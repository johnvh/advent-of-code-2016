'use strict';
/* eslint-env node */

const R = require('ramda');
const {Map, fromJS} = require('immutable');

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
    i: 0,
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
const cpyValueIns = R.allPass([cpyIns, ins => R.is(Number, ins.get(1))]);
const cpyReadIns = R.allPass([cpyIns, ins => R.is(String, ins.get(1))]);
const decIns = R.pipe(insHead, R.equals('dec'));
const incIns = R.pipe(insHead, R.equals('inc'));
const jnzIns = R.pipe(insHead, R.equals('jnz'));
const notJnzIns = R.complement(jnzIns);
const jnzRead = R.pipe(ins => ins.get(1), R.is(String));
const registerIndex = Map([...'abcd'].map((name, i) => [name, i]));
const registerRead = (slot, registers) => registers.get(registerIndex.get(slot));

// ins => ['inc', 'a'] | ['cpy', 1|'a', 'b']
const execIns = (ins, registers) => {
    const reg = R.cond([
        [incIns, ins => registers.update(registerIndex.get(ins.get(1)), R.inc)],
        [decIns, ins => registers.update(registerIndex.get(ins.get(1)), R.dec)],
        [cpyValueIns, ins => registers.set(registerIndex.get(ins.get(2)), ins.get(1))],
        [cpyReadIns, ins => registers.set(
            registerIndex.get(ins.get(2)),
            registerRead(ins.get(1), registers)
        )],
        [jnzIns, R.always(registers)],
        [R.T, () => {throw new Error(`instruction not recognized ${ins[0]}`);}]
    ])(ins);

    const insMove = R.cond([
        [notJnzIns,  R.always(1)],
        [jnzIns, ins => {
            const d = jnzRead(ins) ? registerRead(ins.get(1), registers) : ins.get(1);
            return d === 0 ? 1 : ins.get(2);
        }]
    ])(ins);

    return fromJS({
        registers: reg,
        insMove
    });
};

const execState = state => {
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write([
        state.get('registers').join(),
        state.get('nextIns'),
        state.get('i')
    ].join(' '));

    const ins = state.get('ins').get(state.get('nextIns'));
    const result = execIns(ins, state.get('registers'));

    return state
        .set('registers', result.get('registers'))
        .update('i', R.inc)
        .update('nextIns', R.add(result.get('insMove')));
};

const assembunny = function*(state = initState([])){
    let nextState = state;

    do {
        yield nextState = execState(nextState);
    }
    while(!stateHalted(nextState));

    process.stdout.write('\n');
    return nextState;
};

const runIns = ins => {
    let state = assembunny(initState(ins));
    let s;

    do {
        s = state.next();
    } while(!s.done);

    return s.value;
};

Object.assign(exports, {
    parseIns,
    initState,
    execIns,
    assembunny,
    runIns
});

if(require.main === module){
    const input = require('fs').readFileSync('./input.txt', 'utf8')
        .split('\n')
        .map(R.trim);

    const run = runIns(input.map(parseIns));
    console.dir(R.pick(['registers', 'nextIns', 'i'], run.toJS()), {colors: true});
}
