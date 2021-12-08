const fs = require('fs');

const file = fs.readFileSync('./input.txt');
const line = file.toString().split(',').map(e => +e);
const sortedLine = line.sort((a,b) => a-b);

//of sorted
function median(arr) {
    const mid = Math.floor(arr.length / 2)
    return arr.length % 2 !== 0 ? arr[mid] : (arr[mid - 1] + arr[mid]) / 2;
}

const centroid = median(sortedLine)
const cost = sortedLine.reduce((sum, elem) => sum += Math.abs(elem-centroid), 0);
console.log(cost);