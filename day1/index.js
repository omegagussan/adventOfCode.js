const fs = require('fs');

const file = fs.readFileSync('./input.txt');
const numbers = file.toString().split("\n").map(e => +e);
const diffs = numbers.slice(1).map((x,i)=> x-numbers[i]);
const numberOfIncremented = diffs.filter(x => x > 0).length

console.log(numberOfIncremented);