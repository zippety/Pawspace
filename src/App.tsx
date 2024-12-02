import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { LandingPage } from './components/LandingPage';
import { Categories } from './components/Categories';
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
          <Route
            path="/explore"
            element={
              <div className="flex h-screen pt-20">
                {/* Left Sidebar */}
                <div className="w-[400px] overflow-y-auto border-r border-gray-200 bg-white">
                  <Categories />
                </div>

                {/* Map Area */}
                <div className="flex-1">
                  <div className="h-full w-full bg-[#e5e3df]" id="map-container">
                    {/* Map will be added here */}
                  </div>
                </div>
              </div>
            }
          />
          <Route path="/explore" element={<DirectoryPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
