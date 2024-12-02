import React from 'react';
import { Header } from '../Header';
import { Categories } from '../Categories';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex h-[calc(100vh-64px)]">
        {/* Left Sidebar */}
        <div className="w-[400px] overflow-y-auto border-r border-gray-200 bg-white">
          <Categories />
        </div>

        {/* Main Content Area */}
        <div className="flex-1">
          {children}
        </div>
      </div>
    </div>
  );
}
