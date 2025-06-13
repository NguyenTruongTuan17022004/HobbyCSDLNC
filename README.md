# Ứng dụng Quản lý Sở thích Cá nhân

Ứng dụng web cho phép người dùng quản lý và theo dõi các sở thích cá nhân của mình. Được xây dựng với Node.js, Express, MongoDB và giao diện web hiện đại.

## Tính năng

- Thêm, sửa, xóa sở thích
- Phân loại sở thích theo danh mục
- Theo dõi tiến độ của từng sở thích
- Tìm kiếm và lọc sở thích
- Giao diện người dùng thân thiện và responsive
- Thông báo real-time khi thực hiện các thao tác

## Yêu cầu hệ thống

- Node.js (phiên bản 14 trở lên)
- MongoDB (phiên bản 4.4 trở lên)
- npm hoặc yarn

## Cài đặt

1. Clone repository:
```bash
git clone <repository-url>
cd hobby-manager
```

2. Cài đặt dependencies:
```bash
npm install
```

3. Tạo file .env trong thư mục gốc và cấu hình:
```
MONGODB_URI=mongodb://localhost:27017/hobbiesDB
PORT=3000
```

4. Khởi động MongoDB:
```bash
# Đảm bảo MongoDB đang chạy trên máy của bạn
```

5. Khởi động ứng dụng:
```bash
# Chế độ development
npm run dev

# Chế độ production
npm start
```

6. Truy cập ứng dụng:
Mở trình duyệt và truy cập `http://localhost:3000`

## Cấu trúc dự án

```
hobby-manager/
├── models/
│   └── Hobby.js
├── routes/
│   └── hobbies.js
├── public/
│   ├── index.html
│   ├── styles.css
│   └── app.js
├── server.js
├── package.json
└── README.md
```

## API Endpoints

- `GET /api/hobbies` - Lấy danh sách tất cả sở thích
- `POST /api/hobbies` - Thêm sở thích mới
- `PATCH /api/hobbies/:id` - Cập nhật sở thích
- `DELETE /api/hobbies/:id` - Xóa sở thích

## Công nghệ sử dụng

- Backend:
  - Node.js
  - Express.js
  - MongoDB với Mongoose
- Frontend:
  - HTML5
  - CSS3 (với CSS Variables và Flexbox/Grid)
  - JavaScript (ES6+)
  - Font Awesome cho icons
- Development:
  - Nodemon cho hot-reloading
  - dotenv cho quản lý biến môi trường

## Đóng góp

Mọi đóng góp đều được hoan nghênh! Vui lòng tạo issue hoặc pull request để đóng góp.

## Giấy phép

MIT 