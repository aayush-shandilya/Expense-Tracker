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
    try {
        const { term } = req.query;
        const users = await User.find({
            name: { $regex: term, $options: 'i' },
            _id: { $ne: req.user.id }
        }).select('name email isOnline lastActive');
        
        res.json({
            success: true,
            data: users
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            error: error.message 
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