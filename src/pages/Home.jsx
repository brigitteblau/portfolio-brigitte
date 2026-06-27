import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Hero from '../components/Hero';
import PhotoRain from '../components/PhotoRain';
import Estudios from '../components/Estudios';
import FolderArchive from '../components/archive/FolderArchive';
import Contact from '../components/Contact';

export default function Home() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const el = document.getElementById(location.hash.slice(1));
      if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 60);
    }
  }, [location.hash]);

  return (
    <>
      <Hero />
      <div className="relative">
        <PhotoRain />
        <Estudios />
        <FolderArchive />
        <Contact />
      </div>
    </>
  );
}
