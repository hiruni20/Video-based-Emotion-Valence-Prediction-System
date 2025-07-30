import React, { useState } from 'react';
import { Box, Button, Typography, Grid, Paper } from '@mui/material';

function Chat() {
  const [videoStarted, setVideoStarted] = useState(false);

  const handleStart = async () => {
    await fetch("http://localhost:5000/start-video");
    setVideoStarted(true);
  };

  const handleStop = async () => {
    await fetch("http://localhost:5000/stop-video");
    setVideoStarted(false);
  };

  return (
    <Box sx={{ padding: 5}}>
      <Grid container spacing={5}>
        {/*<Grid item xs={12} md={6}>
          <Paper sx={{ padding: 3 }}>
            <Typography variant="h5">Chat</Typography>
            <Typography>Text or voice chat </Typography>
             <Box
              sx={{
                width: '100%',
                height: 500,
                mt: 2,
                mb: 2,
                borderRadius: 2,
                overflow: 'hidden',
                border: '1px solid #ccc',
              }}
            ></Box>
          </Paper>
        </Grid>*/}

        <Grid item xs={12} md={6}>
          <Paper sx={{ padding: 3, textAlign: 'center' }}>
            <Typography variant="h6">Live Emotion Detection</Typography>

            <Box
              sx={{
                width: '100%',
                height: 500,
                mt: 2,
                mb: 2,
                borderRadius: 2,
                overflow: 'hidden',
                border: '1px solid #ccc',
              }}
            >
              {videoStarted ? (
                <img
                  src="http://localhost:5000/video-feed"
                  alt="Live Feed"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <Typography
                  variant="body1"
                  sx={{
                    height: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    color: 'gray',
                  }}
                >
                  Click "Start" to begin webcam emotion tracking
                </Typography>
              )}
            </Box>

            
            {videoStarted ? (
              <Button variant="outlined" color="error" onClick={handleStop}>
                Stop Emotion Detection
              </Button>
            ) : (
              <Button variant="contained" color="primary" onClick={handleStart}>
                Start Emotion Detection
              </Button>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Chat;
