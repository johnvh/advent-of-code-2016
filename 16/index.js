const R = require('ramda');
const tr = R.curry(require('./string-tr').tr);
const input = '10010000000110000';

const flip01 = tr('01', '10');

const curve = str => str + '0' + R.pipe(R.reverse, flip01)(str);

const dataFill = (initial, len) => {
    const d = R.until(str => str.length >= len, curve, initial);
    return d.substr(0, len);
};

const isOdd = n => n % 2 == 1;
const strLen = str => str.length;
const strLenOdd = R.pipe(strLen, isOdd);

const checksum = R.until(
    strLenOdd,
    str => R.splitEvery(2, Array.from(str))
        .map(chars => {
            const set = new Set(chars);
            return set.size === 1 ? '1' : 0;
        })
        .join('')
);

const fillAndChecksum = (initial, length) => checksum(dataFill(initial, length));

//const assert = require('assert');
//assert.equal(curve('111100001010'), '1111000010100101011110000');
//assert.equal(genData('1').next().value, '100');
//assert.equal(genData('111100001010').next().value, '1111000010100101011110000');
//assert.equal(dataFill('1110000', 272).length, 272);
//assert.equal(checksum('101'), '101');
//assert.equal(checksum('110010110100'), '100');
//assert.equal(fillAndChecksum('10000', 20), '01100');

[272, 35651584].forEach(diskLen => {
    console.log(`checksum for input ${input}, length ${diskLen}:`);
    console.log(fillAndChecksum(input, diskLen));
});
