# MultiTools - Công cụ chỉnh sửa và thiết kế đa phương tiện.

### Các chức năng chính:

- chỉnh sửa hình ảnh
- chỉnh sửa video
- chỉnh sửa audio
- convert files
- AI generator (coming soon...)

---

## Setup project

### Yêu cầu:

- Thiết bị đã cài đặt nodejs, python, ffmpeg (công cụ nền tảng xử lý tệp âm thanh).
- Thiết bị đã cài đặt mongoDB với port mặc định và tạo một database trống có tên `mydatabase` (nếu chưa cài, có thể tham khảo hướng dẫn trong video này: https://www.youtube.com/watch?v=RmPp69cwNgg)
- Sử dụng VS Code để chạy dự án.

---

#### **Các bước setup**

1. Clone dự án về
2. Mở dự án bằng VSCode
3. Mở terminal và vào thư mục frontend để cài đặt các thư viện UI và phụ thuộc: `cd frontend`
4. Cài đặt node-modules bằng cách chạy lệnh: `npm install`
5. Bước này có thể sẽ chạy ra kết quả là tìm thấy 1 lỗ hổng bảo mật, nếu không thấy lỗi gì vui lòng bỏ qua bước này và chuyển tới bước 6. Nếu có thông báo lỗi, làm theo hướng dẫn để fix hoặc chạy `npm audit fix` để sửa 1 phần, hoặc `npm audit fix --force` để sửa all (recommend).
6. Điều hướng từ thu mục frontend sang thư mục backend: `cd ../backend`
7. Tạo môi trường python ảo bằng lệnh:  `python -m venv venv`
8. Kích hoạt môi trường python ảo, sau khi kích hoạt sẽ hiển thị môi trường đang sử dụng màu xanh (venv)): `venv/Scripts/activate`
9. Cài đặt các thư viện cần thiết từ file requirements: `pip install -r requirements.txt`
10. Khởi động kết nối tới mongoDB qua extension **MongoDB for VS Code**
11. Trong terminal của dự án, tiếp tục điều hướng từ thư mục backend tới thư mục frontend để chạy dự án: `cd ../frontend`
12. Chạy lệnh `npm run all` để khởi động localhost (ở đây là `http://localhost:3000`).
    => truy cập liên kết tương ứng để xem kết quả trên trình duyệt
