const fs = require('fs');

const file = fs.readFileSync('./input.txt');
const line = file.toString().split(',').map(e => +e);
const sortedLine = line.sort((a,b) => a-b);

function inclusiveRange(from, to) {
    return [...Array(to +1).keys()].slice(from)
}

function costOfDistance(distance){
    return (distance*(distance+1))/2;
}

let min_cost = Number.MAX_SAFE_INTEGER
for (let i of inclusiveRange(sortedLine[0], sortedLine.slice(-1)[0])){
    const cost = sortedLine.reduce((sum, elem) => sum += costOfDistance(Math.abs(elem-i)), 0);
    min_cost = Math.min(min_cost, cost)
}
console.log(min_cost);
