import React, { useState, useEffect } from 'react';
import 'react-tooltip/dist/react-tooltip.css';


const LandingHero = ({onGetStarted}) => {
  return (
    <div className='md:h-[80vh] h-[90vh] font-anek max-w-5xl mx-auto flex flex-col items-center justify-center'>
      <h1 className='lg:text-6xl text-3xl font-black text-center'>Create and Schedule Quality<span className='font-caladea tracking-tighter font-medium italic'> Linkedin </span> and <span className='font-caladea tracking-tighter font-medium italic'>    X  </span>  posts within a few clicks</h1>
      <div className='pt-5 mx-auto'>
        <ul className='list-disc list-inside text-gray-600 text-sm lg:text-2xl tracking-normal gap-x-10 flex flex-col md:flex-row justify-between items-center '>
            <li>One click generation</li>
            <li>Personalised creation</li>
            <li>Performance Optimised</li>
        </ul>
      </div>
      <button className='bg-blue-600 mt-10  text-white hover:bg-white hover:text-black border-2 border-black px-20 py-2 lg:py-5 text-md lg:text-2xl font-semibold rounded-full' onClick={onGetStarted}>Start Creating</button>
      </div>
  );
};

export default LandingHero;