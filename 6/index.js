'use strict';

const R = require('ramda');
const message = require('fs').readFileSync('./input.txt', 'utf8')
    .split('\n');

const decodeMessage = mostCommon => R.compose(
    R.join(''),
    R.map(R.compose(
        l => l[0][0],
        mostCommon ? R.reverse : R.identity,
        R.sortBy(R.nth(1)),
        // [['a', 5], ['c', 3], ...]
        R.toPairs
    )),
    // [{a: 5, b: 4}, {c: 3, d: 2}, ...]
    R.map(R.countBy(R.identity)),
    R.transpose,
    R.map(R.split(''))
);
const decodeViaMostCommon = decodeMessage(true);
const decodeViaLeastCommon = decodeMessage(false);

console.log('message...');
console.log('via most common:', decodeViaMostCommon(message));
console.log('via least common:', decodeViaLeastCommon(message));

