export const elements = {
    controlSearch: document.querySelector('.search'),
    getInput: document.querySelector('.search__field'),
    listRes: document.querySelector('.results__list'),
    spinner: document.querySelector('.results'),
    resPages: document.querySelector('.results__pages'),
    closest: document.querySelector('.btn-inline'),
    recipe: document.querySelector('.recipe'),
    shopping: document.querySelector('.shopping__list'),
    likesMenu: document.querySelector('.likes__field'),
    likesList: document.querySelector('.likes__list')
};

const elementsString = {
    spinnerDelete: 'loader'
}

export const renderSpinner = parent => {
    parent.insertAdjacentHTML('afterbegin', `
    <div class="${elementsString.spinnerDelete}">
        <svg>
            <use href="/dist/img/icons.svg#icon-cw"></use>
        </svg>
    </div>
    `)
};

export const clearSpinner = () => {
    const loader = document.querySelector(`.${elementsString.spinnerDelete}`);

    if (loader) {
        loader.parentElement.removeChild(loader);
    }
};