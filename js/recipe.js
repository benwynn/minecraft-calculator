
class Recipe {

    #name = "unset";
    #level = 0;
    #quantity = 0;
    #mats = [];

    constructor(name, quantity, mats) {
        this.#name = name;
        if (quantity) this.#quantity = quantity;
        // clone the subset so we don't alter the recipes book
        if (mats) this.#mats = mats;
    }

    getName() {
        return this.#name;
    }

    getLevel() {
        if(this.#level = 0) {
            this.#level = this.calculateLevel();
        }
        return this.#level;
    }

    calculateLevel() {
        let maxLevel = 0;
        this.#mats.forEach(element => {
            let elementRecipe = recipeDB.getRecipe(element);
            let elementLevel = 0;
            if (elementRecipe) {
                elementLevel = elementRecipe.getLevel() + 1;
            }
            if (maxLevel < elementLevel) maxLevel = elementLevel;
        });
        return maxLevel;
    }

    getQuantity() {
        return this.#quantity;
    }

    getMats() {
        return this.#mats;
    }
}

export default Recipe