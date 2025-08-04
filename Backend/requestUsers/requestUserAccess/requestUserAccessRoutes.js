const express = require('express');
const { signup, login, getDashboard } = require('./requestUserAccessController');
const protectRoutes = require('./requestUserAccessMiddleware'); // ✅ fixed

const router = express.Router();

router.post('/request-user/signup', signup);
router.post('/request-user/login', login);
router.get('/request-user/dashboard', protectRoutes, getDashboard); // ✅ protected

module.exports = router;
