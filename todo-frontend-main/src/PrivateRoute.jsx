import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext'; // Import the Auth context

const PrivateRoute = ({ element, ...rest }) => {
  const { user } = useAuth(); // Get the user from context

  // If there is no user, redirect to login page
  if (!user) {
    return <Navigate to="/login" />;
  }

  // If there is a user, render the element (TodoApp)
  return <Route {...rest} element={element} />;
};

export default PrivateRoute;
