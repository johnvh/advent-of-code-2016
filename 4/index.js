'use strict';

const R = require('ramda');
const _ = require('lodash');
const input = require('fs').readFileSync('./input.txt', 'utf8')
    .split('\n');

const rotAmountBounded = amount => {
    amount = amount % 26;
    if(amount < 0){
        amount = 26 + amount;
    }
    return amount;
};

const toCharCode = c => c.charCodeAt(0);
// inclusive
const inRange = R.curry((l, u) => R.both(R.gte(R.__, l), R.lte(R.__, u)));
const isUpperCaseRange = inRange(65, 90);
const isUpper = R.compose(isUpperCaseRange, toCharCode);
const isLowerCaseRange = inRange(97, 122);
const isLower = R.compose(isLowerCaseRange, toCharCode);

// A 65  Z 90
// a 97  z 122
const rotSingle = R.curry((amount, char) => {
    amount = rotAmountBounded(amount);

    let newCharCode = char.charCodeAt(0) + amount;

    if(isUpper(char)){
        if(newCharCode > 90){
            newCharCode = 65 + (newCharCode - 91);
        }
    }else if(isLower(char)){
        if(newCharCode > 122){
            newCharCode = 97 + (newCharCode - 123);
        }
    }else{
        newCharCode = char.charCodeAt(0);
    }

    return String.fromCharCode(newCharCode);
});

const rot = R.curry(
    (amount, chars) => Array.from(chars).map(rotSingle(amount)).join('')
);

function charFrequency(str){
    str = str.replace(/[^a-z]/ig, '');

    return Array.from(str).reduce((result, char) => {
        result[char] = result[char] || 0;
        result[char]++;
        return result;
    }, {});
}

class RoomCode {
    constructor(code){
        this.parse(code);
    }

    parse(code){
        const r = code.trim().match(/([a-z-]+)(\d+)\[([a-z]+)\]/i);

        if(!r){
            throw new Error(`invalid room code ${code}`);
        }

        this.name = r[1].replace(/-$/, '');
        this.sectorId = r[2];
        this.checksum = r[3];

        this.mostCommonChars = _.chain(this.name)
            .thru(charFrequency)
            .toPairs()
            .orderBy(['[1]', '[0]'], ['desc', 'asc'])
            //.tap(v => console.log('chain', v))
            .take(5)
            .map(pair => pair[0])
            .value();
    }

    isValid(){
        return this.checksum === this.mostCommonChars.join('');
    }

    decoded(){
        const shift = rot(parseInt(this.sectorId));
        return shift(this.name).replace(/-/g, ' ');
    }
}

if(require.main === module){
    const doDecode = process.argv.includes('--decode');
    const validCodes = input.map(c => new RoomCode(c))
        .filter(rc => rc.isValid());

    if(!doDecode){
        const sectorIdSum = _.chain(validCodes)
            .map(rc => parseInt(rc.sectorId, 10))
            .sum()
            .value();

        console.log('valid codes', validCodes.length);
        console.log('sector id sum for valid', sectorIdSum);

    }else{
        validCodes.forEach(rc => {
            console.log(rc.sectorId, '|', rc.decoded());
        });
    }
}

module.exports = {
    RoomCode,
    charFrequency,
    rot
};
