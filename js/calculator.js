

class Calculator {
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
        result.mats.forEach(obj => {
            let block = document.createElement("div");
            block.className = "output-row"
            if(obj.quantity > 1) obj.name+= "s";
            block.innerHTML = `${obj.quantity} ${obj.name}`;
            output.appendChild(block);
        })
        return output;
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
        result.mats = []

        while (result.quantity < quantity) {
            result.quantity += recipe.getQuantity();
            recipe.getMats().forEach(obj =>{
                let subresult = this.getResult(obj.name,obj.quantity);
                console.log(subresult);
                if(!subresult.mats) {
                    result.mats.push(subresult);
                } else {
                subresult.mats.forEach(subobj =>{
                    result.mats.push(subobj);
                })}
            })
        }
        result.name = target;

        return result;
    }
}

export default Calculator;