const express = require('express');
const playerController = require('../controllers/playerController');

const router = express.Router();

router.post('/add', playerController.addPlayer); 
router.get('/:id', playerController.getPlayerById); 
router.put('/update', playerController.updatePlayerMoney); 

module.exports = router;
