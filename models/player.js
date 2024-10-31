const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  country: {
    type: String,
    required: true,
  },
  money: {
    type: Number,
    default: 0,
  },
  weeklyEarnings: {
    type: Number,
    default: 0,
  },
  rank: {
    type: Number,
    default: 1,
  },
  dailyDiff: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Player = mongoose.model('Player', playerSchema);

module.exports = Player;
