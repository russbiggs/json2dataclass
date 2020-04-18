const importStrings = {
    dataclass: `<span class="keyword">from</span> <span class="class-name">dataclasses</span> <span class="keyword">import</span> <span class="class-name">dataclass</span>`,
    list: `<span class="keyword">from</span> <span class="class-name">typing</span> <span class="keyword">import</span> <span class="class-name">List</span>`,
    union: `<span class="keyword">from</span> <span class="class-name">typing</span> <span class="keyword">import</span> <span class="class-name">Union</span>`,
    datetime: `<span class="keyword">import</span> <span class="class-name">datetime</span>`,
};

class PythonOutput {
    elem: HTMLInputElement;
    imports: string[];
    data: string;
    includeImports: boolean;
    datetime: boolean;
    snakeCase: boolean;

    constructor() {
        this.elem = document.querySelector('.js-python-output');
        this.imports = [];
        this.includeImports = false;
        this.datetime = false;
        this.snakeCase = true;
        this.data = '';
        this.addEventListeners();
    }

    addEventListeners = () => {
        this.elem.addEventListener('keydown', this.onKeyDown);
    };

    onKeyDown = (e: KeyboardEvent) => {
        if (!~[37, 38, 39, 40].indexOf(e.keyCode) && !e.ctrlKey && !e.metaKey) {
            e.preventDefault();
        }
    };

    setData = (data: string) => {
        this.data = data;
        this.update();
    };

    toggleIncludeImports = () => {
        this.includeImports = !this.includeImports;
        if (this.data != '') {
            this.update();
        }
    };

    toggleDatetime = () => {
        this.datetime = !this.datetime;
        if (this.data != '') {
            this.update();
        }
    };

    errorMessage = (message: string) => {
        this.elem.innerHTML = message;
    };

    toggleCaseStyle = () => {
        this.snakeCase = !this.snakeCase;
        if (this.data != '') {
            this.update();
        }
    };

    update = () => {
        if (this.data != '') {
            this.elem.innerHTML = '';
            const objs = {};
            const data = JSON.parse(this.data);

            this.findObjs(data, objs);
            let output = '';

            if (this.includeImports) {
                if (this.datetime) {
                    output += importStrings.datetime;
                    output += '<br>';
                }
                if (this.imports.length > 0) {
                    for (const i of this.imports) {
                        output += importStrings[i];
                        output += '<br>';
                    }
                }
                output += importStrings.dataclass;
                output += '<br><br>';
            }
            for (const [name, obj] of Object.entries(objs)) {
                output += this.createClass(name, obj);
                output += '<br><br>';
            }
            this.elem.innerHTML = output;
        } else {
            this.elem.innerHTML = '';
        }
    };

    findObjs = (data: object, agg: object, parent: string = 'GeneratedClass'): void => {
        let obj = {};
        if (agg.hasOwnProperty(parent)) {
            obj = agg[parent]
        }
        for (const key in data) {
            if (data[key] !== null && data[key] instanceof Array) {
                if (this.imports.indexOf('list') == -1) {
                    this.imports.push('list');
                }
                let listTypes = new Set();
                for (const item of data[key]) {
                    if (
                        typeof item === 'boolean' ||
                        typeof item === 'number' ||
                        typeof item === 'string' ||
                        item instanceof String
                    ) {
                        listTypes.add(findType(item, this.datetime));
                    } else {
                        const className = properCase(key);
                        listTypes.add(`${className}`);
                        for (const item of data[key]) {
                            this.findObjs(item, agg, key);
                        }
                    }
                }
                if (listTypes.size < 1) {
                    obj[key] = `List`;
                } else if (listTypes.size > 1) {
                    if (this.imports.indexOf('union') == -1) {
                        this.imports.push('union');
                    }
                    let typeArr = Array.from(listTypes.values());
                    obj[key] = `List[Union[${typeArr.join(', ')}]]`;
                } else {
                    obj[key] = `List[${listTypes.values().next().value}]`;
                }
            } else if (data[key] !== null && typeof data[key] == 'object') {
                obj[key] = properCase(key);
                this.findObjs(data[key], agg, key);
            } else {
                obj[key] = findType(data[key], this.datetime);
            }
        }

        agg[parent] = obj
    };

    createClass = (name: string, data: any): string => {
        let types = '';
        for (const [key, value] of Object.entries(data)) {
            let keyName = key;
            if (this.snakeCase) {
                keyName = key
                    .split(/(?=[A-Z])/)
                    .join('_')
                    .toLowerCase();
            }
            const line = `&nbsp&nbsp&nbsp&nbsp${keyName}: <span class="type">${value}</span>`;
            types += line;
            types += '<br>';
        }
        let classText = '<span class="dataclass">@dataclass</span><br>';
        let titleName = name;
        if (name[0] != name[0].toUpperCase()) {
            titleName = properCase(name);
        }
        classText += `<span class="keyword">class</span> <span class="class-name">${titleName}</span>:`;
        classText += '<br>';
        classText += types;
        return classText;
    };
}

const properCase = (word: string): string => {
    return (
        word.charAt(0).toUpperCase() +
        word.substr(1).replace(/([-_][a-z])/g, (group) => group.toUpperCase().replace('-', '').replace('_', ''))
    );
};

const findType = (data: boolean | number | String, datetime: boolean): string => {
    if (typeof data === 'string' || data instanceof String) {
        const regex = RegExp(/^\d{4}(-\d\d(-\d\d(T\d\d:\d\d(:\d\d)?(\.\d+)?(([+-]\d\d:\d\d)|Z)?)?)?)?$/i);
        const match = data.match(regex);
        if (datetime && match) {
            return 'datetime.datetime';
        }
        return 'str';
    }
    if (typeof data === 'number' && isFinite(data)) {
        if (data % 1 === 0) {
            return 'int';
        } else {
            return 'float';
        }
    }
    if (typeof data == 'boolean') {
        return 'bool';
    }
    return 'str';
};

export default PythonOutput;
