
class Recipe {

    #recipeDB;
    #name = "unset";
    #plural = undefined;
    #level = undefined;
    #machine = undefined;
    #quantity = 0;
    #mats = [];

    constructor(recipeDB, name, quantity, machine, plural, mats) {
        this.#recipeDB = recipeDB;
        this.#name = name;
        if (quantity) this.#quantity = quantity;
        // clone the subset so we don't alter the recipes book
        if (mats) this.#mats = mats;
        if (plural) this.#plural = plural;
        if (machine) { 
            this.#machine = machine;
        } else {
            this.#machine = "Crafting Table";
        }
        
    }

    getName() {
        return this.#name;
    }

    getPlural() {
        if(!this.#plural) {
            return (this.#name + "s")};
        return this.#plural;
    }

    getLevel() {
       if(this.#level === undefined) {
            this.#level = this.calculateLevel();
        }
        return this.#level;
    }

    calculateLevel() {
        let maxLevel = 0;
        // if there are no mats, this loop won't run and we return 0
        this.#mats.forEach(element => {
            let elementRecipe = this.#recipeDB.getRecipe(element.name);
            let elementLevel = 0;

            if (elementRecipe) {
                // If our element has no mats, it will return level 0, so our level is 1
                elementLevel = elementRecipe.getLevel() + 1;
            } else {
                console.error("Failed to lookup recipe for: " + element.name);
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

    getMachine() {
        return this.#machine;
    }
}

export default Recipe