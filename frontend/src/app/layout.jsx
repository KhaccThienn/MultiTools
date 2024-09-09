import Head from 'next/head';
import './globals.css';


export const metadata = {
  title: "MultiTools | Công cụ chỉnh sửa đa năng",
  description:
    "Multitools là một nền tảng toàn diện, nơi bạn có thể tìm thấy mọi công cụ cần thiết để chỉnh sửa ảnh và video...",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
      </Head>
      <body>
        {children}
      </body>
    </html>
  );
}
