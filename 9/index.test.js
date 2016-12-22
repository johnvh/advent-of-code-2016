'use strict';
/* eslint-env jest */

const {decompress, tokenize} = require('./');

describe('tokenize', () => {
    it('splits into tokens', () => {
        expect(tokenize('A(2x2)BCD(2x2)EFG')).toEqual([
            {type: 'reg', value: 'A'},
            {
                type: 'marker',
                value: '(2x2)BC',
                repeatChars: 'BC',
                repeat: 2
            },
            {type: 'reg', value: 'D'},
            {
                type: 'marker',
                value: '(2x2)EF',
                repeatChars: 'EF',
                repeat: 2
            },
            {type: 'reg', value: 'G'}
        ]);
        expect(tokenize('X(8x2)(3x3)ABCY')).toEqual([
            {type: 'reg', value: 'X'},
            {
                type: 'marker',
                value: '(8x2)(3x3)ABC',
                repeatChars: '(3x3)ABC',
                repeat: 2
            },
            {type: 'reg', value: 'Y'}
        ]);
        expect(tokenize('(6x1)(1x3)A')).toEqual([
            {
                type: 'marker',
                value: '(6x1)(1x3)A',
                repeatChars: '(1x3)A',
                repeat: 1
            }
        ]);
    });
});

describe('decompress', () => {
    it('decompresses', () => {
        //const input = 'A(1x5)BC';
        //expect(decompress(input)).toEqual('ABBBBBC');
        //expect(decompress('A(2x2)BCD(2x2)EFG')).toEqual('ABCBCDEFEFG');

        [
            ['ADVENT', 'ADVENT'],
            ['A(1x5)BC', 'ABBBBBC'],
            ['(3x3)XYZ', 'XYZXYZXYZ'],
            ['A(2x2)BCD(2x2)EFG', 'ABCBCDEFEFG'],
            ['(6x1)(1x3)A', '(1x3)A'],
            ['X(8x2)(3x3)ABCY', 'X(3x3)ABC(3x3)ABCY'],
            ['(11x2)abcdefghijkl', 'abcdefghijkabcdefghijkl']
        ].forEach(([input, expected]) => {
            //console.log('checking', input);
            //console.log('  ', decompress(input).length);
            expect(decompress(input)).toEqual(expected);
        });
    });
});
