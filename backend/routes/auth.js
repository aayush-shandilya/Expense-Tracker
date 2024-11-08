const express = require('express');
const router = express.Router();
const { 
    register, 
    login, 
    getMe,
    validateToken 
} = require('../controllers/auth');
const { protect } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.get('/validate-token', validateToken);

module.exports = router;