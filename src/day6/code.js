const fs = require('fs');

const resetTime = 6;
const startTime = 8;

const file = fs.readFileSync('./sample_input.txt');
let line = file.toString().split(',').map(e => +e);

function buildInitialState() {
    const dictState = line.reduce((acc, elem) => {
        acc[elem] ? acc[elem] += 1 : acc[elem] = 1;
        return acc;
    }, {});
    let state = new Array(startTime).fill(0);
    for (let [key, value] of Object.entries(dictState)) {
        state[+key] = value;
    }
    return state;
}

let state = buildInitialState();

function stepDay(state){
    const numberReset = state[0] ? state[0] : 0
    state.shift();
    state.push(0);
    state[resetTime] = state[resetTime] ? state[resetTime] + numberReset : numberReset
    state[startTime] = state[startTime] ? state[startTime] + numberReset : numberReset
    return state;
}

function sumFishAfterDays(days, debug=false) {
    for (let d of [...Array(days + 1).keys()].slice(1)) {
        state = stepDay(state);
        if (debug){
            console.log(d, ' days: ', state.join(','));
        }
    }

    function add(accumulator, a) {
        return accumulator + a;
    }

    return state.reduce(add, 0);
}

console.log('part1:', sumFishAfterDays(80));
console.log('part1:', sumFishAfterDays(256));