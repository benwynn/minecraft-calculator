

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

        let items = Object.keys(this.accumulator);
        items.sort();

        let sortItems = items.map(x => { return {name: x, level: this.recipeDB.getRecipe(x).getLevel() }}, this);
        sortItems.sort(function(a,b) {return a.level - b.level})
        
        let ingredientOutput = this.formatIngredients(target,quantity,sortItems);
        let remainderOutput = this.formatRemainders(items);

        output.appendChild(ingredientOutput);
        output.appendChild(remainderOutput);

        return output;
    }

    noResult () {
        let title = document.createElement("div");
        title.innerHTML = "We could not locate this item in the database: " + target;
        return title;
    }

    formatIngredients (target, quantity, sortItems) {
        var output = document.createElement("div");
        var title = document.createElement("div");
        var level = 0;        

        title.className = "output-title";
        title.innerHTML = `${quantity} ${target}`;

        output.appendChild(title)

        sortItems.forEach( item => {
            let text = document.createElement("div");
            let name = item.name;
            let suffix = "";
            
            if(item.level != level) {
                output = this.addSeparator(output);
                level = item.level;
            }

            if (this.addSuffix(name,this.accumulator[name].quantity)) {
                suffix += "s";
            }
            text.innerHTML =`${this.accumulator[name].quantity} ${name}${suffix}`;
            output.appendChild(text);
        })
        output = this.addSeparator(output);
        return output;
    }

    addSeparator(output){
        let separator = document.createElement("p");
        output.appendChild(separator);
        return output;
    }

    formatRemainders (items) {
        var title = document.createElement("div");
        let remainders = document.createElement("div");

  //      let items = Object.keys(this.accumulator);

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
    }

    addSuffix(text,quantity) {
        if(quantity < 2) return false;
        if(text.slice(-1)=="s") return false;
        return true;
    }

    getResult(target, quantity) {
        // clone the subset so we don't alter the recipes book
        let recipe = this.recipeDB.getRecipe(target);

        if (!recipe) {
            return false;
        }

        while (quantity > 0) { 
            // handle base-level mats. Theoretically, should never be more than 1, but code accounts for more.
            if (!recipe.getMats().length) {
                if (recipe.getQuantity()) {
                    this.accumulate(target,quantity,recipe.getQuantity());
                    quantity -= recipe.getQuantity();
                } else {
                    this.accumulate(target,quantity,1);
                    quantity -= 1;
                }
            } else {
                // only get our ingredients if we produce. If we got our quantity from remainder, don't call accumulate
                // on our mats.
                if(this.accumulate(target,quantity,recipe.getQuantity())){
                    for (let i=0;i<recipe.getMats().length;i++){
                        let obj = recipe.getMats()[i];
                        this.getResult(obj.name,obj.quantity);
                    }}
                quantity -= recipe.getQuantity();
            }
        }
        return true;
    }

    // returns true if we had to produce more of the item, false if we could get the quantity from remainders
    accumulate(item,quantity,produced) {
        if(item == "Steel Ingot"){
            console.log("blink")
        };
        if (!this.accumulator.hasOwnProperty(item)) {
            this.accumulator[item] = {quantity:0,remainder:0,level:0};
        }
        if (quantity <= this.accumulator[item].remainder) {
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
        
        this.accumulator[item].level = this.recipeDB.getRecipe(item).getLevel();

        return true;
    }
        
}

export default Calculator;