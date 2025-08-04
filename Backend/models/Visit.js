const mongoose = require('mongoose');

const visitSchema = new mongoose.Schema({
  timestamp: {
    type: Date,
    default: Date.now,
  },
  ip: String,
  userAgent: String,
});

module.exports = mongoose.model('Visit', visitSchema);
