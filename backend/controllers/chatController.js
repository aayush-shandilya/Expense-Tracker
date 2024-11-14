const ChatRoom = require('../models/ChatRoomModel');
const Message = require('../models/MessageModel');
const User = require('../models/UserModel');

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

    createPrivateChat: async (req, res) => {
        try {
            const { participantId } = req.body;
            const userId = req.user.id;

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
            }).populate('participants', 'name email');

            if (existingChat) {
                return res.status(200).json({
                    success: true,
                    data: existingChat
                });
            }

            const newChat = await ChatRoom.create({
                type: 'private',
                participants: [userId, participantId],
                createdBy: userId
            });

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
    getChatMessages: async (req, res) => {
        try {
            const { chatId } = req.params;
            const userId = req.user.id;

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
                .sort({ createdAt: 1 }) 
                .limit(100);

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
sendMessage: async (req, res) => {
    try {
        const { chatRoomId, content } = req.body;
        const userId = req.user.id;

        if (!chatRoomId || !content) {
            return res.status(400).json({
                success: false,
                error: 'ChatRoomId and content are required'
            });
        }

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

        const newMessage = new Message({
            chatRoom: chatRoomId,
            sender: userId,
            content: content,
            timestamp: new Date(),
            readBy: [{ user: userId }]
        });

        await newMessage.save();

        const populatedMessage = await Message.findById(newMessage._id)
            .populate('sender', 'name email');

        await ChatRoom.findByIdAndUpdate(chatRoomId, {
            lastMessage: content,
            lastMessageTime: new Date()
        });

        const messageToSend = {
            ...populatedMessage.toObject(),
            chatRoomId
        };

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
    },

//     createGroupChat : async (req, res) => {
//     try {
//         const { name, participantIds } = req.body;
//         const userId = req.user.id;

//         if (!name || !participantIds || !Array.isArray(participantIds)) {
//             return res.status(400).json({
//                 success: false,
//                 error: 'Name and participant list required'
//             });
//         }

//         // Add creator to participants and admins
//         const uniqueParticipants = [...new Set([...participantIds, userId])];
        
//         const newGroup = await ChatRoom.create({
//             type: 'group',
//             name,
//             participants: uniqueParticipants,
//             admins: [userId],
//             createdBy: userId
//         });

//         const populatedGroup = await ChatRoom.findById(newGroup._id)
//             .populate('participants', 'name email')
//             .populate('admins', 'name email');

//         res.status(201).json({
//             success: true,
//             data: populatedGroup
//         });
//     } catch (error) {
//         console.error('Create group chat error:', error);
//         res.status(500).json({
//             success: false,
//             error: 'Error creating group chat'
//         });
//     }
// },

// addGroupParticipants : async (req, res) => {
//     try {
//         const { chatId, participantIds } = req.body;
//         const userId = req.user.id;

//         const chat = await ChatRoom.findOne({
//             _id: chatId,
//             type: 'group',
//             admins: userId
//         });

//         if (!chat) {
//             return res.status(404).json({
//                 success: false,
//                 error: 'Group not found or unauthorized'
//             });
//         }

//         chat.participants = [...new Set([...chat.participants, ...participantIds])];
//         await chat.save();

//         const populatedChat = await ChatRoom.findById(chat._id)
//             .populate('participants', 'name email')
//             .populate('admins', 'name email');

//         res.status(200).json({
//             success: true,
//             data: populatedChat
//         });
//     } catch (error) {
//         console.error('Add participants error:', error);
//         res.status(500).json({
//             success: false,
//             error: 'Error adding participants'
//         });
//     }
// }
};

// module.exports = chatController;

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

        // Add new participants while avoiding duplicates
        group.participants = [...new Set([...group.participants, ...participantIds])];
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

// Add these methods to the exports
module.exports = {
    ...chatController, // spread existing methods
    createGroupChat,
    addGroupParticipants,
    removeGroupParticipant,
    updateGroupChat
};