
class Recipe {

    #name = "unset";
    #level = 0;
    #quantity = 0;
    #mats = [];

    constructor(name, level, quantity, mats) {
        this.#name = name;
        level = this.calculateLevel();
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

    calculateLevel() {
        let level = 0;
        this.#mats.forEach(element => {
            if(!element.getMats().length) return 1;
            level = element.calculateLevel() +1;
            this.level = level;
            return level;
        });
    }

    getQuantity() {
        return this.#quantity;
    }

    getMats() {
        return this.#mats;
    }
}

export default Recipe