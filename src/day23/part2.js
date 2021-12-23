
const fs = require('fs');

function arrayOfStacks(size) {
    return Array(size).fill(null).map(e => []);
}

function inclusiveRange(from, to) {
    let size = Math.abs(to-from) + 1
    if (size === 0) return []
    return [...Array(size).keys()].map(k => k + Math.min(to, from)).map(Number)
}

class Burrow {
    constructor(playerState) {
        this.players = new Set(playerState)
        this.rooms = playerState.reduce((acc, val, idx) => {
            acc[idx%4].push(val)
            return acc
        }, arrayOfStacks(this.players.size))
        this.hallway = Array(this.players.size + 3 + 4).fill(null)}

    getKey() {
        return [this.rooms.join('|'), this.hallway.join('|')].join('-')
    }

    hasFreeWay(roomIdx, hallwayIdx){
        let range = inclusiveRange(roomIdx, hallwayIdx)
        return !range.some(e => this.hallway[e])
    }

    isValidHallway(hallwayIdx){
        return ![2,4,6,8].some(e => e === hallwayIdx)
    }

    isEligbleRoom(roomIdx, value){
        if (!this.rooms[roomIdx].every(e => e === value)) return false
        switch (roomIdx){
            case 0: return value === 'A'
            case 1: return value === 'B'
            case 2: return value === 'C'
            case 3: return value === 'D'
            default: throw Error('what room? ' +  roomIdx)
        }
    }

    hallwayToRoom(roomIdx, hallwayIdx){
        let val = this.hallway[hallwayIdx]
        if(this.isEligbleRoom(roomIdx, val)){
            this.hallway[hallwayIdx] = null
            this.rooms[roomIdx].unshift(val)
            console.log('moved ' + val + ' from hallway ' + hallwayIdx + ' to room' + roomIdx)
        } else {
            console.log('Nothing happened hallwayToRoom')
        }
    }

    roomToHallway(roomIdx, hallwayIdx){
        //check you dont pop B from B if only B below
        let correspondingHallwayToRoomIndex = 2 + (roomIdx * 2)
        if (this.hasFreeWay(correspondingHallwayToRoomIndex, hallwayIdx) && this.isValidHallway(hallwayIdx)){
            let val = this.rooms[roomIdx].shift()
            this.hallway[hallwayIdx] = val
            console.log('moved ' + val + ' from room ' + roomIdx + ' to hallway' + hallwayIdx)
        } else {
            console.log('Nothing happened roomToHallway')
        }
    }
}
const file = fs.readFileSync('./sample_input.txt');
let input = file.toString().trim().split('\n');
const part2 = `
  #D#C#B#A#
  #D#B#A#C#
`
const lastTwo= input.splice(-2)
input = [input, part2.split('\n').filter(e => e), lastTwo].flat()
const inputPlayerState = input.join('').match(/[A-Z]/g)
let s = new Burrow(inputPlayerState)
s.roomToHallway(0, 0)
s.roomToHallway(0, 10)
s.roomToHallway(0, 1)
s.roomToHallway(3, 9)
s.roomToHallway(3, 5)
s.hallwayToRoom(0, 5)
console.log(s.getKey())