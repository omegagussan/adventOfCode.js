const fs = require('fs');

function diffs(arr) {
    return arr.slice(1).map((x,i)=> x-arr[i]);
}

const file = fs.readFileSync('./input.txt');
const numbers = file.toString().split("\n").map(e => +e);
const diffs = diffs(numbers)
const numberOfIncremented = diffs.filter(x => x > 0).length

console.log(numberOfIncremented);