import { elements, renderSpinner, clearSpinner } from './models/base';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';

// Global state of the app
// - search object - done
// - current recipe object - done
// - shopping list object - done
// - liked recpies - done

const state = {};

// SEARCH CONTROLLER
async function controlSearch() {
    // 1. get query from view
    const query = searchView.getInput();
    
    if (query) {
        // 2. new search object and add to state
        state.search = new Search(query);
    
        // 3. Prepare UI for results
        searchView.clearInput();
        searchView.clearRecipes();
        renderSpinner(elements.spinner);

        try {
             // 4. Search for recipes
            await state.search.getRecipes();

            // 5. Render results on UI
            clearSpinner();
            searchView.renderRecipes(state.search.recipes);
        } catch (error) {
            alert('Error from search.')
        }    
    } 
};

elements.controlSearch.addEventListener('submit', (e) => {
     e.preventDefault();
     controlSearch();
});

elements.resPages.addEventListener('click', (e) => {  
    const click = e.target.closest('.btn-inline');

    if (click) {
        const pages = parseInt(click.dataset.goto, 10);
        searchView.clearRecipes();
        searchView.renderRecipes(state.search.recipes, pages);
    }
});

// RECIPE CONTROLLER

async function controlRecipe() {
    
    //1. Prepare UI for changes
    const id = window.location.hash.replace('#', '');

    if(id) {
       
        // clear element
        recipeView.clearRecipe();
        renderSpinner(elements.recipe);
        
        // Highlight selected search item
        if (state.search) searchView.highlightSelected(id);

         //2. Create new recipe object
        state.recipe = new Recipe(id);

        try {
            //3. Get recipe data and paseIngredients
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();

            //4. Calculate servings and time
            state.recipe.cookingTime();
            state.recipe.servings();

            //5. Render recipe
            clearSpinner();
            recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));

        } catch (error) {
            alert('Error from get recipe.');
        }  
    }
};

['hashchange', 'load'].forEach((el) => {
    window.addEventListener(el, controlRecipe);
});



// LIST CONTROLLER
 
const controlList = () => {
    // Create a new list IF there in none yet
    if (!state.list) state.list = new List();

    // Add each ingredient to the list and UI
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
    });
}

// Handle delete and update list item events
elements.shopping.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;

    // Handle the delete button
    if (e.target.matches('.shopping__delete, .shopping__delete *')) {
        // Delete from state
        state.list.deleteItem(id);

        // Delete from UI
        listView.deleteItem(id);

    // Handle the count update
    } else if (e.target.matches('.shopping__count-value')) {
        const val = parseFloat(e.target.value, 10);
        state.list.updateCount(id, val);
    }
});

// LIKE CONTROLLER
 
const controlLike = () => {
    if (!state.likes) state.likes = new Likes();
    const currentID = state.recipe.id;

    // User has NOT yet liked current recipe
    if (!state.likes.isLiked(currentID)) {
        // Add like to the state
        const newLike = state.likes.addLike(
            currentID,
            state.recipe.title,
            state.recipe.author,
            state.recipe.image
        );
        // Toggle the like button
        likesView.toggleLikeBtn(true);

        // Add like to UI list
        likesView.renderLike(newLike);

    // User HAS liked current recipe
    } else {
        // Remove like from the state
        state.likes.deleteLike(currentID);

        // Toggle the like button
        likesView.toggleLikeBtn(false);

        // Remove like from UI list
        likesView.deleteLike(currentID);
    }
    likesView.toggleLikeMenu(state.likes.getNumLikes());
};

// Restore liked recipes on page load
window.addEventListener('load', () => {
    state.likes = new Likes();
    
    // Restore likes
    state.likes.readStorage();

    // Toggle like menu button
    likesView.toggleLikeMenu(state.likes.getNumLikes());

    // Render the existing likes
    state.likes.likes.forEach(like => likesView.renderLike(like));
});

// Handling recipe button clicks
elements.recipe.addEventListener('click', e => {
    if (e.target.matches('.btn-decrease, .btn-decrease *')) {
        // Decrease button is clicked
        if (state.recipe.servings > 1) {
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        }
    } else if (e.target.matches('.btn-increase, .btn-increase *')) {
        // Increase button is clicked
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
        // Add ingredients to shopping list
        controlList();
    } else if (e.target.matches('.recipe__love, .recipe__love *')) {
        // Like controller
        controlLike();
    }
});