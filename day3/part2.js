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

function colCountFun(lines){
    const cols = Array();
    for (let i = 0; i < elemLength; i++) {
        const col = lines.map(s => s.charAt(i));
        cols.push(col)
    }
    return cols.map(arr => arr.reduce(count, {}));
}

function oxygen_function(lines) {
    let candidates = lines.slice();
    let colCount = colCountFun(candidates);
    for (let col in colCount) {
        colCount = colCountFun(candidates);
        if (colCount[col]['1'] >= colCount[col]['0']) {
            candidates = candidates.filter(s => s.charAt(col) === "1")
        } else {
            candidates = candidates.filter(s => s.charAt(col) === "0")
        }
        if (candidates.length < 2) {
            break;
        }
    }
    return parseInt(candidates[0], 2);
}

function co2_scrub_function(lines) {
    let candidates = lines.slice();
    let colCount = colCountFun(candidates);
    for (let col in colCount) {
        colCount = colCountFun(candidates);
        if (colCount[col]['0'] <= colCount[col]['1']) {
            candidates = candidates.filter(s => s.charAt(col) === "0")
        } else {
            candidates = candidates.filter(s => s.charAt(col) === "1")
        }
        if (candidates.length < 2) {
            break;
        }
    }
    return parseInt(candidates[0], 2);
}

const co2_scrub = co2_scrub_function(lines);
const oxygen_int = oxygen_function(lines);
console.log(oxygen_int*co2_scrub)