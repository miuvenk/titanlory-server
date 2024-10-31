const Player = require('../models/player');
const redisClient = require('../redis/redisClient')
const cron = require('../cron/distributePrizePoolCron')

exports.getLeaderboard = async (playerName, io) => {

    //if playerName send in body
    //get first 100 players (according their rank), 
    //the player that is searched, 
    //3 players above and 2 players below the searched player
    //else only return first 100 player(according their rank)

    const cacheKey = playerName ? `leaderboard:${playerName}` : 'leaderboard:top100';

    try {

        const cachedData = await redisClient.get(cacheKey);
        if (cachedData) {
            return JSON.parse(cachedData);
        }

        const topPlayers = await Player.find()
            .sort({ rank: 1 })
            .limit(100);

        const player = playerName ? (await Player.findOne({ name: new RegExp(`^${playerName}$`, 'i') })) : null;

        if (playerName && !player) {
            const result = {
                topPlayers: topPlayers, 
                surroundingPlayers: [], 
                searchingPlayer: player, 
                message: 'Player not found!' 
            }
            await redisClient.setEx(cacheKey, 300, JSON.stringify(result));
            io.emit('leaderboardUpdated', result);
            return result; 
        }

        if (!player || player.rank <= 100) {
            const result = {
                topPlayers: topPlayers, surroundingPlayers: [], searchingPlayer: player
            }
            await redisClient.setEx(cacheKey, 300, JSON.stringify(result));
            io.emit('leaderboardUpdated', result);
            return result;
        }

        const playerRank = player.rank;

        const surroundingPlayers = await Player.find({
            $or: [
                { rank: { $gte: Math.max(1, playerRank - 3), $lt: playerRank } }, // above 3
                { _id: player._id }, // player
                { rank: { $gt: playerRank, $lt: playerRank + 3 } }, // below 2
            ]
        }).sort({ rank: 1 });


        //remove duplicated players
        const uniqueSurroundingPlayers = surroundingPlayers.filter(sp =>
            !topPlayers.some(tp => tp._id.equals(sp._id))
        );

        const result = {
            topPlayers: topPlayers,
            surroundingPlayers: uniqueSurroundingPlayers,
            searchingPlayer: player
        }

        await redisClient.setEx(cacheKey, 300, JSON.stringify(result));
        io.emit('leaderboardUpdated', result);
        return result;

    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        throw error;
    }
}

exports.distributePrizePool = async (io) => {
    try {
         await cron.distributePrizePool(io);
    } catch (error) {
        console.error('Error distributing prizes:', error);
        throw error;
    }
}