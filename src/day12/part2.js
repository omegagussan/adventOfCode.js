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

let paths = [];
const traverse = (curr, path = [], visitTwice = false) => {
    const nextPath = [...path, curr];

    if (curr === 'end') {
        paths.push(nextPath);
        return;
    }

    edges[curr].forEach((child) => {
        if (child === 'start') return;

        let nextFlag = visitTwice;

        if (child.toLowerCase() ===  child) {
            if (path.includes(child)) {
                if (nextFlag) return;
                nextFlag = true;
            }
        }

        traverse(child, nextPath, nextFlag);
    });
};

traverse('start');
console.log(paths.length);