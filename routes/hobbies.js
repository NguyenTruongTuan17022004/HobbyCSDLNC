const express = require('express');
const router = express.Router();
const Hobby = require('../models/Hobby');
const auth = require('../middleware/auth');

// Lấy tất cả sở thích của user hiện tại
router.get('/', auth, async (req, res) => {
    try {
        const hobbies = await Hobby.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(hobbies);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Tạo sở thích mới
router.post('/', auth, async (req, res) => {
    const hobby = new Hobby({
        name: req.body.name,
        category: req.body.category,
        description: req.body.description,
        frequency: req.body.frequency,
        progress: req.body.progress,
        notes: req.body.notes,
        user: req.user.id
    });

    try {
        const newHobby = await hobby.save();
        res.status(201).json(newHobby);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Cập nhật sở thích
router.patch('/:id', auth, async (req, res) => {
    try {
        const hobby = await Hobby.findOne({ _id: req.params.id, user: req.user.id });
        if (!hobby) return res.status(404).json({ message: 'Không tìm thấy sở thích' });

        Object.keys(req.body).forEach(key => {
            if (key !== 'user') hobby[key] = req.body[key];
        });

        const updatedHobby = await hobby.save();
        res.json(updatedHobby);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Xóa sở thích
router.delete('/:id', auth, async (req, res) => {
    try {
        const hobby = await Hobby.findOne({ _id: req.params.id, user: req.user.id });
        if (!hobby) return res.status(404).json({ message: 'Không tìm thấy sở thích' });

        await hobby.deleteOne();
        res.json({ message: 'Đã xóa sở thích' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router; 