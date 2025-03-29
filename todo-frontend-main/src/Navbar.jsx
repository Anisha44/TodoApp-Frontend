import React from 'react';
import { useAuth } from './context/AuthContext'; // Import the useAuth hook
import { AppBar, Toolbar, Button, Typography } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom'; // For routing between pages

const Navbar = () => {
  const { user, logout } = useAuth(); // Destructure user and logout from useAuth
  const navigate = useNavigate(); // Get the navigate function for redirection

  const handleLogout = () => {
    logout(); // Call logout function to clear the session
    navigate('/login'); // Redirect to the Login page
  };

  return (
    <AppBar position="sticky">
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          TodoApp
        </Typography>
        {/* Check if the user is logged in */}
        {user ? (
          <>
            <Typography variant="body1" style={{ marginRight: 20 }}>
              Welcome, {user}
            </Typography>
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          </>
        ) : (
          <>
            <Button color="inherit" component={Link} to="/login">
              Login
            </Button>
            <Button color="inherit" component={Link} to="/register">
              Register
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
