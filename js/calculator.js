

class Calculator {
    constructor(recipes) {
        this.recipes = recipes;
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
            block.innerHTML = `${obj.quanity} ${obj.name}`;
            output.appendChild(block);
        })
        return output;
    }

    getResult(target, quantity) {
        if (!this.recipes.hasOwnProperty(target)) {
            return null;
        }

        // clone the subset so we don't alter the recipes book
        let recipe = Object.assign({}, this.recipes[target]);

        if (recipe.level == 0) return target;

        let output = {};

        let result = {
            // name:"log",
            // quantity: 2,
            // mats: [ {
            //         name: log,
            //         quantity: 2},
            //         {
            //         name:stick,
            //         quantity: 4,
            //        },
            //         {
            //         name: plank
            //         quanity: 4
            //        }
            //     ]
        }

        result.quantity = 0;
        result.mats = []

        while (result.quantity < quantity) {
            result.quantity += recipe.quantity
            recipe.mats.forEach(obj =>{
                console.log("appeneding");
                result.mats.push(obj)
            })
        }
        result.name = target;
       // result.quantity = recipe.quantity

        //let mats = Object.entries(recipe.mats);
        console.log("Dumping Mats:");
        //mats.forEach(mat this.calculate(mat));

        return result;
    }
}

export default Calculator;