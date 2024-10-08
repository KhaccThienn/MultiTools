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
    avatar: {type: String, default: ''},
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    photoCollection: { type: [String], default: [] }, // Mảng lưu trữ các URL ảnh
});

const User = mongoose.model('User', userSchema);

// Đăng ký người dùng
app.post('/register', async (req, res) => {
    const { username, email, password, avatar } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        const newUser = new User({ username, email, password: hashedPassword, avatar});
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
    const avatar = user.avatar;
    res.json({ token, avatar });
});

// Route cập nhật thông tin người dùng
app.post('/updateUserInfo', async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ error: 'Authorization token required!' });
    }

    const token = authHeader.split(' ')[1]; //Lấy token từ header
    try {
        const decodedToken = jwt.verify(token, 'secretKey'); 
        const userId = decodedToken.userId;

        const { action, oldPassword, newPassword, newEmail, newAvatar ,photoUrl } = req.body;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found!' });
        }
        console.log(action);
        switch (action) {
            case 'changePassword':
                const isMatch = await bcrypt.compare(oldPassword, user.password);
                if (!isMatch) {
                    return res.status(400).json({ error: 'Old password is incorrect!' });
                }

                const hashedPassword = await bcrypt.hash(newPassword, 10);
                user.password = hashedPassword;
                await user.save();

                res.json({ message: 'Password updated successfully!' });
                break;

            case 'updateUserInfo':
                user.email = newEmail;
                await user.save();
                res.json({ message: 'User\'s information updated successfully!' });
                break;

            case 'changeAvatar':
                try {
                    user.avatar = newAvatar;  // Cập nhật avatar
                    await user.save();        // Lưu vào cơ sở dữ liệu
                    res.json({ message: 'User\'s avatar updated successfully!' });
                } catch (error) {
                    console.error("Error while saving avatar:", error);
                    res.status(500).json({ error: 'Failed to update avatar' });
                }
                break;
            case 'addPhoto':
                user.photoCollection.push(photoUrl);
                await user.save();
                res.json({ message: 'Photo added successfully!' });
                break;

            default:
                res.status(400).json({ error: 'Invalid fuck action!' });
                break;
        }
    } catch (error) {
        res.status(401).json({ error: 'Invalid or expired token!' });
    }
});

//Route lấy thông tin tài khoản
app.get('/getUserInfo', async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Authorization token required!' });
    }
  
    const token = authHeader.split(' ')[1];
  
    try {
      // Giải mã token để lấy userId
      const decodedToken = jwt.verify(token, 'secretKey'); 
      const userId = decodedToken.userId;
      console.log(token);
      // Tìm người dùng trong database theo userId
      const user = await User.findById(userId, 'email username avatar'); // Chỉ lấy email, tên, avt
      if (!user) {
        return res.status(404).json({ error: 'User not found!' });
      }
  
      // Trả về thông tin người dùng
      res.json({
        email: user.email,
        username: user.username,
        avatar: user.avatar,
      });
    } catch (error) {
      return res.status(401).json({ error: 'Invalid or expired token!' });
    }
  });

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});