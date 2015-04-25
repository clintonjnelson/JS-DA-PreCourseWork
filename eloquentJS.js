
// Eloquent JS - Chapter 5 Exercises

//////////////////////////////// Flattening //////////////////////////////////
// reduce is about going from many values to one end value
// It works with: a collection, a variable, and an initial value
var myArrayOfArrays = [
  [1, 2, 3, 4, 5, 6],
  [true, false, true, true, false],
  ["another", "array", "of", "arrays"]
]

function flatten(arrayOfArrays) {
  var combined = arrayOfArrays.reduce( function combine(prevVal, currVal, currIndex, origArray) {
    return prevVal.concat(currVal);
  });
  return combined;
}

console.log("Flattened array: ", flatten(myArrayOfArrays));

//
//////////////////////////////// Mother-Child Age Difference //////////////////////////////////
var ancestry = require("./ancestry.js");
var ancestryArray = JSON.parse(ancestry);
var byName = {};

// Populate the byName object with people names as the keys
ancestryArray.forEach( function(person) {
  byName[person.name] = person;
});

// Average of an array of values
function avg(arrayOfValues) {
  // Sum array values
  var total = arrayOfValues.reduce( function total( prevVal, currVal, currIndex, origArray){
    return prevVal + currVal;
  });
  // return average of array values
  return ( total / arrayOfValues.length );
}

function averageMotherChildAgeDifference(peopleByName){
  var mother, motherBirthYear, childBirthYear;
  var differences = [];
  var peopleArray = Object.keys(peopleByName);

  // Populate the age differences array
  peopleArray.forEach( function populateDifferences(currName, index, origArray){
    mother = peopleByName[currName]["mother"];
    if (mother in peopleByName) {
      childBirthYear = peopleByName[currName]["born"]
      motherBirthYear = peopleByName[mother]["born"]
      differences.push( (childBirthYear - motherBirthYear) );
    }
  });

  // return the average age of the mother when gave birth, for available cases
  return avg(differences);
}

console.log( "Average Mother-Child age difference is " + averageMotherChildAgeDifference(byName) + " years." );

//
//////////////////////////////// Historical Life Expectancy //////////////////////////////////
// Break people up by century of death
// Take death year & divide by 100, rounding up
function averageAgePerCentury(peopleByName){
  var age, died, century, centuryAveObj, ageCenturyObj = {};

  function centuryByDeathYear(deathYear){
    return Math.ceil(deathYear/100);
  }

  // populate age-century array
  for (person in peopleByName) {
    age = died = century = null;

    died = peopleByName[person]["died"];
    age = ( died - peopleByName[person]["born"] );
    century = centuryByDeathYear(died);

    ageCenturyObj[century+"th"] ? ageCenturyObj[century+"th"].push(age) : ( ageCenturyObj[century+"th"] = [age] );
    console.log(ageCenturyObj);
  }

  // Inherit ageCenturyObj properties and overwrite their values for averages
  centuryAvgObj = Object.create(ageCenturyObj);
  for (century in ageCenturyObj) {
    centuryAvgObj[century] = Math.round( avg(ageCenturyObj[century]) * 100 ) / 100;
  }

  return centuryAvgObj;
}

console.log( "Average ages per century: ", averageAgePerCentury(byName) );

//
//////////////////////////////// Every & Then Some //////////////////////////////////
function every(arrayParam, callback){
  for(var i=0; i < arrayParam.length; i++){
    if( !callback(arrayParam[i], i, arrayParam) ) {
      return false;  // if even ONE is false, return false
    }
  }
  return true;  // if NONE false, return true
}
var myArray = [1,2,3,4,5];

Testing every()
console.log("Should say true: " + every(myArray, function(currElement, currIndex, origArray){
  return currElement < 6;
}));
console.log("Should say false: " + every(myArray, function(currElement, currIndex, origArray){
  return currElement > 3;
}));


