import React from 'react';
import './landingPage.css'
import { Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className='mainContainer'>
      <Typography variant="h3" gutterBottom>Welcome to the App</Typography>
      <Typography variant="subtitle1" gutterBottom>
        This is your mental health companion. Start exploring now.
      </Typography>
      <Button variant="contained" color="primary" onClick={() => navigate('/dashboard')}>
        Go to Dashboard
      </Button>
    </div>
  );
}

export default LandingPage;

