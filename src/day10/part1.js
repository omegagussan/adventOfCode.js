const fs = require('fs');

const OPENERS = new Set(['(', '[', '{', '<'])
const CLOSERS = {
    '(': ')',
    '[': ']',
    '{': '}',
    '<': '>'
}
const SCORE = {
    ')': 3,
    ']': 57,
    '}': 1197,
    '>': 25137
}
const file = fs.readFileSync('./input.txt');
let lines = file.toString().split('\n');
lines = lines.map(line => line.trim().split(''));

function validateLine(line){
    const queue = []
    line.forEach(char => {
        if (OPENERS.has(char)){queue.push(char);}
        else {
            const elem = queue.pop()
            const expected = CLOSERS[elem]
            if (expected !== char){throw Error(char)}
        }
    })
    return queue
}

let score = 0
lines.forEach(line => {
    try{
        validateLine(line)
    }catch (e) {
        console.log(e.message)
        score += SCORE[e.message]
    }
});
console.log(score)