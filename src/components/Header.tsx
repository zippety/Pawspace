import React from 'react';
import { Link } from 'react-router-dom';

export const Header: React.FC = () => {
  return (
    <header className="absolute top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img
              src="/pawspace-logo.svg"
              alt="PawSpace"
              className="h-8 w-8"
            />
            <span className="text-2xl font-bold text-[#22C55E]">PawSpace</span>
          </Link>

          {/* Navigation */}
          <div className="flex items-center space-x-4">
            <Link
              to="/host"
              className="px-6 py-2 text-gray-700 bg-white rounded-full border border-gray-300 hover:border-gray-400 font-medium shadow-sm"
            >
              Host
            </Link>
            <button className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center border border-gray-200">
              <svg
                className="w-6 h-6 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
