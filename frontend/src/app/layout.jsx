// import { Poppins } from 'next/font/google';
import './globals.css';

// Sử dụng Poppins từ next/font/google
// const poppins = Poppins({
//   weight: ['400', '500', '600', '700'], // Các trọng số (weights) bạn muốn sử dụng
//   subsets: ['latin'], // Bạn có thể chọn thêm subsets nếu cần, ví dụ 'vietnamese'
// });

export const metadata = {
  title: "MultiTools | Công cụ chỉnh sửa đa năng",
  description:
    "Multitools là một nền tảng toàn diện, nơi bạn có thể tìm thấy mọi công cụ cần thiết để chỉnh sửa ảnh và video...",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={'poppins'}>
        {children}
      </body>
    </html>
  );
}
