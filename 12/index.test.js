'use strict';
/* eslint-env mocha */

const {expect} = require('chai');
const {parseIns, assembunny, initState} = require('./');

//[0, 0, 0, 0];

describe('parseIns', () => {
    it('parses instruction', () => {
        expect(parseIns('cpy 19 c')).to.eql(['cpy', 19, 'c']);
        expect(parseIns('jnz c -2')).to.eql(['jnz', 'c', -2]);
        expect(parseIns('inc a')).to.eql(['inc', 'a']);
        expect(parseIns('dec b')).to.eql(['dec', 'b']);
    });
});

describe('assembunnyState', () => {
    it('executes state', () => {
        const state = assembunny(initState([
            ['inc', 'a']
        ]));
        let s = state.next();

        console.log('@@', s);

        expect(s.value.toJS()).to.have.deep.property('registers[0]', 1);
        expect(state.next()).to.have.property('done', true);
    });
});
