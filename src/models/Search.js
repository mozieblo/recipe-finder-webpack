import { key, key2, key3 } from './config';

export default class Search {
    constructor (query) {
        this.query = query;
    }

    async getRecipes() {
        try {
            const res = await fetch(`https://www.food2fork.com/api/search?key=${key}&q=${this.query}`);
            const data = await res.json();
            this.recipes = data.recipes;
            return data;
        } catch (error) {
            alert(error);
        }
    }
};