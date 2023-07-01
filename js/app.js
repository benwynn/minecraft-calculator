
import recipes from "./recipes.json" assert {type: "json"}
import Calculator from "./calculator.js"

var cookieNotice      = document.querySelector(".cookie-notice");
var cookieNoticeClose = document.querySelector(".cookie-notice-dismiss-button");

cookieNoticeClose.addEventListener("click", function() {
  cookieNotice.parentNode.removeChild(cookieNotice);
});

var calc = new Calculator(recipes);


console.log("Starting Recipes:");
console.log(JSON.stringify(recipes));

var result = calc.calculate("stick");
console.log("Final Result: ");
console.log(result);

console.log("ending recipes:");
console.log(JSON.stringify(recipes));
