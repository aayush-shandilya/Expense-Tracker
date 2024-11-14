// //routes/chatRoutes.js
// const express = require('express');
// const router = express.Router();
// const chatController = require('../controllers/chatController');
// const authMiddleware = require('../middleware/auth');

// router.use(authMiddleware.protect);

// router.post('/private', chatController.createPrivateChat);
// router.post('/group', chatController.createGroupChat);
// router.post('/message', chatController.sendMessage);
// router.get('/user-chats', chatController.getUserChats);
// router.get('/messages/:chatRoomId', chatController.getChatMessages);

// module.exports = router;



// backend/routes/chatRoutes.js
const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { protect } = require('../middleware/auth');

// Apply auth middleware to all routes
router.use(protect);

// Chat routes
router.post('/private', chatController.createPrivateChat);
router.get('/user-chats', chatController.getUserChats);
router.get('/messages/:chatId', chatController.getChatMessages);
router.post('/message', chatController.sendMessage);

module.exports = router;