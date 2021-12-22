const fs = require('fs');

const file = fs.readFileSync('./input.txt');
const lines = file.toString().split('\n');

function matchRange(line) {
    return [...line.matchAll(/([\d-]+)\.\.([\d-]+)/g)];
}

function cuboidVolume(sign, cube){
    return (cube[1] - cube[0] + 1) * (cube[3] - cube[2] + 1) * (cube[5] - cube[4] + 1) * sign
}

function parseRows() {
    return lines.map(line => {
        let [status, cubeString] = line.split(' ')
        let sign = (status === 'on') ? 1 : -1
        let newCube = cubeString.split(',')
            .map(d => matchRange(d).map(m => m.slice(-2)))
            .flat(2).map(e => +e)
        return [sign, ...newCube]
    });
}

let rows = parseRows();

const cuboids = [];
for (const [nSign, ...newCube] of rows) {
    const compensationIntersectionCubes = []
    for (const [oSign, ...oldCube] of cuboids) {
        const xMin = Math.max(newCube[0], oldCube[0])
        const xMax = Math.min(newCube[1], oldCube[1]);
        if (xMin > xMax) continue;
        const yMin = Math.max(newCube[2], oldCube[2])
        const yMax = Math.min(newCube[3], oldCube[3]);
        if (yMin > yMax) continue;
        const zMin = Math.max(newCube[4], oldCube[4])
        const zMax = Math.min(newCube[5], oldCube[5]);
        if (zMin > zMax) continue;
        compensationIntersectionCubes.push([-oSign, xMin, xMax, yMin, yMax, zMin, zMax]);
    }
    cuboids.push(...compensationIntersectionCubes);
    if (nSign === 1) cuboids.push([1, ...newCube]);
}

const sum = cuboids.reduce((acc, [s, ...c]) => acc + cuboidVolume(s, c), 0)
console.log(sum);