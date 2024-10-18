# MultiTools - Công cụ chỉnh sửa và thiết kế đa phương tiện.

### Các chức năng chính:

- chỉnh sửa hình ảnh
- chỉnh sửa video
- chỉnh sửa audio
- convert files
- AI gender (coming soon...)

---

## Setup project

### Yêu cầu: laptop/pc đã cài đặt nodejs

**các bước setup**

1. Clone dự án về
2. Mở dự án bằng VSCode
3. mở terminal và vào thư mục frontend, cài đặt node-modules bằng cách chạy lệnh: `npm install`
4. bước này có thể sẽ chạy ra kết quả là tìm thấy 1 lỗ hổng bảo mật, làm theo hướng dẫn để fix hoặc chạy `npm audit fix` để sửa 1 phần, hoặc `npm audit fix --force` để sửa all (recommend).
5. điều hướng sang thư mục backend, tạo môi trường python ảo bằng lệnh: `python -m venv venv`
6. kích hoạt môi trường python ảo: `venv/Scripts/activate`
7. cài đặt thư viện cần thiết từ file requirements: `pip install -r requirements.txt`
8. điều hướng tới thư mục frontend, chạy lệnh `npm run all` để khởi động localhost.
   => truy cập liên kết tương ứng để xem kết quả trên trình duyệt
