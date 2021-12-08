const fs = require('fs');

const file = fs.readFileSync('./sample_input.txt');
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

function createBoards(lines) {
    let boardLines = lines.slice(2);

    const boards = new Map();
    let board = [];

    for (let i in boardLines) {
        if (boardLines[i] === '') {
            boards.set(get_board_sum(board), decorate_with_columns(board));
            board = [];
        } else {
            board.push(boardLines[i].trim().split(/[ ]+/).map(e => +e))
        }
    }
    boards.set(get_board_sum(board), decorate_with_columns(board));
    return boards;
}

function filterBoard(board, curr){
    for (let i in board){
        board[i] = board[i].filter(elem => elem !== curr);
    }
    return board;
}

function getLastWinner(winners) {
    let last_winner = winners.pop() //last exception
    const winner_board_rows = last_winner.board.slice(0, last_winner.board.length/2);
    const final_sum = get_board_sum(winner_board_rows);
    console.log(final_sum * last_winner.curr);
}

//boards
const boards = createBoards(lines);

//queue
const queue = lines[0].split(",").map(e => +e).reverse();

//play the game
const winners = []
while (queue.length > 0){
    let curr = queue.pop();
    for (let [sum, board] of boards.entries()) {
        board = filterBoard(board, curr);
        if (board.some(row => row.length === 0)){
            if (! winners.some(obj => obj.sum === sum)){
                const board_snapshot = [...board];
                winners.push({sum, curr, board: board_snapshot})
            }
        }
    }
}

getLastWinner(winners);
