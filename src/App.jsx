// App.jsx — layout + routing
import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import BrandLoader from './components/BrandLoader';
import Home from './pages/Home';
import JournalList from './pages/JournalList';
import JournalEntry from './pages/JournalEntry';
import Admin from './pages/Admin';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function App() {
  return (
    <div className="min-h-screen relative text-[color:var(--ink)] overflow-hidden">
      <BrandLoader />
      <ScrollToTop />
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/journal" element={<JournalList />} />
            <Route path="/journal/:slug" element={<JournalEntry />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default App;
