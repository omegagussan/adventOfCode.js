const fs = require('fs');

const file = fs.readFileSync('./input.txt');
let lines = file.toString().split('\n');
let dots = lines.filter(l => l !== '' && !l.startsWith('fold along')).map(l => l.split(',').map(e => +e))
let folds = lines.filter(l => l.startsWith('fold along '))
folds = folds.map(l => l.replace(/^fold along /, ''));
folds = folds.map(l => l.split('='))
console.log([dots, folds])

let [maxX, maxY] = dots.reduce((acc, val) => [Math.max(acc[0], val[0]), Math.max(acc[1], val[1])], [0, 0])
let matrix = new Array(maxY + 1).fill(0).map(() => new Array(maxX + 1).fill(0));

dots.forEach(([x,y]) => {
    matrix[y][x] = 1
})

const fold_y = (matrix, val) => {
    let top = matrix.slice(0, val)
    let bottom = matrix.slice(-val).reverse()
    return top.map((r, rI) => r.map((e, cI) => e + bottom[rI][cI]));
}

const fold_x = (matrix, val) => {
    let left = matrix.map(r => r.slice(0, val))
    let right = matrix.map(r => r.slice(-val).reverse())
    return left.map((r, rI) => r.map((e, cI) => e + right[rI][cI]));
}

const count = (matrix) => {
    return matrix.flatMap(x => x).filter(x => x > 0).length
}

function performFolds(matrix, folds, foldFunctions){
    folds.forEach(([dim, val]) => {
        let foldF = dim === 'y' ? foldFunctions[0] : foldFunctions[1];
        matrix = foldF(matrix, val)
        //console.log(count(matrix))
        //console.log('size', [matrix.length, matrix[0].length])
    })
    return matrix
}

matrix = performFolds(matrix, folds, [fold_y, fold_x])
console.log(matrix);