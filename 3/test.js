'use strict';

const expect = require('chai').expect;
const {columnize, chunk} = require('./3');

describe('chunk', () => {
    it('breaks array into chunks', () => {
        const input = [
            'a', 'b', 'c', 'd', 'e', 'f'
        ];
        const chunked = chunk(input, 2);

        expect(chunked).to.have.lengthOf(3);
        expect(chunked[0]).to.eql(['a', 'b']);
        expect(chunked[1]).to.eql(['c', 'd']);
        expect(chunked[2]).to.eql(['e', 'f']);
    });
});

describe('columnize', () => {
    it('groups array by columns', () => {
        const input = [
            [101, 301, 501],
            [102, 302, 502],
            [103, 303, 503],
            [201, 401, 601],
            [202, 402, 602],
            [203, 403, 603]
        ];
        const result = columnize(input);

        expect(result).to.deep.include.members([[101, 102, 103]]);
        expect(result).to.deep.include.members([[201, 202, 203]]);
        expect(result).to.deep.include.members([[301, 302, 303]]);
        expect(result).to.deep.include.members([[401, 402, 403]]);
        expect(result).to.deep.include.members([[501, 502, 503]]);
        expect(result).to.deep.include.members([[601, 602, 603]]);
    });
});
