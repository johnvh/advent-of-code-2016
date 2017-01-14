'use strict';

function buildTable(from, to){
    return new Map(Array.from(from).map((fromChar, i) => [
        fromChar,
        to.charAt(Math.min(i, to.length - 1))
    ]));
}

function stringTr(from, to, str){
    const table = buildTable(from, to);

    return Array.from(str).map(char => {
        return table.get(char) || char;
    }).join('');
}


const assert = require('assert');
assert.equal(stringTr('el', 'ab', 'hello'), 'habbo');
assert.equal(stringTr('lo', '*', 'hello'), 'he***');
assert.equal(stringTr('10', '01', '111000'), '000111');

exports.tr = stringTr;
