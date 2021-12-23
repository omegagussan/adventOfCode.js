const fs = require('fs');

function zip(a,b) {
    return a.map((k, i) => [k, b[i]])
}

function combineAll(arr1, arr2, arr3){
    return [
        [arr1, arr2, arr3],
        [arr1, arr3, arr2],
        [arr2, arr1, arr3],
        [arr2, arr3, arr1],
        [arr3, arr2, arr1],
        [arr3, arr1, arr2]
    ]
}

function determinant(mat){
    if(!mat.every(r => r.length === 3 || mat.length !== 3)){
        throw Error('Must be square 3x3')
    }
    if(!mat.flat().every(e => Number.isInteger(e))){
        throw Error('All elems should be numeric')
    }
    let d = mat[1][0]
    let e = mat[1][1]
    let f = mat[1][2]
    let g = mat[2][0]
    let h = mat[2][1]
    let i = mat[2][2]
    return mat[0][0]*(e*i-f*h)-mat[0][1]*(d*i-f*g)+mat[0][2]*(d*h-e*g); // notice the alternating signs

}

function matMul(m1, m2){
    if (m1[0].length !== m2.length) throw Error("Matrices cannot be multiplied");
    let multiplication = new Array(m1.length).fill('placeholder');
    multiplication = multiplication.map(placeholder => new Array(m2[0].length).fill(0));
    for (let x=0; x < multiplication.length; x++) {
        for (let y=0; y < multiplication[x].length; y++) {
            for (let z=0; z<m1[0].length; z++) {
                multiplication [x][y] = multiplication [x][y] + m1[x][z]*m2[z][y];
            }
        }
    }
    return multiplication
}

/*
https://math.stackexchange.com/questions/503047/why-is-the-determinant-of-a-rotation-matrix-equal-to-1
generate all possible candidates for rotation matrixes with 3 dimensions > 160 st
will filter away invalid rotation matrixes using the determinant => 24
 */
let rotationMat = []
for(const x of [-1, 1]){
    for(const y of [-1, 1]){
        for (const z of [-1, 1]){
            for (const q of combineAll([x,0,0], [0,y,0], [0,0,z])){
                if (determinant(q) === 1) rotationMat.push(q)
            }
        }
    }
}

const reorientScanners = scannerData => {
    const adjustedScanners = [{ position: [0, 0, 0], beacons: scannerData.shift(), isChecked: false }];

    while (scannerData.length) {
        for (let i = 0; i < adjustedScanners.length; ++i) {
            const { position, beacons, isChecked } = adjustedScanners[i];
            if (isChecked) continue;
            adjustedScanners[i].isChecked = true;

            innerScannerLoop: for (let j = scannerData.length - 1; j >= 0; --j) {
                const scannerToTest = scannerData[j];

                for (let r of rotationMat) {
                    const reorientedScanner = scannerToTest
                        .map(([x,y,z]) => [[x], [y], [z]])
                        .map(vec => matMul(r, vec).flat())

                    const neighbors = {};
                    for (const [x, y, z] of beacons) {
                        for (const [xx, yy, zz] of reorientedScanner) {
                            const key = [x - xx, y - yy, z - zz].join(',');
                            neighbors[key] = neighbors[key] + 1 || 1;

                            if (neighbors[key] >= 12) {
                                const [offsetX, offsetY, offsetZ] = key.split(',').map(Number);
                                scannerData.splice(j, 1);

                                adjustedScanners.push({
                                    position: [position[0] + offsetX, position[1] + offsetY, position[2] + offsetZ],
                                    beacons: reorientedScanner,
                                    isChecked: false,
                                });

                                continue innerScannerLoop;
                            }
                        }
                    }
                }
            }
        }
    }

    return adjustedScanners;
};

const input = fs
    .readFileSync('./input.txt')
    .toString();

const scannerData = input.split('\n\n')
    .map(scannerString => scannerString.split('\n').slice(1)
        .filter(line => line !== '').map(line => line.split(',').map(Number)))

const adjustedScanners = reorientScanners(scannerData);
const scannerSet = adjustedScanners.reduce((acc, scanner) => {
    let globalPosition = scanner.position;
    scanner.beacons.forEach(relativePos => {
            let key = zip(globalPosition, relativePos).map(d => d[0] + d[1]).join(',')
            acc.add(key);
    });
    return acc;
}, new Set());
console.log(scannerSet.size)