import { elements } from '../models/base';

export const getInput = () => elements.getInput.value;

export const clearInput = () => { elements.getInput.value = '' };

export const formatTitle = (title) => {
    if (title.length > 17) {
        const array = title.split(' ');
        const arr = [];
        array.reduce((acc, cur) => {
            if (acc < 17) {
                arr.push(cur);
            }
            return acc + cur.length;;
        }, 0)
        return `${arr.join(' ')}...`;
    } else {
        return title;
    }
}; 


export const highlightSelected = id => {
    const resultsArr = Array.from(document.querySelectorAll('.results__link'));
    resultsArr.forEach(el => {
        el.classList.remove('results__link--active');
    });
    document.querySelector(`.results__link[href*="${id}"]`).classList.add('results__link--active');
};

const createButton = (page, type) =>  `
    <button class="btn-inline results__btn--${type}" data-goto="${type === 'prev' ? page - 1 : page + 1}">
        <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
        <svg class="search__icon">
            <use href="/dist/img/icons.svg#icon-triangle-${type === 'next' ? 'right' : 'left'}"></use>
        </svg>
    </button>`;

const addButton = (page, numRes, resOnPage) => {

    const pageNum = Math.ceil(numRes / resOnPage);

    let button;
    if (page === 1 && pageNum > 1) {
        button = createButton(page, 'next');
    } else if (page === pageNum && pageNum > 1) {
        button = createButton(page, 'prev');
    } else if (page > 1 && page < pageNum) {
        button = `
            ${createButton(page, 'next')}
            ${createButton(page, 'prev')}
        `
    }
    elements.resPages.insertAdjacentHTML('afterbegin', button);
};

export const renderRecipes = (recipes, page = 1, resOnPage = 10) => {
    
    let start = (page * resOnPage) - resOnPage;
    let end = page * resOnPage;
    recipes.slice(start, end).forEach((cur) => {
        const markup =
            `<li>
                <a class="results__link" href="#${cur.recipe_id}">
                    <figure class="results__fig">
                        <img src="${cur.image_url}" alt="Test">
                    </figure>
                    <div class="results__data">
                        <h4 class="results__name">${formatTitle(cur.title)}</h4>
                        <p class="results__author">${cur.publisher}</p>
                    </div>
                </a>
            </li>`;
        elements.listRes.insertAdjacentHTML('beforeend', markup);
    });

    addButton(page, recipes.length, resOnPage);
};

export const clearRecipes = () => { 
    elements.listRes.innerHTML = '';
    elements.resPages.innerHTML = '';
};
