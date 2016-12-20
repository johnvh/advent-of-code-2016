'use strict';

const R = require('ramda');
const input = require('fs').readFileSync('./input.txt', 'utf8')
    .split('\n');

function arrayRotate(amount, arr){
    amount = amount % arr.length;
    amount = amount < 0 ? arr.length + amount : amount;

    if(amount === 0){
        return arr;
    }
    return arr.slice(amount).concat(arr.slice(0, amount - arr.length));
}

// rect 9x1
// rotate column x=43 by 1
// rotate column x=40 by 2
// rotate column x=38 by 1
// rotate column x=15 by 1
// rotate row y=3 by 35
function parseInstruction(ins){
    ins = ins.trim();
    if(/^rect/i.test(ins)){
        let [, w, h] = ins.match(/(\d+)x(\d+)/);
        return {
            type: 'rect',
            width: parseInt(w, 10),
            height: parseInt(h, 10)
        };
    }
    else if(/^rotate\s+row/i.test(ins)){
        let [, row, amount] = ins.match(/y=(\d+)\s+by\s+(\d+)/);
        return {
            type: 'rotateRow',
            row: parseInt(row, 10),
            amount: parseInt(amount, 10)
        };
    }
    else if(/^rotate\s+column/i.test(ins)){
        let [, col, amount] = ins.match(/x=(\d+)\s+by\s+(\d+)/);
        return {
            type: 'rotateCol',
            col: parseInt(col, 10),
            amount: parseInt(amount, 10)
        };
    }

    throw new Error(`instruction not recognized "${ins}"`);
}

function buildScreen(width, height){
    return Array(height).fill(0)
        .map(() => Array(width).fill(''));
}

const rotateScreen = R.compose(R.reverse, R.transpose);

//const copyScreen = screen => screen.map(r => row.slice());

function applyRect(rectIns, screen){
    const s = R.clone(screen);

    R.times(y => {
        let row = s[y];
        R.times(x => {
            row[x] = '#';
        }, rectIns.width);
    }, rectIns.height);

    return s;
}

function applyRotateRow(rotateRowIns, screen){
    const s = R.clone(screen);
    const row = s[rotateRowIns.row];

    s[rotateRowIns.row] = arrayRotate(rotateRowIns.amount * -1, row);

    return s;
}

// [ a0 a1 ] => [ a1 b1 ]
// [ b0 b1 ]    [ a0 b0 ]

Object.assign(exports, {
    arrayRotate,
    rotateScreen,
    parseInstruction,
    buildScreen,
    applyRect,
    applyRotateRow
});

if(require.main === module){
    const instructions = input.map(parseInstruction);
    const screen = buildScreen(50, 6);

    console.log(screen[0].length);
    console.log(screen.length);
}
