
class Recipe {

    #name = "unset";
    #level = 0;
    #quantity = 0;
    #mats = [];

    constructor(name, level, quantity, mats) {
        this.#name = name;
        if (level) this.#level = level;
        if (quantity) this.#quantity = quantity;
        // clone the subset so we don't alter the recipes book
        if (mats) this.#mats = mats;
    }

    getName() {
        return this.#name;
    }

    getLevel() {
        return this.#level;
    }

    getQuantity() {
        return this.#quantity;
    }

    getMats() {
        return this.#mats;
    }
}

export default Recipe