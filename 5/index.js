'use strict';

const crypto = require('crypto');
const K = require('kefir');
const doorId = 'cxdnnyjw';

const md5 = input => crypto.createHash('md5')
    .update(input)
    .digest('hex');

const hashesBatch = (start = 0, amount, doorId) => K.stream(emitter => {
    let i = start;
    const end = start + amount;
    while(i < end){
        emitter.emit({
            i,
            hash: md5(`${doorId}${i++}`)
        });
    }
    emitter.end();
});

const hashes = (doorId, start = 0) => K.repeat(i => {
    const batchSize = 500;
    return hashesBatch(start + batchSize * i, batchSize, doorId);
});

const isPwHash = hash => hash.startsWith('0'.repeat(5));

const pwChar = hash => hash.charAt(5);

// 2307654 is first pw hash for input cxdnnyjw

const firstDoorPw = () => hashes(doorId, 2307654)
    .filter(v => isPwHash(v.hash))
    .spy('pw hash')
    .take(8)
    .map(v => v.hash)
    .map(pwChar)
    .spy('char')
    .scan((prev, next) => `${prev}${next}`, '');

if(require.main === module){
    firstDoorPw()
        .observe({
            value(value) {
                console.log('final:', value);
            },
            error(error) {
                console.log('error:', error);
            },
            end() {
                console.log('end');
            }
        });
}
