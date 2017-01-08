#!/usr/bin/env node
'use strict';

const fs = require('fs');
const R = require('ramda');
const {parseIns, run} = require('./assembunny');
const validateRegisters = reg => {
    if(reg.length < 4){
        throw new Error('At least 4 register values are required');
    }
};
const argv = require('yargs')
    .option('file', {
        describe: 'Assembunny input file',
        normalize: true,
        demand: true,
        requiresArg: true
    })
    .option('registers', {
        describe: 'Initial register values, in the form of comma separated integers. At least 4 are required',
        demand: true,
        requiresArg: true,
        coerce: R.pipe(
            R.split(','),
            R.map(R.pipe(R.trim, parseInt)),
            R.tap(validateRegisters)
        ),
        default: '0,0,0,0'
    })
    .help('help')
    .alias('h', 'help')
    .argv;

console.log('intial registers:');
console.dir(argv.registers, {colors: true});

const ab = fs.readFileSync(argv.file, 'utf8')
    .split('\n')
    .map(parseIns);

const result = run(ab, argv.registers).toJS();

console.log('final registers:');
console.dir(result.registers, {colors: true});
console.log('instructions run:', result.i);
