const fs = require('fs');

const count = ( acc, el ) => {
    acc[el] = acc[el] ? acc[el] + 1 : 1;
    return acc;
};

const file = fs.readFileSync('./sample_input.txt');
let lines = file.toString().split('\n');
lines = lines.map(s => s.trim());
const elemLength = lines[0].length;
const twoClassComparator = lines.length/2;

const cols = Array.from(Array(elemLength).keys()).map(i => lines.map(s => s.charAt(i)));
const colCount = cols.map(arr => arr.reduce(count, {}));
const gamma = colCount.map(col => (col['1'] > twoClassComparator) ? '1' : '0');
const epsilon = colCount.map(col => (col['0'] < twoClassComparator) ? '0' : '1');
const gammaInt = parseInt(gamma.join(''), 2);
const epsilonInt = parseInt(epsilon.join(''), 2);
console.log(gammaInt*epsilonInt)
