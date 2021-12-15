const fs = require('fs');
const { performance } = require('perf_hooks');
let startTime = performance.now()

const XSTEPS = 5
const YSTEPS = 5
const file = fs.readFileSync('./input.txt');
let lines = file.toString().split('\n');
lines = lines.map(line => line.trim().split('').map(e => +e));
function key(r, c){
    return r + ',' + c
}
let grid = lines.reduce((acc, row, rowIdx) => {
    for (const [colIdx, v] of row.entries()){
        acc[key(rowIdx, colIdx)] = v
    }
    return acc;
}, {});

function decorateLargeGrid(grid, xsteps, xlen, ysteps, ylen){
    let newGrid = {}
    for (let y=0; y < ysteps; y++){
        for(let x=0; x < xsteps; x++){
            Object.entries(grid).forEach(([k, v]) => {
                let ks = k.split(',').map(e => +e)
                let nk = key( y * ylen + ks[0],  x * xlen + ks[1])
                newGrid[nk] = (v + x + y) > 9 ? (v + x + y) % 10 + 1 : (v + x + y);
            })
        }
    }
    return newGrid;
}
grid = decorateLargeGrid(grid, XSTEPS, lines[0].length, YSTEPS,lines.length)

console.log(`Call to decorateGrid took ${performance.now() - startTime} milliseconds`)
//console.log(Array.from(Array(50).keys()).map(i => grid[key(49, i)]).join(''));
//console.log(Object.keys(grid).length)
//let t = decorateLargeGrid({'1,2': 8}, 5, lines[0].length, 5,lines.length)
//console.log(t)

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
const END = key(lines.length * YSTEPS-1, lines[0].length * XSTEPS -1)
//console.log(grid[END])

let bestMap = Object.entries(grid).reduce((acc, [k, _]) => {acc[k]=Number.MAX_SAFE_INTEGER; return acc}, {});
bestMap[START] = 0

let target = Number.MAX_SAFE_INTEGER - 1; //dont init to same
//numerical stability
while(!(target === bestMap[END])){
    target = bestMap[END]
    for (let [k, v] of Object.entries(grid)){
        if (k === START){continue;}
        bestMap[k] = v + Math.min(...getNeighbourKeys(k).map(key => bestMap[key]));
    }
}
console.log(`Call to loop took ${performance.now() - startTime} milliseconds`)
console.log(target);
