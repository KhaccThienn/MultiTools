// pages/api/convert.js

import nextConnect from 'next-connect';
import multer from 'multer';
import ffmpeg from 'fluent-ffmpeg';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';

// Sử dụng Multer để xử lý multipart/form-data
const upload = multer({
  storage: multer.diskStorage({
    destination: './public/uploads', // Thư mục lưu tệp tải lên
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
  }),
});

// Biến middleware để sử dụng với nextConnect
const uploadMiddleware = upload.single('file');

const handler = nextConnect();

// Sử dụng middleware upload
handler.use(uploadMiddleware);

handler.post(async (req, res) => {
  const { format } = req.body;
  const file = req.file;

  if (!file) {
    return res.status(400).json({ error: 'Không tìm thấy tệp để chuyển đổi.' });
  }

  // Xác định đường dẫn tệp nguồn và tệp đích
  const inputPath = path.join(process.cwd(), 'public', 'uploads', file.filename);
  const outputFilename = `${path.parse(file.filename).name}.${format}`;
  const outputPath = path.join(process.cwd(), 'public', 'uploads', outputFilename);

  try {
    // Sử dụng Fluent-FFmpeg để chuyển đổi tệp
    await new Promise((resolve, reject) => {
      ffmpeg(inputPath)
        .toFormat(format)
        .on('end', resolve)
        .on('error', reject)
        .save(outputPath);
    });

    // Đọc tệp đã chuyển đổi
    const fileBuffer = fs.readFileSync(outputPath);

    // Đặt header để tải xuống tệp
    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename=${outputFilename}`);

    // Gửi tệp cho client
    res.send(fileBuffer);

    // Tùy chọn: Xóa tệp gốc và tệp đã chuyển đổi sau khi hoàn thành
    fs.unlinkSync(inputPath);
    fs.unlinkSync(outputPath);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Đã xảy ra lỗi trong quá trình chuyển đổi.' });
  }
});

// Đặt cấu hình API route để không sử dụng body parser mặc định
export const config = {
  api: {
    bodyParser: false,
  },
};

export default handler;
