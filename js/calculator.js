

class Calculator {
    accumulator = {};
    remainder = {};

    constructor(recipeDB) {
        this.recipeDB = recipeDB;
    }

    calculate(target,quantity) {
        let result = this.getResult(target,quantity);
        var output = document.createElement("div");
        var title = document.createElement("div");
        title.className = "output-title"
        if(result.quantity > 1) result.name +="s";
        title.innerHTML = `${result.quantity} ${result.name}`;
        output.appendChild(title);
        // result.mats.forEach(obj => {
        //     let variableName = this.outputMats(obj);
        //     output.appendChild(variableName);
        // })
        let items = Object.keys(this.accumulator);
        items.forEach( itemName => {
            let text = document.createElement("div");
            let name = itemName;
        if(this.accumulator[itemName].quantity > 1) {
            name += "s";
        }
            text.innerHTML =`${name} ${this.accumulator[itemName].quantity}`
            output.appendChild(text);
        });
        return output;
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

        if (!recipe) {
            return null;
        }

        let result = {}

        if (!recipe.getMats().length) {
            if(recipe.getQuantity()) {
                result.quantity = recipe.getQuantity();
            } else {
                result.quantity = 1;
            }
            result.name = target;
            return result;
        }

        result.quantity = 0;
        
        result.quantity += recipe.getQuantity();
        result.mats = []

        while (quantity > 0) { 
            this.accumulate(target,quantity,recipe.getQuantity());
            recipe.getMats().forEach(obj =>{
                let subresult = this.getResult(obj.name,obj.quantity);
                console.log(subresult);
                if(subresult) {
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
        if(!this.accumulator.hasOwnProperty(item)) {
            this.accumulator[item] = {quantity:0,remainder:0};
        }
        if(quantity < this.accumulator[item].remainder) {
            this.accumulator[item].remainder -= quantity;
            this.accumulator[item].quantity += quantity;
            return false;
        } 
        this.accumulator[item].quantity += quantity;
        this.accumulator[item].remainder += (produced - quantity);
        return true;
    }
        
}


export default Calculator;