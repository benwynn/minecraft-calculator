import recipes from "./recipes.json" assert {type: "json"}
import Recipe from "./recipe.js"

class RecipeDB {

    #recipeMap = {};

    constructor() {
        recipes.forEach(recipeData => {
            let recipe = new Recipe(this, recipeData.name, recipeData.quantity, recipeData.machine, recipeData.plural, recipeData.mats);
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