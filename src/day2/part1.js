const fs = require('fs');

const file = fs.readFileSync('./input.txt');
const lines = file.toString().split('\n');

const reducer = (acc, line) => {
  const [action, val] = line.split(' ');
  const numberValue = +val;
  if (acc[action]){
    acc[action] += numberValue;
  } else {
    acc[action] = numberValue
  }
  return acc;
}
const actionSums = lines.reduce(reducer, {});
const answer = Math.abs((actionSums['up'] - actionSums['down'])* actionSums['forward'])
console.log(answer);