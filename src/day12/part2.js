const fs = require('fs');

const file = fs.readFileSync('./input.txt');
let lines = file.toString().split('\n');
lines = lines.map(line => line.trim().split('-'));

function addEdges(acc, from, to){
    if (acc[from]){
        acc[from].push(to)
    } else {
        acc[from] = [to]
    }
}


const edges = lines.reduce((acc, [from, to]) => {
    addEdges(acc, from, to)
    addEdges(acc, to, from)
    return acc;
}, {});
console.log(edges)

let allWays = [];
const traverse = (curr, currWay = [], visitedTwice = false) => {
    const nextPath = [...currWay, curr];

    if (curr === 'end') {
        allWays.push(nextPath);
        return;
    }

    edges[curr].forEach((child) => {
        if (child === 'start') return;

        let nextFlag = visitedTwice;

        if (child.toLowerCase() ===  child) {
            if (currWay.includes(child)) {
                if (nextFlag) return;
                nextFlag = true
            }
        }

        traverse(child, nextPath, nextFlag);
    });
};

traverse('start');
console.log(allWays.length);