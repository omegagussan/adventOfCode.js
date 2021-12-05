const fs = require('fs');

const file = fs.readFileSync('./sample_input.txt');
let lines = file.toString().split('\n');
lines = lines.map(line => line.trim().split(' -> ')
    .map(tuple => tuple.trim().split(',').map(e => +e)));

function isVertical(p1, p2) {
    return p1[0] === p2[0]
}

function inclusiveRange(from, to){
    const inclusiveTo = to + 1;
    return [...Array(inclusiveTo).keys()].slice(from, inclusiveTo);
}

//console.log(inclusiveRange(10, 2));

function increment(grid, elem){
    grid.has(elem) ? grid.set(elem, grid.get(elem) + 1) : grid.set(elem, 1);
}

function fillVertical(p1, p2, grid) {
    const from = Math.min(p1[1], p2[1])
    const to = Math.max(p1[1], p2[1])
    inclusiveRange(from, to).map(value => [p1[0], value]).forEach(coordinate => increment(grid, coordinate));
}

let validLines = lines.filter(line => isVertical(line[0], line[1]));
console.log('valid', validLines);
const grid = new Map();
validLines.forEach(line => {
    fillVertical(line[0], line[1], grid);
    console.log(grid);
})
