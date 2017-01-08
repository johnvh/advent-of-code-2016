'use strict';
/* eslint-env mocha */

const chai = require('chai');
chai.use(require('chai-immutable'));

const expect = chai.expect;
const {fromJS, List} = require('immutable');
const {parseIns, assembunny, initState, execIns, run} = require('./assembunny');

//[0, 0, 0, 0];

describe('parseIns', () => {
    it('parses instruction', () => {
        expect(parseIns('cpy 19 c')).to.eql(['cpy', 19, 'c']);
        expect(parseIns('jnz c -2')).to.eql(['jnz', 'c', -2]);
        expect(parseIns('inc a')).to.eql(['inc', 'a']);
        expect(parseIns('dec b')).to.eql(['dec', 'b']);
    });
});

describe('execIns', () => {
    // inc a
    // dec b
    // cpy 19 c
    // cpy a b   (read from a)

    it('executes inc', () => {
        const registers = fromJS([1, 1, 1, 1]);
        const r = execIns(fromJS(['inc', 'b']), registers);
        expect(r).to.have.property('registers', List([1, 2, 1, 1]));
        expect(r).to.have.property('insMove', 1);
    });

    it('executes dec', () => {
        const registers = fromJS([1, 1, 1, 1]);
        const r = execIns(fromJS(['dec', 'c']), registers);
        expect(r).to.have.property('registers', List([1, 1, 0, 1]));
        expect(r).to.have.property('insMove', 1);
    });

    it('executes cpy value', () => {
        const registers = fromJS([1, 1, 1, 1]);
        const r = execIns(fromJS(['cpy', 5, 'd']), registers);
        expect(r).to.have.property('registers', List([1, 1, 1, 5]));
        expect(r).to.have.property('insMove', 1);
    });

    it('executes cpy read', () => {
        const registers = fromJS([1, 2, 3, 4]);
        const r = execIns(fromJS(['cpy', 'c', 'a']), registers);
        expect(r).to.have.property('registers', List([3, 2, 3, 4]));
        expect(r).to.have.property('insMove', 1);
    });

    // jnz 1 -2
    // jnz 0 4   (zero noop)
    // jnz c 3   (read from c)
    // jnz c 3   (read from c, c == 0, noop)

    it('executes jnz value > 0', () => {
        const registers = fromJS([1, 2, 3, 4]);
        const r = execIns(fromJS(['jnz', 1, -2]), registers);
        expect(r).to.have.property('registers', registers);
        expect(r).to.have.property('insMove', -2);
    });

    it('executes jnz value < 0 (noop)', () => {
        const registers = fromJS([1, 2, 3, 4]);
        const r = execIns(fromJS(['jnz', 0, 5]), registers);
        expect(r).to.have.property('registers', registers);
        expect(r).to.have.property('insMove', 1);
    });

    it('executes jnz read', () => {
        const registers = fromJS([1, 2, 3, 4]);
        const r = execIns(fromJS(['jnz', 'c', 9]), registers);
        expect(r).to.have.property('registers', registers);
        expect(r).to.have.property('insMove', 9);
    });

    it('executes jnz read reg < 0 (noop)', () => {
        const registers = fromJS([1, 1, 1, 0]);
        const r = execIns(fromJS(['jnz', 'd', 8]), registers);
        expect(r).to.have.property('registers', registers);
        expect(r).to.have.property('insMove', 1);
    });
});

describe('assembunnyState', () => {
    it('executes single state', () => {
        const state = assembunny(initState([
            ['inc', 'a']
        ], Array(4).fill(0)));
        let s = state.next();

        //console.log('@@', s);

        expect(s.value.toJS()).to.have.deep.property('registers[0]', 1);
        expect(state.next()).to.have.property('done', true);
    });

});

describe('run', () => {
    it('executes program', () => {
        const r = run([
            ['cpy', 41, 'a'],
            ['inc', 'a'],
            ['inc', 'a'],
            ['dec', 'a'],
            ['jnz', 'a', 2],
            ['dec', 'a']
        ], Array(4).fill(0));

        console.log('run...', r);
        expect(r.getIn(['registers', '0'], 42));
    });
});
