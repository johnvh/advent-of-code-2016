'use strict';

const assert = require('assert');
const _ = require('lodash');
const input = require('fs').readFileSync('./input.txt', 'utf8')
    .split('\n')
    .map(line => line
        .trim()
        .split(/\s+/)
        .map(num => parseInt(num.trim(), 10))
    );

function chunk(arr, size){
    if(size <= 0) {
        throw new Error(`invalid chunk size ${size}`);
    }

    return arr.reduce((result, item, i) => {
        const chunkIndex = Math.floor(i / size);
        (result[chunkIndex] = result[chunkIndex] || []).push(item);
        return result;
    }, []);
}

/**
 * [ [10 20 30],
 *   [11 21 31],
 *   [12 22 32] ]
 *
 * [ [10, 11, 12],
 *   [20, 21, 22],
 *   [30, 31, 32] ]
 *
 */
function columnize(arr){
    const chunkSize = 3;
    const chunked = chunk(arr, chunkSize);
    return chunked.reduce((result, chunk) => result.concat(_.zip.apply(_, chunk)), []);
}

function isValidTriangle([a, b, c]){
    assert(a > 0, 'a greater than zero');
    assert(b > 0, 'a greater than zero');
    assert(c > 0, 'a greater than zero');

    return a + b > c
        && a + c > b
        && b + c > a;
}

if(require.main === module){
    console.log('total triangles', input.length);

    const validTriangleRows = input.filter(isValidTriangle);
    console.log('valid trinangles (rows)', validTriangleRows.length);

    const validTriangleCols = columnize(input).filter(isValidTriangle);
    console.log('valid triangles (columns)', validTriangleCols.length);
}

module.exports = {
    columnize,
    chunk
};
