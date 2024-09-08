import React, { useState, useEffect } from 'react';
import '../css/app.css'; // Import CSS từ file

const Slideshow = ({ slides }) => {
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
      <button className="prev" onClick={prevSlide}>❮</button>
      <div className="slide">
        <img src={slides[currentSlide].image} alt={slides[currentSlide].title} />
        <div className="caption">{slides[currentSlide].title}</div>
      </div>
      <button className="next" onClick={nextSlide}>❯</button>
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
