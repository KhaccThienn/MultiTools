import React, { useState } from "react";
import Image from "next/image";
import "../css/app.css";
import images from "@/constants/images";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { FaRegCopyright } from "react-icons/fa6";
import { GrLanguage } from "react-icons/gr";
import { IoIosArrowDown, IoIosArrowForward } from "react-icons/io";
import { BsPatchQuestion } from "react-icons/bs";

const Footer = () => {
  const [openQuestionIndex, setOpenQuestionIndex] = useState(null);

  const toggleAnswer = (index) => {
    if (openQuestionIndex === index) {
      setOpenQuestionIndex(null);
    } else {
      setOpenQuestionIndex(index);
    }
  };

  return (
    <footer className="footer">
      <section className="faq">
        <h2>
          <span>Câu hỏi thường gặp</span>
          <BsPatchQuestion />
        </h2>
        <div className="list-faq-question">
          {[
            {
              question: "MultiTools là gì?",
              answer:
                "MultiTools là một công cụ bao gồm nhiều chức năng như chỉnh sửa ảnh, chỉnh sửa video, chuyển đổi định dạng hình ảnh hoặc tài liệu.",
            },
            {
              question: "Công cụ này có miễn phí không?",
              answer:
                "Có, bạn hoàn toàn có thể sử dụng ứng dụng này miễn phí với đầy đủ các chức năng cơ bản.",
            },
            {
              question: "Dịch vụ này có hỗ trợ ngôn ngữ khác không?",
              answer:
                "Có, chúng tôi hỗ trợ nhiều ngôn ngữ khác nhau. Bạn có thể thay đổi bằng cách lựa chọn ngôn ngữ phù hợp ở cuối trang.",
            },
            {
              question:
                "Ngoài chỉnh sửa ảnh thì MultiTools có chức năng nào khác không?",
              answer:
                "Có, ngoài các tính năng chỉnh sửa ảnh, chúng tôi còn cung cấp các tính năng thuận tiện cho việc chuyển đổi định dạng hình ảnh hay tài liệu, ngoài ra còn có các tính năng phục vụ cho việc chỉnh sửa video.",
            },
            {
              question:
                "MultiTools có phù hợp với người mới bắt đầu không?",
              answer:
                "Tất nhiên! MultiTools được thiết kế với giao diện thân thiện với người dùng, phù hợp cả với người mới bắt đầu tiếp xúc với công việc chỉnh sửa sáng tạo, trong khi vẫn cung cấp các tính năng tiên tiến cho người dùng có kinh nghiệm hơn.",
            },
            {
              question:
                "Công cụ này có giống với các ứng dụng, phần mềm Photoshop hay không?",
              answer:
                "MultiTools giống với các phần mềm Photoshop ở điểm là chúng đều có các chức năng cơ bản phục vụ cho công việc chỉnh sửa và sáng tạo nội dung bằng hình ảnh, video. Tuy nhiên, ngoài các tính năng đó, MultiTools còn cung cấp các bộ chuyển đổi định dạng tài liệu, hình ảnh, âm thanh một cách trực quan và thuận tiện. Đặc biệt, MultiTools hoàn toàn miễn phí và không cần cài đặt, bạn có thể sử dụng ngay trên trình duyệt của mình.",
            },
            {
              question: "MultiTools có an toàn không?",
              answer:
                "Với cam kết bảo mật thông tin của người dùng, MultiTools không lưu trữ bất kỳ dữ liệu nào của người sử dụng trên hệ thống. Mọi dữ liệu chỉ tồn tại trong quá trình sử dụng và sẽ bị xóa ngay sau khi bạn đóng trình duyệt của mình.",
            },
            {
              question:
                "Tôi có thể chỉnh sửa ảnh của mình bằng cách nào trong ứng dụng này?",
              answer:
                "Bạn có thể chọn ảnh từ thư viện của mình và sử dụng các công cụ chỉnh sửa như cắt, xoay, điều chỉnh độ sáng và tương phản để chỉnh sửa ảnh theo ý muốn.",
            },
            {
              question: "Ứng dụng có hỗ trợ bộ lọc màu không?",
              answer:
                "Có, ứng dụng cung cấp nhiều bộ lọc màu khác nhau mà bạn có thể áp dụng cho ảnh của mình để tạo ra những hiệu ứng độc đáo.",
            },
            {
              question: "Tôi có thể lưu ảnh đã chỉnh sửa ở định dạng nào?",
              answer:
                "Bạn có thể lưu ảnh đã chỉnh sửa ở nhiều định dạng khác nhau như JPEG, PNG, JPG tùy theo nhu cầu sử dụng của bạn.",
            },
            {
              question: "Có thể khôi phục ảnh gốc sau khi chỉnh sửa không?",
              answer:
                "Có, ứng dụng cho phép bạn khôi phục ảnh gốc bất cứ lúc nào trước khi bạn lưu ảnh đã chỉnh sửa.",
            },
            {
              question:
                "MultiTools cung cấp những tính năng gì cho việc chỉnh sửa ảnh?",
              answer:
                "MultiTools cung cấp nhiều phương thức và phong cách chỉnh sửa ảnh đa dạng như cắt ảnh, điều chỉnh tông màu, độ sáng cho ảnh, thêm các bộ lọc màu, tách nền ảnh, ghép ảnh, thêm chữ, emoji, khung,... và nhiều tính năng khác đang chờ bạn khám phá.",
            },
          ].map((item, index) => (
            <div className="faq-item" key={index}>
              <h4
                className="faq-question"
                onClick={() => toggleAnswer(index)}
              >
                {item.question}
                {openQuestionIndex === index ? (
                  <IoIosArrowDown className="faq-icon" />
                ) : (
                  <IoIosArrowForward className="faq-icon" />
                )}
              </h4>
              {openQuestionIndex === index && (
                <p className="faq-answer">{item.answer}</p>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="footer-detail">
        <div className="footer-elements">
          <div className="links-section">
            <h3>Về chúng tôi</h3>
            <a href="">Giới thiệu</a>
            <a href="">Tin tức</a>
            <a href="">Tuyển dụng</a>
            <a href="">Đối tác</a>
          </div>
          <div className="links-section">
            <h3>Pháp lý</h3>
            <a href="">Điều khoản sử dụng</a>
            <a href="">Chính sách bảo mật</a>
            <a href="">Chính sách cookie</a>
            <a href="">Thỏa thuận cấp phép</a>
          </div>
          <div className="links-section">
            <h3>Sản phẩm</h3>
            <a href="">MultiTools Image Editor</a>
            <a href="">MultiTools Video Editor</a>
            <a href="">MultiTools Converter</a>
          </div>
          <div className="links-section">
            <h3>Trợ giúp</h3>
            <a href="">Hướng dẫn sử dụng</a>
            <a href="">Hỏi đáp</a>
            <a href="">Liên hệ với chúng tôi</a>
            <a href="">Giá cả</a>
          </div>
          <div className="links-section">
            <h3>Theo dõi chúng tôi</h3>
            <a href="">Blog</a>
            <a href="">Facebook</a>
            <a href="">Instagram</a>
            <a href="">Twitter</a>
            <a href="">Discord</a>
            <a href="">Youtube</a>
          </div>
        </div>
        <div className="footer-language">
          <div className="language-icon">
            <GrLanguage />
          </div>
          <div className="languages">
            <a href="">Tiếng Việt</a>
            <a href="">English</a>
            <a href="">Bahasa</a>
            <a href="">Español</a>
            <a href="">Français</a>
            <a href="">Indonesia</a>
            <a href="">Italiano</a>
            <a href="">Nederlands</a>
            <a href="">Polski</a>
            <a href="">Português</a>
            <a href="">Türkçe</a>
            <a href="">Русский</a>
            <a href="">日本語</a>
            <a href="">한국어</a>
            <a href="">中文</a>
          </div>
        </div>
      </section>
      <div className="footer-end">
        <div className="logo-section">
          <Image
            src={images.logo}
            alt="logo"
            width={60}
            height={60}
            className="navbar-logo"
          />
          <h1 className="tommorrow_font">MULTITOOLS</h1>
        </div>
        <div className="copyright">
          <span>MultiTools</span>
          <FaRegCopyright />
          <span>2024</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
