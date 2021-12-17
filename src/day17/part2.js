const fs = require('fs');

const file = fs.readFileSync('./input.txt');
const [xMin, xMax, yMin, yMax] = file.toString().match(/-?\d+/g).map(e => +e)
console.log([xMin, xMax, yMin, yMax])

function inBox(x, y){
    return xMin <= x && x <= xMax && yMin <= y && y <= yMax
}

function combineAll(arr1, arr2){
    const res = []
    for (let e1 of arr1){
        for (let e2 of arr2){
            res.push([e1, e2])
        }
    }
    return res
}

function findHeightIfHitsBox(vx, vy, top=0){
    let px=0
    let py=0
    while (px <= xMax && yMin <= py){
        px = px + vx
        py = py + vy
        vx = Math.max(0, vx-1)
        vy += -1
        top = Math.max(top, py)
        if(inBox(px, py)){return top}
    }
    return null
}

function range(start, stop, step=1) {
    return Array.from({ length: (stop - start) / step + 1}, (_, i) => start + (i * step));
}
//no need to start faster then 1 step to the boxes bottom edges
const xRange = Array.from(Array(xMax +1).keys())
let yRange = range(yMin, -yMin)
const candidateExitVelocityPairs = combineAll(xRange, yRange);
const parabolasWithHeights = candidateExitVelocityPairs.map(p => [findHeightIfHitsBox(p[0], p[1]), p]).filter(p => p[0] !== null)
console.log(new Set(parabolasWithHeights.map(p => p[1])).size)
