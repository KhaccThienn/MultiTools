import { useState, useEffect, useRef } from "react";
import Navbar from "@/components/Navbar";
import Slideshow from "@/components/SlideShow";
import "../css/app.css";
import Container from "@/components/Container";
import HowToUse from "@/components/HowToUse";
import Button from "@/components/Button";
import Footer from "@/components/Footer";
import images from "@/constants/images";
import { RxDoubleArrowUp, RxDoubleArrowDown } from "react-icons/rx";
import { RiImageEditLine } from "react-icons/ri";
import { PiVideo } from "react-icons/pi";
import { SiConvertio } from "react-icons/si";
import { PiSelectionBackgroundDuotone } from "react-icons/pi";
import { MdOutlineFilterVintage } from "react-icons/md";

export default function HomePage() {
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const contentRef = useRef(null);
  const containerRefs = useRef([]);

  containerRefs.current = [];

  const addToRefs = (el) => {
    if (el && !containerRefs.current.includes(el)) {
      containerRefs.current.push(el);
    }
  };

  // const scrollToContainer = (index) => {
  //   if (containerRefs.current[index]) {
  //     const { top } = containerRefs.current[index].getBoundingClientRect();
  //     window.scrollTo({
  //       top: window.scrollY + top,
  //       behavior: "smooth",
  //     });
  //   }
  // };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth",
    });
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

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY && showNavbar) {
        setShowNavbar(false);
      } else if (window.scrollY < lastScrollY && !showNavbar) {
        setShowNavbar(true);
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY, showNavbar]);

  return (
    <>
      <div className={`head ${showNavbar ? "show" : "hide"}`}>
        {/* */}
        <Navbar />
      </div>
      <div className="content" ref={contentRef}>
        <Slideshow />

        <div ref={addToRefs} className="tool-bar fade-in-section">
          <a href="/ImageEditorPage"></a>
          <div
            className="tool-item"
            onClick={() => (window.location.href = "/ImageEditorPage")}
          >
            <RiImageEditLine />
            Chỉnh sửa ảnh
          </div>
          <div
            className="tool-item"
            onClick={() => (window.location.href = "")}
          >
            <PiVideo />
            Chỉnh sửa video
          </div>
          <div
            className="tool-item"
            onClick={() => (window.location.href = "")}
          >
            <SiConvertio />
            Chuyển đổi định dạng
          </div>
          <div
            className="tool-item"
            onClick={() => (window.location.href = "")}
          >
            <PiSelectionBackgroundDuotone />
            Xóa nền
          </div>
          <div
            className="tool-item"
            onClick={() => (window.location.href = "")}
          >
            <MdOutlineFilterVintage />
            Thêm bộ lọc
          </div>
        </div>

        <div ref={addToRefs} className="fade-in-section">
          <Container
            image={images.container1}
            rotate={0}
            colorbg="#b5c1ff"
            onClick={() => {
              window.location.href = "/ImageEditorPage";
            }}
          >
            <div className="container-content">
              <h2>Chỉnh sửa ảnh nhanh chóng và dễ dàng</h2>
              <p>
                Cho dù bạn đang muốn cắt và thay đổi kích thước hình ảnh, chỉnh
                sửa ảnh chân dung, hay điều chỉnh màu sắc cho hình ảnh, bạn đều
                có thể thực hiện tất cả điều đó với trình chỉnh sửa ảnh trực
                tuyến MultiTools.
              </p>
            </div>
          </Container>
        </div>

        <div ref={addToRefs} className="fade-in-section">
          <Container
            image={images.container2}
            rotate={1}
            colorbg="##e2e2e2"
            onClick={() => {
              window.location.href = "/ImageEditorPage";
            }}
          >
            <div className="container-content">
              <h2>Công cụ xóa nền AI</h2>
              <p>
                Tự động xóa nền ảnh, chuyển sang trong suốt hoặc đổi nền mới.
                Giúp ảnh nổi bật trong vài giây!
              </p>
            </div>
          </Container>
        </div>

        <div ref={addToRefs} className="fade-in-section">
          <Container
            image={images.container3}
            rotate={0}
            colorbg="#fdd1ee"
            onClick={() => {}}
          >
            <div className="container-content">
              <h2>Công cụ xóa vật thể trong ảnh</h2>
              <p>
                Xóa các vật trong ảnh chưa bao giờ dễ dàng đến thế. Chỉ cần lướt
                qua các yếu tố gây mất tập trung làm hỏng bức ảnh của bạn và xem
                MultiTools ngay lập tức dọn dẹp chúng để mang lại cho bức ảnh
                diện mạo hoàn hảo. Sửa ảnh dễ chưa từng có!
              </p>
            </div>
          </Container>
        </div>

        <div ref={addToRefs} className="fade-in-section">
          <Container
            image={images.container4}
            rotate={1}
            colorbg="##e2e2e2"
            onClick={() => {

            }}
          >
            <div className="container-content">
              <h2>Công cụ chỉnh sửa và biên tập video</h2>
              <p>
                Dễ dàng tạo ra những thước phim sinh động và mượt mà với các
                chức năng và hiệu ứng đa dạng, phù hợp cho cả người mới và những
                tay lão luyện!
              </p>
            </div>
          </Container>
        </div>

        <div ref={addToRefs} className="fade-in-section">
          <Container
            image={images.container5}
            rotate={0}
            colorbg="#6EE7B7"
            onClick={() => {
              window.location.href = "/ConvertPage";
            }}
          >
            <div className="container-content">
              <h2>Trình chuyển đổi trực tuyến</h2>
              <p>
                Chuyển đổi file media từ định dạng này sang dịnh dạng khác nhanh
                chóng và dễ dàng hơn bao giờ hết.
              </p>
            </div>
          </Container>
        </div>
      </div>

      <div>
        <HowToUse />
      </div>

      <div ref={addToRefs} className="fade-in-section">
        <Footer />
      </div>

      <div className="scroll-btn scroll-top" onClick={scrollToTop}>
        <RxDoubleArrowUp />
      </div>
      <div className="scroll-btn scroll-bottom" onClick={scrollToBottom}>
        <RxDoubleArrowDown />
      </div>
    </>
  );
}
