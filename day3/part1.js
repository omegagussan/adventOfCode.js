const fs = require('fs');

const count = ( acc, el ) => {
    if (el === ''){
      return acc;
    }
    acc[el] = acc[el] ? acc[el] + 1 : 1;
    return acc;
};

const file = fs.readFileSync('./sample_input.txt');
let lines = file.toString().split("\n");
lines = lines.map(s => s.trim());
const elemLength = lines[0].length;
const twoClassComparator = lines.length/2;

const cols = Array();
for (let i = 0; i < elemLength; i++) {
    const col = lines.map(s => s.charAt(i));
    cols.push(col)
}

const colCount = cols.map(arr => arr.reduce(count, {}));
const gamma = colCount.map(col => (col['1'] > twoClassComparator) ? "1" : "0");
const epsilon = colCount.map(col => (col['0'] < twoClassComparator) ? "0" : "1");
const gamma_int = parseInt(gamma.join(""), 2);
const epsilon_int = parseInt(epsilon.join(""), 2);
console.log(gamma_int*epsilon_int)
