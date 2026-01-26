// components/Story.jsx
import { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { useSwipeable } from 'react-swipeable';
import { useLanguage } from '../context/LanguageContext';

export default function Story() {
  const { t } = useLanguage();

  const images = [
    { src: "/img/1.JPG", caption: "a trip that stayed in my memory" },
    { src: "/img/2.jpg", caption: "some friends and me :)" },
    { src: "/img/3.jpg", caption: "a quote from my bullet journal" },
    { src: "/img/4.jpg", caption: "my prayer book from Israel and in hebrew"},
    { src:"/img/5.jpg", caption: "a picture with my mum and sister" },
    { src:"/img/10.jpg", caption: "at the driving course" }, 
    { src:"/img/8.jpg", caption: "skating" },
    { src:"/img/9.jpg", caption: "being healthy and aesthetic" }
  ];

  const [currentIndex, setCurrentIndex] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const frameRef = useRef(null);

  const flipTo = (direction) => {
    if (isTransitioning) return;
    const el = frameRef.current;
    if (!el) return;

    setIsTransitioning(true);
    const sign = direction === 'next' ? -1 : 1;

    gsap.killTweensOf(el);
    gsap.set(el, { transformStyle: 'preserve-3d' });

    gsap
      .timeline({
        onComplete: () => setIsTransitioning(false),
      })
      .to(el, { rotateY: 16 * sign, duration: 0.18, ease: 'power2.in' })
      .add(() => {
        setCurrentIndex((prevIndex) => {
          const delta = direction === 'next' ? 1 : -1;
          return (prevIndex + delta + images.length) % images.length;
        });
      })
      .fromTo(
        el,
        { rotateY: -16 * sign },
        { rotateY: 0, duration: 0.22, ease: 'power2.out' },
      );
  };

  const nextSlide = () => flipTo('next');
  const prevSlide = () => flipTo('prev');

  // Soporte para swipe con los dedos
  const handlers = useSwipeable({
    onSwipedLeft: nextSlide,
    onSwipedRight: prevSlide,
    preventDefaultTouchmoveEvent: true,
    trackMouse: false,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isTransitioning) nextSlide();
    }, 3500);
    return () => clearInterval(interval);
  }, [isTransitioning]);

  return (
    <section id="story" className="px-4 py-14 md:px-6 lg:px-8 max-w-screen-xl mx-auto">
      <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-black mb-6 md:mb-8 text-center tracking-tight uppercase">
        <span className="block">{t.storyTitle1}</span>
        <span className="block">{t.storyTitle2}</span>
      </h2>

      <p className="mt-4 md:mt-6 text-center text-base md:text-lg text-[color:var(--muted)] italic max-w-2xl mx-auto">
        {t.storyOutro}
      </p>

      <div
        {...handlers}
        className="relative w-full max-w-4xl mx-auto my-8 md:my-12 overflow-hidden panel p-4 md:p-8 touch-pan-x"
        style={{ perspective: '900px' }}
      >
        <div ref={frameRef} className="relative h-72 sm:h-80 md:h-[28rem] flex items-center justify-center">
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
                  <div className="bg-white/70 backdrop-blur p-2 sm:p-3 shadow-[0_20px_60px_rgba(12,15,20,0.18)] rounded-2xl border border-[color:var(--line)] transform origin-bottom w-[240px] sm:w-[290px]">
                    <div className="w-full overflow-hidden rounded-xl border border-[color:var(--line)]">
                      <img 
                        src={image.src} 
                        alt={image.caption} 
                        className="w-full h-48 sm:h-56 md:h-64 object-cover"
                      />
                    </div>
                    <div className="mt-2 sm:mt-4 mb-1 text-center px-1">
                      <p className="font-handwriting text-base md:text-lg text-[color:var(--ink)] -rotate-1">{image.caption}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex justify-center mt-3 md:mt-5 gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              className={`h-2 rounded-full transition-all duration-300 border border-[color:var(--line)] ${
                index === currentIndex ? 'bg-[color:var(--ink)] w-7' : 'bg-white/60 w-2'
              }`}
              onClick={() => setCurrentIndex(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
