import React, { useEffect, useState } from 'react';

function ThemeToggle() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <label className="flex items-center cursor-pointer">
      <input
        type="checkbox"
        className="hidden"
        checked={darkMode}
        onChange={() => setDarkMode(!darkMode)}
      />
      <div className="relative">
        <div className={`block w-14 h-8 rounded-full ${darkMode ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
        <div
          className={`dot absolute left-1 top-1 w-6 h-6 rounded-full transition ${darkMode ? 'bg-white transform translate-x-full' : 'bg-gray-600'}`}
        ></div>
      </div>
      
    </label>
  );
}

export default ThemeToggle; 