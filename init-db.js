const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/hobby-manager', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const hobbySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  category: { type: String, required: true, enum: ['Thể thao', 'Nghệ thuật', 'Âm nhạc', 'Đọc sách', 'Du lịch', 'Nấu ăn', 'Khác'] },
  description: { type: String, required: true },
  startDate: { type: Date, default: Date.now },
  frequency: { type: String, required: true, enum: ['Hàng ngày', 'Hàng tuần', 'Hàng tháng', 'Thỉnh thoảng'] },
  progress: { type: Number, min: 0, max: 100, default: 0 },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const Hobby = mongoose.model('Hobby', hobbySchema);

async function createSampleHobbies() {
  await Hobby.insertMany([
    {
      name: 'Đọc sách',
      category: 'Đọc sách',
      description: 'Đọc sách phát triển bản thân',
      frequency: 'Hàng ngày',
      progress: 10,
      notes: 'Đọc mỗi tối trước khi ngủ'
    },
    {
      name: 'Chạy bộ',
      category: 'Thể thao',
      description: 'Chạy bộ buổi sáng để nâng cao sức khỏe',
      frequency: 'Hàng ngày',
      progress: 30,
      notes: 'Chạy 3km mỗi sáng'
    },
    {
      name: 'Vẽ tranh',
      category: 'Nghệ thuật',
      description: 'Vẽ tranh phong cảnh bằng màu nước',
      frequency: 'Hàng tuần',
      progress: 50,
      notes: 'Đang học kỹ thuật vẽ mới'
    },
    {
      name: 'Chơi guitar',
      category: 'Âm nhạc',
      description: 'Tập luyện guitar mỗi ngày',
      frequency: 'Hàng ngày',
      progress: 70,
      notes: 'Đã thuộc 5 bài cơ bản'
    },
    {
      name: 'Nấu ăn',
      category: 'Nấu ăn',
      description: 'Thử nghiệm các món ăn mới vào cuối tuần',
      frequency: 'Hàng tuần',
      progress: 20,
      notes: 'Đã thử 3 món mới'
    },
    {
      name: 'Du lịch',
      category: 'Du lịch',
      description: 'Khám phá các địa điểm mới mỗi tháng',
      frequency: 'Hàng tháng',
      progress: 40,
      notes: 'Đã đi 2 nơi trong năm nay'
    },
    {
      name: 'Bơi lội',
      category: 'Thể thao',
      description: 'Bơi lội để tăng cường sức khỏe',
      frequency: 'Hàng tuần',
      progress: 60,
      notes: 'Bơi 2 lần/tuần'
    },
    {
      name: 'Chụp ảnh',
      category: 'Nghệ thuật',
      description: 'Chụp ảnh phong cảnh và chân dung',
      frequency: 'Thỉnh thoảng',
      progress: 15,
      notes: 'Đang học chỉnh sửa ảnh'
    },
    {
      name: 'Học ngoại ngữ',
      category: 'Khác',
      description: 'Học tiếng Anh giao tiếp',
      frequency: 'Hàng ngày',
      progress: 80,
      notes: 'Đã hoàn thành 2 khóa học online'
    },
    {
      name: 'Làm vườn',
      category: 'Khác',
      description: 'Trồng và chăm sóc cây cảnh tại nhà',
      frequency: 'Hàng tuần',
      progress: 25,
      notes: 'Cây phát triển tốt'
    }
  ]);
  console.log('Đã thêm 10 sở thích mẫu vào database!');
  mongoose.disconnect();
}

createSampleHobbies(); 