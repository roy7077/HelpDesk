import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/globalheader.css'

const GlobalHeader = () => {
  const navigate = useNavigate(); // For navigation
  const isLoggedIn = !!localStorage.getItem('authToken'); // Check if token exists in localStorage

  const handleLogin = () => {
    navigate('/login'); // Redirect to login page
  };

  const handleSignUp = () => {
    navigate('/signup'); // Redirect to sign-up page
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken'); // Remove token from localStorage
    navigate('/login'); // Redirect to login page after logout
  };

  return (
    <header className="global-header">
      <div className="auth-options">
        {!isLoggedIn ? (
          <>
            <button onClick={handleLogin}>Login</button>
            <button onClick={handleSignUp}>Sign Up</button>
          </>
        ) : (
          <button onClick={handleLogout}>Logout</button>
        )}
      </div>
    </header>
  );
};

export default GlobalHeader;
