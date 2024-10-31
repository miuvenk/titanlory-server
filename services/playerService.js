const Player = require('../models/player');
const helpers = require('../helpers/calculateNewRanks');

exports.addPlayer = async (playerData, io) => {
    const newPlayer = new Player(playerData);
    await newPlayer.save();
    await helpers.calculateNewRanks(io);
    return newPlayer;
};

exports.getPlayerById = async (playerId) => {
    return await Player.findById(playerId);
};

exports.updatePlayerMoney = async (playerName, earnedMoney, io) => {
    try {
        const player = await Player.findOne({ name: new RegExp(`^${playerName}$`, 'i') });

        if (!player) {
            return {message: `Player with name ${playerName} not found`};
        }

        player.weeklyEarnings += earnedMoney;
        //player.money += earnedMoney

        const updatedPlayer = await player.save();

        //need update all player's ranks and daily diff
        await helpers.calculateNewRanks(io);

        return updatedPlayer;
    } catch (error) {
        console.error('Error updating player:', error);
        throw error;
    }
};


