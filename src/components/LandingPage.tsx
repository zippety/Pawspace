import React from 'react';
import { useNavigate } from 'react-router-dom';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen">
      {/* Background Image */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url(/hero-dogs.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.7)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-4 py-20">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-8 max-w-4xl mx-auto leading-tight">
          Rent safe and private dog parks hosted by locals
        </h1>

        <button
          onClick={() => navigate('/explore')}
          className="bg-[#3B82F6] hover:bg-[#2563EB] text-white font-semibold text-lg px-8 py-4 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
        >
          Explore spots near me
        </button>
      </div>
    </div>
  );
};
