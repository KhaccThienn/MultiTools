const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const app = express();
const cors = require('cors');
const port = 4000;

// Middleware 
app.use(express.json());
app.use(cors());

mongoose.connect('mongodb://localhost:27017/mydatabase');

// Khởi tạo User Schema
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    photoCollection: { type: [String], default: [] }, // Mảng lưu trữ các URL ảnh
});

const User = mongoose.model('User', userSchema);

// Đăng ký người dùng
app.post('/register', async(req, res) => {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully!' });
    } catch (error) {
        res.status(500).json({ error: 'User registration failed!' });
    }
});

// Đăng nhập người dùng
app.post('/login', async(req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
        return res.status(400).json({ error: 'Invalid username or password!' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ error: 'Invalid username or password!' });
    }

    const token = jwt.sign({ userId: user._id }, 'secretKey');
    res.json({ token });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});