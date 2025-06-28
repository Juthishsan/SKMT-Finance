import React, { useState, useEffect } from 'react';


const AboutSlideshow = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const slides = [
    {
      id: 1,
      image: require('../assets/About Slideshow/skmt logo (1).png'),
      alt: 'SKMT Logo',
    },
    {
      id: 2,
      image: require('../assets/About Slideshow/SKMT Board.jpg'),
      alt: 'SKMT Board',
    },
    {
      id: 3,
      image: require('../assets/About Slideshow/skmt.jpg'),
      alt: 'SKMT Finance Building',
    },
    {
      id: 4,
      image: require('../assets/About Slideshow/SKMT interior.jpg'),
      alt: 'SKMT Interior',
    }
    
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const goToPrev = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  return (
    <div className="about-slideshow modernized-slideshow">
      <div className="slideshow-container">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`slide ${index === currentSlide ? 'active' : ''}`}
          >
            <div className="slide-overlay" />
            <img src={slide.image} alt={slide.alt} />
          </div>
        ))}
        {/* Navigation Arrows */}
        <button className="slideshow-nav prev" onClick={goToPrev} aria-label="Previous Slide">
          <span>&#8592;</span>
        </button>
        <button className="slideshow-nav next" onClick={goToNext} aria-label="Next Slide">
          <span>&#8594;</span>
        </button>
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