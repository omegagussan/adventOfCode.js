const fs = require('fs');

const count = ( acc, el ) => {
    if (el === ''){
      return acc;
    }
    acc[el] = acc[el] ? acc[el] + 1 : 1;
    return acc;  
};

const minFun = (prev, curr) => prev[1] > curr[1] ? prev : curr
const maxFun = (prev, curr) => prev[1] < curr[1] ? prev : curr

const getKeyByFun = (obj, fun) => {
  return Object.entries(obj).reduce(fun, 0)[0]
}

const file = fs.readFileSync('./input.txt');
let lines = file.toString().split("\n");
lines = lines.map(s => s.trim());
const elemLength = lines[0].length;

const cols = Array();
for (let i = 0; i < elemLength; i++) {
    const col = lines.map(s => s.charAt(i));
    cols.push(col)
}

const colCount = cols.map(arr => arr.reduce(count, {}));
const gamma = colCount.map(col => getKeyByFun(col, maxFun));
const epsilon = colCount.map(col => getKeyByFun(col, minFun));
const gamma_int = parseInt(gamma.join(""), 2);
const epsilon_int = parseInt(epsilon.join(""), 2);
console.log(gamma_int*epsilon_int)
