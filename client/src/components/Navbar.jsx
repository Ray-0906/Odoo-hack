import React, { useState, useEffect } from 'react';
import { MessageCircle, Bell, Menu, X } from 'lucide-react';

const StackItNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      scrollY > 20 ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              StackIt
            </span>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a 
              href="#" 
              className="text-gray-700 hover:text-blue-600 transition-colors font-medium hover:scale-105 transform duration-200"
            >
              Browse
            </a>
            <a 
              href="#" 
              className="text-gray-700 hover:text-blue-600 transition-colors font-medium hover:scale-105 transform duration-200"
            >
              Ask
            </a>
            <a 
              href="#" 
              className="text-gray-700 hover:text-blue-600 transition-colors font-medium hover:scale-105 transform duration-200"
            >
              Login
            </a>
            <button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-200 font-medium">
              Sign Up Free
            </button>
            <div className="relative">
              <Bell className="w-6 h-6 text-gray-600 hover:text-blue-600 cursor-pointer transition-colors hover:scale-110 transform duration-200" />
              {/* Notification Badge */}
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">3</span>
              </div>
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-700 hover:text-blue-600 transition-colors hover:scale-110 transform duration-200"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-lg">
          <div className="px-4 py-3 space-y-3">
            <a 
              href="#" 
              className="block text-gray-700 hover:text-blue-600 transition-colors font-medium py-2 hover:bg-blue-50 rounded-lg px-3"
            >
              Browse
            </a>
            <a 
              href="#" 
              className="block text-gray-700 hover:text-blue-600 transition-colors font-medium py-2 hover:bg-blue-50 rounded-lg px-3"
            >
              Ask
            </a>
            <a 
              href="#" 
              className="block text-gray-700 hover:text-blue-600 transition-colors font-medium py-2 hover:bg-blue-50 rounded-lg px-3"
            >
              Login
            </a>
            <button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-full font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-200">
              Sign Up Free
            </button>
            <div className="flex items-center justify-center pt-2">
              <div className="relative">
                <Bell className="w-6 h-6 text-gray-600 hover:text-blue-600 cursor-pointer transition-colors" />
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">3</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default StackItNavbar;