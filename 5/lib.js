'use strict';

const crypto = require('crypto');
const K = require('kefir');

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

// 2307654 is first pw hash for input cxdnnyjw

const pwHashes = pw => hashes(pw, 2307654)
    .filter(v => isPwHash(v.hash))
    .spy('pw hash');

Object.assign(exports, {
    pwHashes
});
