//controllers/chatController.js
const ChatRoom = require('../models/ChatRoomModel');
const Message = require('../models/MessageModel');
const User = require('../models/UserModel');
const redisService = require('../services/redisService');


const multer = require('multer');
const path = require('path');
const fs = require('fs');

const chatController = {
    getUserChats: async (req, res) => {
        try {
            const userId = req.user.id;

            const chats = await ChatRoom.find({
                participants: userId
            })
            .populate('participants', 'name email')
            .populate('lastMessage')
            .sort({ updatedAt: -1 });

 
            res.status(200).json({
                success: true,
                data: chats 
            });
        } catch (error) {
            console.error('Get user chats error:', error);
            res.status(500).json({
                success: false,
                error: 'Error fetching chats'
            });
        }
    },
    getChatMessages: async (req, res) => {
        try {
            const { chatId } = req.params;
            const userId = req.user.id;
    
            console.log('Getting messages for chat:', chatId, 'user:', userId);
    
            const chat = await ChatRoom.findOne({
                _id: chatId,
                participants: userId
            });
    
            if (!chat) {
                console.log('Chat not found or unauthorized');
                return res.status(404).json({
                    success: false,
                    error: 'Chat not found or unauthorized'
                });
            }
    
            const messages = await Message.find({ chatRoom: chatId })
                .populate('sender', 'name email')
                .sort({ createdAt: 1 });
    
            console.log('Found messages:', messages.length);
    
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
    }
};

const createPrivateChat = async (req, res) => {
    try {
        const { participantId } = req.body;
        const userId = req.user.id;

        // Check if participant exists
        const participant = await User.findById(participantId);
        if (!participant) {
            return res.status(404).json({
                success: false,
                error: 'Participant not found'
            });
        }
        const existingChat = await ChatRoom.findOne({
            type: 'private',
            participants: {
                $all: [userId, participantId],
                $size: 2
            }
        });

        if (existingChat) {
            return res.status(200).json({
                success: true,
                data: existingChat
            });
        }

        // Create new chat
        const newChat = await ChatRoom.create({
            type: 'private',
            participants: [userId, participantId],
            createdBy: userId
        });

        await redisService.createChatRoom(newChat._id, [userId, participantId]);

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
};


const createGroupChat = async (req, res) => {
    try {
        const { name, participantIds } = req.body;
        const userId = req.user.id;

        if (!name || !participantIds || participantIds.length < 2) {
            return res.status(400).json({
                success: false,
                error: 'Group name and at least 2 participants are required'
            });
        }

        // Add the creator to the participants if not already included
        const uniqueParticipants = [...new Set([...participantIds, userId])];

        const newGroup = await ChatRoom.create({
            type: 'group',
            name,
            participants: uniqueParticipants,
            admins: [userId], // Creator becomes the first admin
            createdBy: userId,
            lastMessage: '',
            lastMessageTime: new Date()
        });

        // Populate the participants and admins information
        const populatedGroup = await ChatRoom.findById(newGroup._id)
            .populate('participants', 'name email')
            .populate('admins', 'name email');

        res.status(201).json({
            success: true,
            data: populatedGroup
        });
    } catch (error) {
        console.error('Create group chat error:', error);
        res.status(500).json({
            success: false,
            error: 'Error creating group chat'
        });
    }
};

const addGroupParticipants = async (req, res) => {
    try {
        const { groupId } = req.params;
        const { participantIds } = req.body;
        const userId = req.user.id;

        if (!participantIds || !Array.isArray(participantIds)) {
            return res.status(400).json({
                success: false,
                error: 'Participant IDs are required and must be an array'
            });
        }

        const group = await ChatRoom.findOne({
            _id: groupId,
            type: 'group',
            admins: userId
        }).populate('participants', 'name email');

        if (!group) {
            return res.status(404).json({
                success: false,
                error: 'Group not found or unauthorized'
            });
        }

        // Verify all users exist before adding
        const users = await User.find({ _id: { $in: participantIds } });
        if (users.length !== participantIds.length) {
            return res.status(400).json({
                success: false,
                error: 'One or more users not found'
            });
        }

        // Add new participants while avoiding duplicates
        const existingIds = group.participants.map(p => p._id.toString());
        const newParticipantIds = participantIds.filter(id => !existingIds.includes(id.toString()));
        
        if (newParticipantIds.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'All users are already members of the group'
            });
        }

        group.participants = [...group.participants, ...newParticipantIds];
        await group.save();

        const updatedGroup = await ChatRoom.findById(groupId)
            .populate('participants', 'name email')
            .populate('admins', 'name email');

        res.status(200).json({
            success: true,
            data: updatedGroup
        });
    } catch (error) {
        console.error('Add participants error:', error);
        res.status(500).json({
            success: false,
            error: 'Error adding participants'
        });
    }
};

