const fs = require('fs');

function windowedSlice(arr, size) {
    let result = [];
    arr.some((el, i) => {
        if (i + size - 1 >= arr.length) return true;
        result.push(arr.slice(i, i + size));
    });
    return result;
}

function add(accumulator, a) {
    return accumulator + a;
}

function diffs(arr) {
    return arr.slice(1).map((x,i)=> x-arr[i]);
}

const file = fs.readFileSync('./input.txt');
const numbers = file.toString().split('\n').map(e => +e);
const sums = windowedSlice(numbers, 3).map(l => l.reduce(add, 0));
const numberOfIncremented = diffs(sums).filter(x => x > 0).length
console.log(numberOfIncremented);