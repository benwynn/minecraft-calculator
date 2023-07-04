

class Calculator {
    accumulator = {};

    constructor(recipeDB) {
        this.recipeDB = recipeDB;
    }

    calculate(target,quantity) {
        var output = document.createElement("div");
        var title = document.createElement("div");

        this.reset();

        let result = this.getResult(target,quantity);
        if (!result) {
            return this.noResult();
        }

        this.accumulator.sort(function(a,b) {
            let levela = recipeDB.getRecipe(a).getLevel();
            let levelb = recipeDB.getRecipe(b).getLevel();
            return levela - levelb})

        // title.className = "output-title";
        // title.innerHTML = `${result.quantity} ${result.name}`;
        // output.appendChild(title);
        
        let ingredientOutput = this.formatIngredients(result);
        let remainderOutput = this.formatRemainders();

        output.appendChild(ingredientOutput);
        output.appendChild(remainderOutput);

        return output;
    }

    noResult () {
        let title = document.createElement("div");
        title.innerHTML = "We could not locate this item in the database: " + target;
        return title;
    }

    formatIngredients (result) {
        var output = document.createElement("div");
        var title = document.createElement("div");

        let items = Object.keys(this.accumulator);

        title.className = "output-title";
        title.innerHTML = `${result.quantity} ${result.name}`;

        output.appendChild(title)

        items.forEach( itemName => {
            let text = document.createElement("div");
            let name = itemName;
            let suffix = "";

            if (this.addSuffix(name,this.accumulator[itemName].quantity)) {
                suffix += "s";
            }
            let level = this.recipeDB.getRecipe(itemName).getLevel();
            text.innerHTML =`${this.accumulator[itemName].quantity} ${name}${suffix} Level ${level} `;
            output.appendChild(text);
        })
        return output;
    }

    formatRemainders () {
        var title = document.createElement("div");
        let remainders = document.createElement("div");

        let items = Object.keys(this.accumulator);

        title.className = "output-title";
        title.innerHTML = "Remainders"
        remainders.appendChild(title);

        items.forEach( itemName => {
            let text = document.createElement("div");
            let remainderText = document.createElement("div");
            let name = itemName;
            let suffix = "";

            if(this.addSuffix(name,this.accumulator[itemName].remainder)) {
                suffix += "s";
            }
            if (this.accumulator[itemName].remainder > 0) {
                remainderText.innerHTML = `${this.accumulator[itemName].remainder} ${name}${suffix}`;
                remainders.appendChild(remainderText);
            }
        });

        return remainders;
    }

    reset() {
        this.accumulator = [];
        this.remainder = [];
    }

    addSuffix(text,quantity) {
        if(quantity < 2) return false;
        if(text.slice(-1)=="s") return false;
        return true;
    }

    outputMats (mat){
        let block = document.createElement("div");
        block.className = "output-row";
        if(mat.quantity > 1) mat.name+= "s";
        let text = document.createElement("div");
        text.innerHTML = `${mat.quantity} ${mat.name}`;
        block.appendChild(text);
        if(mat.mats) mat.mats.forEach(obj => {
            let result = this.outputMats(obj);
            block.appendChild(result);
        });
        return block;
    }

    getResult(target, quantity) {
        // clone the subset so we don't alter the recipes book
        let recipe = this.recipeDB.getRecipe(target);

        let result = {}
        result.name = target;
        result.quantity = quantity;

        if (!recipe) {
            return result;
        }

        if (!recipe.getMats().length) {
            if (recipe.getQuantity()) {
                this.accumulate(target,quantity,recipe.getQuantity());
            } else {
                this.accumulate(target,quantity,1);
            }
            result.name = target;
            return result;
        }

        result.quantity =  recipe.getQuantity();
        result.mats = [];

        while (quantity > 0) { 
            this.accumulate(target,quantity,recipe.getQuantity());
            recipe.getMats().forEach(obj =>{
                let subresult = this.getResult(obj.name,obj.quantity);
                if (subresult) {
                    result.mats.push(subresult);
                }
                quantity -= recipe.getQuantity();
            });
            result.quantity += recipe.getQuantity();
        }
        
        result.name = target;

        return result;
    }

    accumulate(item,quantity,produced) {
        if (!this.accumulator.hasOwnProperty(item)) {
            this.accumulator[item] = {quantity:0,remainder:0};
        }
        if (quantity < this.accumulator[item].remainder) {
            this.accumulator[item].remainder -= quantity;
            this.accumulator[item].quantity += quantity;
            return false;
        } 
        if (produced > quantity) {
            this.accumulator[item].quantity += quantity;
            this.accumulator[item].remainder += (produced - quantity);
            return true;
        }
        this.accumulator[item].quantity += produced;
        return true;
    }
        
}


export default Calculator;