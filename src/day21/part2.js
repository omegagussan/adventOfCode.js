const fs = require('fs');

const file = fs.readFileSync('./sample_input.txt');
let state = file.toString().split('\n').map(l => l.slice(-1)[0]).map(e => +e).map(e => e-1)
let score = [0, 0]
console.log(state)

function play(player, state, score) {
    let states = [];
    for(let j=0; j < 3; j++){
        let quantumDie = [1,2,3]
        quantumDie.forEach(roll => {
            let stateFork = [...state]
            let scoreFork = [...score]
            stateFork[player] = (stateFork[player] + roll) % 10
            scoreFork[player] = scoreFork[player] + stateFork[player] + 1
            states.push({state: stateFork, score: scoreFork})
        })
    }
    return states;
}

let player = 0
let ongoing = [{state, score}]
let wins = [0, 0]
while(ongoing.length > 0){
    let before = ongoing.length
    for (let i=0; i < before; i++){
        let {state:st, score:sc} = ongoing.shift()
        let outcomes = play(player % 2, st, sc)
        ongoing.push(...outcomes)
    }
    ongoing = ongoing.filter(game => {
        if (game.score[0] >= 21){
            wins[0] += 1
            return false
        }
        if (game.score[1] >= 21){
            wins[1] += 1
            return false
        }
        return true
    })
    player += 1
}
console.log(wins)
console.log(Math.max(...wins))