function some(arrayParam, callback){
  for(var i=0; i < arrayParam.length; i++){
    if( callback(arrayParam[i], i, arrayParam) ) {
      return true;  // if even ONE is true, return true
    }
  }
  return false;  // if NONE true, return false
}

Testing some()
console.log("Should say true: " + some(myArray, function(currElement, currIndex, origArray){
  return currElement < 2;
}));
console.log("Should say false: " + some(myArray, function(currElement, currIndex, origArray){
  return currElement > 6;
}));


// Some of the biggest things learned from these books
// JS - The Good Parts
  // Observation
    // You can become a better programmer by using ONLY THE GOOD PARTS of a language, so define your own subset. Avoid cases that are "sometimes useful", but othertimes dangerous. It's the programmer's burden to avoid a language's weaknesses or risky areas.
    // Your entire application should live inside of ONE Global Variable to provide
    // Never use "new". Use the prototypical pattern of delegation instead!
  // Question
    // If JS is so bad, why doesn't someone else come up with a new version? If Netscape can launch JS in its version 2.0 and change the web that quickly, why should we say it can't be done. Sure, it can't be done instantly, but if Netscape can do it, Google should be able to launch a properly-designed competitor language and change the webscape. Alternatively, why not "fix" JS and re-launch as a ner version that doesn't support prior versions. Prior versions will hang around a while, and eventually fall away.

// YDKJS - Scpes & Closures
  // Observation
    // Inner scopes will overwrite outer scopes if you don't call/decare new with var.
    // ALWAYS NAME FUNCTIONS - no reason not to.
    // "let" is the new block scope variable. "Let" is great for emphasizing block scope, and is useful for garbage collection. Remember block scopes are not hoisted.
    // The process of compilation consists of 3 main phases: tokenizing, parsing into program structure tree, and generating executable code. The scope process is a process of LHS/RHS lookups vis engine/compiler/scope. Hoisting starts the process declaring variables into their relative scopes, then lookups occur for hoisted declarations in their relative scopes, an finally executing accordingly.
  // Question
    // Does shadowing with variables cause the same issues Douglas Crockford mentioned iwth shadowing properties/methods in prototypes? Seems rather similar, as variables are essentially the same as properties. Wouldn't it cause brittle code here, too?

// YDKJS - this & Object Prototype
  // Observation
    // There are four rules (ie: a 4-step process) to determining "this". First, default binding (global scope). Second, implicit binding occurs when there is a context object. Third, explicit binding when "this" was forces through assignment. Fourth, "new" binding when using a function through constructor.
    // Process for determining "this" is asking: First, was "new" called - if so, new object is "this". Second, was hard-binding applied - if so, explicitly specified object is "this". Third, is function called with context - if so, context object is "this". Fourth, if none of others apply, "this" is the global object (or "undefined" if in strict mode).
  // Question
    // Author mentions at least one "workaround". How can we as younger programmers tell when a "workaround" is goog JS coding, or when it's really BAD JS coding & we should instead be using a better coding pattern? How do we know which side of the fence we're on?


// Chapter 6 - Exercises

////////////////////////////////A Vector Type//////////////////////////////////

// function Vector(x, y) {
//   this.x = x;
//   this.y = y;
// }

// Vector.prototype.plus = function (a, b) {
//     var newX = this.x + a;
//     var newY = this.y + b;
//     return new Vector(newX, newY);
//   };
// Vector.prototype.minus = function(a, b) {
//     var newX = this.x - a;
//     var newY = this.y - b;
//     return new Vector(newX, newY);
//   }

// Object.defineProperty(Vector.prototype, "length", {
//   get: function length() {
//     return Math.sqrt( (this.x * this.x) + (this.y * this.y) );
//   }
// });

// var first = new Vector(12, 12);
// var second = new Vector(1, 1);

// // Test our Objects/methods worked
// console.log(first.length);
// console.log(second.length);

// // Attempt to override the getter function property & test if worked
// second.length = 4;
// console.log(second.length);   // Should still be 1.4142 => no override allowed


