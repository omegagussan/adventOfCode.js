const fs = require('fs');
const file = fs.readFileSync('./sample_input.txt');
const lines = file.toString().split('\n');

function combineAll(arr1, arr2, arr3){
    const res = []
    res.push([arr1, arr2, arr3])
    res.push([arr1, arr3, arr2])
    res.push([arr2, arr1, arr3])
    res.push([arr2, arr3, arr1])
    res.push([arr3, arr2, arr1])
    res.push([arr3, arr1, arr2])
    return res
}

//OBS! 3x3 only
// [ [a,b,c],
// [d,e,f],
// [g,h,i] ];
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


/*
https://math.stackexchange.com/questions/503047/why-is-the-determinant-of-a-rotation-matrix-equal-to-1
generate all possible candidates for rotation matrixes with 3 dimensions > 160 st
will filter away invalid rotation matrixes using the determinant => 24
 */
let rotationMat = []
for(let x of [-1, 1]){
    for(let y of [-1, 1]){
        for (let z of [-1, 1]){
            for (let q of combineAll([x,0,0], [0,y,0], [0,0,z])){
                if (determinant(q) === 1) rotationMat.push(q) //
            }
        }
    }
}

let scanners = []
let curr = []
for (const line of lines){
    if (line.length === 0)
        continue
    if (line[1] === "-") {
        curr = []
        scanners.push(curr)
        continue
    }
    curr.push({cord: line.split(',').map(e => +e), relative: []})
}
for (const s of scanners){
    for (let i=0; i < s.length; i++){
        for (let j=0; j < s.length; j++){
            if (j === 0) s[i].relative = Array(s.length).fill(null)
            if (i === j) continue
            let dx = Math.abs(s[i].cord[0] - s[j].cord[0])
            let dy = Math.abs(s[i].cord[1] - s[j].cord[1])
            let dz = Math.abs(s[i].cord[2] - s[j].cord[2])
            let fingerprint = [dx*dx + dy*dy + dz*dz, Math.min(dx, dy, dz), Math.max(dx,dy,dz)].join(',')
            s[i].relative[j] = fingerprint
            s[j].relative[i] = fingerprint //TODO: we can prune loop to not have to do all twice.
        }
    }
}

function commonBeacons(b1, b2){
    const cb = []
    for (const [b1Index, r1] of b1.relative.entries()) {
        if (r1 !== null){
            const b2Index = b2.relative.indexOf(r1)
            if (b2Index > -1) cb.push([r1, b1Index, b2Index])
        }
    }
    return cb
}

function compareScanner(s1, s2){
    for (let b1 of s1) {
        for (let b2 of s2) {
            const intersection = commonBeacons(b1, b2)
            if (intersection.length >= 11) {
                return {b1, b2, intersection}
            }
        }
    }
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

unittestMatMul();
unittestDeterminant();


function rebaseBtoA(scannerA, scannerB, intersectionsObj){
    for(let i of intersectionsObj.intersection){
        if(i[0].split(',')[1] === "0") continue
        let from = scannerB[i[2]].cord
        let to = scannerA[i[1]].cord
        console.log('to', to)
        for (let r of rotationMat){
            let cand = matMul(r, from.map(e => [e])).flat() //column vector
            console.log('cand', cand)
            if (JSON.stringify(cand) === JSON.stringify(to)){
                console.log('Bazinga')
            }
        }
    }
    //rotationMat.map(r => matMul(r, ))
}

scanners[0].absolute = [0, 0]
let fixed = new Set([0])
while (fixed.size < scanners.length) {
    for (let i = 0; i < scanners.length; i++) {
        for (let j = 0; j < scanners.length; j++) {
            if (i === j || !fixed.has(i) || fixed.has(j)) continue
            let intersections = compareScanner(scanners[i], scanners[j])
            if (!intersections) continue
            rebaseBtoA(scanners[i], scanners[j], intersections) //TODO: assign back to scanner[j]
            fixed.add(j)
        }
    }
}

