const fs = require('fs');

const file = fs.readFileSync('./input.txt');
let hexSeq = file.toString();
let intSeq = [...hexSeq].map(h => parseInt(h, 16))
let binSeq = intSeq.map(i => [...i.toString(2).padStart(4, '0')]).flat(1)

function add(accumulator, a) {
    return accumulator + a;
}

function parsePacket(bin){
    const chars = bin.split('');
    let version = Number.parseInt(chars.splice(0,3).join(''), 2);
    let typeId = Number.parseInt(chars.splice(0, 3).join(''), 2);

    if (typeId === 4) {
        let literalBinary = '';

        while (true) {
            const sub = chars.splice(0, 5).join('').padEnd(5, '0');
            literalBinary += sub.slice(1);
            if (sub[0] === '0') break;
        }
        return {versions: [version], rest: chars.join('')}
    }

    const lengthTypeId = chars.shift();
    if (lengthTypeId === '0'){
        const bitLength = Number.parseInt(chars.splice(0, 15).join(''), 2)
        let content = chars.splice(0, bitLength).join('');

        let v = []
        while(content.length > 0){
            const p = parsePacket(content);
            content = p.rest;
            v = [...v, ...p.versions];
        }
        return {versions: [...v, version], rest: chars.join('')}

    } else {
        const numSubPackets = Number.parseInt(chars.splice(0, 11).join(''), 2)

        let content = chars.join('');

        let v = []
        for(let i=0; i< numSubPackets; i++){
            const p = parsePacket(content);
            content = p.rest;
            v = [...v, ...p.versions]
        }
        return {versions: [...v, version], rest: content}
    }

}
const a = parsePacket(binSeq.join(''))
console.log(a.versions.reduce(add, 0))