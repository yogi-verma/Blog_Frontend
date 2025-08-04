const User = require("../models/User");

// Get all sessions of logged-in user
exports.getSessions = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("sessions");
    res.json(user.sessions);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch sessions" });
  }
};

// Logout from a single session
exports.logoutSession = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ message: "Refresh token is required" });
  }

  try {
    await User.updateOne(
      { _id: req.user.id },
      { $pull: { sessions: { refreshToken } } }
    );
    res.json({ message: "Logged out from selected session" });
  } catch (err) {
    res.status(500).json({ message: "Failed to logout from session" });
  }
};

// Logout from all sessions
exports.logoutAllSessions = async (req, res) => {
  try {
    await User.updateOne(
      { _id: req.user.id },
      { $set: { sessions: [] } }
    );
    res.json({ message: "Logged out from all sessions" });
  } catch (err) {
    res.status(500).json({ message: "Failed to logout from all sessions" });
  }
};
