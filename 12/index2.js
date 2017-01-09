'use strict';

const fs = require('fs');
const R = require('ramda');
const {run} = require('./assembunny2');
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
    .option('c', {
        default: 0,
        type: 'number'
    })
    .help('help')
    .alias('h', 'help')
    .argv;

const input = fs.readFileSync(argv.file, 'utf8').split('\n');
const result = run({a: 0, b: 0, c: argv.c, d: 0}, input);

console.log(result);
