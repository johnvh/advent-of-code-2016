'use strict';
/* eslint-env mocha */

const expect = require('chai').expect;
const {RoomCode, charFrequency} = require('./');

describe('RoomCode', () => {
    it('parses', () => {
        const rc = new RoomCode('aaaaa-bbb-z-y-x-123[abxyz]');

        expect(rc.name).to.eql('aaaaa-bbb-z-y-x');
        expect(rc.sectorId).to.eql('123');
        expect(rc.checksum).to.eql('abxyz');
    });

    it('has most common chars', () => {
        let rc = new RoomCode('aaaaa-bbb-z-y-x-123[abxyz]');
        expect(rc.mostCommonChars).to.eql([
            'a', 'b', 'x', 'y', 'z'
        ]);

        rc = new RoomCode('not-a-real-room-404[oarel]');
        expect(rc.mostCommonChars).to.eql([
            'o', 'a', 'r', 'e', 'l'
        ]);
    });

    it('#isValid', () => {
        [
            'aaaaa-bbb-z-y-x-123[abxyz]',
            'a-b-c-d-e-f-g-h-987[abcde]',
            'not-a-real-room-404[oarel]',
        ].forEach(code => {
            const rc = new RoomCode(code);
            expect(rc.isValid()).to.eql(true);
        });

        const rc = new RoomCode('totally-real-room-200[decoy]');
        expect(rc.isValid()).to.eql(false);
    });
});

describe('charFrequency', () => {
    it('counts chars', () => {
        const cf = charFrequency('aaaaa-bbb-z-y-x');
        expect(cf).to.eql({
            a: 5, b: 3, x: 1, y: 1, z: 1
        });
    });
});
