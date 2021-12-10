const fs = require('fs');

const OPENERS = new Set(['(', '[', '{', '<'])
const CLOSERS = {
    '(': ')',
    '[': ']',
    '{': '}',
    '<': '>'
}
const SCORE = {
    ')': 1,
    ']': 2,
    '}': 3,
    '>': 4
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

function score(accumulator, elem) {
    const elemVal = SCORE[elem]
    return (5 * accumulator) + elemVal;
}

function treatIncomplete(state){
    return state.reverse().map(elem => CLOSERS[elem])
}

let scores = []
lines.forEach(line => {
    try{
        let incompleteState = validateLine(line);
        incompleteState = treatIncomplete(incompleteState);
        let rowScore = incompleteState.reduce(score, 0);
        scores.push(rowScore);
    }catch (e) {
    }
});
scores = scores.sort((a, b) => a-b);
console.log(scores[scores.length / 2 | 0])