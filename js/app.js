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
  let quantity = parseQuantity(recipeInput.value);
  let value = parseString(recipeInput.value);
  console.log(value);
  if (!value) return;
  
  let output=calc.calculate(value,quantity);
  outputBlock.appendChild(output);
};

function parseQuantity(text) {
  let quantity = 1;
  let valArray = text.split(` `);

  if(!isNaN(valArray[0])) {
    quantity = valArray[0];
  }

  return quantity;
}

function parseString(text) {
  let value = text;
  let valArray = text.split(` `).map(captialize);

  if(!isNaN(valArray[0])) {
    valArray[0] = "";
  }
  value = valArray.join(" ");
  value = value.trim();

  return value;
}

function captialize(str){
  let text = str.toLowerCase();
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function resetOutput()
{
  while (outputBlock.hasChildNodes()) {
    console.log(outputBlock.firstChild)
    outputBlock.removeChild(outputBlock.firstChild);
  }
}
