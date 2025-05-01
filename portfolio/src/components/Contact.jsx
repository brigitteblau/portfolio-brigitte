//contact

import React, { useState } from 'react';
import { Mail, Instagram, Linkedin, Github } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext'; // ajustá la ruta según tu estructura

export default function ConnectButton() {
  const [highlight, setHighlight] = useState(false);
  const { t } = useLanguage(); // Hook del contexto de idioma

  return (
    <section id='chat' className="flex flex-col items-center justify-center min-h-screen bg-white relative">
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&display=swap');
        .handwritten {
          font-family: 'Caveat', cursive;
          
        }
        .button-3d {
          width: 280px;
          height: 90px;
          transform: rotate(-5deg);
          background-color: #333;
          color: white;
          font-size: 2rem;
          font-weight: bold;
          border: none;
          border-radius: 9999px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease-in-out;
          box-shadow:
            0 4px 0 #999,
            0 8px 0 #ccc,
            0 12px 20px rgba(0, 0, 0, 0.5);
          position: relative;
          z-index: 1;
        }
        .button-3d:hover {
          transform: rotate(-5deg) scale(1.05) translateY(-3px);
          background-color: #f9a8d4;
          color: #4b004b;
          box-shadow:
            0 0 30px 10px rgba(249, 168, 212, 0.7),
            0 6px 0 #f472b6,
            0 12px 0 #f9a8d4,
            0 20px 25px rgba(240, 100, 180, 0.3);
        }
        .button-3d:hover::after {
          content: '';
          position: absolute;
          top: -20px;
          bottom: -20px;
          left: -30px;
          right: -30px;
          background: radial-gradient(circle, rgba(249, 168, 212, 0.2) 0%, transparent 80%);
          border-radius: 9999px;
          z-index: -1;
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 0.7;
          }
          50% {
            transform: scale(1.1);
            opacity: 1;
          }
          100% {
            transform: scale(1);
            opacity: 0.7;
          }
        }
      `}</style>

      <p className="handwritten text-gray-600 text-2xl mb-8 -rotate-2 font-bold">
        {t.contactPrompt}
      </p>

      <button
        onClick={() => setHighlight(!highlight)}
        className={`button-3d ${highlight ? 'ring-4 ring-pink-300' : ''}`}
      >
        {t.contactButton}
      </button>

      <div className="flex gap-6 items-center mt-16 rotate-[3deg]">
        <a href="mailto:hello@danielsun.space" className="text-pink-500 text-lg flex items-center gap-2">
          <Mail className="w-5 h-5" /> brigitteblau20@gmail.com
        </a>
      </div>

      <div className="flex gap-4 mt-6 rotate-[-5deg]">
        <a href="https://github.com/brigitteblau" target="_blank" rel="noopener noreferrer">
          <Github className="w-7 h-7 text-pink-400 hover:text-pink-500" />
        </a>
        <a href="https://instagram.com/brigitteblau" target="_blank" rel="noopener noreferrer">
          <Instagram className="w-7 h-7 text-pink-400 hover:text-pink-500" />
        </a>
        <a href="https://ar.linkedin.com/in/brigitte-blau-17567835b" target="_blank" rel="noopener noreferrer">
          <Linkedin className="w-7 h-7 text-pink-400 hover:text-pink-500" />
        </a>
      </div>
    </section>
  );
}
