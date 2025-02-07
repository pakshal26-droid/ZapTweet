import React, { useState, useEffect } from 'react';
import 'react-tooltip/dist/react-tooltip.css';


const LandingHero = ({onGetStarted}) => {
  return (
    <div className='md:h-[80vh] h-[90vh] font-anek max-w-5xl md:gap-y-0 gap-y-5 mx-auto flex flex-col items-center justify-center'>
      <div className='bg-green-100 px-5 min-py-1 flex flex-row items-center gap-x-3 font-semibold text-green-900 rounded-full mb-5 border-2 border-green-600'><span className='md:text-4xl text-xl text-green-700 '>• </span>Join the community with 5k+ creators</div>
      <h1 className='lg:text-7xl tracking-tight text-3xl font-black text-center'>Create and Schedule Quality<span className='font-caladea tracking-tighter font-medium italic'> Linkedin </span> and <span className='font-caladea tracking-tighter font-medium italic'>    X  </span>  posts within a few clicks</h1>
      <div className='pt-5 mx-auto'>
        <ul className='list-disc list-inside text-gray-600 text-lg lg:text-2xl tracking-normal gap-x-10 flex flex-col md:flex-row justify-between items-center '>
            <li>One click generation</li>
            <li>Personalised creation</li>
            <li>Performance Optimised</li>
        </ul>
      </div>
      <button className='bg-blue-600 mt-10  text-white hover:bg-white hover:text-black border-2 border-black px-20 py-3 lg:py-5 text-lg lg:text-2xl font-semibold rounded-full' onClick={onGetStarted}>Start Creating</button>
      </div>
  );
};

export default LandingHero;