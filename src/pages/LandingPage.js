import React, { useState, useEffect } from 'react';
import 'react-tooltip/dist/react-tooltip.css';

const LandingPage = ({ onGetStarted }) => {
  return (
    <div>
      <button onClick={onGetStarted}>Go</button>
    </div>
  );
};

export default LandingPage;