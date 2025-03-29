import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext'; // Import AuthProvider
import Navbar from './Navbar'; // Assuming you have a Navbar component
import Login from './Login';
import Register from './Register';
import TodoApp from './TodoApp'; // Your Todo App

function App() {
  const { user } = useAuth(); // Get user from AuthContext

  return (
      <>
        <Navbar />
        <Routes>
          {/* Check if user is logged in, if not, redirect to /login */}
          <Route
            path="/"
            element={user ? <TodoApp /> : <Navigate to="/login" />}
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </>
  );
}

export default App;
