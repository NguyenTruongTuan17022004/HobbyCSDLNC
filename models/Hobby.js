const mongoose = require('mongoose');

const hobbySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        required: true,
        enum: ['Thể thao', 'Nghệ thuật', 'Âm nhạc', 'Đọc sách', 'Du lịch', 'Nấu ăn', 'Khác']
    },
    description: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        default: Date.now
    },
    frequency: {
        type: String,
        required: true,
        enum: ['Hàng ngày', 'Hàng tuần', 'Hàng tháng', 'Thỉnh thoảng']
    },
    progress: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
    },
    notes: {
        type: String
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Hobby', hobbySchema); 