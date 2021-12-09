const fs = require('fs');

const file = fs.readFileSync('./input.txt');
const lines = file.toString().split('\n');

function increment(acc, action, val) {
    const numberValue = +val;
    acc[action] += numberValue;
}

const reducer = (acc, line) => {
    const [action, val] = line.split(' ');
    switch(action){
        case 'up':
            increment(acc, 'aim', -val)
            break;
        case 'down':
            increment(acc, 'aim', val)
            break;
        case 'forward':
            increment(acc, 'horizontal', val)
            increment(acc, 'vertical', val * acc['aim'])
            break;
        default:
            throw new Error('not expected');
    }
    return acc;
}
const finalState = lines.reduce(reducer, {aim: 0, horizontal: 0, vertical: 0});
const answer = Math.abs(finalState['vertical']* finalState['horizontal'])
console.log(answer);