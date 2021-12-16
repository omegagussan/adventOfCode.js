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
        const packet = {'literal': true, version, typeId, value: Number.parseInt(literalBinary, 2)}
        return {packet, rest: chars.join('')}
    }

    const lengthTypeId = chars.shift();
    if (lengthTypeId === '0'){
        const bitLength = Number.parseInt(chars.splice(0, 15).join(''), 2)
        let content = chars.splice(0, bitLength).join('');

        let subP = []
        while(content.length > 0){
            const p = parsePacket(content);
            content = p.rest;
            subP.push(p.packet);
        }
        const packet = {'literal': false, version, typeId, subPackets: subP}
        return {packet, rest: chars.join('')}

    } else {
        const numSubPackets = Number.parseInt(chars.splice(0, 11).join(''), 2)

        let content = chars.join('');

        let subP = []
        for(let i=0; i< numSubPackets; i++){
            const p = parsePacket(content);
            content = p.rest;
            subP.push(p.packet);
        }
        const packet = {'literal': false, version, typeId, subPackets: subP}
        return {packet, rest: content}
    }

}

function reduce(packet) {
    if (packet.literal) return packet.value;

    const subPacketValues = packet.subPackets.map(subPacket => reduce(subPacket));
    switch (packet.typeId) {
        case 0:
            return subPacketValues.reduce((a, b) => a + b);
        case 1:
            return subPacketValues.reduce((a, b) => a * b);
        case 2:
            return Math.min(...subPacketValues);
        case 3:
            return Math.max(...subPacketValues);
        case 5:
            return subPacketValues[0] > subPacketValues[1] ? 1 : 0;
        case 6:
            return subPacketValues[0] < subPacketValues[1] ? 1 : 0;
        case 7:
            return subPacketValues[0] === subPacketValues[1] ? 1 : 0;
        default:
            throw new Error('Invalid packet type: ' + packet.type);
    }
}


const root = parsePacket(binSeq.join('')).packet;
console.log(reduce(root))