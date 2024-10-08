import { useState, useEffect, useRef } from "react";
import Navbar from "@/components/Navbar";
import Slideshow from "@/components/SlideShow";
import "../css/app.css";
import Container from "@/components/Container";
import Button from "@/components/Button";
import Footer from "@/components/Footer";
import { RxDoubleArrowUp, RxDoubleArrowDown } from "react-icons/rx";

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
  //     containerRefs.current[index].scrollIntoView({ behavior: "smooth" });
  //   }
  // };

  const scrollToContainer = (index) => {
    if (containerRefs.current[index]) {
      const { top } = containerRefs.current[index].getBoundingClientRect();
      window.scrollTo({
        top: window.scrollY + top,
        behavior: "smooth",
      });
    }
  };

  const scrollToTop = () => {
    contentRef.current.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth",
    });
  };

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
        <Navbar scrollToContainer={scrollToContainer} />
      </div>
      <div className="content" ref={contentRef}>
        <Slideshow />
        {/* <Container
          ref={addToRefs}
          image="https://via.placeholder.com/500x500"
          rotate={0}
          colorbg="#6EE7B7"
          onClick={() => {
            window.location.href = "/ImageEditorPage";
          }}
        /> */}
        <Container
          ref={addToRefs}
          image="https://via.placeholder.com/500x500"
          rotate={0}
          colorbg="#6EE7B7"
          onClick={() => {
            window.location.href = "/ImageEditorPage";
          }}
          style={{ height: "500px" }} // Thêm chiều cao tạm thời
        />

        <Container
          ref={addToRefs}
          image="https://via.placeholder.com/500x500"
          rotate={1}
          colorbg="#fff"
          onClick={() => {
            window.location.href = "/ImageEditorPage";
          }}
        />
        <Container
          ref={addToRefs}
          image="https://via.placeholder.com/500x500"
          rotate={0}
          colorbg="#FCA5A5"
          onClick={() => {}}
        />
        <Container
          ref={addToRefs}
          image="https://via.placeholder.com/500x500"
          rotate={1}
          colorbg="#fff"
          onClick={() => {}}
        />
        <Container
          ref={addToRefs}
          image="https://via.placeholder.com/500x500"
          rotate={0}
          colorbg="#67E8F9"
          onClick={() => {}}
        />
        <Container
          ref={addToRefs}
          image="https://via.placeholder.com/500x500"
          rotate={1}
          colorbg="#fff"
          onClick={() => {}}
        />
        <div
          style={{
            height: "200px",
            backgroundColor: "#5EEAD4",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Button label="XEM CHI TIẾT" onClick={() => {}} />
        </div>
        <div style={{ height: "20px", backgroundColor: "#D9D9D9" }}></div>
      </div>
      <Footer />

      <div className="scroll-btn scroll-top" onClick={scrollToTop}>
        <RxDoubleArrowUp />
      </div>
      <div className="scroll-btn scroll-bottom" onClick={scrollToBottom}>
        <RxDoubleArrowDown />
      </div>
    </>
  );
}
