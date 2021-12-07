const fs = require('fs');

const file = fs.readFileSync('./input.txt');
const line = file.toString().split(',').map(e => +e);
const sortedLine = line.sort((a,b) => a-b);

function findSmallestIdx(arr) {
    return arr.reduce((state, elem, idx) => {
        if (elem < state.val) {
            state.val = elem;
            state.idx = idx;
        }
        return state;
    }, {val: Number.MAX_SAFE_INTEGER, idx: undefined}).idx;
}

function inclusiveRange(from, to) {
    return [...Array(to +1).keys()].slice(from)
}

function costOfDistance(distance){
    return (distance*(distance-1))/2 + distance;
}

const costs = []
for (let i of inclusiveRange(sortedLine[0], sortedLine.slice(-1)[0])){
    const cost = sortedLine.reduce((sum, elem) => sum += costOfDistance(Math.abs(elem-i)), 0);
    costs.push(cost);
}
console.log(costs[findSmallestIdx(costs)]);
