'use strict';

const fs = require('fs');
const directionsRaw = fs.readFileSync('./directions.txt', 'utf8').split(',')
exports.directionsRaw = directionsRaw;

function parseDirection(dir) {
    dir = dir.trim();
    return {
        turn: dir.charAt(0).toLowerCase(),
        length: parseInt(dir.substr(1))
    }
}
exports.parseDirection = parseDirection;

const parseDirections = dirs => dirs.map(parseDirection);
exports.parseDirections = parseDirections;

const directions = parseDirections(directionsRaw);
exports.directions = directions;

function taxiCabDistance(p1, p2){
    return Math.abs(p2[0] - p1[0]) + Math.abs(p2[1] - p1[1]);
}
exports.taxiCabDistance = taxiCabDistance;

function go(startVec, direction){
    //startVec.coord; // [0, 0]
    //startVec.dir;   // N

    //direction.turn;   // L
    //direction.length; // 2

    const newDir = newDirection(startVec.dir, direction.turn);
    let newCoord;

    //console.log('go()', startVec, direction);
    //console.log('  new dir', newDir)

    switch(newDir) {
        case 'n':
            newCoord =  [
                startVec.coord[0],
                startVec.coord[1] + direction.length
            ];
            break;
        case 'e':
            newCoord = [
                startVec.coord[0] + direction.length,
                startVec.coord[1],
            ];
            break;
        case 's':
            newCoord = [
                startVec.coord[0],
                startVec.coord[1] - direction.length
            ];
            break;
        case 'w':
            newCoord = [
                startVec.coord[0] - direction.length,
                startVec.coord[1],
            ];
            break;
        default:
            throw new Error(`dont know direction ${newDir}`);
    }

    return {dir: newDir, coord: newCoord};
}

// (N, L) => W
function newDirection(current, turn) {
    const turnNum = turn.toLowerCase() === 'l' ? -1 : 1;
    const dirToInt = {n:0, e:1, s:2, w:3};
    const intToDir = {'0':'n', '1':'e', '2':'s', '3':'w'};
    let newDir = dirToInt[current.toLowerCase()] + turnNum;

    if (newDir < 0) {
        newDir = 3;
    } else if (newDir === 4) {
        newDir = 0;
    }

    return intToDir[newDir.toString()];
}
exports.newDirection = newDirection;

//console.log(newDirection('n', 'l'));
//return;

const startVec = {dir: 'n', coord: [0, 0]};

//console.log(go({dir: 'n', coord: [0, 0]}, {turn: 'l', length: 1}));
//console.log(newDirection('E', 'R'));
//console.log(taxiCabDistance([-1, -1], [2, 2]));

const endVec = directions.reduce((result, curr) => {
    //console.log('start', result);
    //console.log('dir', curr);
    //console.log('-'.repeat(40));
    return go(result, curr);
}, startVec);

console.log('='.repeat(40));
console.log(endVec);

console.log('distance');
console.log(taxiCabDistance(startVec.coord, endVec.coord));
