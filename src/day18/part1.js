const fs = require('fs');

function matchTwoDigitNumber(line) {
    return [...line.matchAll(/\d\d+/g)]
}

function matchTwoElementPair(line) {
    return [...line.matchAll(/\[(\d+),(\d+)]/g)];
}

function getDepth(match) {
    const line = [...match.input]
    return line.slice(0, match.index).reduce((d, e) => {
        if (e === '[') d += 1;
        if (e === ']') d += -1;
        return d;
    }, 0);
}

function reduce(line) {
    untilNoChanges: while (true) {
        const explodes = matchTwoElementPair(line).filter(match => match.length > 0)
            .map(match => [match, getDepth(match)]).filter(p => p[1] >= 4).map(p => p[0])
        explodes.forEach(match => {line = explode(match)})

        const splits = matchTwoDigitNumber(line).filter(match => match.length > 0);
        splits.forEach(match => {line = split(match)})
        if (splits.length === 0 && explodes.length === 0){
            break;
        }
    }
    return line;
}

function replaceLast(arr, pattern, replacerFn){
    let reversed = arr.split(',').reverse().join();
    reversed = reversed.replace(pattern, replacerFn)
    return reversed.split(',').reverse().join();
}

function explode(match) {
    const matchStr = match[0]
    const [left, right] = match.input.split(matchStr)
    const leftExplodedValue = Number(match[1]);
    const rightExplodedValue = Number(match[2]);

    const singleDigitPattern = /(\d+)/;
    let leftExploded = replaceLast(left, singleDigitPattern, (n) => Number(n) + leftExplodedValue)
    const rightExploded = right.replace(singleDigitPattern, (n) => Number(n) + rightExplodedValue);

    return `${leftExploded}0${rightExploded}`;
}

function split(match) {
    const matchStr = match[0]
    const matchVal = +matchStr
    const [left, right] = match.input.split(matchStr)
    return `${left}[${Math.floor(matchVal / 2)},${Math.ceil(matchVal / 2)}]${right}`;
}

const file = fs.readFileSync('./sample_input.txt');
let lines = file.toString().split('\n');
//lines = lines.map(row => JSON.parse(row))
//console.log('given',lines)

function testSplit() {
    let test = `
        [1]
        [10,[1,2]]
        [10]
        [1,[2,[10,11]]]
        [1,[2,[[5,5],11]]]
    `
    let expect = `
        [1]
        [[5,5],[1,2]]
        [[5,5]]
        [1,[2,[[5,5],[5,6]]]]
        [1,[2,[[5,5],[5,6]]]]
    `

    test = test.trim().split("\n").map((s) => s.trim()).map(reduce);
    expect = expect.trim().split("\n").map((s) => s.trim())
    console.assert(JSON.stringify(test) === JSON.stringify(expect), 'testSplit failed')
}

function testExplode() {
    let test = `
        [1]
        [[[[[9,8],1],2],3],4]
        [7,[6,[5,[4,[3,2]]]]]
        [[6,[5,[4,[3,2]]]],1]
        [[3,[2,[1,[7,3]]]],[6,[5,[4,[3,2]]]]]
        [[3,[2,[8,0]]],[9,[5,[4,[3,2]]]]]
    `
    let expect = `
        [1]
        [[[[0,9],2],3],4]
        [7,[6,[5,[7,0]]]]
        [[6,[5,[7,0]]],3]
        [[3,[2,[8,0]]],[9,[5,[7,0]]]]
        [[3,[2,[8,0]]],[9,[5,[7,0]]]]
    `
    test = test.trim().split("\n").map((s) => s.trim()).map(reduce);
    expect = expect.trim().split("\n").map((s) => s.trim())
    console.assert(JSON.stringify(test) === JSON.stringify(expect), 'testExplode failed')
}
testSplit();
testExplode();