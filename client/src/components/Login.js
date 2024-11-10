// src/components/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/login.css';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('http://localhost:8080/api/v1/auth/login', {
        email: formData.email,
        password: formData.password,
      });

      // Assuming a successful login response with a token
      localStorage.setItem('authToken', response.data.token);  // Store the token for authentication
      localStorage.setItem('accountType', response.data.user.accountType);
      localStorage.setItem('user', JSON.stringify(response?.data?.user))

      alert('Login successful!');
      setLoading(false);
      const user=response?.data?.user;
     // console.log("login user -> ",user);
      navigate('/tickets', { state: { user, } });
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || 'An error occurred');
    }
  };

  return (
    <div className="login-background">
      <div className="login-container">
        <form onSubmit={handleSubmit} className="login-form">
          <h2>Welcome Back!</h2>
          <p>Log in to your account</p>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="submit" className="login-button">
            {loading ? 'Logging In...' : 'Log In'}
          </button>
          {error && <div className="error">{error}</div>}
          <p className="signup-prompt">
            Don't have an account? <a href="/signup">Sign Up</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
