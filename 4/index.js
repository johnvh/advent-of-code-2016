'use strict';

const _ = require('lodash');
const input = require('fs').readFileSync('./input.txt', 'utf8')
    .split('\n');

//console.log(input.slice(0, 3));

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
}

if(require.main === module){
    const validCodes = input.map(c => new RoomCode(c))
        .filter(rc => rc.isValid());

    const sectorIdSum = _.chain(validCodes)
        .map(rc => parseInt(rc.sectorId, 10))
        .sum()
        .value();

    console.log('valid codes', validCodes.length);
    console.log('sector id sum for valid', sectorIdSum);
}

module.exports = {
    RoomCode,
    charFrequency
};