const removeGroupParticipant = async (req, res) => {
    try {
        const { groupId, userId: participantId } = req.params;
        const requesterId = req.user.id;

        const group = await ChatRoom.findOne({
            _id: groupId,
            type: 'group',
            admins: requesterId
        });

        if (!group) {
            return res.status(404).json({
                success: false,
                error: 'Group not found or unauthorized'
            });
        }

        // Remove participant
        group.participants = group.participants.filter(
            id => id.toString() !== participantId
        );

        // If participant was an admin, remove from admins too
        group.admins = group.admins.filter(
            id => id.toString() !== participantId
        );

        await group.save();

        const updatedGroup = await ChatRoom.findById(groupId)
            .populate('participants', 'name email')
            .populate('admins', 'name email');

        res.status(200).json({
            success: true,
            data: updatedGroup
        });
    } catch (error) {
        console.error('Remove participant error:', error);
        res.status(500).json({
            success: false,
            error: 'Error removing participant'
        });
    }
};

const updateGroupChat = async (req, res) => {
    try {
        const { groupId } = req.params;
        const { name } = req.body;
        const userId = req.user.id;

        const group = await ChatRoom.findOne({
            _id: groupId,
            type: 'group',
            admins: userId
        });

        if (!group) {
            return res.status(404).json({
                success: false,
                error: 'Group not found or unauthorized'
            });
        }

        if (name) {
            group.name = name;
        }

        await group.save();

        const updatedGroup = await ChatRoom.findById(groupId)
            .populate('participants', 'name email')
            .populate('admins', 'name email');

        res.status(200).json({
            success: true,
            data: updatedGroup
        });
    } catch (error) {
        console.error('Update group error:', error);
        res.status(500).json({
            success: false,
            error: 'Error updating group'
        });
    }
};

// const searchUsers = async (req, res) => {
//     try {
//         const { term } = req.query;
        
//         console.log('Search term received:', term); // Debug log

//         if (!term) {
//             console.log('No search term provided, returning empty array'); // Debug log
//             return res.json({
//                 success: true,
//                 data: []
//             });
//         }

//         const users = await User.find({
//             $and: [
//                 {
//                     $or: [
//                         { name: { $regex: term, $options: 'i' } },
//                         { email: { $regex: term, $options: 'i' } }
//                     ]
//                 },
//                 { _id: { $ne: req.user.id } }
//             ]
//         }).select('name email isOnline lastActive');

//         console.log('Found users:', users); // Debug log

//         // Ensure we're sending an array and transform the data
//         const formattedUsers = users.map(user => ({
//             _id: user._id.toString(),
//             name: user.name || 'Unknown',
//             email: user.email || '',
//             isOnline: !!user.isOnline,
//             lastActive: user.lastActive || new Date()
//         }));

//         console.log('Formatted users:', formattedUsers); // Debug log

//         res.json({
//             success: true,
//             data: formattedUsers
//         });
        
//     } catch (error) {
//         console.error('Search users error:', error);
//         res.status(500).json({ 
//             success: false,
//             error: error.message || 'Server error',
//             data: []
//         });
//     }
// };

// const searchUsers = async (req, res) => {
//     try {
//         const { term } = req.query;
        
//         console.log('Search term received:', term);

//         if (!term) {
//             console.log('No search term provided, returning empty array');
//             return res.json({
//                 success: true,
//                 data: []
//             });
//         }

//         const users = await User.find({
//             $and: [
//                 {
//                     $or: [
//                         { name: { $regex: term, $options: 'i' } },
//                         { email: { $regex: term, $options: 'i' } }
//                     ]
//                 },
//                 { _id: { $ne: req.user.id } }
//             ]
//         }).select('name email isOnline lastActive');

