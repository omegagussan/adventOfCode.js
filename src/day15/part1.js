const fs = require('fs');

const file = fs.readFileSync('./input.txt');
let lines = file.toString().split('\n');
lines = lines.map(line => line.trim().split('').map(e => +e));
function key(r, c){
    return r + ',' + c
}
const grid = lines.reduce((acc, row, rowIdx) => {
    for (const [colIdx, v] of row.entries()){
        acc[key(rowIdx, colIdx)] = v
    }
    return acc;
}, {});

const N_PATTERN = [[1,0], [-1, 0], [0, 1], [0, -1]]
function getNeighbourKeys(currKey){
    let n = [];
    let [row, col] = currKey.split(',').map(e=>+e)
    for (let [a, b] of N_PATTERN){
        let keyCand = key(row+a, col+b)
        if (grid[keyCand]){
            n.push(keyCand)
        }
    }
    return n;
}

const START = key(0,0)
const END = key(lines.length-1, lines[0].length-1)

let bestMap = Object.entries(grid).reduce((acc, [k, _]) => {acc[k]=Number.MAX_SAFE_INTEGER; return acc}, {});
bestMap[START] = 0
for (let [k, _] of Object.entries(grid)){
    if (k === START){continue;}
    bestMap[k] = grid[k] + Math.min(...getNeighbourKeys(k).map(key => bestMap[key]));
}
console.log(bestMap[END]);
