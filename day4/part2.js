const fs = require('fs');

const file = fs.readFileSync('./input.txt');
let lines = file.toString().split("\n");

function add(accumulator, a) {
    return accumulator + a;
}

function get_board_sum(board){
    return board.flat().reduce(add, 0);
}

function decorate_with_columns(board){
    const cols = Array.from(Array(board.length).keys()).map(i => board.map(row => row[i]));
    return [...board, ...cols]
}

//queue
const queue = lines[0].split(",").map(e => +e).reverse();
console.log(queue);

//boards
lines = lines.slice(2)
//console.log(lines)
const boards = new Map();
let board = [];
for (let i in lines){
    if (lines[i] === ''){
        //console.log(board);
        //console.log(get_board_sum(board));
        //console.log(decorate_with_columns(board));
        boards.set(get_board_sum(board), decorate_with_columns(board));
        board = [];
    } else {
        board.push(lines[i].trim().split(/[ ]+/).map(e => +e))
    }
}
//console.log(board);
boards.set(get_board_sum(board), decorate_with_columns(board));
console.log(boards);

function filterBoard(board, curr, sum){
    for (let i in board){
        board[i] = board[i].filter(elem => elem !== curr);
    }
    return board;
}

//play the game
const exceptions = []
while (queue.length > 0){
    let curr = queue.pop();
    //console.log(curr);
    //console.log(" ")
    for (let [sum, board] of boards.entries()) {
        board = filterBoard(board, curr, sum, exceptions);
        if (board.some(row => row.length === 0)){
            if (exceptions.some(obj => obj.sum === sum)){
                //console.log("already added");
            } else {
                const board_snapshot = [...board];
                exceptions.push({sum, curr, board: board_snapshot})
            }
        }
    }
}

function catcher(exceptions) {
    let last_winner = exceptions.pop() //last exception
    console.log(last_winner);
    const winner_board_rows = last_winner.board.slice(0, last_winner.board.length/2);
    const final_sum = get_board_sum(winner_board_rows);
    console.log(final_sum * last_winner.curr);
}

catcher(exceptions);
