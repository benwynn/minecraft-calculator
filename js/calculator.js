

class Calculator {
    accumulator = {};
    inventory = {};

    constructor(recipeDB) {
        this.recipeDB = recipeDB;
    }

    calculate(target,quantity) {
        var output = document.createElement("div");

        this.reset();

        this.inventory = this.copyAccumulator();

        target = this.recipeDB.lookupRecipeName(target);

        let result = this.getResult(target,quantity);
        if (!result) {
            return this.noResult(target);
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
        let remainderOutput = this.formatInventory();

        output.appendChild(ingredientOutput);
        output.appendChild(remainderOutput);

        return output;
    }

    noResult (target) {
        let title = document.createElement("div");
        title.innerHTML = "We could not locate this item in the database: " + target;
        return title;
    }

    formatIngredients (target, quantity, sortItems) {
        var output = document.createElement("div");
        var level = undefined;  
        var machine = undefined;  
        
        output = this.addTitle(output,target,quantity);

        for (let i=0;i<sortItems.length;i++){

            let item = sortItems[i];
            let text = document.createElement("div");
            text.className = "output-row";
            let name = item.name;
            let outName = item.name;
            
            if(item.level != level) {
                level = item.level;
                // the first items in any step will be made w/ crafting table. Reset machine to reflect this.
                machine = undefined;
                output = this.addStep(output,level);
            }

            if(item.machine && (item.machine != machine)) {
                machine = item.machine;
                output = this.addMachine(output,machine)
            }

            if (this.usePlural(this.accumulator[name].quantity)) {
                outName = this.recipeDB.getRecipe(item.name).getPlural();
            }

            let recipeMakes = this.recipeDB.getRecipe(item.name).getQuantity();

            let madeFrom = "";

            if (recipeMakes > 1) {
                madeFrom = this.madeFrom(item.name);
            }

            let itemInventory = this.getInventoryOutput(name);

            text.innerHTML =`${this.accumulator[name].quantity} ${outName} ${itemInventory} ${madeFrom}`;
            output.appendChild(text);
        }
        this.addSeparator(output)
        return output;
    }

    copyAccumulator(){
        let copy = {};

        Object.keys(this.accumulator).forEach(item => {
            copy[item] = Object.assign({}, this.accumulator[item]);
        })

        return copy;
    }

    madeFrom(name) {
        let ingredients = "";
        let recipe = this.recipeDB.getRecipe(name);
        let mats = recipe.getMats();

        let recipeQuantity = recipe.getQuantity();
        let total = this.accumulator[name].quantity - this.getInventory(name);

        if(total <1){
            return "";
        };

        let multiplier = Math.ceil(total/recipeQuantity);

        for(let i = 0; i < mats.length;i++){
            let matName = mats[i].name;
            let matQuantity = mats[i].quantity * multiplier;

            ingredients += ` ${matQuantity} ${matName}`;
        }
        ingredients = ingredients.trim();
        
        return ("(made from " + ingredients +")");
    }

    getInventory(name) {
        
        if(!this.inventory[name]) {
            return 0;
        };
        if (this.inventory[name].remainder) {
            return this.inventory[name].remainder;
        };
        return 0;
    }

    getInventoryOutput(name) {

        if(!this.inventory[name]) {
            return "";
        } else if (this.inventory[name].remainder) {
            let outtext =  ("(" + `${this.inventory[name].remainder}` + " from inventory)");
            return outtext;
        }
    }

    addTitle(output,target,quantity){        
        let title = document.createElement("div");

        title.className = "output-title";
        title.innerHTML = `${quantity} ${target}`;

        output.appendChild(title);
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

    addMachine(output,machine) {        
        let machineText = document.createElement("div");
        machineText.className = "output-machine";
        machineText.innerHTML = `${machine}`;
        output.appendChild(machineText);
        return output;
    }

    addSeparator(output) {
        let separator = document.createElement("p");
        output.appendChild(separator);
        return output;
    }

    formatInventory () {
        
        var title = document.createElement("div");
        let remainders = document.createElement("div");

        let items = Object.keys(this.accumulator);
        items.sort();

        title.className = "output-title";
        title.innerHTML = "Remainders"
        remainders.appendChild(title);

        items.forEach( itemName => {
            let text = document.createElement("div");
            let remainderText = document.createElement("div");
            let name = itemName;

            if(this.usePlural(this.accumulator[itemName].remainder)) {
                name = this.recipeDB.getRecipe(itemName).getPlural();
            }
            if (this.accumulator[itemName].remainder > 0) {
                remainderText.innerHTML = `${this.accumulator[itemName].remainder} ${name}`;
                remainders.appendChild(remainderText);
            }
        });

        return remainders;
    }

    usePlural(quantity) {
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
                    let mats = recipe.getMats();
                    for (let i=0;i<mats.length;i++){
                        let obj = mats[i];
                        this.getResult(obj.name,obj.quantity);
                    };
                    quantity -= recipe.getQuantity();
                } else {
                    quantity = 0;
                }
                
            }
        }
        return true;
    }

    // returns true if we had to produce more of the item, false if we could get the quantity from remainders
    accumulate(item,quantity,produced) {

        this.maybeInitItem(item);

        if(item == "Analog Circuit")
        {
            console.log("digital!")
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

    maybeInitItem(item){
        // if we haven't already encountered this item, initialize it here.
        if (!this.accumulator.hasOwnProperty(item)) {
            this.accumulator[item] = {
                name: item,
                quantity: 0,
                remainder: 0,
                level: this.recipeDB.getRecipe(item).getLevel(),
                machine: this.recipeDB.getRecipe(item).getMachine()
            };
            return true;
        }
        return false;
    }

    addInventory(item,quantity){

        item =  this.recipeDB.lookupRecipeName(item);

        this.maybeInitItem(item);
        if(quantity > 0){
            this.accumulator[item].remainder += quantity;
            return true;
        }
        return false;
    }

    clearInventory(){

        let items = Object.keys(this.accumulator);

        for(let i=0;i<items.length;i++) {
            let item = items[i];
            let accumItem = this.accumulator[item];
            if(accumItem.quantity ==0){
                delete this.accumulator[item];
            } else {
                this.accumulator[item].remainder = 0;
            }
        }
    }
    
    reset() {
        
        let items = Object.keys(this.accumulator);

        for(let i=0;i<items.length;i++) {
            let item = items[i];
            let accumItem = this.accumulator[item];
            if(accumItem.remainder ==0){
                delete this.accumulator[item];
            } else {
                this.accumulator[item].quantity =0;
            }
        }
    }
        
}

export default Calculator;