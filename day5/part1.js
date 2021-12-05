const fs = require('fs');

const file = fs.readFileSync('./sample_input.txt');
let lines = file.toString().split('\n');
lines = lines.map(line => line.trim().split(' -> ')
    .map(tuple => tuple.trim().split(',').map(e => +e)));

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

const zip = (a, b) => a.map((k, i) => [k, b[i]]);

function buildGrid(datasets, methods) {
    const grid = new Map();

    zip(datasets, methods).map(pair => pair[0].forEach(line => pair[1](line[0], line[1], grid)))
    return grid;
}

const grid = buildGrid([validVerticalLines, validHorizontalLines], [fillVertical, fillHorizontal]);
const minOccurrences = 2;

function getMapEntryElement(entry) {
    return entry[1];
}

console.log([...grid].map(entry => getMapEntryElement(entry)).filter(value => value >= minOccurrences).length);