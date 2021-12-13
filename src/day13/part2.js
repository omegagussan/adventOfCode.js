const fs = require('fs');

const file = fs.readFileSync('./input.txt');
let lines = file.toString().split('\n');
let dots = lines.filter(l => l !== '' && !l.startsWith('fold along')).map(l => l.split(',').map(e => +e))
let folds = lines.filter(l => l.startsWith('fold along '))
folds = folds.map(l => l.replace(/^fold along /, ''));
folds = folds.map(l => l.split('='))
console.log([dots, folds])

const print = (matrix) => {
    let [maxX, maxY] = matrix.reduce((acc, val) => [Math.max(acc[0], val[0]), Math.max(acc[1], val[1])], [0, 0])
    let grid = new Array(maxY + 1).fill(0).map(() => new Array(maxX + 1).fill(0));
    matrix.forEach(([x,y]) => {grid[y][x]=1});
    grid.forEach(l => console.log(l.map(e => e ? '#' : '.').join('')) + '\n')
}

let matrix = dots.reduce((acc, cords) => {acc.push(cords); return acc}, []);
console.log(matrix);

const fold_y = (matrix, val) => {
    return matrix.map(([x,y]) => {
        if(y > val){
            return [x, val -(y -val)]
        } else {
            return [x,y]
        }
    });
}

const fold_x = (matrix, val) => {
    return matrix.map(([x,y]) => {
        if(x > val){
            return [val -(x -val), y]
        } else {
            return [x,y]
        }
    });
}

function performFolds(matrix, folds, foldFunctions){
    folds.forEach(([dim, val]) => {
        let foldF = dim === 'y' ? foldFunctions[0] : foldFunctions[1];
        matrix = foldF(matrix, val)
    })
    return matrix
}

matrix = performFolds(matrix, folds, [fold_y, fold_x])

print(matrix);