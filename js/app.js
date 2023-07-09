import RecipeDB from "./recipeDB.js"
import Calculator from "./calculator.js"

var cookieNotice      = document.querySelector(".cookie-notice");
var cookieNoticeClose = document.querySelector(".cookie-notice-dismiss-button");
var recipeInput       = document.querySelector(".RecipeInput");
var goButton          = document.querySelector(".GoButton");
var addButton         = document.querySelector(".addInventory");
var clearButton       = document.querySelector(".clearInventory");
var outputBlock       = document.querySelector(".output");
var inventoryInput    = document.querySelector(".InventoryInput");
var inventoryBlock    = document.querySelector(".inventory");


cookieNoticeClose.addEventListener("click", function() {
  cookieNotice.parentNode.removeChild(cookieNotice);
});

console.log("Starting...");

var recipeDB = new RecipeDB();
console.log("Finished loading recipeDB");

var calc = new Calculator(recipeDB);
console.log("Loaded calculator, ready to calculate");

goButton.addEventListener("click", callCalculate);
addButton.addEventListener("click", addInventory);
clearButton.addEventListener("click", clearInventory);


recipeInput.addEventListener("keydown", function(e) {
  if(e.code == "Enter") {
    callCalculate();
  }
});

inventoryInput.addEventListener("keydown", function(e) {
  if(e.code == "Enter") {
    addInventory();
  }
});

function callCalculate()
{
  resetOutput();
  let value = recipeInput.value;
  let quantity = parseQuantity(value);

  console.log(value);
  if (!value) return;
  
  let output=calc.calculate(value,quantity);
  outputBlock.appendChild(output);

  let remainders=calc.formatInventory();
  inventoryBlock.appendChild(remainders);
};

function addInventory()
{
  let value = inventoryInput.value;
  let quantity = parseQuantity(value);

  if(!value) return;

  if(calc.addInventory(value,quantity)) {
    
    resetInventoryBlock();
    let remainders=calc.formatInventory();
    inventoryBlock.appendChild(remainders);
  }
}

function clearInventory()
{
  calc.clearInventory();
  
  resetInventoryBlock();
  let remainders=calc.formatInventory();
  inventoryBlock.appendChild(remainders);
}

function parseQuantity(text) {
  let quantity = 1;
  let valArray = text.split(` `);

  if(!isNaN(valArray[0])) {
    quantity = valArray[0];
  }

  return parseInt(quantity);
}

function resetOutput()
{
  while (outputBlock.hasChildNodes()) {
    outputBlock.removeChild(outputBlock.firstChild);
  }
  while (inventoryBlock.hasChildNodes()) {
    inventoryBlock.removeChild(inventoryBlock.firstChild);
  }
}

function resetInventoryBlock()
{
  while (inventoryBlock.hasChildNodes()) {
    inventoryBlock.removeChild(inventoryBlock.firstChild);
  }
}