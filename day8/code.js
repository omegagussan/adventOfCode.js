const fs = require('fs');
const { permutations } = require('itertools');

const VALID = new Set(['abcefg', 'cf', 'acdeg', 'acdfg', 'bcdf', 'abdfg', 'abdefg', 'acf', 'abcdefg', 'abcdfg']);
const LOOKUP = [...VALID].reduce((o, key, idx) => Object.assign(o, {[key]: idx}), {});

const KEYS = ['a', 'b', 'c', 'd', 'e', 'f', 'g']
function initMapping(permutation){
    return permutation.reduce((o, val, idx) => Object.assign(o, {[KEYS[idx]]: val}), {});
}

function mappingPermutations(){
    const perms = Array.from(permutations(KEYS, KEYS.length))
    return perms.map(perm => initMapping(perm));
}

const mappings = mappingPermutations()

const file = fs.readFileSync('./input.txt');
const lines = file.toString().split("\n").map(line => line.split(' '));
const output = [...Array( 10).keys()].reduce((o, key) => Object.assign(o, {[key]: 0}), {});
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

    let is_valid;
    for (let candidate of candidates){
        is_valid = validate(candidate, first)
        if (is_valid){
            break;
        }
    }
    translate(is_valid, input).map(seq => LOOKUP[seq]).forEach(number => output['' + number] += 1);
}

console.log(output);
console.log(output['1'] + output['4'] + output['7'] + output['8'])