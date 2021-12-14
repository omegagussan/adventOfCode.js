const fs = require('fs');

function addStr(str, index, stringToAdd){
    return str.substring(0, index) + stringToAdd + str.substring(index, str.length);
}

const file = fs.readFileSync('./input.txt');
let lines = file.toString().split('\n');
let [template, ...rules] = lines
rules = rules.filter(e => e !== '').map(e => e.split(' -> ')).map(([f, d]) => [f, addStr(f, 1, d)])
let ta = template.split('')
let elems = ta.map((e, i) => [e, ta[i+1]].join('')).filter(e => e.length > 1)
let templateD = elems.reduce((acc, e)=>{
    acc[e] = acc[e] ? acc[e] + 1 : 1
    return acc;
}, {});

function insert(template, rules){
    const newTemplate = {}
    for (let [from, to] of rules){
        const c = template[from]
        if (c > 0){
            let a = to.slice(0,2);
            let b = to.slice(-2);
            newTemplate[a] = newTemplate[a] ? newTemplate[a] + c : c;
            newTemplate[b] = newTemplate[b] ? newTemplate[b] + c : c;
            template[from] = 0;
        }
    }
    for (var attrname in template) {
        let addition = template[attrname]
        if (addition > 0){
            let old = newTemplate[attrname]
            newTemplate[attrname] = old ? old + addition : addition;
        }
    }
    console.log(newTemplate)
    return newTemplate
}

const step = 40
Array.from(Array(step+1).keys()).filter(e => e> 0).forEach(i => {
    console.log(i)
    templateD = insert(templateD, rules)
})

a = {}
Object.entries(templateD).forEach(([k,v]) => {
    let key = k.charAt(0)
    a[key] = a[key] ? a[key] + v : v
});
console.log('a-1', a)
let o = a[ta.slice(-1)]
a[ta.slice(-1)] = o ? o + 1 : 1;
console.log('a', a)

let min = Number.MAX_SAFE_INTEGER
let max = 0
Object.entries(a).forEach(([k,v]) => {
    if(v > max){
        max = v
    } else if (v < min){
        min = v
    }
});
console.log(max-min)