//         // Get online status from Redis for each user
//         const formattedUsers = await Promise.all(users.map(async user => {
//             const isOnline = await redisService.isUserOnline(user._id.toString());
            
//             return {
//                 _id: user._id.toString(),
//                 name: user.name || 'Unknown',
//                 email: user.email || '',
//                 isOnline: isOnline,
//                 lastActive: user.lastActive || new Date()
//             };
//         }));

//         console.log('Formatted users with online status:', formattedUsers);

//         res.json({
//             success: true,
//             data: formattedUsers
//         });
        
//     } catch (error) {
//         console.error('Search users error:', error);
//         res.status(500).json({ 
//             success: false,
//             error: error.message || 'Server error',
//             data: []
//         });
//     }
// };

// const searchUsers = async (req, res) => {
//     try {
//         const { term } = req.query;
        
//         console.log('Search term received:', term);

//         if (!term) {
//             console.log('No search term provided, returning empty array');
//             return res.json({
//                 success: true,
//                 data: []
//             });
//         }

//         // Change the search query to look for name or email instead of IDs
//         const users = await User.find({
//             $and: [
//                 {
//                     $or: [
//                         { name: { $regex: term, $options: 'i' } },
//                         { email: { $regex: term, $options: 'i' } }
//                     ]
//                 },
//                 { _id: { $ne: req.user.id } }
//             ]
//         }).select('name email isOnline lastActive');

//         // Get online status for each user from Redis
//         const formattedUsers = await Promise.all(users.map(async user => {
//             const isOnline = await redisService.isUserOnline(user._id.toString());
//             const lastActive = await redisService.getUserLastActive(user._id.toString());
            
//             return {
//                 _id: user._id.toString(),
//                 name: user.name || 'Unknown',
//                 email: user.email || '',
//                 isOnline: isOnline,
//                 lastActive: lastActive || user.lastActive || null
//             };
//         }));

//         console.log('Found users:', users.length);
//         console.log('Formatted users with online status:', formattedUsers);

//         res.json({
//             success: true,
//             data: formattedUsers
//         });
        
//     } catch (error) {
//         console.error('Search users error:', error);
//         res.status(500).json({ 
//             success: false,
//             error: error.message || 'Server error',
//             data: []
//         });
//     }
// };

const searchUsers = async (req, res) => {
    try {
        const { term, query } = req.query;
        console.log('Search query received:', { term, query });

        if (!term && !query) {
            return res.json({
                success: true,
                data: []
            });
        }

        let users;
        if (term && term.includes(',')) {
            // Handle ID-based search
            const userIds = term.split(',');
            users = await User.find({
                _id: { $in: userIds }
            }).select('name email isOnline lastActive');
        } else {
            // Handle text-based search
            const searchTerm = query || term;
            users = await User.find({
                $and: [
                    {
                        $or: [
                            { name: { $regex: searchTerm, $options: 'i' } },
                            { email: { $regex: searchTerm, $options: 'i' } }
                        ]
                    },
                    { _id: { $ne: req.user.id } }
                ]
            }).select('name email isOnline lastActive');
        }

        const formattedUsers = await Promise.all(users.map(async user => {
            const isOnline = await redisService.isUserOnline(user._id.toString());
            const lastActive = await redisService.getUserLastActive(user._id.toString());
            
            return {
                _id: user._id.toString(),
                name: user.name || 'Unknown',
                email: user.email || '',
                isOnline: isOnline,
                lastActive: lastActive || user.lastActive || null
            };
        }));

        console.log(`Found ${users.length} users`);

        res.json({
            success: true,
            data: formattedUsers
        });
        
    } catch (error) {
        console.error('Search users error:', error);
        res.status(500).json({ 
            success: false,
            error: error.message || 'Server error',
            data: []
        });
    }
};

// Add these utility functions for managing online status
const updateUserOnlineStatus = async (userId, isOnline) => {
    try {
        await User.findByIdAndUpdate(userId, {
            isOnline,
            lastActive: new Date()
        });
    } catch (error) {
        console.error('Error updating online status:', error);
    }
};

// Add this to your auth middleware or login handler
const handleUserLogin = async (userId) => {
    await updateUserOnlineStatus(userId, true);
};

