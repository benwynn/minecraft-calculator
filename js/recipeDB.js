import recipes from "./recipes.json" assert {type: "json"}
import Recipe from "./recipe.js"

class RecipeDB {

    #recipeMap = new Map();

    constructor() {
        recipes.forEach(recipeData => {
            let recipe = new Recipe(this, recipeData.name, recipeData.quantity, recipeData.machine, recipeData.plural, recipeData.mats);
            this.#recipeMap.set(recipe.getName(), recipe);
        })
    }

    getRecipe(recipeName) {
        if (typeof recipeName !== 'string') {
            console.error("RecipeDB.getRecipe(string) called without a string");
            return null;
        }
        if (this.#recipeMap.has(recipeName)) {
            return this.#recipeMap.get(recipeName);
        }
        return null;
    }
}

export default RecipeDB