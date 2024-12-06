import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { LandingPage } from './components/LandingPage';
import { DirectoryPage } from './components/DirectoryPage';
import { BecomeHostPage } from './components/BecomeHostPage';
import { ListPropertyPage } from './components/ListPropertyPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <Header />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/host" element={<BecomeHostPage />} />
          <Route path="/host/list-property" element={<ListPropertyPage />} />
          <Route path="/explore" element={<DirectoryPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
