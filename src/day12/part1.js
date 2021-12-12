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

function getAsList(arr, key){
    return arr[key] ? arr[key] : []
}

function traverse(edges, curr, hist){
    if (curr === 'end'){
        return 1
    }
    const cand = getAsList(edges, curr).filter(cand => !hist.has(cand));
    return cand.map(c => {
        if (curr.toLowerCase() === curr){
            let s = new Set([...hist, curr]);
            return traverse(edges, c, s)
        }
        return traverse(edges, c, hist)
    }).reduce(add, 0)
}

function add(accumulator, a) {
    return accumulator + a;
}

const totalWays = traverse(edges, 'start', new Set('start'))
console.log(totalWays)