const fs = require('fs');

function inclusiveRange(from, to) {
    return [...Array(to +1).keys()].slice(from)
}

function* infiniteGen(arr){
    if(!Array.isArray(arr)){throw Error("not array")}
    while(true){
        yield* arr
    }
}
let testDie = infiniteGen(inclusiveRange(1, 4))
let test = testDie.next().value + testDie.next().value + testDie.next().value
let test2 = testDie.next().value + testDie.next().value + testDie.next().value
console.assert(test === 6, 'first 3 rolls did not equal 6')
console.assert(test2 === 7, 'next 3 rolls did not equal 7')

const die = infiniteGen(inclusiveRange(1, 100))

const file = fs.readFileSync('./input.txt');
let state = file.toString().split('\n').map(l => l.slice(-1)[0]).map(e => +e).map(e => e-1)
let score = [0, 0]
console.log(state)

function play(player, die, state, score) {
    let rollDie = 0
    for (let i=0; i<3; i++){
        let next = die.next().value
        rollDie += next
    }
    state[player] = (state[player] + rollDie) % 10
    score[player] = score[player] + state[player] + 1
}

let player = 0
while(true){
    play(player % 2, die, state, score)
    player += 1
    //console.log('x', score)
    //console.log('s', state)
    //console.log(' ')
    if (score.some(e => e >= 1000)) break
}
let looser = Math.min(...score)
let rolls = player *3
console.log(looser)
console.log(rolls)
console.log(rolls*looser)