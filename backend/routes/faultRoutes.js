const express = require('express');
const router = express.Router();
const { createFault, getFaults } = require('../controllers/faultController');
const { verifyToken } = require('../middleware/auth');

router.post('/', verifyToken, createFault);
router.get('/', verifyToken, getFaults);

module.exports = router;
