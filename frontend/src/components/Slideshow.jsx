import React, { useState, useEffect } from 'react';
import '../css/app.css';
import Link from 'next/link';
import images from '@/constants/images';
import Image from 'next/image';

const Slideshow = () => {
  const slides = [
    { image: images.banner1, title: "Slide 1" },
    { image: images.banner2, title: "Slide 2" },
    { image: images.banner3, title: "Slide 3" },
    { image: images.banner4, title: "Slide 4" },
    { image: images.banner5, title: "Slide 5" },
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
    <div className="slideshow-container" >
      <button className="prev" onClick={prevSlide}>
        <i className="fas fa-chevron-left"></i>
      </button>
      <Link className="slide" href="/">
        <Image src={slides[currentSlide].image} alt={slides[currentSlide].title}    style={{ width: '100%', height: '420px', objectFit: 'cover' }}/>
        <div className="caption">{slides[currentSlide].title}</div>
      </Link>
      <button className="next" onClick={nextSlide}>
        <i className="fas fa-chevron-right"></i>
      </button>
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
