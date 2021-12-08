const fs = require('fs');

const file = fs.readFileSync('./input.txt');
const lines = file.toString().split("\n");

const reducer = (acc, line) => {
  const [action, val] = line.split(" ");
  const val_number = +val;
  if (acc[action]){
    acc[action] += val_number;
  } else {
    acc[action] = val_number
  }
  return acc;
}
const actionSums = lines.reduce(reducer, {});
const answer = Math.abs((actionSums["up"] - actionSums["down"])* actionSums['forward'])
console.log(answer);