// Add this to your logout handler
const handleUserLogout = async (userId) => {
    await updateUserOnlineStatus(userId, false);
};


const getChatById = async (req, res) => {
    try {
        const { chatId } = req.params;
        const userId = req.user.id;

        const chat = await ChatRoom.findOne({
            _id: chatId,
            participants: userId
        })
        .populate('participants', 'name email')
        .populate('admins', 'name email');

        if (!chat) {
            return res.status(404).json({
                success: false,
                error: 'Chat not found or unauthorized'
            });
        }

        res.status(200).json({
            success: true,
            data: chat
        });
    } catch (error) {
        console.error('Get chat by id error:', error);
        res.status(500).json({
            success: false,
            error: 'Error fetching chat'
        });
    }
};
// Configure multer for file upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = 'uploads/';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = [
        // Document types
        'application/pdf', 
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        // Image types
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only PDF, DOC, and image files (JPEG, PNG, GIF, WEBP) are allowed.'), false);
    }
};


const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

// const sendMessage = async (req, res) => {
//     try {
//         const { chatRoomId, content } = req.body;
//         const userId = req.user.id;
//         const files = req.files; // Array of uploaded files

//         if (!chatRoomId || !content) {
//             return res.status(400).json({
//                 success: false,
//                 error: 'ChatRoomId and content are required'
//             });
//         }

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

//         // Process file attachments if any
//         const attachments = files ? files.map(file => ({
//             fileName: file.filename,
//             originalName: file.originalname,
//             fileType: file.mimetype,
//             fileSize: file.size,
//             fileUrl: `/uploads/${file.filename}`
//         })) : [];

//         const newMessage = new Message({
//             chatRoom: chatRoomId,
//             sender: userId,
//             content: content,
//             attachments: attachments,
//             timestamp: new Date(),
//             readBy: [{ user: userId }]
//         });

//         await newMessage.save();

//         const populatedMessage = await Message.findById(newMessage._id)
//             .populate('sender', 'name email');

//         await ChatRoom.findByIdAndUpdate(chatRoomId, {
//             lastMessage: content,
//             lastMessageTime: new Date()
//         });

//         const messageToSend = {
//             ...populatedMessage.toObject(),
//             chatRoomId
//         };

//         res.status(201).json({
//             success: true,
//             data: messageToSend
//         });

//     } catch (error) {
//         console.error('Send message error:', error);
//         res.status(500).json({
//             success: false,
//             error: 'Error sending message'
//         });
//     }
// };


// const sendMessage = async (req, res) => {
//     try {
//         const { chatRoomId, content } = req.body;
//         const userId = req.user.id;
//         const files = req.files; // Array of uploaded files

//         // Input validation
//         if (!chatRoomId || !content) {
//             return res.status(400).json({
//                 success: false,
//                 error: 'ChatRoomId and content are required'
//             });
//         }

//         // Find chat room and verify participant
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

//         // Process file attachments if any
//         const attachments = files ? files.map(file => ({
//             fileName: file.filename,
//             originalName: file.originalname,
//             fileType: file.mimetype,
//             fileSize: file.size,
//             fileUrl: `/uploads/${file.filename}`
//         })) : [];

//         // Create and save new message
//         const newMessage = new Message({
//             chatRoom: chatRoomId,
//             sender: userId,
//             content: content,
//             attachments: attachments,
//             timestamp: new Date(),
//             readBy: [{ user: userId }]
//         });

//         await newMessage.save();

//         // Populate sender details
//         const populatedMessage = await Message.findById(newMessage._id)
//             .populate('sender', 'name email');

//         // Update chat room with last message
//         await ChatRoom.findByIdAndUpdate(chatRoomId, {
//             lastMessage: content,
//             lastMessageTime: new Date()
//         });

//         const messageToSend = {
//             ...populatedMessage.toObject(),
//             chatRoomId
//         };

//         // Handle real-time notifications and offline messages
//         for (const participantId of chatRoom.participants) {
//             if (participantId.toString() !== userId) {
//                 const isOnline = await redisService.isUserOnline(participantId);
                
