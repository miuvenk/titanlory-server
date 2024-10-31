//get player's weeklyEarnings, 
//%2 of totalEarnings --> totalPrize
//1. player will get 20% of the totalPrize
//2. player will get 15% of the totalPrize
//3. player will get 10% of the totalPrize
//The remaining prize must be given to the other players in the top 100 in order to the rank of the players.
//update players' money and reset weeklyEarnings
//reset players' ranks

const Player = require("../models/player");
const helpers = require('../helpers/calculateNewRanks');

async function distributePrizePool(io) {

    const players = await Player.find().sort({ rank: 1 });
    const topPlayers = await Player.find().sort({ rank: 1 }).limit(100);

    const totalEarnings = players.reduce((acc, player) => acc + player.weeklyEarnings, 0);

    if(totalEarnings !== 0){
        const totalPrize = Number((totalEarnings * 0.02).toFixed(2));

        for (let i = 0; i < 3; i++) {
            const weeklyEarnings = topPlayers[i].weeklyEarnings;
            const collectedEarning = Number((weeklyEarnings * 0.02).toFixed(2));
            
            const prizePercent = i === 0 ? 0.20 : i === 1 ? 0.15 : 0.10;
            const prizeAmount = Number((totalPrize * prizePercent).toFixed(2));

            const totalPlayerPrize = Number((prizeAmount + weeklyEarnings - collectedEarning).toFixed(2))
            await Player.findByIdAndUpdate(topPlayers[i]._id, {
                $inc: { money: totalPlayerPrize }
            });
        }
    
        const remainingPrize = Number((totalPrize - (totalPrize * 0.45)).toFixed(2));

        //distribute remaining 97 player according to their ranks
        const remainingPlayers = topPlayers.slice(3,103)
    
        //4.player --> 97x
        //5.player --> 96x
        //6.player --> 95x
        //...
        //99.player --> 2x
        //100.player --> x
    
        //total x  --> 4753x ==== remainingPrize 
        //ex -->  for player 4 --> 97 * (remainingPrize/4753) 
    
        let remainingCounter = 97
        const totalX = 4753;
    
        for (const remPlayer of remainingPlayers) {
            const playerPrize = Number((remainingCounter * (remainingPrize / totalX)).toFixed(2));
            const collectedEarning = Number((remPlayer.weeklyEarnings * 0.02).toFixed(2))
            const totalPlayerPrize = Number((playerPrize + remPlayer.weeklyEarnings - collectedEarning).toFixed(2))
            await Player.findByIdAndUpdate(remPlayer._id, { $inc: { money: totalPlayerPrize } });
            remainingCounter--;
        };
    
        await Player.updateMany({}, { $set: { weeklyEarnings: 0 } });

        await helpers.calculateNewRanks(io);
    }
}

module.exports = {
    distributePrizePool,
};