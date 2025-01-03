import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = ({ user, onLogout }) => {
  const location = useLocation();
  
  return (
    <nav className="bg-white dark:bg-black border-b border-gray-200 dark:border-gray-600  px-4 mb-4">
      <div className="container mx-4 flex justify-between items-center mb-4">
        <div className="flex items-center space-x-16">
          <h1 className="text-3xl font-newsreader font-bold text-gray-900 dark:text-white">
            ZapTweet
          </h1>
            
          
          {user && (
            <div className="flex space-x-6">
              <Link
                to="/"
                className={`text-lg ${
                  location.pathname === '/'
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
                Saved
              </Link>
            </div>
          )}
        </div>
        
        {user && (
          <button
            onClick={onLogout}
            className=" text-md bg-red-500 px-3 py-1 rounded-md text-white hover:text-red-800 font-medium"
          >
            Logout
          </button>
        )}
      </div>
      
    </nav>
  );
};

export default Navbar; 