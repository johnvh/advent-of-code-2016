'use strict';


const fs = require('fs');
const K = require('kefir');
const Promise = require('bluebird');
const _ = require('lodash');
const instructions = () => {
    return fs.readFileSync('./input.txt', 'utf8')
        .split('\n')
        .map(line => line.split(''));
};

const crazyNumPad = [
    ['-', '-', '1', '-', '-'],
    ['-', '2', '3', '4', '-'],
    ['5', '6', '7', '8', '9'],
    ['-', 'a', 'b', 'c', '-'],
    ['-', '-', 'd', '-', '-']
];

//     1
//   2 3 4
// 5 6 7 8 9
//   A B C
//     D
const goCrazyNumPad = exports.goCrazyNumPad = function(num, dir){
    num = num.toString();
    let d, newRow, newCol, newNum;
    const row = _.findIndex(crazyNumPad, row => {
        return row.includes(num);
    });
    const col = _.findIndex(crazyNumPad[row], _.matches(num));

    switch(dir.toLowerCase()){
        case 'u':
        case 'd':
            d = dir.toLowerCase() === 'u' ? -1 : 1;
            newRow = _.clamp(row + d, 0, crazyNumPad.length - 1);
            newNum = crazyNumPad[newRow][col];
        break;

        case 'r':
        case 'l':
            d = dir.toLowerCase() === 'r' ? 1 : -1;
            newCol = _.clamp(col + d, 0, crazyNumPad[row].length - 1);
            newNum = crazyNumPad[row][newCol];
        break;

        default:
            throw new Error(`dont know direction ${dir}`);
    }

    if(newNum == '-'){
        return num;
    }
    return newNum;
}

// 1 2 3
// 4 5 6
// 7 8 9
function goPhoneNumPad(num, dir){
    switch(dir.toLowerCase()){
        case 'u':
            return num <= 3 ? num : num - 3;
        break;
        case 'd':
            return num >= 7 ? num : num + 3;
        break;
        case 'r':
            return num % 3 === 0 ? num : num + 1;
        break;
        case 'l':
            return num % 3 === 1 ? num : num - 1;
        break;
        default:
            throw new Error(`dont know direction ${dir}`);
    }
}

//console.log('u', go(7, 'u'));
//console.log('r', go(7, 'r'));
//console.log('d', go(7, 'd'));
//console.log('l', go(7, 'l'));

function followPhoneNumPadInstructions(startNum, instructions){
    return K.sequentially(0, instructions)
        .scan((result, instruction) => {
            return goPhoneNumPad(result, instruction);
        }, startNum);
}

function followCrazyNumPadInstructions(startNum, instructions){
    return K.sequentially(0, instructions)
        .scan((result, instruction) => {
            return goCrazyNumPad(result, instruction);
        }, startNum);
}

const ins = instructions();

function runPhoneNumPad(){
    console.log('running instructions on regular num pad...');

    return Promise.reduce(ins, (result, currentIns) => {
        const startNum = result[result.length - 1] || 5;
        console.log('run', startNum);
        return followPhoneNumPadInstructions(startNum, currentIns)
            .last()
            .toPromise()
            .then(v => {
                result.push(v);
                return result;
            });
    }, [])
    .then(digits => {
        console.log('digits', digits);
        console.log(digits.join(''));
    });
}

function runCrazyNumPad(){
    console.log('running instructions on crazy num pad...');

    return Promise.reduce(ins, (result, currentIns) => {
        const startNum = result[result.length - 1] || 5;
        console.log('run', startNum);
        return followCrazyNumPadInstructions(startNum, currentIns)
            .last()
            .toPromise()
            .then(v => {
                result.push(v);
                return result;
            });
    }, [])
    .then(digits => {
        console.log('digits', digits);
        console.log(digits.join('').toUpperCase());
    });
}

if(require.main === module) {
    console.log('instruction lines', ins.length);

    runPhoneNumPad()
        .then(() => console.log('-'.repeat(80)))
        .then(runCrazyNumPad);
}
