'use strict';
/* eslint-env jest */

const {
    arrayRotate,
    rotateScreen,
    parseInstruction,
    buildScreen,
    applyRect,
    applyRotateRow
} = require('./');

describe('parser', () => {
    it('parses rect instruction', () => {
        const parsed = parseInstruction('rect 31x5');
        expect(parsed).toMatchObject({
            type: 'rect',
            width: 31,
            height: 5
        });
    });

    it('parses rotate row instruction', () => {
        const parsed = parseInstruction('rotate row y=2 by 5');
        expect(parsed).toMatchObject({
            type: 'rotateRow',
            row: 2,
            amount: 5
        });
    });

    it('parses rotate column instruction', () => {
        const parsed = parseInstruction('rotate column x=48 by 5');
        expect(parsed).toMatchObject({
            type: 'rotateCol',
            col: 48,
            amount: 5
        });
    });

});

describe('arrayRotate', () => {
    it('rotates array items', () => {
        const arr = ['a', 'b', 'c', 'd'];

        expect(arrayRotate(1, arr)).toEqual(['b', 'c', 'd', 'a']);
        expect(arrayRotate(0, arr)).toEqual(['a', 'b', 'c', 'd']);
        expect(arrayRotate(6, arr)).toEqual(['c', 'd', 'a', 'b']);

        expect(arrayRotate(-2, arr)).toEqual(['c', 'd', 'a', 'b']);
        expect(arrayRotate(-5, arr)).toEqual(['d', 'a', 'b', 'c']);
    });
});

describe('rotateScreen', () => {
    it('rotates -90', () => {
        const screen = [
            ['a0', 'a1', 'a2'],
            ['b0', 'b1', 'b2'],
            ['c0', 'c1', 'c2']
        ];

        expect(rotateScreen(screen)).toEqual([
            ['a2', 'b2', 'c2'],
            ['a1', 'b1', 'c1'],
            ['a0', 'b0', 'c0']
        ]);
    });
});

describe('applyRect', () => {
    it('draws rect', () => {
        const s = buildScreen(4, 4);
        const ins = {
            width: 2,
            height: 2
        };
        expect(applyRect(ins, s)).toEqual([
            ['#', '#', '', ''],
            ['#', '#', '', ''],
            ['', '', '', ''],
            ['', '', '', ''],
        ]);
    });
});

describe('applyRotateRow', () => {
    // rotate row y=2 by 5
    it('rotates rows', () => {
        const s = [
            ['#', '#', '', ''],
            ['#', '#', '', ''],
            ['', '', '', ''],
            ['', '', '', ''],
        ];

        expect(applyRotateRow({row: 1, amount: 1}, s)).toEqual([
            ['#', '#', '', ''],
            ['', '#', '#', ''],
            ['', '', '', ''],
            ['', '', '', ''],
        ]);

        expect(applyRotateRow({row: 0, amount: 2}, s)).toEqual([
            ['', '', '#', '#'],
            ['#', '#', '', ''],
            ['', '', '', ''],
            ['', '', '', ''],
        ]);

        expect(applyRotateRow({row: 0, amount: 3}, s)).toEqual([
            ['#', '', '', '#'],
            ['#', '#', '', ''],
            ['', '', '', ''],
            ['', '', '', ''],
        ]);
    });
});

describe('applyRotateCol', () => {
    it('rotates columns', () => {
        throw new Error('Implment me!!!');
    });
});
