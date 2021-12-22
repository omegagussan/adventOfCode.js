const fs = require('fs');

const file = fs.readFileSync('./sample_input2.txt');
const lines = file.toString().split('\n');

const zip = (a, b) => a.map((k, i) => [k, b[i]]);

function akey(arr){
    return arr.join(',')
}

function fromKey(arr){
    return arr.split(',').map(e => +e)
}

function matchRange(line) {
    return [...line.matchAll(/([\d-]+)\.\.([\d-]+)/g)];
}

function updateMap(map, key, value){
    let old = map.get(key)
    map.set(key, old ? old + value: value)
}

function initCubes(lines) {
    let cubes = new Map()

    for (let line of lines) {
        let [status, cubeString] = line.split(' ')
        let newCubeStatusInt = status === 'on' ? 1 : -1
        let newCubeRanges = cubeString.split(',').map(d => matchRange(d).map(m => m.slice(-2))).flat(2).map(e => +e)
        let updates = new Map()
        for (let [oldKey, oldStatus] of cubes.entries()) {
            let oldCubeRanges = fromKey(oldKey)
            let cubeIntersection = zip(newCubeRanges, oldCubeRanges)
            let evenMax = cubeIntersection.filter((e, i) => i % 2 === 0).map(d => Math.max(...d.map(e => +e)))
            let oddMin = cubeIntersection.filter((e, i) => i % 2 === 1).map(d => Math.min(...d.map(e => +e)))
            let dimensionWiseComparison = zip(evenMax, oddMin)
            if (dimensionWiseComparison.every(d => d[1] >= d[0])) {
                updateMap(updates, akey(dimensionWiseComparison.flat()), -oldStatus)
            }
        }
        if (newCubeStatusInt > 0){
            updateMap(updates, akey(newCubeRanges), 1)
        }
        cubes = new Map([...cubes, ...updates])
    }
    return cubes
}

function countLitCubes(cubes) {
    let sum = 0
    for (let [key, sign] of cubes.entries()) {
        console.log(key)
        let range = fromKey(key)
        let even = range.filter((e, i) => i % 2 === 0).map(e => +e)
        let odd = range.filter((e, i) => i % 2 === 1).map(e => +e)
        let dimensions = zip(even, odd).map(d => Math.abs(d[1] - d[0]))
        let volume = (dimensions[0]) * (dimensions[1]) * (dimensions[2]) * sign
        sum += volume
    }
    return sum;
}

let testCubes = new Map()
console.assert(countLitCubes(testCubes) === 0, 'empty cubes is 0')

let testCubes2 = new Map([['1,2,3,4,5,6', 0]])
console.assert(countLitCubes(testCubes2) === 0, 'empty cubes is 0')

let testCubes3 = new Map([['1,2,3,4,5,6', 0], ['6,5,4,3,2,1', 0]])
console.assert(countLitCubes(testCubes3) === 0, 'empty cubes is 0')

let testCubes4 = new Map([['1,0,1,0,1,0', 1]])
console.assert(countLitCubes(testCubes4) === 1, '1,1,1 cube has 1')

let testCubesX = new Map([['1,0,1,0,1,0', -2]])
console.assert(countLitCubes(testCubesX) === -2, '1,1,1 cube has -2 sign')

let testCubes5 = new Map([['1,-1,1,-1,1,-1', 1]])
console.assert(countLitCubes(testCubes5) === 8, '1,-1,1,-1,1,-1 cube has 8')

let testCubes6 = new Map([['-1,1,-1,1,-1,1', 1]])
console.assert(countLitCubes(testCubes6) === 8, '1,-1,1,-1,1,-1 inverse dimension cube has 8')

let testCubes7 = new Map([['-1,1,-1,-1,-1,1', 1]])
console.assert(countLitCubes(testCubes7) === 0, 'cube with one dimension is 0 is 0')

