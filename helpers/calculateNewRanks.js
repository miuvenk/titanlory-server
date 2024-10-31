const Player = require('../models/player')
const redisClient = require('../redis/redisClient')

async function calculateNewRanks(io) {
    try {
        //calculate new ranks!
        //ALSO NEED CALCULATE ALL PLAYER'S DAILY DIFF HERE!!!

        const cacheKey = 'leaderboard:top100';

        const players = await Player.find().sort({ weeklyEarnings: -1, money: -1, name:1 });

        let newRank = 1; 

        for (const player of players) {
            const previousRank = player.rank; 

            const dailyDiff = previousRank ? previousRank - newRank : 0; 

            await Player.findByIdAndUpdate(player._id, {
                rank: newRank,
                dailyDiff: dailyDiff
            });

            newRank++;
        }
        
        //redis update HERE, also update io!!!!!

        const topPlayers = await Player.find()
                .sort({ rank: 1 }) 
                .limit(100);

        const result = {
            topPlayers: topPlayers, surroundingPlayers: [], searchingPlayer: null
        }            
        await redisClient.setEx(cacheKey, 300, JSON.stringify(result)); 
        io.emit('leaderboardUpdated', result); 

        return players;
    } catch (error) {
        console.error('Error calculating new ranks and daily diffs:', error);
        throw error;
    }
}

module.exports = {
    calculateNewRanks,
};
