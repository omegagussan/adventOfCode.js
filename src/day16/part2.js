const fs = require('fs');

const file = fs.readFileSync('./input.txt');
let hexSeq = file.toString();
let intSeq = [...hexSeq].map(h => parseInt(h, 16))
let binSeq = intSeq.map(i => [...i.toString(2).padStart(4, '0')]).flat(1)

const LITERAL_STRIDE = 5;
const TO_BINARY = 2;
const BIT_LENGTH_STRIDE = 15;
const SUB_PACKET_STRIDE = 11;

function stepAndUpdate(content, subP) {
    const p = parsePacket(content);
    content = p.rest;
    subP.push(p.packet);
    return content;
}

function subPacketFunction(chars, version, typeId) {
    const numSubPackets = Number.parseInt(chars.splice(0, SUB_PACKET_STRIDE).join(''), TO_BINARY)
    let content = chars.join('');

    let subP = []
    for (let i = 0; i < numSubPackets; i++) {
        content = stepAndUpdate(content, subP);

    }
    const packet = {'literal': false, version, typeId, subPackets: subP}
    return {packet, rest: content}
}

function bitLengthFunction(chars, version, typeId) {
    const bitLength = Number.parseInt(chars.splice(0, BIT_LENGTH_STRIDE).join(''), TO_BINARY)
    let content = chars.splice(0, bitLength).join('');

    let subP = []
    while (content.length > 0) {
        content = stepAndUpdate(content, subP);
    }
    const packet = {'literal': false, version, typeId, subPackets: subP}
    return {packet, rest: chars.join('')}
}

function LiteralFunction(chars, version, typeId) {
    let literalBinary = '';
    while (chars.length > 0) {
        const sub = chars.splice(0, LITERAL_STRIDE).join('').padEnd(LITERAL_STRIDE, '0');
        literalBinary += sub.slice(1);
        if (sub[0] === '0') break;
    }
    const packet = {'literal': true, version, typeId, value: Number.parseInt(literalBinary, TO_BINARY)}
    return {packet, rest: chars.join('')}
}

function parsePacket(bin){
    const chars = bin.split('');
    let version = Number.parseInt(chars.splice(0,3).join(''), TO_BINARY);
    let typeId = Number.parseInt(chars.splice(0, 3).join(''), TO_BINARY);

    if (typeId === 4) return LiteralFunction(chars, version, typeId)

    const lengthTypeId = chars.shift();
    if (lengthTypeId === '0'){
        return bitLengthFunction(chars, version, typeId);
    } else {
        return subPacketFunction(chars, version, typeId);
    }

}

function reduce(packet) {
    if (packet.literal) return packet.value;

    const vals = packet.subPackets.map(subPacket => reduce(subPacket));
    switch (packet.typeId) {
        case 0:
            return vals.reduce((a, b) => a + b);
        case 1:
            return vals.reduce((a, b) => a * b);
        case 2:
            return Math.min(...vals);
        case 3:
            return Math.max(...vals);
        case 5:
            return vals[0] > vals[1] ? 1 : 0;
        case 6:
            return vals[0] < vals[1] ? 1 : 0;
        case 7:
            return vals[0] === vals[1] ? 1 : 0;
        default:
            throw new Error(packet.typeId);
    }
}


const root = parsePacket(binSeq.join('')).packet;
console.log(reduce(root))