'use strict';


const fs = require('fs');
const K = require('kefir');
const Promise = require('bluebird');
const instructions = () => {
    return fs.readFileSync('./input.txt', 'utf8')
        .split('\n')
        .map(line => line.split(''));
};

// 1 2 3
// 4 5 6
// 7 8 9
function go(num, dir){
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

function followInstructions(startNum, instructions){
    return K.sequentially(0, instructions)
        .scan((result, instruction) => {
            return go(result, instruction);
        }, startNum);
}

const ins = instructions();

console.log('instruction lines', ins.length);

Promise.reduce(ins, (result, currentIns) => {
    const startNum = result[result.length - 1] || 5;
    console.log('run', startNum);
    return followInstructions(startNum, currentIns)
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
