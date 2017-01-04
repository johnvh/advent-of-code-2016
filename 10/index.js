'use strict';

const logRun = require('debug')('run');
const logMove = require('debug')('move');
const R = require('ramda');
const input = require('fs').readFileSync('./input.txt', 'utf8')
    .split('\n')
    .map(R.trim);

const groupInstructions = R.groupBy(R.pipe(
    R.split(' '),
    R.head
));

// 'bot 136 gives low to bot 28 and high to bot 158'
const parseBotInstruction = botIns => {
    const s = botIns.split(/\s+/);
    // 0  bot
    // 1  136
    // 2  gives
    // 3  low
    // 4  to
    // 5  bot
    // 6  28
    // 7  and
    // 8  high
    // 9 to
    // 10 bot
    // 11 158
    return {
        botNum: parseInt(s[1]),
        low: {to: s[5], num: parseInt(s[6])},
        high: {to: s[10], num: parseInt(s[11])},
        chips: []
    };
};

const makeBots = botInstructions => new Map(
    botInstructions.map(ins => {
        const parsedIns = parseBotInstruction(ins);
        return [parsedIns.botNum, parsedIns];
    })
);

const giveChip = (bot, chipNum) => {
    if(bot.chips.includes(chipNum)){
        throw new Error(`bot ${bot.botNum} already has chip ${chipNum}`);
    }
    bot.chips.push(chipNum);
    return bot;
};

const populate = (moves, bots) => {
    moves.forEach(move => {
        const s = move.split(/\s+/);
        const chipNum = parseInt(s[1]);
        const botNum = parseInt(s[5]);

        bots.set(botNum, giveChip(bots.get(botNum), chipNum));
    });
};

const check = (chipNums, bots) => {
    const botWithChipNums = Array.from(bots.values()).find(bot => {
        return chipNums.every(chipNum => bot.chips.includes(chipNum));
    });

    if(botWithChipNums){
        console.log('bot with', chipNums);
        console.log(botWithChipNums);
    }
    return !botWithChipNums;
};

const runProgram = instructions => {
    const {
        bot: botInstructions,
        value: moves
    } = groupInstructions(instructions);
    const bots = makeBots(botInstructions);
    let i = 0;

    populate(moves, bots);

    while(check([61, 17], bots)){
        const fullBots = Array.from(bots.values())
            .filter(bot => bot.chips.length >= 2);

        logRun('@@ run', i++);
        logMove('full:', fullBots.length);

        fullBots.forEach(bot => {
            const chips = bot.chips.sort((a, b) => a - b);
            const botLow = chips[0];
            const botHigh = chips[1];

            logMove(`bot ${bot.botNum} is full`, bot);

            bot.chips = [];

            if(bot.low.to == 'bot'){
                giveChip(bots.get(bot.low.num), botLow);
            }

            if(bot.high.to == 'bot'){
                giveChip(bots.get(bot.high.num), botHigh);
            }
        });
    }

    logRun('done', i);
};

if(require.main === module){
    //console.log('input', input.length);

    runProgram(input);
}
