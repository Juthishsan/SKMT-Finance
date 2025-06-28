import React, { useState, useEffect } from 'react';
import '../styles/AboutSlideshow.css';

const AboutSlideshow = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const slides = [
    {
      id: 1,
      image: require('../assets/About Slideshow/skmt.jpg'),
      alt: 'SKMT Finance Building',
    },
    {
      id: 2,
      image: require('../assets/About Slideshow/SKMT Board.jpg'),
      alt: 'SKMT Board',
    },
    {
      id: 3,
      image: require('../assets/About Slideshow/SKMT interior.jpg'),
      alt: 'SKMT Interior',
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [slides.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="about-slideshow">
      <div className="slideshow-container">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`slide ${index === currentSlide ? 'active' : ''}`}
          >
            <img src={slide.image} alt={slide.alt} />
          </div>
        ))}
        {/* Dots Indicator */}
        <div className="slideshow-dots">
          {slides.map((_, index) => (
            <span
              key={index}
              className={`dot ${index === currentSlide ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
            ></span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AboutSlideshow; 