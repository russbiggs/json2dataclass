import PubSub from './pubsub';
import PythonOutput from './python-output';
import JSONInput from './json-input';
import ImportToggle from './import-toggle';
import DatetimeToggle from './datetime-toggle';
import SnakeCaseToggle from './snake-case-toggle';
import Modal from './modal';

const pubSub = new PubSub();
const pythonOutput = new PythonOutput();
new JSONInput(pubSub);
new ImportToggle(pubSub);
new DatetimeToggle(pubSub);
new SnakeCaseToggle(pubSub);
new Modal();

pubSub.subscribe('enter-json', pythonOutput.setData);
pubSub.subscribe('toggle-import', pythonOutput.toggleIncludeImports);
pubSub.subscribe('toggle-datetime', pythonOutput.toggleDatetime);
pubSub.subscribe('toggle-snake-case', pythonOutput.toggleCaseStyle);
pubSub.subscribe('json-error', pythonOutput.errorMessage);
