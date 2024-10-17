import { useState, useEffect, useRef } from "react";
import "../css/app.css";
import images from "@/constants/images";
import { LiaCloudUploadAltSolid } from "react-icons/lia";
import { HiOutlineAdjustmentsHorizontal } from "react-icons/hi2";
import { LuMousePointer2, LuDownload } from "react-icons/lu";
import { PiArrowRightBold } from "react-icons/pi";
import { BsPatchQuestion } from "react-icons/bs";
import { IoIosArrowDown, IoIosArrowForward } from "react-icons/io";

const HowToUse = () => {
  const containerRefs = useRef([]);
  const [openQuestionIndex, setOpenQuestionIndex] = useState(null);

  containerRefs.current = [];

  const addToRefs = (el) => {
    if (el && !containerRefs.current.includes(el)) {
      containerRefs.current.push(el);
    }
  };

  const toggleAnswer = (index) => {
    if (openQuestionIndex === index) {
      setOpenQuestionIndex(null);
    } else {
      setOpenQuestionIndex(index);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      { threshold: 0.2 }
    );

    containerRefs.current.forEach((container) => {
      if (container) observer.observe(container);
    });

    return () => {
      containerRefs.current.forEach((container) => {
        if (container) observer.unobserve(container);
      });
    };
  }, []);

  return (
    <>
      <div className="how-to-use">
        <section
          ref={addToRefs}
          className="instruction-section fade-in-section"
        >
          <h2>
            Cách chỉnh sửa ảnh bằng trình chỉnh ảnh trực tuyến của MultiTools?
          </h2>
          Với trình sửa ảnh miễn phí của MultiTools, bạn có thể sửa ảnh trực
          tuyến như chuyên gia chỉ với 3 bước đơn giản.
          <div className="instruction-steps">
            <div className="step-card" style={{width:"32%"}}>
              <div className="step-header">
                <LiaCloudUploadAltSolid className="step-icon" />
                <h3>1. Tải ảnh lên</h3>
                Tải lên hoặc kéo thả ảnh...
              </div>
              <div className="step-detail">
                <div>
                  <h3>1. Tải ảnh lên</h3>
                  Tải lên hoặc kéo thả ảnh vào trình chỉnh sửa ảnh trực tuyến
                  của MultiTools để bắt đầu chỉnh sửa.
                </div>
                <PiArrowRightBold
                  className="step-arrow"
                  onClick={() => (window.location.href = "")}
                />
              </div>
            </div>
            <div className="step-card" style={{width:"32%"}}>
              <div className="step-header">
                <HiOutlineAdjustmentsHorizontal className="step-icon" />
                <h3>2. Sửa ảnh</h3>
                Cắt ảnh, điều chỉnh góc độ, độ sáng...
              </div>
              <div className="step-detail">
                <div>
                  <h3>2. Sửa ảnh</h3>
                  Cắt ảnh, xoay ảnh, điều chỉnh độ sáng, tương phản, màu sắc,
                  thêm hiệu ứng, văn bản, hình ảnh, v.v.
                </div>
                <PiArrowRightBold
                  className="step-arrow"
                  onClick={() => (window.location.href = "")}
                />
              </div>
            </div>
            <div className="step-card" style={{width:"32%"}}>
              <div className="step-header">
                <LuDownload className="step-icon" />
                <h3>3. Tải ảnh về</h3>
                Lưu ảnh đã sửa về máy...
              </div>
              <div className="step-detail">
                <div>
                  <h3>3. Tải ảnh về</h3>
                  Chọn định dạng và chất lượng ảnh trước khi tải về máy tính của
                  bạn.
                </div>
                <PiArrowRightBold
                  className="step-arrow"
                  onClick={() => (window.location.href = "")}
                />
              </div>
            </div>
          </div>
        </section>

        <section
          ref={addToRefs}
          className="instruction-section fade-in-section"
        >
          <h2>Làm thế nào để chỉnh sửa video?</h2>
          Dễ dàng biên tập và chỉnh sửa video trực tuyến với trình chỉnh sửa
          video của MultiTools.
          <div className="instruction-steps">
            <div className="step-card" style={{width:"32%"}}>
              <div className="step-header">
                <LiaCloudUploadAltSolid className="step-icon" />
                <h3>1. Tải video lên</h3>
                Chọn và tải video lên từ thiết bị...
              </div>
              <div className="step-detail">
                <div>
                  <h3>1. Tải video lên</h3>
                  Chọn và tải video lên từ thiết bị hoặc kéo thả trực tiếp vào
                  công cụ.
                </div>
                <PiArrowRightBold
                  className="step-arrow"
                  onClick={() => (window.location.href = "")}
                />
              </div>
            </div>
            <div className="step-card" style={{width:"32%"}}>
              <div className="step-header">
                <HiOutlineAdjustmentsHorizontal className="step-icon" />
                <h3>2. Chỉnh sửa video</h3>
                Cắt, ghép video, chọn khung hình...
              </div>
              <div className="step-detail">
                <div>
                  <h3>2. Chỉnh sửa video</h3>
                  Cắt, ghép video, chọn khung hình, sử dụng các công cụ chỉnh
                  sửa để thêm văn bản, hình ảnh, âm nhạc, hiệu ứng chuyển cảnh.
                </div>
                <PiArrowRightBold
                  className="step-arrow"
                  onClick={() => (window.location.href = "")}
                />
              </div>
            </div>
            <div className="step-card" style={{width:"32%"}}>
              <div className="step-header">
                <LuDownload className="step-icon" />
                <h3>3. Tải video về</h3>
                Chọn chất lượng và lưu video...
              </div>
              <div className="step-detail">
                <div>
                  <h3>3. Tải video về</h3>
                  Chọn chất lượng và lưu video về thiết bị của bạn.
                </div>
                <PiArrowRightBold
                  className="step-arrow"
                  onClick={() => (window.location.href = "")}
                />
              </div>
            </div>
          </div>
        </section>

        <section
          ref={addToRefs}
          className="instruction-section fade-in-section"
        >
          <h2>Các bước chuyển đổi file</h2>
          Chỉ với 3 bước đơn giản, bạn có thể chuyển đổi định dạng file một cách
          nhanh chóng và dễ dàng.
          <div className="instruction-steps">
            <div className="step-card">
              <div className="boder-top-card"></div>
              <div className="step-header">
                <LiaCloudUploadAltSolid className="step-icon" />
                <h3>1. Tải file lên</h3>
                Chọn hoặc kéo thả file...
              </div>
              <div className="step-detail">
                <div>
                  <h3>1. Tải file lên</h3>
                  Chọn hoặc kéo thả file vào trình chuyển đổi. Hỗ trợ nhiều định
                  dạng file như PDF, DOCX, PPTX, MP4, MP3...
                </div>
                <PiArrowRightBold
                  className="step-arrow"
                  onClick={() => (window.location.href = "")}
                />
              </div>
            </div>
            <div className="step-card" style={{width:"32%"}}>
              <div className="step-header">
                <LuMousePointer2 className="step-icon" />
                <h3>2. Chọn định dạng chuyển đổi</h3>
                Lựa chọn định dạng...
              </div>
              <div className="step-detail">
                <div>
                  <h3>2. Chọn định dạng chuyển đổi</h3>
                  Lựa chọn định dạng nguồn và định dạng đích muốn chuyển đổi
                  (PDF, Word, Excel, PowerPoint, video, âm thanh, v.v.)
                </div>
                <PiArrowRightBold
                  className="step-arrow"
                  onClick={() => (window.location.href = "")}
                />
              </div>
            </div>
            <div className="step-card" style={{width:"32%"}}>
              <div className="step-header">
                <LuDownload className="step-icon" />
                <h3>3. Tải file về</h3>
                Tải file đã chuyển đổi về thiết bị...
              </div>
              <div className="step-detail">
                <div>
                  <h3>3. Tải file về</h3>
                  Sau khi chuyển đổi xong, bạn có thể tải file về với định dạng
                  mong muốn.
                </div>
                <PiArrowRightBold
                  className="step-arrow"
                  onClick={() => (window.location.href = "")}
                />
              </div>
            </div>
          </div>
        </section>
      </div>

      <section ref={addToRefs} className="faq fade-in-section">
        <h2>
          Câu hỏi thường gặp
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
              question: "MultiTools có phù hợp với người mới bắt đầu không?",
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
              <h4 className="faq-question" onClick={() => toggleAnswer(index)}>
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

      <section ref={addToRefs} className="review-section fade-in-section">
        <h2>Mọi người yêu thích MultiTools</h2>
        <div className="bg-review-section">
          <div className="review-card">
            <p className="review-detail">
              "MultiTools đã giúp tôi tiết kiệm rất nhiều thời gian khi cần
              chỉnh sửa ảnh và chuyển đổi định dạng tập tin nhanh chóng. Giao
              diện dễ sử dụng, và các công cụ chỉnh sửa đều có sẵn ngay lập tức
              mà không cần tải về phần mềm phức tạp. Đây thực sự là giải pháp
              hoàn hảo cho những ai cần sự tiện lợi và hiệu quả trong công việc
              hàng ngày."
            </p>
            <p className="star-rate">★★★★★</p>
            <div className="review-author">
              <img
                src="https://i.pinimg.com/736x/bf/95/34/bf953419d76bf747cba69b55e6e03957.jpg"
                alt="Reviewer"
              />
              <div>
                <p className="author-name">Hoàng Tuấn</p>
                <p className="author-job">Lập trình viên</p>
              </div>
            </div>
          </div>
          <div className="review-card">
            <p className="review-detail">
              "Các công cụ chỉnh sửa video và ảnh của MultiTools rất mạnh mẽ,
              giúp tôi hoàn thiện dự án một cách chuyên nghiệp mà không tốn
              nhiều công sức. Tôi đặc biệt ấn tượng với khả năng chuyển đổi định
              dạng nhanh chóng, cho phép tôi làm việc với nhiều loại tệp mà
              không gặp khó khăn. Đây là công cụ lý tưởng cho dân thiết kế như
              tôi."
            </p>
            <p className="star-rate">★★★★★</p>
            <div className="review-author">
              <img
                src="https://i.pinimg.com/736x/e1/9b/f0/e19bf09954ad5231ad9a89cb8db03ec4.jpg"
                alt="Reviewer"
              />
              <div>
                <p className="author-name">Lê Kiên</p>
                <p className="author-job">Designer</p>
              </div>
            </div>
          </div>
          <div className="review-card">
            <p className="review-detail">
              "Tôi thường xuyên phải chỉnh sửa video và chuyển đổi định dạng cho
              nhiều dự án, và MultiTools đã trở thành công cụ không thể thiếu.
              Các tính năng như cắt ghép video, chỉnh màu và hiệu ứng rất dễ sử
              dụng và nhanh chóng cho kết quả chất lượng cao. Đây là lựa chọn
              tuyệt vời cho những ai cần chỉnh sửa nhanh gọn và hiệu quả."
            </p>
            <p className="star-rate">★★★★★</p>
            <div className="review-author">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQGg117hTNrhTBDkX0CTSHEnp7LRdOsrl76CQ&s"
                alt="Reviewer"
              />
              <div>
                <p className="author-name">Hoài Anh</p>
                <p className="author-job">Biên tập viên video</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HowToUse;
