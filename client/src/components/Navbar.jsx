import React, { useState, useEffect } from 'react';
import { MessageCircle, Bell, Menu, X, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const StackItNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const checkAuth = () => {
      const user = localStorage.getItem('soloAuth');
      setIsLoggedIn(!!user);
    };

    checkAuth();
    window.addEventListener('storage', checkAuth); // Sync across tabs
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('soloAuth');
    setIsLoggedIn(false);
    navigate("/login"); // Redirect to login page after logout
  };

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
              <Link to="/">StackIt</Link>
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/home" className="text-gray-700 hover:text-blue-600 font-medium hover:scale-105 transform duration-200">
              Browse
            </Link>
            <Link to="/add" className="text-gray-700 hover:text-blue-600 font-medium hover:scale-105 transform duration-200">
              Ask
            </Link>

            {isLoggedIn ? (
              <>
                <div className="relative">
                  <Link to={'/notices'}>
                  <Bell className="w-6 h-6 text-gray-600 hover:text-blue-600 cursor-pointer transition-colors hover:scale-110 transform duration-200" aria-label="Notifications" /></Link>
                  <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">?</span>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-gray-700 hover:text-red-600 font-medium flex items-center gap-1"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-blue-600 font-medium hover:scale-105 transform duration-200">
                  Login
                </Link>
                <Link to="/signup">
                  <button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-full hover:shadow-lg transform hover:scale-105 transition-all font-medium">
                    Sign Up Free
                  </button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-700 hover:text-blue-600 transition-colors hover:scale-110 transform duration-200"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-lg">
          <div className="px-4 py-3 space-y-3">
            <Link to="/home" className="block text-gray-700 hover:text-blue-600 font-medium py-2 hover:bg-blue-50 rounded-lg px-3">
              Browse
            </Link>
            <Link to="/add" className="block text-gray-700 hover:text-blue-600 font-medium py-2 hover:bg-blue-50 rounded-lg px-3">
              Ask
            </Link>

            {isLoggedIn ? (
              <>
                <div className="flex items-center justify-center pt-2">
                  <div className="relative">
                    <Bell className="w-6 h-6 text-gray-600 hover:text-blue-600 cursor-pointer transition-colors" aria-label="Notifications" />
                    <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">3</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left text-gray-700 hover:text-red-600 font-medium py-2 hover:bg-red-50 rounded-lg px-3 flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="block text-gray-700 hover:text-blue-600 font-medium py-2 hover:bg-blue-50 rounded-lg px-3">
                  Login
                </Link>
                <Link to="/signup">
                  <button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-full font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-200">
                    Sign Up Free
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default StackItNavbar;