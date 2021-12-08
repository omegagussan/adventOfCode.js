const fs = require('fs');

const permutations = (inputArr) => {
    let result = [];

    const permute = (arr, m = []) => {
        if (arr.length === 0) {
            result.push(m)
        } else {
            for (let i = 0; i < arr.length; i++) {
                let curr = arr.slice();
                let next = curr.splice(i, 1);
                permute(curr.slice(), m.concat(next))
            }
        }
    }

    permute(inputArr)

    return result;
}

const VALID = new Set(['abcefg', 'cf', 'acdeg', 'acdfg', 'bcdf', 'abdfg', 'abdefg', 'acf', 'abcdefg', 'abcdfg']);
const LOOKUP = [...VALID].reduce((o, key, idx) => Object.assign(o, {[key]: idx}), {});

const KEYS = ['a', 'b', 'c', 'd', 'e', 'f', 'g']
function initMapping(permutation){
    return permutation.reduce((o, val, idx) => Object.assign(o, {[KEYS[idx]]: val}), {});
}

function mappingPermutations(){
    const perms = Array.from(permutations(KEYS))
    return perms.map(perm => initMapping(perm));
}

const mappings = mappingPermutations()

const file = fs.readFileSync('./sample_input.txt');
const lines = file.toString().split("\n").map(line => line.split(' '));

const output = [];
lines.forEach(line => readLine(line, [...mappings], output));

function validate(mapping, seq){
    const translated = translate(mapping, seq)
    if (translated.every(elem => VALID.has(elem))){
        return mapping
    }
    return undefined
}

function translate(mapping, seq){
    return seq.map(chars => chars.split('').map(char => mapping[char]).sort().join(''))

}
function readLine(arr, candidates){
    const first = arr.slice(0,10)
    const input = arr.slice(-4)

    let validCandidate;
    for (let candidate of candidates){
        validCandidate = validate(candidate, first)
        if (validCandidate){
            break;
        }
    }
    output.push(+translate(validCandidate, input).map(seq => LOOKUP[seq]).join(''));
}

function add(accumulator, a) {
    return accumulator + a;
}

console.log(output.reduce(add, 0));