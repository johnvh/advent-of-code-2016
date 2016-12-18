'use strict'

const {pwHashes} = require('./lib');
const doorId = 'cxdnnyjw';

const isDoor2PwHash = hash => /^[0-7]$/.test(hash.charAt(5));

const pwHashInfo = hash => ({
    pos: parseInt(hash.charAt(5)),
    char: hash.charAt(6)
});

const scanPw = () => {
    let pw = Array.from('-'.repeat(8));

    return (emitter, event) => {
        if(event.type == 'end'){
            return emitter.end();
        }
        if(event.type == 'error'){
            return emitter.error(event.error);
        }

        const {pos, char} = event.value;

        if(pw[pos] === '-') {
            pw[pos] = char;
            emitter.value(pw.join(''));
        }

        if(!pw.includes('-')){
            emitter.end();
        }
    }
}

const secondDoorPw = () => pwHashes(doorId)
    .map(v => v.hash)
    .filter(isDoor2PwHash)
    .spy('door 2 hash')
    .map(pwHashInfo)
    .spy('info')
    .withHandler(scanPw())
    .spy('pw so far')
    .last();

secondDoorPw()
    .onAny(console.log);
