const fs = require('fs');

const file = fs.readFileSync('./sample_input.txt');
let lines = file.toString().split('\n');
lines = lines.map(line => line.trim().split('').map(e => +e));

function getKey(r, c){
    return r + ',' + c
}

const lineDict = lines.reduce((acc, row, rowNr) => {
    row.forEach((h, colNr) => {
        const key = getKey(rowNr, colNr)
        acc[key] = h
    })
    return acc;
}, {});

function getNeighbourKeys(key){
    const [row, col] = key.split(',').map(e => +e);
    return [getKey(row -1, col), getKey(row +1, col), getKey(row, col+1), getKey(row, col-1)];
}

function getNeighbourValues (key, dict){
    return getNeighbourKeys(key).map(key => dict[key]);
}

const minP = Object.entries(lineDict).filter(([key, val]) => {
    const ns = getNeighbourValues(key, lineDict);
    return ns.every(n => n !== undefined ? n > val : true)
});

function add(accumulator, a) {
    return accumulator + a;
}

console.log(minP.map(([cord, val]) => val + 1).reduce(add, 0));