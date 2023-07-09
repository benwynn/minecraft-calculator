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

    lookupRecipeName(recipeName){

        recipeName = this.parseString(recipeName);

        if(!this.getRecipe(recipeName)) {
            recipeName = recipeName.substring(0, recipeName.length - 1);
        }
        return recipeName;
    }

    parseString(text) {
        let value = text;
        let valArray = text.split(` `).map(this.captialize);
      
        if(!isNaN(valArray[0])) {
          valArray[0] = "";
        }
        value = valArray.join(" ");
        value = value.trim();
      
        return value;
      }
      
    captialize(str){
        let text = str.toLowerCase();
        return text.charAt(0).toUpperCase() + text.slice(1);
      }
}

export default RecipeDB