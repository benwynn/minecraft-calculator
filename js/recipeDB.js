import Recipe from "./recipe.js"

class RecipeDB {

    #recipeMap = {};

    constructor(recipes) {
        this.recipes = recipes;
        Object.keys(this.recipes).forEach(recipeName => {
            let recipeData = recipes[recipeName];
            let recipe = new Recipe(recipeName, recipeData.quantity, recipeData.mats);
            this.#recipeMap[recipe.getName()] = recipe;
        })
    }

    getRecipe(target) {
        if (this.#recipeMap.hasOwnProperty(target)) {
            return this.#recipeMap[target];
        }
        return null;
    }
}

export default RecipeDB