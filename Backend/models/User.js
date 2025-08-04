const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


const sessionSchema = new mongoose.Schema({
  refreshToken: String,
  ip: String,
  userAgent: String,
  location: String,
  createdAt: { type: Date, default: Date.now },
  lastUsed: { type: Date, default: Date.now },
});

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Please provide a username'],
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6,
    select: false
  },
  sessions: [sessionSchema],
  createdAt: {
    type: Date,
    default: Date.now
  }
});



// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;