const fs = require('fs');
const file = fs.readFileSync('./sample_input.txt');
const scannerStrings = file.toString().split('\n\n')
const zip = (a, b) => a.map((k, i) => [k, b[i]]);

function add(accumulator, a) {
    return accumulator + a;
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

function unittestDeterminant() {
    let test0 = determinant([[0, 0, 0], [0, 0, 0], [0, 0, 0]])
    let test1 = determinant([[1, 2, 3], [4, 5, 6], [7, 8, 9]])
    let test2 = determinant([[1, 1, 1], [2, 2, 2], [3, 3, 3]])
    let test3 = determinant([[1, 2, 3], [1, 2, 3], [1, 2, 3]])
    let testX = determinant([[1, 2, 3], [4, 11, 6], [7, 8, 9]])
    let testY = determinant([[-5, 2, 3], [4, 5, 6], [7, 8, 9]])


    console.assert(test0 === 0, 'determinant unittest 0 failed')
    console.assert(test1 === 0, 'determinant unittest 1 failed')
    console.assert(test2 === 0, 'determinant unittest 2 failed')
    console.assert(test3 === 0, 'determinant unittest 3 failed')
    console.assert(testX === -72, 'determinant unittest X failed')
    console.assert(testY === 18, 'determinant unittest Y failed')
}

function matMul(m1, m2){
    if (m1[0].length !== m2.length) throw Error("Matrices cannot be multiplied");
    let multiplication = new Array(m1.length).fill('placeholder');
    multiplication = multiplication.map(placeholder => new Array(m2[0].length).fill(0));
    for (let x=0; x < multiplication.length; x++) {
        for (let y=0; y < multiplication[x].length; y++) {
            for (let z=0; z<m1[0].length; z++) {
                //dot for every position
                multiplication [x][y] = multiplication [x][y] + m1[x][z]*m2[z][y];
            }
        }
    }
    return multiplication
}

function unittestMatMul() {
    let expected = [[2], [3], [5]]
    let test = matMul([[1, 0, 0], [0, 1, 0], [0, 0, 1]], [[2], [3], [5]])
    console.assert(JSON.stringify(test) === JSON.stringify(expected), 'multiplication with identity matrix failed')
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
                if (determinant(q) === 1) rotationMat.push(q) //
            }
        }
    }
}

console.assert(rotationMat.length === 24, 'Rotation matrix is not 24 versions')
unittestMatMul();
unittestDeterminant();

function parseScanners(scannerStrings) {
    let lines = scannerStrings.map(ss => ss.split('\n').slice(1))
    return lines.map(line => {
        let beacons = line.map(s => s.split(',').map(e => +e))
        return beacons.map(bea => {
            let distanceHashes = beacons.map(con =>{
                let [d1, d2, d3] = zip(bea, con).map(([i,j]) => Math.abs(i-j))
                return d1*d1 + d2*d2 + d3*d3
            });
            return {pos: bea, distanceHashes}
        });
    })
}

let scanners = parseScanners(scannerStrings);

function commonBeacons(b1, b2){
    const entriesB1 = [...b1.distanceHashes.entries()]
    return entriesB1.map(([i, v]) => {
        if (v !== 0){
            const j = b2.distanceHashes.indexOf(v)
            if (j > -1) return {i, j}
        }
        return null
    }).filter(e => e !== null)
}

function compareScanner(s1, s2){
    for (const b1 of s1) {
        for (const b2 of s2) {
            const intersection = commonBeacons(b1, b2)
            if (intersection.length >= 11) {
                return {beaconI: b1, beaconJ:b2, intersection}
            }
        }
    }
}

let expected = 11
let test = compareScanner(scanners[0], scanners[1])
let testBackwards = compareScanner(scanners[0], scanners[1])
console.assert(test.intersection.length === expected, 'expecting 12 overlaps between 0 and 1. Found ' + test.intersection.length)
console.assert(testBackwards.intersection.length === expected, 'expecting 12 overlaps between 1 and 0. Found ' + test.intersection.length)

function findRotationTranslation(intersectionsObj, s1, s2) {
    let {intersection, beaconI, beaconJ} = intersectionsObj
    for (const translationCandidate of combineAll(...beaconJ.pos)) {
        let translationVector = zip(beaconI.pos, translationCandidate).map(([i, j]) => i - j)
        for (let r of rotationMat) {
            for (let {i: iIndex, j: jIndex} of intersection) {
                let to = zip(s1[iIndex].pos, translationVector).map(([i, t]) => i - t)
                let from = matMul(r, s2[jIndex].pos.map(e => [e])).flat() //column vector
                if (zip(to, from).map(([t,f]) => t - f).reduce(add, 0) === 0) {
                    console.log('here')
                    return {r, t: translationVector}
                }
            }
        }
    }
}

function transform(r, t, b) {
    return zip(matMul(r, b.pos.map(e => [e])).flat(), t).map(d => d[1] + d[0]);
}

function pair(i,j){
    return i + ',' + j
}

//scanners[0].absolute = [0, 0]
let fixed = [0]
let tried = new Set()
while (fixed.length < scanners.length) {
    for (let i = 0; i < scanners.length; i++) {
        for (let j = 0; j < scanners.length; j++) {
            if (tried.size > 0.95*scanners.length*scanners.length) console.log('aj')
            if (i === j || tried.has(pair(i,j)) || fixed.filter(e => e === i).length === 0 || fixed.filter(e => e === j).length > 1) continue
            let intersections = compareScanner(scanners[i], scanners[j])
            if (!intersections) {
                tried.add(pair(i,j))
                continue
            }
            const rt = findRotationTranslation(intersections, scanners[i], scanners[j]);
            if (!rt) {
                tried.add(pair(i,j))
                continue
            }
            scanners[j] = scanners[j].map(b => transform(rt.r, rt.t, b))
            fixed.push(j)
        }
    }
}
console.log(fixed)
