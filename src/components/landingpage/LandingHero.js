import React, { useState, useEffect } from 'react';
import 'react-tooltip/dist/react-tooltip.css';
import heropic from '../../heropic.jpg';


const LandingHero = ({onGetStarted}) => {
  return (
    <>
    
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

    <div className='md:pt-20  relative'>
      <div className='relative'>
        <img src={heropic} alt='hero' className='rounded-lg md:max-w-6xl shadow-b-0 shadow-[rgba(0,0,15,0.5)_0px_-10px_20px_-15px] mx-auto md:h-auto w-auto h-auto '/>
        <div className='absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white dark:from-black to-transparent'></div>
      </div>
    </div>
    </>
  );
};

export default LandingHero;