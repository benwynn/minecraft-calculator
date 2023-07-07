

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

        let sortItems = items.map(x => { return {name: x, level: this.recipeDB.getRecipe(x).getLevel(), machine: this.recipeDB.getRecipe(x).getMachine()}}, this);
        sortItems.sort(function(a,b) {
            if(!a.machine && !b.machine) {return a.name.localeCompare(b.name)};
            if(!a.machine) {return -1}
            if(!b.machine) {return 0};
            return a.machine.localeCompare(b.machine);
        });
        sortItems.sort(function(a,b) {return a.level - b.level});
        
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
        var level = undefined;  
        var machine = undefined;      

        title.className = "output-title";
        title.innerHTML = `${quantity} ${target}`;

        output.appendChild(title)

        for (let i=0;i<sortItems.length;i++){

            let item = sortItems[i];
            let text = document.createElement("div");
            text.className = "output-row";
            let machineText = document.createElement("div");
            let name = item.name;
            let outName = item.name;
            
            if(item.level != level) {
                level = item.level;
                output = this.addStep(output,level);
            }

            if(item.machine && (item.machine != machine)) {
                machine = item.machine;
                machineText.className = "output-machine";
                machineText.innerHTML = `${machine}`;
                output.appendChild(machineText);
            }

            if (this.addSuffix(name,this.accumulator[name].quantity)) {
                outName = this.recipeDB.getRecipe(item.name).getPlural();
            }
            text.innerHTML =`${this.accumulator[name].quantity} ${outName}`;
            output.appendChild(text);
        }
        this.addSeparator(output)
        return output;
    }

    addStep(output,level){
        let separator = document.createElement("p");
        let adjustedLevel = level +1 ;
        separator.className = "output-step";
        separator.innerHTML = `Step ${adjustedLevel}`
        output.appendChild(separator);
        return output;
    }

    addSeparator(output) {
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

            if(this.addSuffix(name,this.accumulator[itemName].remainder)) {
                name = this.recipeDB.getRecipe(itemName).getPlural();
            }
            if (this.accumulator[itemName].remainder > 0) {
                remainderText.innerHTML = `${this.accumulator[itemName].remainder} ${name}`;
                remainders.appendChild(remainderText);
            }
        });

        return remainders;
    }

    reset() {
        this.accumulator = {};
    }

    addSuffix(text,quantity) {
        if(quantity < 2) return false;
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
        // if we haven't already encountered this item, initialize it here.
        if (!this.accumulator.hasOwnProperty(item)) {
            this.accumulator[item] = {
                name: item,
                quantity: 0,
                remainder: 0,
                level: this.recipeDB.getRecipe(item).getLevel(),
                machine: this.recipeDB.getRecipe(item).getMachine()
            };
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
        

        return true;
    }
        
}

export default Calculator;