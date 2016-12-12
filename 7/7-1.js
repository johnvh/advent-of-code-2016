'use strict';

const fs = require('fs');

/**
 * All regex matches against str.
 *
 * regexAllMatches(/regex/, str)
 * > [
 *   ['match', 'group' index: 20, input: 'inputstr'],
 *   ['match', 'group' index: 34, input: 'inputstr']
 * ]
 */
function regexAllMatches(re, str){
    const matches = [];
    let match;
    while((match = re.exec(str)) !== null){
        matches.push(match);
    }
    return matches;
}

function abaInverse(aba){
    const outside = aba.charAt(0);
    const inside = aba.charAt(1);
    return `${inside}${outside}${inside}`;
}

function sequenceAbas(seq){
    // have to capture w/ lookahead or regex won't match overlaps.
    // i.e. we want 'abab' to match both 'aba' and 'bab'
    const re = /([a-z1-9])(?=([a-z1-9]\1))/g
    return regexAllMatches(re, seq)
        .map(m => m[0] + m[2])
        .filter(aba => {
            return aba.charAt(0) !== aba.charAt(1);
        });
}

//console.log(abaInverse('hjh'));
//console.log(abaInverse('isi'));

//let ip = 'iungssgfnnjlgdferc[xfffplonmzjmxkinhl]dehxdielvncdawomqk[teizynepguvtgofr]fjazkxesmlwryphifh[ppjfvfefqhmuqtdp]luopramrehtriilwlou';
//console.log(regexAllMatches(/([a-z1-9])[a-z1-9]\1/g, 'lkjssslkjfsf'));
//let seq = 'lkjssslababkjfsfs';
//console.log(regexAllMatches(/([a-z1-9])(?=([a-z1-9]\1))/g, seq));
//console.log(sequenceAbas(seq));

//return;


class Ip {
    constructor(addr){
        this.addr = addr;
        this.parse();
        this.toString = () => this.addr;
        this.inspect = this.toString;
    }

    supportsTls() {
        return this.regularSequences.some(seq => this.sequenceHasAbba(seq))
        && this.hypernetSequences.every(seq => !this.sequenceHasAbba(seq));
    }

    supportsSsl() {
        return this.regularSequences.some(regSeq => {
            const abas = sequenceAbas(regSeq);

            return abas.some(aba => {
                return this.hypernetSequences.some(hnSeq => {
                    return hnSeq.includes(abaInverse(aba));
                });
            })
        });
    }

    /*
    sequenceHasAba(seq) {
        const re = /([a-z1-9])[a-z1-9]\1/g;
        const abas = regexAllMatches(re, seq);
    }
    */

    sequenceHasAbba(seq) {
        const re = /([a-z1-9])\1/g
        let repeat;

        while ((repeat = re.exec(seq)) !== null) {
            //repeats[0] 'ee'
            //repeats[1] 'e'
            //repeats.index 4
            //repeats.input 'full str'

            if(repeat.index === 0){
                continue;
            }

            let before = seq.charAt(repeat.index - 1);
            let after = seq.charAt(repeat.index + 2);

            if(before == after) {
                return true;
            }
        }

        return false;
    }

    parse() {
        const hns = this.addr.match(/\[[a-z1-9]+\]/g);

        this.hypernetSequences = hns.map(hn => {
            return hn.slice(1).slice(0, -1);
        });

        this.regularSequences = hns.reduce((result, hn) => {
            return result.replace(hn, '|');
        }, this.addr)
        .split('|');
    }
}

if(require.main === module) {
    const ips = fs.readFileSync('./ips.txt', 'utf8')
        .split('\n')
        //.slice(0, 4)
        .map(line => new Ip(line))

    console.log('ips total', ips.length);

    const supportTls = ips
        .filter(ip => ip.supportsTls());

    console.log('num tls support', supportTls.length);

    const supportSsl = ips
        .filter(ip => ip.supportsSsl());

    console.log('num ssl support', supportSsl.length);
}
