// const User = require('../models/UserModel');
// const jwt = require('jsonwebtoken');

// const generateToken = (id) => {
//     return jwt.sign({ id }, process.env.JWT_SECRET, {
//         expiresIn: '30d'
//     });
// };

// const verifyToken = (token) => {
//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         return { valid: true, id: decoded.id };
//     } catch (error) {
//         return { valid: false, error: error.message };
//     }
// };

// exports.register = async (req, res) => {
//     try {
//         const { name, email, password } = req.body;

//         // Check if user exists
//         const userExists = await User.findOne({ email });
//         if (userExists) {
//             return res.status(400).json({
//                 success: false,
//                 error: 'User already exists'
//             });
//         }

//         // Create user
//         const user = await User.create({
//             name,
//             email,
//             password
//         });

//         res.status(201).json({
//             success: true,
//             token: generateToken(user._id),
//             user: {
//                 id: user._id,
//                 name: user.name,
//                 email: user.email
//             }
//         });
//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             error: 'Server Error'
//         });
//     }
// };

// exports.login = async (req, res) => {
//     try {
//         const { email, password } = req.body;
//         const user = await User.findOne({ email }).select('+password');
//         if (!user) {
//             return res.status(401).json({
//                 success: false,
//                 error: 'Invalid credentials'
//             });
//         }

//         const isMatch = await user.matchPassword(password);
//         if (!isMatch) {
//             return res.status(401).json({
//                 success: false,
//                 error: 'Invalid credentials'
//             });
//         }

//         res.json({
//             success: true,
//             token: generateToken(user._id),
//             user: {
//                 id: user._id,
//                 name: user.name,
//                 email: user.email
//             }
//         });
//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             error: 'Server Error'
//         });
//     }
// };

// exports.getMe = async (req, res) => {
//     try {
        
//         const token = req.headers.authorization?.split(' ')[1];
        
//         if (!token) {
//             return res.status(401).json({
//                 success: false,
//                 error: 'No token provided'
//             });
//         }

//         const { valid, id, error } = verifyToken(token);
//         if (!valid) {
//             return res.status(401).json({
//                 success: false,
//                 error: 'Invalid or expired token'
//             });
//         }
//         const user = await User.findById(id);
        
//         if (!user) {
//             return res.status(401).json({
//                 success: false,
//                 error: 'User not found'
//             });
//         }

//         res.json({
//             success: true,
//             user: {
//                 id: user._id,
//                 name: user.name,
//                 email: user.email
//             }
//         });
//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             error: 'Server Error'
//         });
//     }
// };

// exports.validateToken = async (req, res) => {
//     try {
//         const token = req.headers.authorization?.split(' ')[1];
        
//         if (!token) {
//             return res.status(401).json({
//                 success: false,
//                 error: 'No token provided'
//             });
//         }

//         const { valid, error } = verifyToken(token);
        
//         if (!valid) {
//             return res.status(401).json({
//                 success: false,
//                 error: 'Invalid or expired token'
//             });
//         }

//         res.json({
//             success: true,
//             message: 'Token is valid'
//         });
//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             error: 'Server Error'
//         });
//     }
// };


// // backend/controllers/auth.js
// exports.searchUsers = async (req, res) => {
//     try {
//         const { term } = req.query;
//         const users = await User.find({
//             name: { $regex: term, $options: 'i' },
//             _id: { $ne: req.user.id }
//         }).select('name email');
//         res.json(users);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

const User = require('../models/UserModel');
const jwt = require('jsonwebtoken');
const redisService = require('../services/redisService'); // Add this import


const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

const verifyToken = (token) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return { valid: true, id: decoded.id };
    } catch (error) {
        return { valid: false, error: error.message };
    }
};

exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({
                success: false,
                error: 'User already exists'
            });
        }

        // Create user with online status
        const user = await User.create({
            name,
            email,
            password,
            isOnline: true, // Set online on registration
            lastActive: new Date()
        });

        res.status(201).json({
            success: true,
            token: generateToken(user._id),
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                isOnline: user.isOnline
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({
                success: false,
                error: 'Invalid credentials'
            });
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                error: 'Invalid credentials'
            });
        }

        // Update online status on login
        await User.findByIdAndUpdate(user._id, {
            isOnline: true,
            lastActive: new Date()
        });

        res.json({
            success: true,
            token: generateToken(user._id),
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                isOnline: true
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};

exports.logout = async (req, res) => {
    try {
        // Update user's online status to false
        await User.findByIdAndUpdate(req.user.id, {
            isOnline: false,
            lastActive: new Date()
        });

        res.json({
            success: true,
            message: 'Logged out successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};

exports.getMe = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({
                success: false,
                error: 'No token provided'
            });
        }

        const { valid, id, error } = verifyToken(token);
        if (!valid) {
            return res.status(401).json({
                success: false,
                error: 'Invalid or expired token'
            });
        }

        const user = await User.findById(id);
        
        if (!user) {
            return res.status(401).json({
                success: false,
                error: 'User not found'
            });
        }

        // Update lastActive timestamp
        await User.findByIdAndUpdate(id, {
            lastActive: new Date()
        });

        res.json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                isOnline: user.isOnline
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};

exports.validateToken = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({
                success: false,
                error: 'No token provided'
            });
        }

        const { valid, id, error } = verifyToken(token);
        
        if (!valid) {
            return res.status(401).json({
                success: false,
                error: 'Invalid or expired token'
            });
        }

        // Update lastActive timestamp if token is valid
        if (id) {
            await User.findByIdAndUpdate(id, {
                lastActive: new Date()
            });
        }

        res.json({
            success: true,
            message: 'Token is valid'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};

exports.searchUsers = async (req, res) => {
//     try {
//         const { term } = req.query;
        
//         console.log('Search term received:', term);

//         if (!term) {
//             return res.json({
//                 success: true,
//                 data: []
//             });
//         }

//         // First get users from MongoDB
//         const users = await User.find({
//             $and: [
//                 {
//                     $or: [
//                         { name: { $regex: term, $options: 'i' } },
//                         { email: { $regex: term, $options: 'i' } }
//                     ]
//                 },
//                 { _id: { $ne: req.user.id } } // Exclude current user
//             ]
//         }).select('name email isOnline lastActive');

//         console.log('Found users:', users.length);

//         // Then enrich with Redis online status
//         const formattedUsers = await Promise.all(users.map(async user => {
//             try {
//                 const isOnline = await redisService.isUserInRedis(user._id.toString());
//                 const userKey = `user:${user._id.toString()}`;
//                 const lastActive = await redisService.redis.hget(userKey, 'lastActive');
                
//                 return {
//                     _id: user._id.toString(),
//                     name: user.name || 'Unknown',
//                     email: user.email || '',
//                     isOnline: isOnline,
//                     lastActive: lastActive || user.lastActive || null
//                 };
//             } catch (error) {
//                 console.error(`Error getting status for user ${user._id}:`, error);
//                 return {
//                     _id: user._id.toString(),
//                     name: user.name || 'Unknown',
//                     email: user.email || '',
//                     isOnline: false,
//                     lastActive: user.lastActive || null
//                 };
//             }
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

    try {
        const { term } = req.query;
        
        console.log('Search term received:', term);

        if (!term) {
            return res.json({
                success: true,
                data: []
            });
        }

        // Get users from MongoDB
        const users = await User.find({
            $and: [
                {
                    $or: [
                        { name: { $regex: term, $options: 'i' } },
                        { email: { $regex: term, $options: 'i' } }
                    ]
                },
                { _id: { $ne: req.user.id } }
            ]
        }).select('name email isOnline lastActive');

        // Get bulk online status from Redis
        const userIds = users.map(user => user._id.toString());
        const onlineStatuses = await redisService.getBulkOnlineStatus(userIds);

        // Combine MongoDB data with Redis online status
        const formattedUsers = users.map(user => {
            const userId = user._id.toString();
            const onlineStatus = onlineStatuses[userId] || { 
                isOnline: false, 
                lastActive: null 
            };

            return {
                _id: userId,
                name: user.name || 'Unknown',
                email: user.email || '',
                isOnline: onlineStatus.isOnline,
                lastActive: onlineStatus.lastActive || user.lastActive || null
            };
        });

        console.log(`Found ${formattedUsers.length} users for search term: ${term}`);
        
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
// Add update online status middleware
exports.updateOnlineStatus = async (req, res, next) => {
    try {
        if (req.user && req.user.id) {
            await User.findByIdAndUpdate(req.user.id, {
                isOnline: true,
                lastActive: new Date()
            });
        }
        next();
    } catch (error) {
        console.error('Update online status error:', error);
        next();
    }
};