'use strict';

const {pwHashes} = require('./lib');
const doorId = 'cxdnnyjw';

const pwChar = hash => hash.charAt(5);

const pwChars = pw => pwHashes(pw)
    .map(v => v.hash)
    .map(pwChar);

const firstDoorPw = () => pwChars(doorId)
    .take(8)
    .spy('char')
    .scan((prev, next) => `${prev}${next}`, '');

firstDoorPw().onAny(console.log);
