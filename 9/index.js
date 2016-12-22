'use strict';

const R = require('ramda');

// A(2x2)BCD(2x2)EFG
//  > [ A, (2x2)BC, D, (2x2)EF, G ]
// (6x1)(1x3)A
//  > [ (6x1)(1x3)A ]
// X(8x2)(3x3)ABCY
//  > [ X, (8x2)(3x3)AB, CY ]
function tokenize(str){
    const markerRe = /\((\d+)x(\d+)\)/i;
    const tokens = [];
    let s = str;
    let m;

    while((m = s.match(markerRe)) !== null){
        //['(8x2)', '8', '2', index: 1, input: 'X(8x2)(3x3)ABCY']
        const before = s.substring(0, m.index);
        const markedLength = parseInt(m[1]);
        const repeat = parseInt(m[2]);
        const markerLength = m[0].length + markedLength;

        if(before){
            tokens.push({type: 'reg', value: before});
        }

        tokens.push({
            type: 'marker',
            value: s.substr(m.index, markerLength),
            repeatChars: s.substr(m.index + m[0].length, markedLength),
            repeat
        });

        s = s.substr(m.index + markerLength);
    }

    if(s){
        tokens.push({type: 'reg', value: s});
    }

    return tokens;
}

const typeIs = type => R.pipe(R.prop('type'), R.equals(type));

const processToken = R.cond([
    [typeIs('reg'), R.prop('value')],
    [typeIs('marker'), t => t.repeatChars.repeat(t.repeat)],
    [R.T, t => {
        throw new Error(`token not recognized ${t ? t.type : t}`);
    }]
]);

const decompress = R.pipe(
    tokenize,
    R.map(processToken),
    R.join('')
);

Object.assign(exports, {
    decompress,
    tokenize
});

if(require.main === module){
    const input = require('fs').readFileSync('./input.txt', 'utf8');

    //console.log('input length, compressed', input.length);
    console.log('input length, decompressed', decompress(input.trim()).length);
}
