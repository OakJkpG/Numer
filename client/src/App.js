import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import RootFinder from './components/RootFinder';
import LinearFinder from './components/LinearFinder';

function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/root-finding" element={<RootFinder />} />
        <Route path="/linear-finder" element={<LinearFinder />} />
      </Routes>
    </div>
  );
}

export default App;
