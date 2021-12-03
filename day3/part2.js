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
    const cols = Array.from(Array(elemLength).keys()).map(i => lines.map(s => s.charAt(i)));
    return cols.map(arr => arr.reduce(count, {}));
}

const oxygen_condtional = (colCount, col) => {
    return colCount[col]['1'] >= colCount[col]['0'];
}

const co2_scrub_condtional = (colCount, col) => {
    return colCount[col]['0'] <= colCount[col]['1'];
}

function oxygen_function(lines) {
    let candidates = lines.slice();
    let colCount = colCountFun(candidates);
    return reduce_candidates(colCount, candidates, oxygen_condtional, "1", "0");

}

function reduce_candidates(colCount, candidates, con, outcome1, outcome2) {
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

function co2_scrub_function(lines) {
    let candidates = lines.slice();
    let colCount = colCountFun(candidates);
    return reduce_candidates(colCount, candidates, co2_scrub_condtional, "0", "1");
}

const co2_scrub = co2_scrub_function(lines);
const oxygen_int = oxygen_function(lines);
console.log([oxygen_int, co2_scrub])
console.log(oxygen_int*co2_scrub)