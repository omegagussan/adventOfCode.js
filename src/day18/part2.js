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

function reduce(input) {
    let line = input.slice() //copy
    while (true) {
        const explodes = matchTwoElementPair(line).filter(match => match.length > 0)
            .map(match => [match, getDepth(match)]).filter(p => p[1] >= 4).map(p => p[0]);
        const leftMostExplodes = explodes.length > 0 ? explodes[0] : null
        if(leftMostExplodes){
            line = explode(leftMostExplodes);
            continue;
        }


        const splits = matchTwoDigitNumber(line).filter(match => match.length > 0);
        const leftMostSplit = splits.length > 0 ? splits[0] : null
        if (leftMostSplit){
            line=split(leftMostSplit);
        }

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
    let left = match.input.slice(0, match.index);
    let right = match.input.slice(match.index + match[0].length);
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
    let left = match.input.slice(0, match.index);
    let right = match.input.slice(match.index + match[0].length);
    return `${left}[${Math.floor(matchVal / 2)},${Math.ceil(matchVal / 2)}]${right}`;
}

function magnitude(pair) {
    const [a, b] = pair.map((n) => (Array.isArray(n) ? magnitude(n) : n));
    return 3 * a + 2 * b;
}

function* combineAllNonCommutative(arr1, arr2){
    const res = []
    for (let e1 of arr1){
        for (let e2 of arr2){
            if (e1 !== e2){
                yield [e1, e2]
                yield [e2, e1]
            }
        }
    }
    return res
}

function reduceGenerator(generator, reducerFn, init){
    let acc = init
    if(reducerFn.length !== 2){
        throw Error("wrong arguments for reduce function; acc, elem expected")
    }
    let elem = generator.next()
    while (!elem.done){
        acc = reducerFn(acc, elem)
        elem = generator.next()
    }
    return acc;
}


const file = fs.readFileSync('./input.txt');
const lines = file.toString().split('\n');

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

function solveP2(lines) {
    let combinationGenerator = combineAllNonCommutative(lines, lines)
    const max = (acc, elem) => {
        const stringElem = `[${elem.value[0]},${elem.value[1]}]`
        const mag = magnitude(JSON.parse(reduce(stringElem)));
        if(mag > acc){acc = mag}
        return acc;
    }
    return reduceGenerator(combinationGenerator, max, 0)
}
console.log(solveP2(lines));