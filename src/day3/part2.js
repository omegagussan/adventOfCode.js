const fs = require('fs');

const count = ( acc, el ) => {
    if (el === ''){
        return acc;
    }
    acc[el] = acc[el] ? acc[el] + 1 : 1;
    return acc;
};

const file = fs.readFileSync('./sample_input.txt');
let lines = file.toString().split('\n');
lines = lines.map(s => s.trim());
const elemLength = lines[0].length;

function colCountFun(lines){
    const cols = Array.from(Array(elemLength).keys()).map(i => lines.map(s => s.charAt(i)));
    return cols.map(arr => arr.reduce(count, {}));
}

const oxygenConditional = (colCount, col) => {
    return colCount[col]['1'] >= colCount[col]['0'];
}

const co2ScrubConditional = (colCount, col) => {
    return colCount[col]['0'] <= colCount[col]['1'];
}

function oxygenFunction(lines) {
    let candidates = lines.slice();
    let colCount = colCountFun(candidates);
    return reduceCandidates(colCount, candidates, oxygenConditional, '1', '0');

}

function reduceCandidates(colCount, candidates, con, outcome1, outcome2) {
    for (let col in colCount) {
        colCount = colCountFun(candidates);
        if (con(colCount, col)) {
            candidates = candidates.filter(s => s.charAt(col) === outcome1)
        } else {
            candidates = candidates.filter(s => s.charAt(col) === outcome2)
        }
        if (candidates.length < 2) {
            break;
        }
    }
    return parseInt(candidates[0], 2);
}

function co2ScrubFunction(lines) {
    let candidates = lines.slice();
    let colCount = colCountFun(candidates);
    return reduceCandidates(colCount, candidates, co2ScrubConditional, '0', '1');
}

const co2Scrub = co2ScrubFunction(lines);
const oxygenInt = oxygenFunction(lines);
console.log(oxygenInt*co2Scrub)