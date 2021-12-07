const fs = require('fs');

const file = fs.readFileSync('./input.txt');
const line = file.toString().split(',').map(e => +e);
const sortedLine = line.sort((a,b) => a-b);

//of sorted
function median(arr) {
    const mid = Math.floor(arr.length / 2)
    return arr.length % 2 !== 0 ? arr[mid] : (arr[mid - 1] + arr[mid]) / 2;
}

function findClosest(arr, val) {
    const closestIdx = arr.reduce((state, elem, idx) => {
        const distCandidate = Math.abs(val - elem)
        if (distCandidate < state.dist){
            state.dist = distCandidate;
            state.idx = idx;
        }
        return state;
    }, {dist: Number.MAX_SAFE_INTEGER, idx: undefined}).idx;
    return arr[closestIdx];
}

const centroid = median(sortedLine)
const centroid_elem = findClosest(sortedLine, centroid);
const cost = sortedLine.reduce((sum, elem) => sum += Math.abs(elem-centroid_elem), 0);
console.log(cost);