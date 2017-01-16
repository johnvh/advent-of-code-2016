const R = require('ramda');
const input = require('fs').readFileSync('./input.txt', 'utf-8').trim();
const {Range} = require('immutable');

const isTrap = seq => seq === '^^.' || seq === '.^^' || seq === '^..' || seq === '..^';

const nextRow = prevRow => Array.from(prevRow).map((_, i) => {
    const prevSeq = (prevRow[i - 1] || '.') + prevRow[i] + (prevRow[i + 1] || '.');
    return isTrap(prevSeq) ? '^' : '.';
}).join('');

const safeInRow = R.pipe(R.countBy(R.identity), R.prop('.'));

const countSafe = (length, initialRow) => Range(1, length)
    .reduce(
        result => {
            const row = nextRow(result.prevRow);
            result.totalSafe += safeInRow(row);
            result.prevRow = row;

            return result;
        },
        {totalSafe: safeInRow(initialRow), prevRow: initialRow}
    );

//const assert = require('assert');
//assert.deepEqual(nextRow('..^^.'), '.^^^^');
//assert.deepEqual(nextRow('.^^^^'), '^^..^');

console.log('safe tiles, 40 rows:');
console.log(countSafe(40, input).totalSafe);

console.log('safe tiles, 400,000 rows:');
console.log(countSafe(400000, input).totalSafe);
