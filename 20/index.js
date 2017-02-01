/* eslint-disable no-constant-condition */

const assert = require('assert'); // eslint-disable-line no-unused-vars
const R = require('ramda');
const input = require('fs').readFileSync('./input.txt', 'utf8')
    .split('\n')
    .map(s => s.split('-').map(ss => parseInt(ss, 10)));

const inRange = ([min, max], num) => R.both(R.gte(R.__, min), R.lte(R.__, max))(num);
//assert(inRange([0, 8], 0));
//assert(inRange([0, 8], 8));
//assert(inRange([0, 8], 6));
//assert(!inRange([0, 8], 9));
//assert(!inRange([0, 8], -1));

const sortRanges = R.sortBy(R.head);

const inRanges = (ranges, num) => R.any(range => inRange(range, num), ranges);

const lowestNotInRanges = ranges => {
    ranges = sortRanges(ranges);

    for (let r of ranges) {
        const n = R.head(r) - 1;

        if (n < 0) {
            continue;
        }
        if (!inRanges(ranges, n)) {
            return n;
        }
    }

    return -1;
};

const minStart = R.pipe(R.map(R.head), R.reduce(R.min, Number.MAX_SAFE_INTEGER));
//assert.equal(minStart([[1, 5], [3, 6], [3, 4] ]), 1);

const maxEnd = R.pipe(R.map(R.last), R.reduce(R.max, 0));
//assert.equal(maxEnd([[1, 5], [0, 2], [3, 6], [3, 4] ]), 6);

const collapseRanges = ranges => {
    let r = sortRanges(ranges);

    while (true) {
        const grouped = R.groupWith((r1, r2) => r2[0] <= r1[1], r);
        const collapsed = R.map(ranges => [minStart(ranges), maxEnd(ranges)], grouped);

        if (collapsed.length === r.length) {
            return collapsed;
        }
        r = collapsed;
    }
};

const numAvailableIps = (ranges, max) => {
    const collapsed = collapseRanges(ranges);
    const cover = R.map(range => R.last(range) - R.head(range) + 1, collapsed);

    return R.reduce((acc, c) => acc - c, max + 1, cover);
};
/*
assert.equal(numAvailableIps([
    [1, 2], [0, 4],
    // 5, 6, 7
    [8, 9], [9, 12],
    // 13
    [14, 17]
    // 18, 19
], 19), 6);
*/

console.log('lowest available ip:', lowestNotInRanges(input));
console.log('num available:', numAvailableIps(input, 4294967295));
