const assert = require('assert');
const {Range} = require('immutable');
const {tap} = require('ramda');
const input = require('fs').readFileSync('./input.txt', 'utf-8').split('\n');

// Disc #3 has 17 positions; at time=0, it is at position 10.
const start = () => input
    .map(ln => {
        const [discNum, positions, , start] = ln.match(/(\d+)/g);
        return {
            num: parseInt(discNum, 10),
            positions: parseInt(positions, 10),
            start: parseInt(start, 10)
        };
    });

// disc { start: 1, positions: 4}
const discPos = (disc, time) => (disc.start + time) % disc.positions;

const check = (discs, t) => {
    return discs.every((disc, discIdx) => {
        return discPos(disc, t + discIdx) === disc.positions - 1;
    });
};

//assert.equal(discPos(discs[0], 0), 2);
//assert.equal(discPos(discs[3], 1), 0);
//assert.equal(discPos(discs[5], 13), 6);
//console.log(check(discs, 17));
//console.log(discs[0]);

const run = discs => {
    return Range(
        discs[0].positions - 1 - discs[0].start,
        Number.MAX_SAFE_INTEGER,
        discs[0].positions
    )
    .filter(t => check(discs, t))
    .take(1)
    .toJS()[0];
};

console.log('part 1, drop at t =', run(start()));

console.log('part 2, drop at t =', run(start().concat([
    {positions: 11, start: 0}
])));
