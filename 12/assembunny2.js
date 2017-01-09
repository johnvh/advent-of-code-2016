'use strict';
/* eslint-env node */

const R = require('ramda');
const parseIns = ins => {
    const s = ins.split(/\s+/);
    [1, 2].forEach(i => {
        const v = s[i];
        const vi = parseInt(v);
        if(!isNaN(vi)){
            s[i] = vi;
        }
    });
    return s;
};
const isNum = R.is(Number);

// cpy 19 c
// jnz c -2
// inc a
// dec b
function run(registers, instructions){
    console.log('initial registers:', registers);
    const reg = R.clone(registers);
    const ins = instructions.map(parseIns);

    const ops = {
        inc: (x) => (reg[x]++, 1),
        dec: (x) => (reg[x]--, 1),
        cpy: (x, y) => {
            reg[y] = isNum(x) ? x : reg[x];
            return 1;
        },
        jnz: (x, y) => {
            const v = isNum(x) ? x : reg[x];
            return v === 0 ? 1 : y;
        }
    };

    let op, x, y, i = 0, line = 0;

    while(line < ins.length){
        [op, x, y] = ins[line];

        line += ops[op](x, y);
        i++;
    }

    return {registers: reg, i};
}

exports.run = run;
