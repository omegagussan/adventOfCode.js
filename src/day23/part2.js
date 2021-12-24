
const fs = require('fs');

function arrayOfStacks(size) {
    return Array(size).fill(null).map(e => []);
}

function inclusiveRange(from, to) {
    let size = Math.abs(to-from) + 1
    if (size === 0) return []
    return [...Array(size).keys()].map(k => k + Math.min(to, from)).map(Number)
}

function isCorrectRoom(roomIdx, value) {
    switch (roomIdx) {
        case 0:
            return value === 'A'
        case 1:
            return value === 'B'
        case 2:
            return value === 'C'
        case 3:
            return value === 'D'
        default:
            throw Error('what room? ' + roomIdx)
    }
}

class Burrow {
    constructor(playerState, rooms, hallways) {
        this.rooms = rooms ? rooms : playerState.reduce((acc, val, idx) => {
            acc[idx%4].push(val)
            return acc
        }, arrayOfStacks(4))
        this.hallway = hallways ? hallways : Array(4 + 3 + 4).fill(null)}

    getKey() {
        return [this.rooms.join('|'), this.hallway.join('|')].join('-')
    }

    copy(){
        return new Burrow(undefined, this.rooms.map(l => [...l]), [...this.hallway])
    }

    isEqual(otherBurrow){
        return this.getKey() === otherBurrow.getKey()
    }

    isDone(){
        return !this.hallway.some(e => e) && this.rooms.every(r => r.every(e => e === r[0]))
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
        return isCorrectRoom(roomIdx, value);
    }

    hallwayToRoom(roomIdx, hallwayIdx){
        let val = this.hallway[hallwayIdx]
        if(this.isEligbleRoom(roomIdx, val)){
            this.hallway[hallwayIdx] = null
            this.rooms[roomIdx].unshift(val)
            //console.log('moved ' + val + ' from hallway ' + hallwayIdx + ' to room' + roomIdx)
        }
        return this
    }

    roomToHallway(roomIdx, hallwayIdx){
        if (this.rooms[roomIdx].every(e => isCorrectRoom(roomIdx, e))) return this
        let correspondingHallwayToRoomIndex = 2 + (roomIdx * 2)
        if (this.hasFreeWay(correspondingHallwayToRoomIndex, hallwayIdx) && this.isValidHallway(hallwayIdx)){
            this.hallway[hallwayIdx] = this.rooms[roomIdx].shift()
            //console.log('moved ' + val + ' from room ' + roomIdx + ' to hallway' + hallwayIdx)
        }
        return this
    }

    roomToRoom(fromRoomIdx, toRoomIdx){
        let toRoomIsValidBefore = this.rooms[toRoomIdx].every(e => isCorrectRoom(toRoomIdx, e))
        if (!(toRoomIsValidBefore && isCorrectRoom(toRoomIdx, this.rooms[fromRoomIdx][0]))) return this
        let corrHallwayToRoomIndex = 2 + (toRoomIdx * 2)
        let corrHallwayFromRoomIndex = 2 + (fromRoomIdx * 2)
        if (this.hasFreeWay(corrHallwayToRoomIndex, corrHallwayFromRoomIndex)){
            this.rooms[toRoomIdx].unshift(this.rooms[fromRoomIdx].shift())
            //console.log('moved ' + val + ' from room ' + roomIdx + ' to hallway' + hallwayIdx)
        }
        return this
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
// let s = new Burrow([
// 'A', 'B', 'C', 'C',
// 'A', 'B', 'C', 'D',
// 'A', 'B', 'C', 'D',
// 'A', 'B', 'D', 'D'
// ])
// s.roomToHallway(2, 0)
// s.roomToHallway(2, 1)
// s.roomToHallway(2, 3)
// s.roomToHallway(2, 5)
// let c = s.copy()
// s.roomToHallway(2, 7)
// console.log(s.isEqual(c))
// console.log(s.getKey())


let burrows = [new Burrow(inputPlayerState)]
while (burrows.length > 0 && !burrows.some(b => b.isDone())){
    const keepers = []
    for (const b of burrows){
        for (const r of [0,1,2,3]){
            for (const h of [0,1,3,5,7,9,10]){
                b.hallwayToRoom(r, h)
            }
        }
        for (const r of [0,1,2,3]){
            for (const r2 of [0,1,2,3]){
                b.roomToRoom(r, r2)
            }
        }
        for (const r of [0,1,2,3]){
            for (const h of [0,1,3,5,7,9,10]){
                let c = b.copy().roomToHallway(r, h)
                if(!b.isEqual(c)) keepers.push(c)
            }
        }
    }
    burrows = keepers
    console.log(burrows.length)
}
console.log('done')