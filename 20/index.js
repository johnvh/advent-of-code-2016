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

console.log('lowest available ip:', lowestNotInRanges(input));
