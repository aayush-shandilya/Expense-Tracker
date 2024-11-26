// const mongoose = require('mongoose');
// const messageSchema = new mongoose.Schema({
//     chatRoom: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'ChatRoom',
//         required: true
//     },
//     sender: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'User',
//         required: true
//     },
//     content: {
//         type: String,
//         required: true
//     },
//     attachments: [{
//         fileName: String,
//         originalName: String,
//         fileType: String,
//         fileSize: Number,
//         fileUrl: String
//     }],
//     timestamp: {
//         type: Date,
//         default: Date.now
//     },
//     readBy: [{
//         user: {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: 'User'
//         },
//         readAt: {
//             type: Date,
//             default: Date.now
//         }
//     }]
// }, {
//     timestamps: true
// });

// module.exports = mongoose.model('Message', messageSchema);


// models/MessageModel.js
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    chatRoom: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ChatRoom',
        required: true
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        required: true
    },
    messageType: {
        type: String,
        enum: ['regular', 'customer_service', 'bot_response'],
        default: 'regular'
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    readBy: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        readAt: {
            type: Date,
            default: Date.now
        }
    }],
    attachments: [{
        fileName: String,
        originalName: String,
        fileType: String,
        fileSize: Number,
        fileUrl: String
    }]
}, {
    timestamps: true
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;