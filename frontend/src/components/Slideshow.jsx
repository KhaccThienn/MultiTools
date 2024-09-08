import React, { useState, useEffect } from 'react';

const Slideshow = ({ slides }) => {
  const [currentSlide, setCurrentSlide] = useState(0); // Quản lý trạng thái slide hiện tại

  // Chuyển sang slide tiếp theo
  const nextSlide = () => {
    setCurrentSlide((prevSlide) =>
      prevSlide === slides.length - 1 ? 0 : prevSlide + 1
    );
  };

  // Quay về slide trước đó
  const prevSlide = () => {
    setCurrentSlide((prevSlide) =>
      prevSlide === 0 ? slides.length - 1 : prevSlide - 1
    );
  };

  // Tự động chuyển slide sau một khoảng thời gian (optional)
  useEffect(() => {
    const interval = setInterval(nextSlide, 5000); // Tự động chuyển sau 5 giây
    return () => clearInterval(interval); // Xóa interval khi component unmount
  }, [currentSlide]);

  return (
    <div className="slideshow-container">
      <button className="prev" onClick={prevSlide}>
        ❮
      </button>
      
      {/* Render slide hiện tại */}
      <div className="slide">
        <img src={slides[currentSlide].image} alt={slides[currentSlide].title} />
        <div className="caption">{slides[currentSlide].title}</div>
      </div>

      <button className="next" onClick={nextSlide}>
        ❯
      </button>

      {/* Hiển thị các chấm chỉ định slide */}
      <div className="dots">
        {slides.map((_, index) => (
          <span
            key={index}
            className={`dot ${currentSlide === index ? 'active' : ''}`}
            onClick={() => setCurrentSlide(index)}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default Slideshow;
