import React, { useState, useEffect } from "react";
import "../css/app.css";
import Link from "next/link";
import images from "@/constants/images";
import Image from "next/image";

const Slideshow = () => {
  const slides = [
    { image: images.banner1, title: "Slide 1", link: "/" },
    { image: images.banner2, title: "Slide 2", link: "/ImageEditorPage" },
    { image: images.banner3, title: "Slide 3", link: "/VideoEditorPage" },
    { image: images.banner4, title: "Slide 4", link: "/ConvertPage" },
    { image: images.banner5, title: "Slide 5", link: "/ImageEditorPage" },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prevSlide) =>
      prevSlide === slides.length - 1 ? 0 : prevSlide + 1
    );
  };

  const prevSlide = () => {
    setCurrentSlide((prevSlide) =>
      prevSlide === 0 ? slides.length - 1 : prevSlide - 1
    );
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [currentSlide]);

  return (
    <div className="slideshow-container">
      <button className="prev" onClick={prevSlide}>
        <i className="fas fa-chevron-left"></i>
      </button>

      <div
        className="slides-wrapper"
        style={{
          transform: `translateX(-${currentSlide * 100}%)`,
        }}
      >
        {slides.map((slide, index) => (
          <Link className="slide" href={slide.link} key={index}>
            <Image
              src={slide.image}
              alt={slide.title}
              style={{ width: "100%", objectFit: "cover", margin: "0 auto" }}
            />
            {/* <div className="caption">{slide.title}</div> */}
          </Link>
        ))}
      </div>

      <button className="next" onClick={nextSlide}>
        <i className="fas fa-chevron-right"></i>
      </button>

      <div className="dots">
        {slides.map((_, index) => (
          <span
            key={index}
            className={`dot ${currentSlide === index ? "active" : ""}`}
            onClick={() => setCurrentSlide(index)}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default Slideshow;
