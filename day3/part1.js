const fs = require('fs');
var nj = require('numjs');

const count = ( acc, el ) => {
    if (el === ''){
      return acc;
    }
    acc[el] = acc[el] ? acc[el] + 1 : 1;
    return acc;
};

const file = fs.readFileSync('./day3/sample_input.txt');
let lines = file.toString().split("\n");
lines = lines.map(s => s.trim());
lines = lines.map(s => {
    const el = s.split("")
    return el.map(s => +s)
});

const twoClassComparator = lines.length/2;
const elemLength = lines[0].length;
nj_lines = nj.array(lines, 'int')

const cols = Array.from(Array(elemLength).keys())
    .map(i => nj_lines.slice(null, [i, i+1]).flatten().tolist());

const colCount = cols.map(arr => arr.reduce(count, {}));
const gamma = colCount.map(col => (col['1'] > twoClassComparator) ? "1" : "0");
const epsilon = colCount.map(col => (col['0'] < twoClassComparator) ? "0" : "1");
const gamma_int = parseInt(gamma.join(""), 2);
const epsilon_int = parseInt(epsilon.join(""), 2);
console.log(gamma_int*epsilon_int)
