'use strict';

const crypto = require('crypto');
const R = require('ramda');
const {Seq} = require('immutable');
const salt = 'cuanljph';
const MAX = Number.MAX_SAFE_INTEGER;

const md5 = input => crypto.createHash('md5')
    .update(input)
    .digest('hex');

const keyGenerator = R.curry((salt, start, stop) => {
    //console.log('keyGenerator', salt, start, stop);
    return function*(){
        let i = start;
        //console.log('gen', {start, stop});
        while(i < stop) {
            yield {i, md5: md5(`${salt}${i++}`)};
        }
    };
});

const saltGenerator = keyGenerator(salt);

const recordFirstTriple = keyRecord => {
    const [triple, tripleChar] = keyRecord.md5.match(/(.)\1\1/) || [];
    return Object.assign({triple, tripleChar}, keyRecord);
};

const recordHasTriple = R.propIs(String, 'triple');

const hashQuintupleDownStream = ({i, tripleChar}) => {
    return !Seq(saltGenerator(i + 1, i + 1001)())
        //.map(R.tap(v => console.log('     quintuple?',  v.i)))
        .filter(record => record.md5.includes(tripleChar.repeat(5)))
        //.map(R.tap(v => console.log('  quintuple!! at',  v.i)))
        .isEmpty();
};

Seq(saltGenerator(0, MAX)())
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

