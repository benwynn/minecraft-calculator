

class Calculator {
    constructor(recipes) {
        this.recipes = recipes;
    }

    calculate(target) {
        if (!this.recipes.hasOwnProperty(target)) {
            return null;
        }

        // clone the subset so we don't alter the recipes book
        let subset = Object.assign({}, this.recipes[target]);

        let output = {};

        let mats = Object.entries(subset.mats);
        console.log("Dumping Mats:");
        mats.forEach(mat => console.log(mat));

        return subset;
    }
}

export default Calculator;