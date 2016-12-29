'use strict';

const R = require('ramda');

function matchMarker(str){
    const markerRe = /\((\d+)x(\d+)\)/i;
    return str.match(markerRe);
}

// A(2x2)BCD(2x2)EFG
//  > [ A, (2x2)BC, D, (2x2)EF, G ]
// (6x1)(1x3)A
//  > [ (6x1)(1x3)A ]
// X(8x2)(3x3)ABCY
//  > [ X, (8x2)(3x3)AB, CY ]
function tokenize(str){
    //const markerRe = /\((\d+)x(\d+)\)/i;
    const tokens = [];
    let s = str;
    let m;

    while((m = matchMarker(s)) !== null){
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

const tokenNotRecognized = t => {
    throw new Error(`token not recognized ${t ? t.type : t}`);
};

const processToken = R.cond([
    [typeIs('reg'), R.prop('value')],
    [typeIs('marker'), t => t.repeatChars.repeat(t.repeat)],
    [R.T, tokenNotRecognized]
]);

const markerInfo = marker => {
    let m = matchMarker(marker);

    if(!m){
        return null;
    }

    const length = parseInt(m[1], 10);
    const markedStart = m.index + m[0].length;

    return {
        length,
        index: m.index,
        marker: m[0],
        repeat: parseInt(m[2], 10),
        markedChars: marker.substr(markedStart, length)
    };
};

const markerFullLength = marker => {
    let m;
    let s = marker;
    let length = 0;

    while((m = markerInfo(s)) !== null){
        if(matchMarker(m.markedChars)){
            length += m.repeat * markerFullLength(m.markedChars);
        }else{
            length += m.length * m.repeat;
        }

        s = s.substr(m.index + m.marker.length + m.length);
    }
    return length;
};

const expandAndSizeToken = R.cond([
    [typeIs('reg'), R.path(['value', 'length'])],
    [typeIs('marker'), m => markerFullLength(m.value)],
    [R.T, tokenNotRecognized]
]);

const decompress = R.pipe(
    tokenize,
    R.map(processToken),
    R.join('')
);

const decompressedLength = R.pipe(
    tokenize,
    R.map(expandAndSizeToken),
    R.sum
);

Object.assign(exports, {
    decompress,
    decompressedLength,
    tokenize
});

if(require.main === module){
    const input = require('fs').readFileSync('./input.txt', 'utf8').trim();

    console.log('input length, compressed', input.length);
    console.log('input length, simple decompression', decompress(input).length);
    console.log('input length, full decompression', decompressedLength(input));
}
