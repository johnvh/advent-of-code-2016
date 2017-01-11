'use strict';
/* eslint-env node */

const lru = require('lru-cache');
const crypto = require('crypto');
const R = require('ramda');
const {Seq} = require('immutable');
const salt = 'cuanljph';
const MAX = Number.MAX_SAFE_INTEGER;

const stretch = () => {
    const optIndex = process.argv.indexOf('--stretch');
    const stretch = parseInt(process.argv[optIndex + 1]);
    return isNaN(stretch) ? 0 : stretch;
};

const memoize = f => {
    const cache = lru({max: 10000});
    return function(){
        const k = arguments[0];
        if(cache.has(k)){
            return cache.get(k);
        }
        const v = f.apply(null, arguments);
        cache.set(k, v);
        return v;
    };
};

const md5 = input => crypto.createHash('md5')
    .update(input)
    .digest('hex');

const hash = R.curry((salt, stretch, i) => {
    let h = md5(`${salt}${i}`);
    R.times(() => h = md5(h), stretch);
    return h;
});

const saltHash = hash(salt);
//const keyUnstretched = saltHash(0);
const keyStretched = memoize(saltHash(stretch()));

const keyGenerator = R.curry((hashImpl, start, stop) => {
    return function*(){
        let i = start;
        while(i < stop) {
            yield {i, md5: hashImpl(i++)};
        }
    };
});

//const keyGenUnstretched = keyGenerator(keyUnstretched);
const keyGenStretched = keyGenerator(keyStretched);

const recordFirstTriple = keyRecord => {
    const [triple, tripleChar] = keyRecord.md5.match(/(.)\1\1/) || [];
    return Object.assign({triple, tripleChar}, keyRecord);
};

const recordHasTriple = R.propIs(String, 'triple');

const hashQuintupleDownStream = ({i, tripleChar}) => {
    return !Seq(keyGenStretched(i + 1, i + 1001)())
        //.map(R.tap(v => console.log('     quintuple?',  v.i)))
        .filter(record => record.md5.includes(tripleChar.repeat(5)))
        .take(1)
        //.map(R.tap(v => console.log('  quintuple!! at',  v.i)))
        .isEmpty();
};

console.log('stretch', stretch());

Seq(keyGenStretched(0, MAX)())
    .map(recordFirstTriple)
    //.map(R.tap(v => console.log('record:', v)))
    .filter(recordHasTriple)
    //.map(R.tap(v => console.log('hasTriple:', v)))
    .filter(hashQuintupleDownStream)
    //.map(R.tap(v => console.log('hasQuint!:', v)))
    .take(64)
    .forEach((v, i) => {
        console.log(i + 1, v);
    });

