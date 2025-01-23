import React, { useState, useEffect } from 'react';
import 'react-tooltip/dist/react-tooltip.css';

const LandingNavbar = ({onGetStarted}) => {
  return (
    <div>
      <div className='flex flex-row items-center h-auto my-auto justify-between'>
        <h1 className='lg:text-3xl text-xl font-caladea tracking-tighter font-black'>ZapTweet</h1>
        <button className='bg-blue-600 font-semibold text-white hover:bg-white hover:text-black border-2 border-black px-7 lg:px-10 py-1 lg:py-2 rounded-full' onClick={onGetStarted}>Get Started </button>
      </div>
    </div>
  );
};

export default LandingNavbar;