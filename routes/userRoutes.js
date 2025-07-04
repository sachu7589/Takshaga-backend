const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const { authenticateToken } = require('../middleware/auth');

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// http://localhost:3000/api/users/register
router.post('/register', async (req, res) => {
    try {
        const { name, email, phone, password, role } = req.body;
        let image = '';

        // Validate required fields
        if (!name || !email || !phone || !password) {
            return res.status(400).json({ 
                message: 'Please provide all required fields: name, email, phone, and password' 
            });
        }

        // Validate password length
        if (password.length < 6) {
            return res.status(400).json({ 
                message: 'Password must be at least 6 characters long' 
            });
        }

        // Handle file upload if image is provided
        if (req.files && req.files.image) {
            const imageFile = req.files.image;
            const fileExt = path.extname(imageFile.name);
            const fileName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${fileExt}`;
            const filePath = path.join(uploadDir, fileName);

            await imageFile.mv(filePath);
            image = `/uploads/${fileName}`;
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const user = new User({
            name,
            email,
            phone,
            password: hashedPassword,
            image,
            role: role || 'employee' // Default to employee if role not specified
        });

        await user.save();

        res.status(201).json({
            message: 'User registered successfully',
            user: {
                name: user.name,
                email: user.email,
                phone: user.phone,
                image: user.image,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ 
            message: 'Error registering user',
            error: error.message 
        });
    }
});


// http://localhost:3000/api/users/login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        // Generate JWT token
        const token = jwt.sign(
            { _id: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET || 'fallback_jwt_secret_for_development',
            { expiresIn: '7d' }
        );
        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                image: user.image,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            message: 'Error logging in',
            error: error.message
        });
    }
});

// http://localhost:3000/api/users/me - Token verification endpoint
router.get('/me', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        res.status(200).json({
            message: 'Token verified successfully',
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                image: user.image,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Token verification error:', error);
        res.status(500).json({
            message: 'Error verifying token',
            error: error.message
        });
    }
});

// http://localhost:3000/api/users/:id
router.get('/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        
        // Check if ID is valid
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid user ID format' });
        }
        
        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        res.status(200).json({
            message: 'User details retrieved successfully',
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                image: user.image,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Error fetching user details:', error);
        res.status(500).json({
            message: 'Error retrieving user details',
            error: error.message
        });
    }
});

// http://localhost:3000/api/users/logout
router.post('/logout', authenticateToken, async (req, res) => {
    try {
        // You can implement token blacklisting here if needed
        // For now, we'll just return success since the frontend handles token removal
        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({
            message: 'Error during logout',
            error: error.message
        });
    }
});

module.exports = router;
