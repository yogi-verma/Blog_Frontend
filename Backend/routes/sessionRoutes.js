const express = require("express");
const router = express.Router();
const {
  getSessions,
  logoutSession,
  logoutAllSessions,
} = require("../controllers/sessionController");
const { protect } = require("../middleware/authMiddleware");

// List active sessions
router.get("/", protect, getSessions);

// Logout individual session
router.post("/logout-session", protect, logoutSession);

// Logout all sessions
router.post("/logout-all", protect, logoutAllSessions);

module.exports = router;
