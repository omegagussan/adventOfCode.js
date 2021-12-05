const fs = require('fs');

const file = fs.readFileSync('./input.txt');
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

function isSlopeUp(p1, p2) {
    return p1[0] - p2[0] === p1[1] - p2[1]
}

function isSlopeDown(p1, p2) {
    return p1[0] - p2[0] === - (p1[1] - p2[1])
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

function incrementUnsafe(grid, hashSafeElem){
    grid.has(hashSafeElem) ? grid.set(hashSafeElem, grid.get(hashSafeElem) + 1) : grid.set(hashSafeElem, 1);
}

function getHashSafe(grid, elem){
    const hashSafeElem = '' + elem;
    return grid.has(hashSafeElem) ? grid.get(hashSafeElem) : '.';
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

function fillSlopeUp(p1, p2, grid) {
    const coords = new Set();
    if (p1[0] > p2[0]){
        inclusiveRange(p2[0],p1[0]).map(value => [value, p2[1] + value - p2[0]]).forEach(cord => coords.add('' + cord));
    } else {
        inclusiveRange(p1[0],p2[0]).map(value => [value, p1[1] + value - p1[0]]).forEach(cord => coords.add('' + cord));
    }
    coords.forEach(coordinate => incrementUnsafe(grid, coordinate));

}

function fillSlopeDown(p1, p2, grid) {
    const coords = new Set();
    if (p1[0] > p2[0]){
        inclusiveRange(p2[0],p1[0]).map(value => [value, p2[1] - (value - p2[0])]).forEach(cord => coords.add('' + cord));
    } else {
        inclusiveRange(p1[0],p2[0]).map(value => [value, p1[1] - (value - p1[0])]).forEach(cord => coords.add('' + cord));
    }
    coords.forEach(coordinate => incrementUnsafe(grid, coordinate));
}

let validVerticalLines = lines.filter(line => isVertical(line[0], line[1]));
let validHorizontalLines = lines.filter(line => isHorizontal(line[0], line[1]));
let validSlopeUp = lines.filter(line => isSlopeUp(line[0], line[1]));
let validSlopeDown = lines.filter(line => isSlopeDown(line[0], line[1]));

//('valid', [...validSlopeDown]);
let grid = new Map();
validVerticalLines.forEach(line => {
    fillVertical(line[0], line[1], grid);
})
validHorizontalLines.forEach(line => {
    fillHorizontal(line[0], line[1], grid);
})
validSlopeUp.forEach(line => {
    fillSlopeUp(line[0], line[1], grid);
})
validSlopeDown.forEach(line => {
    fillSlopeDown(line[0], line[1], grid);
})
const minOccurrences = 2;
function getRemainder(arr, rem){
    return arr.map((val, index) => {
        return (index % 2 === rem) ? null : val;
    }).filter(val => val !== null);
}

function plot(grid) {
    const cords = [...grid].map(entry=> entry[0].split(','));
    const flatCords = cords.flat().map(e => +e);
    const maxX = Math.max(...getRemainder(flatCords, 0))
    const maxY = Math.max(...getRemainder(flatCords, 1))
    for (let y in inclusiveRange(0, maxY)){
        console.log(inclusiveRange(0, maxX).map(value => getHashSafe(grid, [value, y])).join(''));
    }

}
//plot(grid)
console.log([...grid].map(entry => entry[1]).filter(value => value >= minOccurrences).length);