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
rot = []
for(let x of [-1, 1]){
    for(let y of [-1, 1]){
        for (let z of [-1, 1]){
            for (let q of combineAll([x,0,0], [0,y,0], [0,0,z])){
                if (determinant(q) === 1) rot.push(q)
            }
        }
    }
}
console.log(rot.length)

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
            let fingerprint = [dx*dx + dy*dy, Math.min(dx, dy), Math.max(dx,dy)].join(',')
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
            if (intersection) {// .length >= 11) {
                return {b1, b2, intersection}
            }
        }
    }
}

scanners[0].absolute = [0, 0]
let fixed = new Set([0])
while (fixed.size < scanners.length) {
    for (let i = 0; i < scanners.length; i++) {
        for (let j = 0; j < scanners.length; j++) {
            if (i === j || !fixed.has(i) || fixed.has(j)) continue
            console.log(i, j)
            let intersection = compareScanner(scanners[i], scanners[j])
            console.log(intersection)
            if (!intersection) continue
            //this.scanners[i].align(this.scanners[j], intersection)
            fixed.add(j)
        }
    }
}

