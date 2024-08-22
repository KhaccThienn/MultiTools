import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "MultiTools | Công cụ chỉnh sửa đa năng",
  description:
    "Multitools là một nền tảng toàn diện, nơi bạn có thể tìm thấy mọi công cụ cần thiết để chỉnh sửa ảnh và video. Với giao diện thân thiện, dễ sử dụng, Multitools giúp bạn thực hiện các tác vụ từ cơ bản đến nâng cao một cách nhanh chóng và hiệu quả. Từ việc cắt, ghép, xoay, đến thay đổi định dạng, và áp dụng các bộ lọc sáng tạo, tất cả đều có sẵn chỉ với vài cú nhấp chuột. Multitools không chỉ đơn thuần là một bộ công cụ trực tuyến, mà còn là nơi người dùng có thể khám phá, thử nghiệm và phát huy khả năng sáng tạo của mình. Cho dù bạn là một người mới bắt đầu hay một chuyên gia, Multitools luôn có giải pháp phù hợp để biến ý tưởng của bạn thành hiện thực. Hãy bắt đầu chuyến hành trình sáng tạo của bạn cùng Multitools – công cụ chỉnh sửa ảnh và video đa năng, mang lại sự chuyên nghiệp và đơn giản trong từng thao tác.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
