class Modal {
    modal: HTMLElement;
    modalBody: HTMLElement;
    background: HTMLElement;
    modalBtn: HTMLElement;
    closeBtn: HTMLButtonElement;

    constructor() {
        this.modal = document.querySelector('.js-modal');
        this.modalBody = document.querySelector('.js-modal__body');
        this.background = document.querySelector('.js-modal__background');
        this.modalBtn = document.querySelector('.about');
        this.closeBtn = document.querySelector('.js-close-btn');
        this.addEventListeners();
    }

    addEventListeners = () => {
        this.modalBtn.addEventListener('click', this.show);
        this.background.addEventListener('click', this.close);
        this.closeBtn.addEventListener('click', this.close);
    };

    show = () => {
        this.modal.classList.add('modal--visible');
        this.background.classList.add('modal__background--visible');
        this.modalBody.classList.add('modal__body--visible');
    };

    close = () => {
        this.modal.classList.remove('modal--visible');
        this.background.classList.remove('modal__background--visible');
        this.modalBody.classList.remove('modal__body--visible');
    };
}

export default Modal;
