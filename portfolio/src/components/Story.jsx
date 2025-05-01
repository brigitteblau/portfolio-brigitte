import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function Story() {
  const { t } = useLanguage();

  const images = [
    { src: "/api/placeholder/600/600", caption: "Porto's rocky coast" },
    { src: "/api/placeholder/600/600", caption: "Sunset at the beach" },
    { src: "/api/placeholder/600/600", caption: "Mountain view" },
    { src: "/api/placeholder/600/600", caption: "City skyline" },
    { src: "/api/placeholder/600/600", caption: "Forest trail" }
  ];

  const [currentIndex, setCurrentIndex] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const nextSlide = () => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
      setTimeout(() => setIsTransitioning(false), 500);
    }
  };

  const prevSlide = () => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
      setTimeout(() => setIsTransitioning(false), 500);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isTransitioning) nextSlide();
    }, 3500);
    return () => clearInterval(interval);
  }, [isTransitioning]);

  return (
 <div id='story'>
      <h1 className="text-5xl font-black mb-12 text-center bg-gradient-to-r from-pink-500 to-pink-400 text-transparent bg-clip-text uppercase">
        <span className="block">{t.storyTitle1}</span>
        <span className="block">{t.storyTitle2}</span>
      </h1>

      <p className="mt-6 text-center text-lg text-neutral-600 italic max-w-xl mx-auto">
        {t.storyOutro}
      </p>

      <div className="relative w-full max-w-3xl mx-auto my-10 overflow-hidden bg-gray-100 p-8 rounded-lg">
        <div className="relative h-96 flex items-center justify-center">
          <div className="flex w-full justify-center relative h-full">
            {images.map((image, index) => {
              let position = index - currentIndex;
              if (position < -2) position += images.length;
              if (position > 2) position -= images.length;

              let transformClass = "";
              let zIndex = 0;
              let opacityClass = "opacity-0";
              let onClick = null;

              if (position === -2) {
                transformClass = "translate-x-[-120%] scale-75 rotate-[-15deg]";
                zIndex = 1;
                opacityClass = "opacity-40";
                onClick = prevSlide;
              } else if (position === -1) {
                transformClass = "translate-x-[-60%] scale-90 rotate-[-8deg]";
                zIndex = 2;
                opacityClass = "opacity-70";
                onClick = prevSlide;
              } else if (position === 0) {
                transformClass = "translate-x-0 scale-100 rotate-0";
                zIndex = 3;
                opacityClass = "opacity-100";
              } else if (position === 1) {
                transformClass = "translate-x-[60%] scale-90 rotate-[8deg]";
                zIndex = 2;
                opacityClass = "opacity-70";
                onClick = nextSlide;
              } else if (position === 2) {
                transformClass = "translate-x-[120%] scale-75 rotate-[15deg]";
                zIndex = 1;
                opacityClass = "opacity-40";
                onClick = nextSlide;
              }

              return (
                <div
                  key={index}
                  className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${transformClass} ${opacityClass} transition-all duration-500 ease-in-out cursor-pointer`}
                  style={{ zIndex }}
                  onClick={onClick}
                >
                  <div className="bg-white p-3 shadow-lg rounded-sm transform origin-bottom" style={{ width: '280px' }}>
                    <div className="w-full overflow-hidden">
                      <img 
                        src={image.src} 
                        alt={image.caption} 
                        className="w-full h-64 object-cover"
                      />
                    </div>
                    <div className="mt-4 mb-1 text-center px-1">
                      <p className="font-handwriting text-lg text-gray-800">{image.caption}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex justify-center mt-4 gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex ? 'bg-gray-800 w-4' : 'bg-gray-400'
              }`}
              onClick={() => setCurrentIndex(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
      </div>
  );
}
