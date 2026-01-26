// App.jsx
import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Work from './components/Work';
import PlanetIntro from './components/PlanetIntro';
import Story from './components/Story';
import Contact from './components/Contact';

function App() {
  return (
    <div className="min-h-screen relative text-[color:var(--ink)] overflow-hidden">
      <PlanetIntro />
      <div className="relative z-10">
        <Navbar />
        <Hero />
        <About />
        <Work />
        <Story/>
        <Contact /> 
      </div>
    </div>
  );
}
export default App;
