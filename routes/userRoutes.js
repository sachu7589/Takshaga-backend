const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

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
        res.status(200).json({
            message: 'Login successful',
            user: {
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



module.exports = router;
