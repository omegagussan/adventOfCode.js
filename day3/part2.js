const fs = require('fs');

const count = ( acc, el ) => {
    if (el === ''){
        return acc;
    }
    acc[el] = acc[el] ? acc[el] + 1 : 1;
    return acc;
};

const file = fs.readFileSync('./input.txt');
let lines = file.toString().split("\n");
lines = lines.map(s => s.trim());
const elemLength = lines[0].length;

function colCountFun(lines){
    const cols = Array();
    for (let i = 0; i < elemLength; i++) {
        const col = lines.map(s => s.charAt(i));
        cols.push(col)
    }

    const colCount = cols.map(arr => arr.reduce(count, {}));
    return colCount;
}

let candidates = lines.slice();
let colCount= colCountFun(candidates);
// oxygen generator rating
for (col in colCount){
    colCount= colCountFun(candidates);
    //console.log([colCount[col]['1'],colCount[col]['0']])
    if (colCount[col]['1'] >= colCount[col]['0']){
        //console.log("looking for 1")
        candidates = candidates.filter(s => s.charAt(col) === "1")
    } else {
        //console.log("looking for 0")
        candidates = candidates.filter(s => s.charAt(col) === "0")
    }
    //console.log(candidates);
    if (candidates.length < 2){
        break;
    }
}
const oxygen_int = parseInt(candidates[0], 2);

candidates = lines.slice();
colCount= colCountFun(candidates);
// co2 scrubb rating
for (col in colCount){
    colCount= colCountFun(candidates);
    console.log([colCount[col]['1'],colCount[col]['0']])
    if (colCount[col]['0'] <= colCount[col]['1']){
        console.log("looking for 0")
        candidates = candidates.filter(s => s.charAt(col) === "0")
    } else {
        console.log("looking for 1")
        candidates = candidates.filter(s => s.charAt(col) === "1")
    }
    console.log(candidates);
    if (candidates.length < 2){
        break;
    }
}
const co2_scrub = parseInt(candidates[0], 2);

console.log([oxygen_int, co2_scrub])
console.log(oxygen_int*co2_scrub)