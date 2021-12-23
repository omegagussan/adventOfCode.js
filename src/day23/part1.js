
const fs = require('fs');

function arrayOfStacks(size) {
    return Array(size).fill(null).map(e => []);
}

function inclusiveRange(from, to) {
    let size = Math.abs(to-from +1)
    if (size === 0) return []
    return [...Array(size).keys()].map(k => k + from).map(Number)
}

class Burrow {
    constructor(playerState) {
        this.players = new Set(playerState)
        this.rooms = playerState.reduce((acc, val, idx) => {
            acc[idx%4].push(val) // appendLeft
            return acc
        }, arrayOfStacks(this.players.size))
        this.hallway = arrayOfStacks(this.players.size + 1)
    }

    getKey() {
        return [this.rooms.join('|'), this.hallway.map(e => e.join(',')).join('|')].join('-')
    }

    hasFreeWay(roomIdx, hallwayIdx){
        if (roomIdx === hallwayIdx) return true
        let range = inclusiveRange(roomIdx+1, hallwayIdx-1)
        return !range.map(e => this.hallway[e]).some(e => e.length > 0)
    }

    isEligbleHallway(hallwayIdx){
        if (hallwayIdx === 0 || hallwayIdx === 5) return this.hallway[hallwayIdx].length < 2
        return this.hallway[hallwayIdx].length < 1
    }

    isEligbleRoom(roomIdx, value){
        switch (roomIdx){
            case 0: return value === 'A'
            case 1: return value === 'B'
            case 2: return value === 'C'
            case 3: return value === 'D'
            default: throw Error('what room? ' +  roomIdx)
        }
    }

    roomToHallway(roomIdx, hallwayIdx){
        if (this.hasFreeWay(roomIdx, hallwayIdx) && this.isEligbleHallway(hallwayIdx)){
            let val = this.rooms[roomIdx].shift()
            this.hallway[hallwayIdx].push(val)
            console.log('did ' + val + ' to hallway' + hallwayIdx)
        } else {
            console.log('Nothing happened')
        }
    }
}
const file = fs.readFileSync('./sample_input.txt');
let input = file.toString().trim().split('\n');
const part2 = `
  #D#C#B#A#
  #D#B#A#C#
`
let lastTwo= input.splice(-2)
input = [input, part2.split('\n').filter(e => e), lastTwo].flat()
console.log(input)
const inputPlayerState = input.join('').match(/[A-Z]/g)

let s = new Burrow(inputPlayerState)
s.roomToHallway(0, 1)
s.roomToHallway(0, 2)