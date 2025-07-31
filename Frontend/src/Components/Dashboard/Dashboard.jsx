import React, { useState, useEffect } from 'react';
import calm3 from '../../assets/calm3.jpg';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import { Box, Typography, Grid, Paper } from '@mui/material';

function Dashboard() {
  const [emotionData, setEmotionData] = useState([]);
  const [valenceData, setValenceData] = useState([]);
  const [weeklyData, setWeeklyData] = useState([]);
  const [today, setToday] = useState('');
  const [weeklyValenceData, setWeeklyValenceData] = useState([]);

  useEffect(() => {
    const now = new Date();
    const formatted = now.toLocaleDateString('en-GB'); 
    setToday(formatted);

    fetch("http://localhost:5000/today-summary")
      .then(res => res.json())
      .then(data => {
        if (data.emotions && data.valence) {
          setEmotionData(
            Object.entries(data.emotions).map(([emotion, value]) => ({ emotion, value }))
          );
          setValenceData(
            Object.entries(data.valence).map(([valence, value]) => ({ valence, value }))
          );
        }
      });

    fetch("http://localhost:5000/weekly-valence")
    .then(res => res.json())
    .then(data => setWeeklyValenceData(data));
}, []);

  return (
    <div className="dash">
      <div
        className="upperContainer"
        style={{
          backgroundImage: `url(${calm3})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          padding: '1rem',
          color: 'white',
        }}
      >
        <h1>Dashboard</h1>
        <p>Hi Hiruni Nishara, hope you're doing well</p>
      </div>
      <br/>
        <h2>Facial Expressions</h2>
      <Box padding={4}>
        <Typography variant="h5" gutterBottom>
          Today Your Emotions Summary ({today})
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Paper elevation={3} style={{ padding: '1rem' }}>
              <Typography variant="h6" gutterBottom>
                Emotions Breakdown (%)
              </Typography>
              <Box sx={{ overflowX: 'auto' }}>
                <Box sx={{ width: 700 }}>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={emotionData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="emotion" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Paper elevation={3} style={{ padding: '1rem' }}>
              <Typography variant="h6" gutterBottom>
                Valence Summary (%)
              </Typography>
              <Box sx={{ overflowX: 'auto' }}>
                <Box sx={{ width: 300 }}>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={valenceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="valence" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      <Box padding={4}>
        <Typography variant="h5" gutterBottom>
  Weekly Analysis (Last 7 Days)
</Typography>
<Typography variant="subtitle2" className="percentage">
  (%)
</Typography>
        <ResponsiveContainer width="100%" height={300}>
  <LineChart data={weeklyValenceData}>
    <XAxis dataKey="date" />
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="date" />
    <YAxis />
    <Tooltip />
    <Legend />
    <Line type="monotone" dataKey="Positive" stroke="#4caf50" name="Positive" />
    <Line type="monotone" dataKey="Negative" stroke="#f44336" name="Negative" />
    <Line type="monotone" dataKey="Neutral" stroke="#2196f3" name="Neutral" />
  </LineChart>
</ResponsiveContainer>
      </Box>
    </div>
  );
}

export default Dashboard;
