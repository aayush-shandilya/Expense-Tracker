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
router.post('/messages', chatController.sendMessage);
router.post('/send-message', chatController.sendMessage);



// Add these new routes along with your existing ones
router.post('/group', chatController.createGroupChat);
router.post('/group/:groupId/add', chatController.addGroupParticipants);
router.delete('/group/:groupId/remove/:userId',  chatController.removeGroupParticipant);
router.put('/group/:groupId', chatController.updateGroupChat);

module.exports = router;