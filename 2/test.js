'use strict'

const assert = require('assert');
const numPad = require('./2-1');
const goCrazyNumPad = numPad.goCrazyNumPad;

describe('crazy num pad', () => {
    //     1
    //   2 3 4
    // 5 6 7 8 9
    //   A B C
    //     D
    [
        {num: '5', dir: 'u', exp: '5'},
        {num: '5', dir: 'd', exp: '5'},
        {num: '6', dir: 'u', exp: '2'},
        {num: '6', dir: 'd', exp: 'a'},
        {num: '1', dir: 'l', exp: '1'},
        {num: '1', dir: 'r', exp: '1'},
        {num: '3', dir: 'r', exp: '4'},
        {num: '9', dir: 'r', exp: '9'},
        {num: '5', dir: 'l', exp: '5'},
    ].forEach(tc => {
        it(`goes to ${tc.exp} with ${tc.num}, ${tc.dir}`, () => {
            assert.equal(goCrazyNumPad(tc.num, tc.dir), tc.exp);
        });
    });
});
