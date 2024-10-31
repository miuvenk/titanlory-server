const playerService = require('../services/playerService');

// Add a new player
exports.addPlayer = async (req, res) => {
    try {
        const io = req.app.get('socketio');
        const player = await playerService.addPlayer(req.body, io); 
        res.status(201).json(player);
    } catch (error) {
        res.status(500).json({ message: 'Failed to add player' }); 
    }
};

// Get a player by ID
exports.getPlayerById = async (req, res) => {
    try {
        const player = await playerService.getPlayerById(req.params.id); 
        if (!player) return res.status(404).json({ message: 'Player not found' });
        res.status(200).json(player);
    } catch (error) {
        res.status(500).json({ message: 'Failed to get player' }); 
    }
};

// Update player money
exports.updatePlayerMoney = async (req, res) => {
    try {
        const { playerName } = req.body
        const { money } = req.body
        const io = req.app.get('socketio');
        const player = await playerService.updatePlayerMoney(playerName, money, io); 
        if (!player) return res.status(404).json({ message: 'Player not found' });
        res.status(200).json(player);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update player money' }); 
    }
};

