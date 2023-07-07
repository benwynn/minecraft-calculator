import Recipe from "./recipe.js"

class RecipeDB {

    #recipeMap = {};

    constructor(recipes) {
        this.recipes = recipes;
        Object.keys(this.recipes).forEach(recipeName => {
            let recipeData = recipes[recipeName];
            let recipe = new Recipe(this, recipeName, recipeData.quantity, recipeData.machine, recipeData.plural, recipeData.mats);
            this.#recipeMap[recipe.getName()] = recipe;
        })
    }

    getRecipe(target) {
        if (typeof target !== 'string') {
            console.error("RecipeDB.getRecipe(string) called without a string");
            return null;
        }
        if (this.#recipeMap.hasOwnProperty(target)) {
            return this.#recipeMap[target];
        }
        return null;
    }
}

export default RecipeDB