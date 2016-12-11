'use strict';

const fs = require('fs');

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

//const ip = new Ip('dkodbaotlfdaphwzbcc[ldzeemqiovyqjgs]qxibabdusgaistkru[usglloxgycyynmp]aaocvclsocababbzxeg[liaacgfxytuqudp]jvvqsypuoduyhvraak');
//console.log('addr', ip.addr);
//console.log('hns:', ip.hypernetSequences);

if(require.main === module) {
    const ips = fs.readFileSync('./ips.txt', 'utf8')
        .split('\n')
        //.slice(0, 4)
        .map(line => new Ip(line))
        .filter(ip => ip.supportsTls());

    console.log('ips', ips.length);

    //ips.forEach(ip => {
        //console.log(ip);
        //console.log('tls', ip.supportsTls());
        //console.log('reg', ip.regularSequences);
        //console.log('hypernet', ip.hypernetSequences);
    //});
}
