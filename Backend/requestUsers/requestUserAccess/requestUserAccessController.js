const RequestUser = require('./RequestUserAccessModel');
const jwt = require('jsonwebtoken');

// Sign JWT
const signToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '1d'
  });
};

// Signup
exports.signup = async (req, res) => {
  try {
    const { username, password } = req.body;

    const userExists = await RequestUser.findOne({ username });
    if (userExists) {
      return res.status(400).json({ message: 'Username already taken' });
    }

    const newUser = await RequestUser.create({ username, password });
    const token = signToken(newUser._id);

    res.status(201).json({
      message: 'Signup successful',
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        createdAt: newUser.createdAt
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Signup failed', error: err.message });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await RequestUser.findOne({ username }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = signToken(user._id);

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};

// Dashboard (Protected Route)
exports.getDashboard = async (req, res) => {
  try {
    // Ensure req.user is attached by the protect middleware
    const user = await RequestUser.findById(req.user?.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      message: 'Dashboard data',
      data: {
        username: user.username,
        joinedOn: user.createdAt,
        customMessage: `Welcome back, ${user.username}!`
      }
    });
  } catch (err) {
    res.status(500).json({
      message: 'Failed to load dashboard',
      error: err.message
    });
  }
};
