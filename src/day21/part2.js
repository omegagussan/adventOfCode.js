const fs = require('fs');

const file = fs.readFileSync('./src/day21/input.txt');
let state = file.toString().split('\n').map(l => l.slice(-1)[0]).map(e => +e).map(e => e-1)
//console.log(state)

const DIRAC = {3: 1, 4: 3, 5: 6, 6: 7, 7: 6, 8: 3, 9: 1}
function countWins(player, state, score, memo = {}, winConstraint=21) {
    let wins = [0,0]
    let playerId = player % 2
    let hash = [playerId, state.join(','), score.join(',')].join(';')
    if (memo[hash]) return memo[hash]

    for (let [roll, weight] of Object.entries(DIRAC)){
        roll = Number(roll)
        let stateFork = [...state]
        let scoreFork = [...score]
        let val = (stateFork[playerId] + roll) % 10
        stateFork[playerId] = val
        scoreFork[playerId] += val + 1

        if (scoreFork[playerId] >= winConstraint){
            wins[playerId] += weight
        } else {
            let w = countWins( player+1, stateFork, scoreFork, memo, winConstraint)
            wins[0] += weight * w[0]
            wins[1] += weight * w[1]
        }
    }

    memo[hash] = wins
    return wins
}

let winAtFirstRoll = countWins(0, [0,0], [0,0], {}, 4)
console.assert(JSON.stringify(winAtFirstRoll) === JSON.stringify([27,0]), 'check that p=0 always wins')

let winAtFirstRollPlayer2 = countWins(1, [0,0], [0,0], {}, 4)
console.assert(JSON.stringify(winAtFirstRollPlayer2) === JSON.stringify([0, 27]), 'check that p=1 always wins')

let twoWinsExceptOnce = countWins(0, [0,0], [0,1], {}, 5)
console.assert(JSON.stringify(twoWinsExceptOnce) === JSON.stringify([26, 27]), 'check that p=1 always wins')


let w = countWins(0, state, [0,0], {}, 21)
console.log(w)
console.log(Math.max(...w))
