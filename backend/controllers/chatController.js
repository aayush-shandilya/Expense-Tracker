// const ChatRoom = require('../models/ChatRoomModel');
// const Message = require('../models/MessageModel');
// const User = require('../models/UserModel');

// const chatController = {
//     // Create a private chat between two users
//     createPrivateChat: async (req, res) => {
//         try {
//             const { participantId } = req.body;
//             const userId = req.user.id;

//             // Check if chat already exists
//             const existingChat = await ChatRoom.findOne({
//                 type: 'private',
//                 participants: { $all: [userId, participantId] }
//             });

//             if (existingChat) {
//                 return res.status(200).json(existingChat);
//             }

//             const newChat = await ChatRoom.create({
//                 type: 'private',
//                 participants: [userId, participantId]
//             });

//             res.status(201).json(newChat);
//         } catch (error) {
//             res.status(500).json({ error: error.message });
//         }
//     },

//     // Create a group chat
//     createGroupChat: async (req, res) => {
//         try {
//             const { name, participants } = req.body;
//             const userId = req.user.id;

//             const newGroup = await ChatRoom.create({
//                 name,
//                 type: 'group',
//                 participants: [...participants, userId],
//                 admin: userId
//             });

//             res.status(201).json(newGroup);
//         } catch (error) {
//             res.status(500).json({ error: error.message });
//         }
//     },

//     // Send a message
//     sendMessage: async (req, res) => {
//         try {
//             const { chatRoomId, content } = req.body;
//             const userId = req.user.id;

//             const chatRoom = await ChatRoom.findById(chatRoomId);
//             if (!chatRoom) {
//                 return res.status(404).json({ error: 'Chat room not found' });
//             }

//             if (!chatRoom.participants.includes(userId)) {
//                 return res.status(403).json({ error: 'Not a participant of this chat' });
//             }

//             const message = await Message.create({
//                 chatRoom: chatRoomId,
//                 sender: userId,
//                 content,
//                 readBy: [{ user: userId }]
//             });

//             res.status(201).json(message);
//         } catch (error) {
//             res.status(500).json({ error: error.message });
//         }
//     },

//     // Get all chats for a user
//     getUserChats: async (req, res) => {
//         try {
//             const userId = req.user.id;
//             const chats = await ChatRoom.find({
//                 participants: userId
//             }).populate('participants', 'name email');

//             res.status(200).json(chats);
//         } catch (error) {
//             res.status(500).json({ error: error.message });
//         }
//     },

//     // Get messages for a specific chat
//     getChatMessages: async (req, res) => {
//         try {
//             const { chatRoomId } = req.params;
//             const userId = req.user.id;

//             const chatRoom = await ChatRoom.findById(chatRoomId);
//             if (!chatRoom) {
//                 return res.status(404).json({ error: 'Chat room not found' });
//             }

//             if (!chatRoom.participants.includes(userId)) {
//                 return res.status(403).json({ error: 'Not a participant of this chat' });
//             }

//             const messages = await Message.find({ chatRoom: chatRoomId })
//                 .populate('sender', 'name email')
//                 .sort({ createdAt: 1 });

//             res.status(200).json(messages);
//         } catch (error) {
//             res.status(500).json({ error: error.message });
//         }
//     }
// };

// module.exports = chatController;



// backend/controllers/chatController.js
const ChatRoom = require('../models/ChatRoomModel');
const Message = require('../models/MessageModel');
const User = require('../models/UserModel');

