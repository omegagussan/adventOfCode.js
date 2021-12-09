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

function times(accumulator, a) {
    return accumulator * a;
}

function basinSize(key, dict, visited= new Set()){
    const nonVisitedKeys = getNeighbourKeys(key, dict).filter(n => !visited.has(n));
    if (visited.has(key)){
        return 0;
    }
    visited.add(key);

    const shallGo = nonVisitedKeys.filter(key => dict[key] !== undefined && dict[key] < 9 )
    if (nonVisitedKeys.length === 0 || shallGo.length === 0){
        return 1;
    }
    return 1 + shallGo.map(goKey => basinSize(goKey, dict, visited)).reduce(add, 0);
}

console.log(minP.map(([key, val]) => basinSize(key, lineDict)).sort((a,b) => b-a).slice(0,3).reduce(times, 1));