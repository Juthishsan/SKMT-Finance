import React, { useState, useEffect } from 'react';
import img1 from '../assets/Slideshow/image 1.jpg';
import img2 from '../assets/Slideshow/image 2.jpg';
import img3 from '../assets/Slideshow/image 3.jpg';
import img4 from '../assets/Slideshow/image 4.jpg';

const images = [
  { src: img1, objectPosition: 'center top' },
  { src: img2, objectPosition: 'center' },
  { src: img3, objectPosition: 'center' },
  { src: img4, objectPosition: 'center top' },
];

const Slideshow = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="slideshow-bg" style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1, overflow: 'hidden'}}>
      {images.map((img, idx) => (
        <img
          key={img.src}
          src={img.src}
          alt={`slide-${idx}`}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: img.objectPosition,
            opacity: idx === current ? 1 : 0,
            transition: 'opacity 0.8s',
            zIndex: 1
          }}
        />
      ))}
      {/* Overlay for contrast */}
      <div style={{position: 'absolute', top:0, left:0, width:'100%', height:'100%', background:'linear-gradient(90deg,rgba(30,58,138,0.55) 0%,rgba(30,58,138,0.15) 100%)', zIndex: 2}}></div>
      {/* Dots */}
      <div className="slideshow-dots" style={{position:'absolute', bottom: 24, left: '50%', transform: 'translateX(-50%)', zIndex: 3, display: 'flex', gap: 8}}>
        {images.map((_, idx) => (
          <span
            key={idx}
            className={`dot${idx === current ? ' active' : ''}`}
            onClick={() => setCurrent(idx)}
            style={{width: 12, height: 12, borderRadius: '50%', background: idx === current ? '#fff' : '#c7d2fe', display: 'inline-block', cursor: 'pointer', border: '2px solid #1e3a8a'}}
          />
        ))}
      </div>
    </div>
  );
};

export default Slideshow; 