const chatController = {
    // Create or get private chat
    // createPrivateChat: async (req, res) => {
    //     try {
    //         const { participantId } = req.body;
    //         const userId = req.user.id; // This comes from your auth middleware

    //         // Validate participant exists
    //         const participant = await User.findById(participantId);
    //         if (!participant) {
    //             return res.status(404).json({
    //                 success: false,
    //                 error: 'Participant not found'
    //             });
    //         }

    //         // Check if chat already exists
    //         const existingChat = await ChatRoom.findOne({
    //             type: 'private',
    //             participants: {
    //                 $all: [userId, participantId],
    //                 $size: 2
    //             }
    //         }).populate('participants', 'name email');

    //         if (existingChat) {
    //             return res.status(200).json({
    //                 success: true,
    //                 data: existingChat
    //             });
    //         }

    //         // Create new chat room
    //         const newChat = await ChatRoom.create({
    //             type: 'private',
    //             participants: [userId, participantId],
    //             createdBy: userId
    //         });

    //         // Populate the participants information
    //         const populatedChat = await ChatRoom.findById(newChat._id)
    //             .populate('participants', 'name email');

    //         res.status(201).json({
    //             success: true,
    //             data: populatedChat
    //         });

    //     } catch (error) {
    //         console.error('Create private chat error:', error);
    //         res.status(500).json({
    //             success: false,
    //             error: 'Error creating chat room'
    //         });
    //     }
    // },

    // // Get all user's chats
    // getUserChats: async (req, res) => {
    //     try {
    //         const userId = req.user.id;

    //         const chats = await ChatRoom.find({
    //             participants: userId
    //         })
    //         .populate('participants', 'name email')
    //         .populate('lastMessage')
    //         .sort({ updatedAt: -1 });

    //         res.status(200).json({
    //             success: true,
    //             data: chats
    //         });
    //     } catch (error) {
    //         console.error('Get user chats error:', error);
    //         res.status(500).json({
    //             success: false,
    //             error: 'Error fetching chats'
    //         });
    //     }
    // },

    //backend/controller/chatController.js 
    getUserChats: async (req, res) => {
        try {
            const userId = req.user.id;

            const chats = await ChatRoom.find({
                participants: userId
            })
            .populate('participants', 'name email')
            .populate('lastMessage')
            .sort({ updatedAt: -1 });

            // Return the data in a consistent format
            res.status(200).json({
                success: true,
                data: chats // Make sure we're sending an array
            });
        } catch (error) {
            console.error('Get user chats error:', error);
            res.status(500).json({
                success: false,
                error: 'Error fetching chats'
            });
        }
    },

    createPrivateChat: async (req, res) => {
        try {
            const { participantId } = req.body;
            const userId = req.user.id;

            // Validate participant exists
            const participant = await User.findById(participantId);
            if (!participant) {
                return res.status(404).json({
                    success: false,
                    error: 'Participant not found'
                });
            }

            // Check if chat already exists
            const existingChat = await ChatRoom.findOne({
                type: 'private',
                participants: {
                    $all: [userId, participantId],
                    $size: 2
                }
            }).populate('participants', 'name email');

            if (existingChat) {
                return res.status(200).json({
                    success: true,
                    data: existingChat
                });
            }

            // Create new chat room
            const newChat = await ChatRoom.create({
                type: 'private',
                participants: [userId, participantId],
                createdBy: userId
            });

            // Populate the participants information
            const populatedChat = await ChatRoom.findById(newChat._id)
                .populate('participants', 'name email');

            res.status(201).json({
                success: true,
                data: populatedChat
            });

        } catch (error) {
            console.error('Create private chat error:', error);
            res.status(500).json({
                success: false,
                error: 'Error creating chat room'
            });
        }
    },

    // Get chat messages
    // getChatMessages: async (req, res) => {
    //     try {
    //         const { chatId } = req.params;
    //         const userId = req.user.id;

    //         // Verify user is participant
    //         const chat = await ChatRoom.findOne({
    //             _id: chatId,
    //             participants: userId
    //         });

    //         if (!chat) {
    //             return res.status(404).json({
    //                 success: false,
    //                 error: 'Chat not found or unauthorized'
    //             });
    //         }

    //         const messages = await Message.find({ chatRoom: chatId })
    //             .populate('sender', 'name email')
    //             .sort({ createdAt: 1 });

    //         res.status(200).json({
    //             success: true,
    //             data: messages
    //         });
    //     } catch (error) {
    //         console.error('Get chat messages error:', error);
    //         res.status(500).json({
    //             success: false,
    //             error: 'Error fetching messages'
    //         });
    //     }
    // },

    // In backend/controller/chatController.js
    getChatMessages: async (req, res) => {
        try {
            const { chatId } = req.params;
            const userId = req.user.id;

            // Verify user is participant
            const chat = await ChatRoom.findOne({
                _id: chatId,
                participants: userId
            });

            if (!chat) {
                return res.status(404).json({
                    success: false,
                    error: 'Chat not found or unauthorized'
                });
            }

            const messages = await Message.find({ chatRoom: chatId })
                .populate('sender', 'name email')
                .sort({ createdAt: 1 })  // Ensure messages are in chronological order
                .limit(100);  // Optional: limit the number of messages loaded

            res.status(200).json({
                success: true,
                data: messages
            });
        } catch (error) {
            console.error('Get chat messages error:', error);
            res.status(500).json({
                success: false,
                error: 'Error fetching messages'
            });
        }
    },

    // // Send message
    // sendMessage: async (req, res) => {
    //     try {
    //         const { chatRoomId, content } = req.body;
    //         const userId = req.user.id;

    //         // Verify chat room and user participation
    //         const chatRoom = await ChatRoom.findOne({
    //             _id: chatRoomId,
    //             participants: userId
    //         });

    //         if (!chatRoom) {
    //             return res.status(404).json({
    //                 success: false,
    //                 error: 'Chat room not found or unauthorized'
    //             });
    //         }

    //         // Create message
    //         const message = await Message.create({
    //             chatRoom: chatRoomId,
    //             sender: userId,
    //             content,
    //             readBy: [{ user: userId }]
    //         });

    //         // Update chat room's last message
    //         await ChatRoom.findByIdAndUpdate(chatRoomId, {
    //             lastMessage: content,
    //             lastMessageTime: new Date()
    //         });

    //         const populatedMessage = await Message.findById(message._id)
    //             .populate('sender', 'name email');

    //         res.status(201).json({
    //             success: true,
    //             data: populatedMessage
    //         });
    //     } catch (error) {
    //         console.error('Send message error:', error);
    //         res.status(500).json({
    //             success: false,
    //             error: 'Error sending message'
    //         });
    //     }
    // }

    // In backend/controller/chatController.js
//     sendMessage: async (req, res) => {
//         try {
//             const { chatRoomId, content } = req.body;
//             const userId = req.user.id;

//             // Create message with timestamp
//             const message = await Message.create({
//                 chatRoom: chatRoomId,
//                 sender: userId,
//                 content,
//                 timestamp: new Date(), // Add timestamp
//                 readBy: [{ user: userId }]
//             });

//             // Update chat room's last message
//             await ChatRoom.findByIdAndUpdate(chatRoomId, {
//                 lastMessage: message, // Store the entire message object
//                 lastMessageTime: new Date()
//             });

//             const populatedMessage = await Message.findById(message._id)
//                 .populate('sender', 'name email');

//             res.status(201).json({
//                 success: true,
//                 data: populatedMessage
//             });
//         } catch (error) {
//             console.error('Send message error:', error);
//             res.status(500).json({
//                 success: false,
//                 error: 'Error sending message'
//             });
//         }
//     }
// };

sendMessage: async (req, res) => {
    try {
        const { chatRoomId, content } = req.body;
        const userId = req.user.id; // Get from auth middleware

        // Validate input
        if (!chatRoomId || !content) {
            return res.status(400).json({
                success: false,
                error: 'ChatRoomId and content are required'
            });
        }

        // Verify chat room exists and user is participant
        const chatRoom = await ChatRoom.findOne({
            _id: chatRoomId,
            participants: userId
        });

        if (!chatRoom) {
            return res.status(404).json({
                success: false,
                error: 'Chat room not found or unauthorized'
            });
        }

        // Create message
        const newMessage = new Message({
            chatRoom: chatRoomId,
            sender: userId,
            content: content,
            readBy: [{ user: userId }]
        });

        await newMessage.save();

        // Populate sender details
        const populatedMessage = await Message.findById(newMessage._id)
            .populate('sender', 'name email');

        // Update chat room's last message
        await ChatRoom.findByIdAndUpdate(chatRoomId, {
            lastMessage: content,
            lastMessageTime: new Date()
        });

        res.status(201).json({
            success: true,
            data: populatedMessage
        });
    } catch (error) {
        console.error('Send message error:', error);
        res.status(500).json({
            success: false,
            error: 'Error sending message: ' + error.message
        });
    }
}
};

module.exports = chatController;