const mongoose = require('mongoose');

const prizePoolSchema = new mongoose.Schema({
    totalPool: {
        type: Number,
        required: true, 
      },
      weekNumber: {
        type: Number,
        required: true, 
      },
      distributed: {
        type: Boolean,
        default: false, 
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
});

const PrizePool = mongoose.model('PrizePool', prizePoolSchema);

module.exports = PrizePool;

