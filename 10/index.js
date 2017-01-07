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

const runProgram1 = instructions => {
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

const runProgram2 = instructions => {
    const {
        bot: botInstructions,
        value: moves
    } = groupInstructions(instructions);
    const bots = makeBots(botInstructions);
    const bins = new Map();
    const fullBots = bots => Array.from(bots.values()).filter(bot => bot.chips.length >= 2);
    let full;
    let i = 0;

    populate(moves, bots);
    full = fullBots(bots);

    while(full.length > 0){
        logRun('@@ run', i++);
        logMove('full:', fullBots.length);

        full.forEach(bot => {
            const [botLow, botHigh] = bot.chips.sort((a, b) => a - b);

            logMove(`bot ${bot.botNum} is full`, bot);

            bot.chips = [];

            if(bot.low.to == 'bot'){
                giveChip(bots.get(bot.low.num), botLow);
            }else if(bot.low.to == 'output'){
                const bin = bins.get(bot.low.num) || [];
                bin.push(botLow);
                bins.set(bot.low.num, bin);
            }

            if(bot.high.to == 'bot'){
                giveChip(bots.get(bot.high.num), botHigh);
            }else if(bot.high.to == 'output'){
                const bin = bins.get(bot.high.num) || [];
                bin.push(botHigh);
                bins.set(bot.high.num, bin);
            }
        });

        full = fullBots(bots);
    }

    logRun('done', i);

    const product = [0, 1, 2]
        .map(binNum => R.head(bins.get(binNum)))
        .reduce((result, chip) => result * chip, 1);

    console.log('product of chips from 0, 1, 2:', product);
};

if(require.main === module){
    runProgram1(input);
    runProgram2(input);
}
