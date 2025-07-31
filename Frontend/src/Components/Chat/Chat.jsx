import React, { useState } from 'react';
import { Button, Typography } from '@mui/material';
import './Chat.css'; // Import CSS file

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
    <div className="chat-container">
      <div className="chat-section">
        <div className="paper">
          <Typography variant="h5">Chat</Typography>
          <Typography>Text or voice chat</Typography>
          <div className="video-box"></div>
        </div>
      </div>

      <div className="video-section">
        <div className="paper center-text">
          <Typography variant="h6">Live Emotion Detection</Typography>
          <div className="video-box">
            {videoStarted ? (
              <img
                src="http://localhost:5000/video-feed"
                alt="Live Feed"
                className="live-feed"
              />
            ) : (
              <div className="placeholder-text">
                Click "Start" to begin webcam emotion tracking
              </div>
            )}
          </div>

          {videoStarted ? (
            <Button variant="outlined" color="error" onClick={handleStop}>
              Stop Emotion Detection
            </Button>
          ) : (
            <Button variant="contained" color="primary" onClick={handleStart}>
              Start Emotion Detection
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Chat;
