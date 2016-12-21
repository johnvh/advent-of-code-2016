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
    return Array(height).fill()
        .map(() => Array(width).fill(' '));
}

const rotateScreen = R.transpose;

function applyRect({width, height}, screen){
    const s = R.clone(screen);

    R.times(y => {
        let row = s[y];
        R.times(x => row[x] = '#', width);
    }, height);

    return s;
}

function applyRotateRow({row, amount}, screen){
    const s = R.clone(screen);
    const r = s[row];

    s[row] = arrayRotate(amount * -1, r);
    return s;
}

function applyRotateCol({col, amount}, screen){
    const s = rotateScreen(R.clone(screen));

    s[col] = arrayRotate(amount * -1, s[col]);
    return rotateScreen(s);
}

const applyIns = R.cond([
    [({type}) => R.equals('rect', type), applyRect],
    [({type}) => R.equals('rotateRow', type), applyRotateRow],
    [({type}) => R.equals('rotateCol', type), applyRotateCol],
    [R.T, ins => {throw new Error(`dont know instruction ${ins.type}`);}]
]);

const screenToStr = R.compose(R.join('\n'), R.map(R.join('')));

const screenCount = screen => [].concat.apply([], screen)
    .filter(R.equals('#'))
    .length;

Object.assign(exports, {
    arrayRotate,
    rotateScreen,
    parseInstruction,
    buildScreen,
    applyRect,
    applyRotateRow,
    applyRotateCol
});

if(require.main === module){
    const instructions = input.map(parseInstruction);
    const screen = buildScreen(50, 6);

    const finalScreen = instructions.reduce((screen, ins) => {
        console.log('apply', ins);
        return applyIns(ins, screen);
    }, screen);

    console.log(screenToStr(finalScreen));
    console.log('pixels lit:', screenCount(finalScreen));
}
