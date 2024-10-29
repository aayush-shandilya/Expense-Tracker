const User = require('../models/UserModel');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
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

        // Create user
        const user = await User.create({
            name,
            email,
            password
        });

        res.status(201).json({
            success: true,
            token: generateToken(user._id),
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check for user
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({
                success: false,
                error: 'Invalid credentials'
            });
        }

        // Check password
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                error: 'Invalid credentials'
            });
        }

        res.json({
            success: true,
            token: generateToken(user._id),
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};

// @desc    Get current logged in user
// @route   GET /api/v1/auth/me
// @access  Private
exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};