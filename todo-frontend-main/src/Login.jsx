import React, { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import { Button, TextField, Typography, Grid, Paper, Box, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
// import './Login.css'; // Import the CSS file for the background animation

const Login = () => {
  const { user, login } = useAuth(); // Access the login function and user from context
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null); // State for handling errors
  const navigate = useNavigate(); // Initialize useNavigate hook for redirection

  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      navigate('/'); // Redirect to the homepage or another page
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Reset error before login attempt

    try {
      const response = await fetch('http://localhost:8000/api/auth/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Login failed');
      }

      console.log(data)
      // Assume the token is in `data.access`
      const token = data.access; 
      login(username, token); // Login the user with the API token
      navigate('/'); // Navigate to the homepage (TodoApp page)
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      className="animated-background" // Apply the animated background
    >
      <Paper
        elevation={3}
        sx={{
          padding: 4,
          maxWidth: 400,
          width: '100%',
          borderRadius: 2,
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Typography variant="h4" align="center" gutterBottom>
          Login
        </Typography>

        {error && <Alert severity="error">{error}</Alert>}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary" fullWidth>
                Login
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default Login;
