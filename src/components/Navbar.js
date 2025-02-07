import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

const Navbar = ({ user, onLogout }) => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const navigation = [
    { name: 'Home', href: '/app' },
    { name: 'Saved Tweets', href: '/saved-tweets' },
    { name: 'Saved LinkedIn Posts', href: '/linkedin-saved-posts' }
  ];

  return (
    <>
      {/* Overlay when menu is open */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleMenu}
        />
      )}

      <nav className="bg-white font-anek dark:bg-black border-b border-gray-200 dark:border-gray-600 sticky mb-4 top-0 z-50">
        <div className=" mx-auto  md:px-8 px-5  py-4 lg:py-6">
          <div className="flex justify-between  items-center">
            <h1 className="text-2xl font-caladea tracking-tighter lg:text-3xl  font-bold text-gray-900 dark:text-white">
              ZapTweet
            </h1>

            {/* Mobile Menu Button */}
            <div className="flex items-center gap-4 md:hidden">
              <ThemeToggle />
              <button 
                onClick={toggleMenu}
                className="text-gray-600 dark:text-gray-400 focus:outline-none"
              >
                {isOpen ? (
                  // Close (X) icon
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  // Hamburger icon
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                  </svg>
                )}
              </button>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-6">
              {user && (
                <>
                  <Link
                    to="/"
                    className={`text-lg ${
                      location.pathname === '/app'
                        ? 'text-black dark:text-white font-semibold'
                        : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white'
                    }`}
                  >
                    Home
                  </Link>
                  <Link
                    to="/saved-tweets"
                    className={`text-lg ${
                      location.pathname === '/saved-tweets'
                        ? 'text-black dark:text-white font-semibold'
                        : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white'
                    }`}
                  >
                    Saved Tweets
                  </Link>
                  <Link
                    to="/linkedin-saved-posts"
                    className={`text-lg ${
                      location.pathname === '/linkedin-saved-posts'
                        ? 'text-black dark:text-white font-semibold'
                        : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white'
                    }`}
                  >
                    LinkedIn Posts 
                  </Link>
                  <button
                    onClick={onLogout}
                    className="text-md  bg-red-500 px-3 py-1 rounded-md text-white hover:text-red-800 font-semibold"
                  >
                    Logout
                  </button>
                </>
              )}
              <ThemeToggle />
            </div>
          </div>
        </div>

        {/* Mobile Slide-out Menu */}
        <div 
          className={`fixed top-0 left-0 h-full w-[280px] bg-white dark:bg-black shadow-lg 
            transform transition-transform duration-300 ease-in-out z-50 
            ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
        >
          <div className="flex justify-end p-6">
            <button 
              onClick={toggleMenu}
              className="text-gray-600 dark:text-gray-400 focus:outline-none"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="px-6 py-4 space-y-6">
            {user && (
              <>
                <Link
                  to="/"
                  className="block text-xl text-gray-900 dark:text-white hover:text-gray-600 dark:hover:text-gray-300"
                  onClick={toggleMenu}
                >
                  Home
                </Link>
                <Link
                  to="/saved-tweets"
                  className="block text-xl text-gray-900 dark:text-white hover:text-gray-600 dark:hover:text-gray-300"
                  onClick={toggleMenu}
                >
                  Saved Tweets
                </Link>
                <Link
                  to="/linkedin-saved-posts"
                  className="block text-xl text-gray-900 dark:text-white hover:text-gray-600 dark:hover:text-gray-300"
                  onClick={toggleMenu}
                >
                  Saved LinkedIn Posts
                </Link>
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => {
                      onLogout();
                      toggleMenu();
                    }}
                    className="block w-full text-left text-xl text-red-600 hover:text-red-800"
                  >
                    Logout
                  </button>
                </div>
              </>
            )}
            <div className="pt-4">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;