const fs = require('fs');

function addStr(str, index, stringToAdd){
    return str.substring(0, index) + stringToAdd + str.substring(index, str.length);
}

const file = fs.readFileSync('./sample_input.txt');
let lines = file.toString().split('\n');
let [template, ...rules] = lines
rules = rules.filter(e => e !== '').map(e => e.split(' -> ')).map(([f, d]) => [f, addStr(f, 1, d)])

function insert(template, rules){
    let ta = template.split('')
    let elems = ta.map((e, i) => [e, ta[i+1]].join('')).filter(e => e.length > 1)
    for (let [from, to] of rules){
        elems = elems.map(e => e === from ? to : e)
    }
    return elems.map(e => e.slice(0,-1)).join('') + ta.slice(-1)
}

const step = 10
Array.from(Array(step+1).keys()).filter(e => e> 0).forEach(i => {
    console.log(i)
    template = insert(template, rules)
})
const occur = template.split('').reduce((acc, e)=>{
    acc[e] = acc[e] ? acc[e] + 1 : 1
    return acc;
}, {});

let min = Number.MAX_SAFE_INTEGER
let max = 0
Object.entries(occur).forEach(([k,v]) => {
    if(v > max){
        max = v
    } else if (v < min){
        min = v
    }
});
console.log(max-min)