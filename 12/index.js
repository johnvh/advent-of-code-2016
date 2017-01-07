'use strict';

const R = require('ramda');
const {Map, fromJS} = require('immutable');
const input = require('fs').readFileSync('./input.txt', 'utf8')
    .split('\n')
    .map(R.trim);

// cpy 19 c
// jnz c -2
// inc a
// dec b
const parseIns = ins => {
    const s = ins.split(/\s+/);
    [1, 2].forEach(i => {
        const v = s[i];
        const vi = parseInt(v);
        if(!isNaN(vi)){
            s[i] = vi;
        }
    });
    return s;
};

const initState = ins => fromJS({
    registers: [0, 0, 0, 0],
    nextIns: 0,
    ins
});

const stateHalted = state => {
    //console.log('halted?', {nextIns: state.get('nextIns'), 'ins': state.get('ins').size});
    //console.log(state.get('nextIns') >= state.get('ins').size);
    return state.get('nextIns') >= state.get('ins').size;
};

const insHead = ins => ins.get(0);
const cpyIns = R.pipe(insHead, R.equals('cpy'));
const decIns = R.pipe(insHead, R.equals('dec'));
const incIns = R.pipe(insHead, R.equals('inc'));
const jnzIns = R.pipe(insHead, R.equals('jnz'));
const registerIndex = Map([...'abcd'].map((name, i) => [name, i]));

// ins => ['inc', 'a'] | ['cpy', 1|'a', 'b']
const execIns = (ins, registers) => {
    console.log('execIns()', ins);
    const reg = R.cond([
        [incIns, ins => registers.update(registerIndex.get(ins.get(1)), R.inc)],
        [decIns, ins => registers.update(registerIndex.get(ins.get(1)), R.dec)],
        [R.T, () => {throw new Error(`instruction not recognized ${ins[0]}`);}]
    ])(ins);

    return {
        registers: reg
    };
};

const execState = state => {
    console.log('execState()', state);
    const ins = state.get('ins').get(state.get('nextIns'));
    const exec = execIns(ins, state.get('registers'));

    console.log('ins', ins);
    console.log('execd', exec);

    return state
        .set('registers', exec.registers)
        .update('nextIns', R.inc);
};

const assembunny = function*(state = initState([])){
    //console.log('init state', state);
    let nextState = state;
    while(!stateHalted(nextState)){
        yield nextState = execState(state);
    }
};

Object.assign(exports, {
    parseIns,
    initState,
    assembunny
});

if(require.main === module){
    console.dir(input);
}
