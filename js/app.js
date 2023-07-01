
import recipes from "./recipes.json" assert {type: "json"}
import Calculator from "./calculator.js"

var cookieNotice      = document.querySelector(".cookie-notice");
var cookieNoticeClose = document.querySelector(".cookie-notice-dismiss-button");
var recipeInput = document.querySelector(".RecipeInput");
var goButton = document.querySelector(".GoButton");
var outputBlock = document.querySelector(".output")


cookieNoticeClose.addEventListener("click", function() {
  cookieNotice.parentNode.removeChild(cookieNotice);
});

var calc = new Calculator(recipes);

goButton.addEventListener("click", callCalculate);

recipeInput.addEventListener("keydown", function(e) {
  if(e.code == "Enter") {
    callCalculate();
  }
});

function callCalculate()
{
  let value=recipeInput.value;
  console.log(value);
  if (!value) return;
  let output=calc.calculate(value,1);
 // outputBlock.innerHTML = JSON.stringify(output);
 outputBlock.appendChild(output)
};

console.log("Starting Recipes:");
console.log(JSON.stringify(recipes));

var result = calc.calculate("stick");
console.log("Final Result: ");
console.log(result);

console.log("ending recipes:");
console.log(JSON.stringify(recipes));
