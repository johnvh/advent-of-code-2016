'use strict';
/* eslint-env mocha */

const expect = require('chai').expect;
const {RoomCode, charFrequency, rot} = require('./');

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

describe('rot', () => {
    it('shifts lowercase chars', () => {
        expect(rot(1, 'a')).to.eql('b');
        expect(rot(1, 'z')).to.eql('a');
        expect(rot(2, 'z')).to.eql('b');
        expect(rot(13, 'a')).to.eql('n');
        expect(rot(13, 'n')).to.eql('a');
        expect(rot(26, 'a')).to.eql('a');
        expect(rot(27, 'a')).to.eql('b');
        expect(rot(39, 'a')).to.eql('n');
        expect(rot(130, 'a')).to.eql('a');

        expect(rot(-1, 'a')).to.eql('z');
        expect(rot(-13, 'a')).to.eql('n');
        expect(rot(-26, 'a')).to.eql('a');
        expect(rot(-27, 'a')).to.eql('z');
    });

    it('shifts uppercase chars', () => {
        expect(rot(1, 'A')).to.eql('B');
        expect(rot(1, 'Z')).to.eql('A');
        expect(rot(2, 'Z')).to.eql('B');
        expect(rot(13, 'A')).to.eql('N');
        expect(rot(13, 'N')).to.eql('A');
        expect(rot(26, 'A')).to.eql('A');
        expect(rot(27, 'A')).to.eql('B');
        expect(rot(39, 'A')).to.eql('N');
        expect(rot(130, 'A')).to.eql('A');

        expect(rot(-1, 'A')).to.eql('Z');
        expect(rot(-13, 'A')).to.eql('N');
        expect(rot(-26, 'A')).to.eql('A');
        expect(rot(-27, 'A')).to.eql('Z');
    });

    it('shifts multiple chars', () => {
        expect(rot(2, 'aBc^ y')).to.eql('cDe^ a');
    })

    it('doesnt shift non-letters', () => {
        expect(rot(32, '@')).to.eql('@');
    });
});
