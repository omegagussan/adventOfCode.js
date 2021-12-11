const fs = require('fs');

const file = fs.readFileSync('./small.txt');
let lines = file.toString().split('\n');
lines = lines.map(line => line.trim().split('').map(e => +e));
//console.log(lines)

ROWMAX = lines.length - 1
COLMAX = lines[0].length - 1

function getKey(row, col){
    return `${row},${col}`
}

function combineAll(arr1, arr2, except = undefined){
    const res = []
    for (let e1 of arr1){
        for (let e2 of arr2){
            if (!(e1 === except[0] && e2 === except[1])){
                res.push([e1, e2])
            }
        }
    }
    return res
}

function getNeighbourKeys(row, col){
    const rowPerms = [row -1, row, row +1].filter(e => e >= 0 && e <= ROWMAX)
    const colPerms = [col -1, col, col +1].filter(e => e >= 0 && e <= COLMAX)
    return combineAll(rowPerms, colPerms, [row, col])
}

function sweapIncrement(matrix) {
    let flashedToday = new Set();
    matrix = matrix.map(row => row.map(e => e +1));
    matrix.forEach((row, rowIdx) => row.forEach((_, colIdx) => {
        const key = getKey(rowIdx, colIdx);
        if (matrix[rowIdx][colIdx] > 9 && !flashedToday.has(key)){
            matrix[rowIdx][colIdx] = 0
            flashedToday.add(key)
            console.log('key', key)
            console.log('before', matrix)
            getNeighbourKeys(rowIdx, colIdx).map(([row, col]) => recursiveFlash(matrix, row, col, flashedToday))
            console.log('after', matrix)
        }
    }));
    return {matrix, flashed: flashedToday.size}
}

function recursiveFlash(matrix, row, col, flashedToday){
    const key = getKey(row, col);
    if (!flashedToday.has(key)){
        matrix[row][col] += 1;
    }
    if (matrix[row][col] > 9 && !flashedToday.has(key)){
        matrix[row][col] = 0
        flashedToday.add(key)
        getNeighbourKeys(row, col).map(([row, col]) => recursiveFlash(matrix, row, col, flashedToday))
    }
}
const days = 2
let totalFlashes = 0
console.log(lines)
for (let d of [...Array(days + 1).keys()].slice(1)) {
    console.log('day', d);
    let {matrix, flashed} = sweapIncrement(lines);
    lines = matrix;
    totalFlashes += flashed;
    console.log('lines', lines)
}
console.log(totalFlashes)