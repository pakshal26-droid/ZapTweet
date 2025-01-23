import React, { useState, useEffect } from 'react';
import 'react-tooltip/dist/react-tooltip.css';
import LandingNavbar from '../components/landingpage/LandingNavbar';
import LandingHero from '../components/landingpage/LandingHero';

const LandingPage = ({ onGetStarted }) => {
  return (
    <div className='px-10 py-7 tracking-tighter'>
      <LandingNavbar onGetStarted={onGetStarted}/>
      <LandingHero onGetStarted={onGetStarted}/>
    </div>
  );
};

export default LandingPage;