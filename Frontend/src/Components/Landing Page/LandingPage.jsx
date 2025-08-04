import React from 'react';
import './landingPage.css';
import { Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import robot from '../../assets/robot.gif';

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="mainContainer">
      <div className="img">
        <img src={robot} alt="MindBot Robot" />
      </div>
      <div className="text">
        <Typography variant="h3" gutterBottom>
          Welcome to <span className='name'>MindBOT</span>
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          This is your mental health companion. Start exploring now.
        </Typography>
        <Button variant="contained" onClick={() => navigate('/dashboard')}>
          Go to Dashboard
        </Button>
      </div>
    </div>
  );
}

export default LandingPage;
