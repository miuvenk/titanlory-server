const express = require('express');
const leaderboardController = require('../controllers/leaderboardController');

const router = express.Router();

router.post('/', leaderboardController.getLeaderboard); 
router.post('/distributePrizePool', leaderboardController.distributePrizePool); 


module.exports = router;