//                 if (isOnline) {
//                     // Get socket ID and emit message for online users
//                     const socketId = await redisService.getUserSocketId(participantId);
//                     if (socketId) {
//                         req.app.io.to(socketId).emit('new_message', messageToSend);
//                     }
//                 } else {
//                     // Increment unread count for offline users
//                     await redisService.addUnreadMessage(participantId, chatRoomId);
//                 }
//             }
//         }

//         res.status(201).json({
//             success: false,
//             data: messageToSend
//         });

//     } catch (error) {
//         console.error('Send message error:', error);
//         res.status(500).json({
//             success: false,
//             error: 'Error sending message'
//         });
//     }
// };


// In your sendMessage function in chatController.js

const sendMessage = async (req, res) => {
    try {
        const { chatRoomId, content } = req.body;
        const userId = req.user.id;
        const files = req.files;

        if (!chatRoomId || !content) {
            return res.status(400).json({
                success: false,
                error: 'ChatRoomId and content are required'
            });
        }

        // Find chat room and verify participant
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

        // Process attachments
        const attachments = files ? files.map(file => ({
            fileName: file.filename,
            originalName: file.originalname,
            fileType: file.mimetype,
            fileSize: file.size,
            fileUrl: `/uploads/${file.filename}`
        })) : [];

        // Create and save message to DB
        const newMessage = new Message({
            chatRoom: chatRoomId,
            sender: userId,
            content: content,
            attachments: attachments,
            timestamp: new Date(),
            readBy: [{ user: userId }]
        });

        await newMessage.save();

        // Populate sender details
        const populatedMessage = await Message.findById(newMessage._id)
            .populate('sender', 'name email');

        // Update chat room
        await ChatRoom.findByIdAndUpdate(chatRoomId, {
            lastMessage: content,
            lastMessageTime: new Date()
        });

        const messageToSend = {
            ...populatedMessage.toObject(),
            chatRoomId
        };

        // Handle message delivery through Redis
        // For each participant except the sender
        for (const participantId of chatRoom.participants) {
            if (participantId.toString() !== userId) {
                await redisService.handleMessage(
                    messageToSend,
                    userId,
                    participantId.toString(),
                    req.app.io
                );
            }
        }

        res.status(201).json({
            success: true,
            data: messageToSend
        });

    } catch (error) {
        console.error('Send message error:', error);
        res.status(500).json({
            success: false,
            error: 'Error sending message'
        });
    }
};


const downloadFile = async (req, res) => {
    try {
        const { messageId, fileId } = req.params;
        
        const message = await Message.findById(messageId);
        if (!message) {
            return res.status(404).json({
                success: false,
                error: 'Message not found'
            });
        }

        const fileAttachment = message.attachments.find(
            attachment => attachment._id.toString() === fileId
        );

        if (!fileAttachment) {
            return res.status(404).json({
                success: false,
                error: 'File attachment not found'
            });
        }

        const filePath = path.join(__dirname, '../uploads', fileAttachment.fileName);

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({
                success: false,
                error: 'File not found on server'
            });
        }

        const stats = fs.statSync(filePath);

        // Set appropriate headers based on file type
        res.setHeader('Content-Length', stats.size);
        res.setHeader('Content-Type', fileAttachment.fileType);

        // For images, we can display them inline in the browser
        const isImage = fileAttachment.fileType.startsWith('image/');
        res.setHeader(
            'Content-Disposition',
            `${isImage ? 'inline' : 'attachment'}; filename="${fileAttachment.originalName}"`
        );

        // Stream the file
        const fileStream = fs.createReadStream(filePath);
        fileStream.pipe(res);

        fileStream.on('error', (error) => {
            console.error('File stream error:', error);
            if (!res.headersSent) {
                res.status(500).json({
                    success: false,
                    error: 'Error streaming file'
                });
            }
        });

    } catch (error) {
        console.error('Download file error:', error);
        if (!res.headersSent) {
            res.status(500).json({
                success: false,
                error: 'Error downloading file'
            });
        }
    }
};


module.exports = {
    ...chatController,
    createGroupChat,
    addGroupParticipants,
    removeGroupParticipant,
    updateGroupChat,
    searchUsers,
    getChatById,
    sendMessage: [upload.array('files', 5), sendMessage],
    downloadFile,


    createPrivateChat,
    handleUserLogin,
    handleUserLogout,
    updateUserOnlineStatus
};