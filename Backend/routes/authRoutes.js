const express = require('express');
const router = express.Router();
const {
  signup,
  login,
  getDashboard,
  logout,
  updatePassword,
  deleteAccount,
  verifyAuth
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/signup', signup);
router.post('/login', login);
router.get('/dashboard', protect, getDashboard);
router.get('/logout', protect, logout);
router.put('/update-password', protect, updatePassword);
router.delete('/delete-account', protect, deleteAccount);
router.get('/verify-auth', protect, verifyAuth);

module.exports = router;