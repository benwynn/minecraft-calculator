import RecipeDB from "./recipeDB.js"
import Calculator from "./calculator.js"

var cookieNotice      = document.querySelector(".cookie-notice");
var cookieNoticeClose = document.querySelector(".cookie-notice-dismiss-button");
var recipeInput       = document.querySelector(".RecipeInput");
var goButton          = document.querySelector(".GoButton");
var outputBlock       = document.querySelector(".output");


cookieNoticeClose.addEventListener("click", function() {
  cookieNotice.parentNode.removeChild(cookieNotice);
});

console.log("Starting...");

var recipeDB = new RecipeDB();
console.log("Finished loading recipeDB");

var calc = new Calculator(recipeDB);
console.log("Loaded calculator, ready to calculate");

goButton.addEventListener("click", callCalculate);

recipeInput.addEventListener("keydown", function(e) {
  if(e.code == "Enter") {
    callCalculate();
  }
});

function callCalculate()
{
  resetOutput();
  let value=recipeInput.value;
  console.log(value);
  if (!value) return;
  let output=calc.calculate(value,1);
  outputBlock.appendChild(output);
};

function resetOutput()
{
  while (outputBlock.hasChildNodes()) {
    console.log(outputBlock.firstChild)
    outputBlock.removeChild(outputBlock.firstChild);
  }
}
