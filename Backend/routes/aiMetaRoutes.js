const express = require('express');

const { generateBlogMeta }  = require('../controllers/aiMetaController');

const router = express.Router();

router.post('/generate-meta', generateBlogMeta);

module.exports = router;