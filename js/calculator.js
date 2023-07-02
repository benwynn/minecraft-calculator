

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
            let variableName = this.outputMats(obj);
            output.appendChild(variableName);
        })
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
        result.mats = []

        while (result.quantity < quantity) {
            result.quantity += recipe.getQuantity();
            recipe.getMats().forEach(obj =>{
                let subresult = this.getResult(obj.name,obj.quantity);
                console.log(subresult);
                // if(!subresult.mats) {
                //     result.mats.push(subresult);
                // } else {
                // subresult.mats.forEach(subobj =>{
                //     result.mats.push(subobj);
                // })}
                if(subresult) result.mats.push(subresult);
            })
        }
        result.name = target;

        return result;
    }
}

export default Calculator;