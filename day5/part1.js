const fs = require('fs');

const file = fs.readFileSync('./sample_input.txt');
let lines = file.toString().split('\n');
lines = lines.map(line => line.trim().split(' -> ')
    .map(tuple => tuple.trim().split(',').map(e => +e)));

//console.log(lines);

function isVertical(p1, p2
) {
    return p1[0] === p2[0]
}

function isHorizontal(p1, p2) {
    return p1[1] === p2[1]
}

function inclusiveRange(from, to){
    const inclusiveTo = to + 1;
    return [...Array(inclusiveTo).keys()].slice(from, inclusiveTo);
}

//console.log(inclusiveRange(10, 2));

function increment(grid, elem){
    const hashSafeElem = '' + elem;
    grid.has(hashSafeElem) ? grid.set(hashSafeElem, grid.get(hashSafeElem) + 1) : grid.set(hashSafeElem, 1);
}

function fillVertical(p1, p2, grid) {
    const from = Math.min(p1[1], p2[1])
    const to = Math.max(p1[1], p2[1])
    inclusiveRange(from, to).map(value => [p1[0], value]).forEach(coordinate => increment(grid, coordinate));
}

function fillHorizontal(p1, p2, grid) {
    const from = Math.min(p1[0], p2[0])
    const to = Math.max(p1[0], p2[0])
    inclusiveRange(from, to).map(value => [value, p1[1]]).forEach(coordinate => increment(grid, coordinate));
}

let validVerticalLines = lines.filter(line => isVertical(line[0], line[1]));
let validHorizontalLines = lines.filter(line => isHorizontal(line[0], line[1]));

//console.log('valid', [...validHorizontalLines, ...validVerticalLines]);
const grid = new Map();
validVerticalLines.forEach(line => {
    fillVertical(line[0], line[1], grid);
})
validHorizontalLines.forEach(line => {
    fillHorizontal(line[0], line[1], grid);
})
//console.log('grid', grid)
const minOccurrences = 2;
function add(accumulator, a) {
    return accumulator + a;
}
console.log([...grid].map(entry => entry[1]).filter(value => value >= minOccurrences).map(value => value-1).reduce(add, 0));