let testCubes8 = new Map([['-1,1,-1,1,-1,1', 1], ['1,0,1,0,1,0', 1]])
console.assert(countLitCubes(testCubes8) === 9, 'cube 8 and cube 1 is total 9')

let testCubes9 = new Map([['1,0,1,0,1,0', 1], ['-1,1,-1,1,-1,1', 1]])
console.assert(countLitCubes(testCubes9) === 9, 'cube 1 and cube 8 is total 9')

let testCubes10 = new Map([['1,0,1,0,1,0', -1], ['-1,1,-1,1,-1,1', 1]])
console.assert(countLitCubes(testCubes10) === 7, 'cube 8 and cube 1 (dark) is total 8')

let testLines = ['on x=-5..47,y=-31..22,z=-19..33']
let testCubes11 = initCubes(testLines);
console.assert([...testCubes11.keys()][0] === '-5,47,-31,22,-19,33', 'parse line correctly')

let testLines1 = ['on x=1..5,y=1..5,z=1..5', 'on x=-5..0,y=-5..0,z=-5..0']
let testCubes12 = initCubes(testLines1);
console.assert([...testCubes12.keys()].length === 2, 'total cubes')
console.assert([...testCubes12.keys()][0] === '1,5,1,5,1,5', 'parse line correctly 2')
console.assert([...testCubes12.keys()][1] === '-5,0,-5,0,-5,0', 'parse line correctly 3')
console.assert([...testCubes12.values()][0] === 1, 'parse value line correctly 2')
console.assert([...testCubes12.values()][1] === 1, 'parse value line correctly 3')

let testLines2 = ['on x=-5..5,y=-5..5,z=-5..5', 'off x=-5..0,y=-5..0,z=-5..0']
let testCubes13 = initCubes(testLines2);
console.assert([...testCubes13.keys()].length === 2, 'total cubes2')
console.assert([...testCubes13.keys()][0] === '-5,5,-5,5,-5,5', 'parse line correctly 4')
console.assert([...testCubes13.keys()][1] === '-5,0,-5,0,-5,0', 'parse line correctly 5')
console.assert([...testCubes13.values()][0] === 1, 'parse value line correctly 4')
console.assert([...testCubes13.values()][1] === -1, 'parse value line correctly 5')

//cube in cube
let testLines3 = ['on x=-5..5,y=-5..5,z=-5..5', 'on x=-5..0,y=-5..0,z=-5..0']
let testCubes14 = initCubes(testLines3);
console.assert([...testCubes14.keys()].length === 2, 'count overlap twice in same key')
console.assert([...testCubes14.keys()][0] === '-5,5,-5,5,-5,5', 'parse line correctly 6')
console.assert([...testCubes14.values()][0] === 1, 'parse value line correctly 6')
console.assert([...testCubes14.keys()][1] === '-5,0,-5,0,-5,0', 'parse line correctly 6')
console.assert([...testCubes14.values()][1] === 0, 'parse value line correctly 6')

let testLines4 = ['on x=-5..1,y=-5..1,z=-5..1', 'on x=0..5,y=0..5,z=0..5']
let testCubes15 = initCubes(testLines4);
console.assert([...testCubes15.keys()].length === 3, 'should new cube for overlap')
console.assert([...testCubes15.keys()][0] === '-5,1,-5,1,-5,1', 'parse line correctly 7 ')
console.assert([...testCubes15.keys()][1] === '0,1,0,1,0,1', 'should create overlap')
console.assert([...testCubes15.keys()][2] === '0,5,0,5,0,5', 'parse line correctly 8 ')
console.assert([...testCubes15.values()][0] === 1, 'parse value line correctly 7 ')
console.assert([...testCubes15.values()][1] === -1, 'should value create overlap')
console.assert([...testCubes15.values()][2] === 1, 'parse value line correctly 8 ')

let cubes = initCubes(lines);
let sum = countLitCubes(cubes);
console.log(sum)