// App.jsx
import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Work from './components/Work';
import PlanetIntro from './components/PlanetIntro';
import Story from './components/Story';
 import Contact from './components/Contact';

function App() {
  return (
    <div className="min-h-screen relative text-neutral-900 font-sans bg-white overflow-hidden">
      <PlanetIntro />
      <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-pink-300 rounded-full blur-3xl opacity-30 z-0 pointer-events-none"></div>
      <div className="relative z-10">
        <Navbar />
        <Hero />
        <Work />
        <Story/>
        <Contact /> 
      </div>
    </div>
  );
}
export default App;