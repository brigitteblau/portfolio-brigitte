import React, { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function Hero() {
  const { t } = useLanguage();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const section = document.getElementById('hero');
      const rect = section.getBoundingClientRect();
      setVisible(rect.top < window.innerHeight && rect.bottom > 0);
    };
    
    window.addEventListener('scroll', onScroll);
    onScroll(); // trigger once
    
    // Activar la visibilidad inmediatamente al cargar
    setTimeout(() => setVisible(true), 100);
    
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      id="hero"
      className={`min-h-screen pt-24 pb-20 px-4 relative transition-all duration-700 ease-out ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
    >
      <style jsx global>{`
        @keyframes draw {
          0% {
            stroke-dashoffset: 1000;
          }
          100% {
            stroke-dashoffset: 0;
          }
        }
        
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
          100% { transform: translateY(0px); }
        }
        
        .draw-line {
          stroke-dasharray: 1000;
          stroke-dashoffset: 1000;
          animation: draw 3s ease-in-out forwards;
        }
        
        .float-slow {
          animation: float 8s ease-in-out infinite;
        }
        
        .float-medium {
          animation: float 6s ease-in-out 1s infinite;
        }
        
        .float-fast {
          animation: float 4s ease-in-out 0.5s infinite;
        }
        
        .handwritten {
          font-family: 'Caveat', cursive;
        }
      `}</style>
      
      <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&display=swap" rel="stylesheet" />
      
      <div className="max-w-screen-xl mx-auto relative">
        {/* Blob decorativo */}
        <div className="absolute -right-40 -top-40 w-96 h-96 bg-pink-200 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute -left-40 top-60 w-80 h-80 bg-pink-300 rounded-full blur-3xl opacity-20"></div>
        
        <div className="relative z-10">
          {/* Texto introductorio con borde estilizado */}
          <div className="relative inline-block mx-auto">
            <p className="text-right text-xl sm:text-2xl text-pink-400 handwritten italic mb-2">
              {t.heroIntro || 'Welcome to'}
            </p>
          </div>
          
          {/* Título principal con gradiente al estilo de tu web */}
          <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl leading-[0.9] font-black tracking-tight text-center">
            <span className="block">{t.heroTitle.split(' ')[0]}</span>
            <span className="block bg-gradient-to-r from-pink-500 to-pink-400 text-transparent bg-clip-text">
              {t.heroTitle.split(' ')[1]}
            </span>
          </h1>
          
          {/* Texto descriptivo */}
          <p className="text-lg text-neutral-600 max-w-xl mx-auto my-8 text-center">
            {t.heroText}
          </p>
          
          {/* SVG Curvas como la imagen proporcionada */}
          <div className="w-full max-w-3xl mx-auto overflow-hidden h-24 sm:h-32 relative my-8">
            <svg 
              width="100%" 
              height="100%" 
              viewBox="0 0 1000 200" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              className="transform scale-110 sm:scale-125"
            >
              <path 
                d="M0 100 C150 180, 300 20, 450 100 C600 180, 750 20, 1000 100" 
                stroke="#ec4899" 
                strokeWidth="4" 
                strokeLinecap="round"
                className="draw-line"
              />
              <path 
                d="M50 120 C200 200, 350 40, 500 120 C650 200, 800 40, 950 120" 
                stroke="#f9a8d4" 
                strokeWidth="2" 
                strokeLinecap="round"
                className="draw-line"
                style={{animationDelay: '0.5s'}}
              />
            </svg>
          </div>
        </div>
        
        {/* Elementos visuales artísticos flotantes */}
        {/* <div className="mt-12 relative max-w-4xl mx-auto">
          <div className="grid grid-cols-3 gap-6 sm:gap-8">
      
            <div className="relative float-medium">
              <div className="w-full pt-[100%] rounded-full bg-gradient-to-br from-pink-200 to-pink-400 shadow-lg transform hover:rotate-12 transition-transform duration-700">
                <div className="absolute inset-2 rounded-full bg-white opacity-30"></div>
              </div>
              <p className="mt-3 text-center handwritten text-pink-500 opacity-80">
                {t.heroElement1 || "Creatividad"}
              </p>
            </div>
            

            <div className="relative float-slow">
              <div className="w-full pt-[100%] rounded-[30%_70%_70%_30%_/_30%_30%_70%_70%] bg-gradient-to-tr from-pink-300 to-pink-100 shadow-lg transform hover:rotate-45 transition-transform duration-700">
                <div className="absolute inset-3 rounded-[30%_70%_70%_30%_/_30%_30%_70%_70%] bg-white opacity-30"></div>
              </div>
              <p className="mt-3 text-center handwritten text-pink-500 opacity-80">
                {t.heroElement2 || "Diseño"}
              </p>
            </div>
            
  
            <div className="relative float-fast">
              <div className="w-full pt-[100%] rounded-[50%_50%_20%_80%_/_25%_80%_80%_75%] bg-gradient-to-bl from-pink-400 to-pink-200 shadow-lg transform hover:-rotate-12 transition-transform duration-700">
                <div className="absolute inset-2 rounded-[50%_50%_20%_80%_/_25%_80%_80%_75%] bg-white opacity-30"></div>
              </div>
              <p className="mt-3 text-center handwritten text-pink-500 opacity-80">
                {t.heroElement3 || "Innovación"}
              </p>
            </div>
          </div>
        </div> */}
        
        {/* Línea decorativa abajo */}
        <div className="w-full max-w-lg mx-auto mt-16">
          <svg 
            width="100%" 
            height="40" 
            viewBox="0 0 400 40" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              d="M20 20 C60 5, 100 35, 140 20 C180 5, 220 35, 260 20 C300 5, 340 35, 380 20" 
              stroke="#f9a8d4" 
              strokeWidth="2" 
              strokeLinecap="round"
              className="draw-line"
              style={{animationDelay: '1s'}}
            />
          </svg>
        </div>
        
        {/* Indicador de scroll */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
          <p className="handwritten text-pink-400 mb-2">scroll</p>
          <div className="w-6 h-10 border-2 border-pink-300 rounded-full flex justify-center pt-1">
            <div className="w-1.5 h-3 bg-pink-400 rounded-full animate-bounce"></div>
          </div>
        </div>
      </div>
    </header>
  );
}