const leaderboardService = require('../services/leaderboardService');

exports.getLeaderboard = async (req, res) => {
    try {
        const { playerName } = req.body
        const io = req.app.get('socketio');
        const leaderboard = await leaderboardService.getLeaderboard(playerName, io); 
        if (!leaderboard) return res.status(404).json({ message: 'Leaderboard not found' });
        res.status(200).json(leaderboard);
    } catch (error) {
        res.status(500).json({ message: 'Failed to get leaderboard' }); 
    }
}

exports.distributePrizePool = async (req, res) => {
    try {
        const io = req.app.get('socketio');
        const leaderboard = await leaderboardService.distributePrizePool(io); 
        if (!leaderboard) return res.status(404).json({ message: 'Prizes are distributed!' });
        res.status(200).json(player);
    } catch (error) {
        res.status(500).json({ message: 'Failed to distribute prize pool' }); 
    }
};