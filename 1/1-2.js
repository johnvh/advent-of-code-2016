'use strict';

const K = require('kefir');
const d = require('./');
const newDirection = d.newDirection;

const travel = (startVec, directions) => K.stream(emitter => {

    emitter.emit(startVec.coord);

    directions.reduce((currentVec, direction) => {
        //direction.turn;   // L
        //direction.length; // 2

        const newDir = newDirection(currentVec.dir, direction.turn);
        const oldCoord = currentVec.coord;
        let newCoord;
        let step;

        switch(newDir) {
            case 'n':
                step = 1;
                newCoord =  [
                    currentVec.coord[0],
                    currentVec.coord[1] + direction.length
                ];
                break;
            case 'e':
                step = 1;
                newCoord = [
                    currentVec.coord[0] + direction.length,
                    currentVec.coord[1],
                ];
                break;
            case 's':
                step = -1;
                newCoord = [
                    currentVec.coord[0],
                    currentVec.coord[1] - direction.length
                ];
                break;
            case 'w':
                step = -1;
                newCoord = [
                    currentVec.coord[0] - direction.length,
                    currentVec.coord[1],
                ];
                break;
            default:
                throw new Error(`dont know direction ${newDir}`);
        }

        //[0, 0]
        //[-1, 0];
        //emitter.value(oldCoord);

        // w -1
        //debugger;

        if(oldCoord[0] != newCoord[0]){
            // x
            let x = oldCoord[0];
            while(x != newCoord[0]){
                x += step;
                emitter.value([x, oldCoord[1]]);
            }

        } else {
            // y
            let y = oldCoord[1];
            while(y != newCoord[1]){
                y += step;
                emitter.value([oldCoord[0], y]);
            }
        }

        return {dir: newDir, coord: newCoord};

    }, startVec);

});

const coordToStr = coord => coord.join(',');

function visitedMultiple(){
    const visited = new Set();
    console.log('visitedMultiple()');

    return coord => {
        const str = coordToStr(coord);
        const visitedBefore = visited.has(str);
        //console.log(visited);
        //console.log('coord', str, 'visited?', visitedBefore);
        //if(cstr)
        visited.add(str);
        //console.log(visited.size);
        return visitedBefore;
    };
}

const directions = d.directions;
//const directions = d.parseDirections('R8, R4, R4, R8'.split(','));
console.log('directions', directions.length);

travel({coord: [0, 0], dir: 'n'}, directions)
.filter(visitedMultiple())
.take(1)
.onValue(coord => {
    console.log('first visited multiple', coord);
    console.log('distance', d.taxiCabDistance([0, 0], coord));
})

