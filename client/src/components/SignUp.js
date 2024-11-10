import React, { useState } from 'react';
import '../styles/signup.css';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userName: '',
    phoneNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
    accountType: 'Customer',  // default value for accountType
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      const response = await fetch('https://helpdesk-yyx0.onrender.com/api/v1/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        alert('Account created successfully!');
        navigate('/login');
        // Redirect to login page or home page
      } else {
        setError(data.message || 'Something went wrong');
      }
    } catch (err) {
      setError('Server error. Please try again later');
    }
  };

  return (
    <div className="signUp-background">
      <div className="signUp-container">
        <form onSubmit={handleSubmit} className="signUp-form">
          <h2>Sign Up</h2>
          {error && <p className="error">{error}</p>}

          <input
            type="text"
            name="userName"
            value={formData.userName}
            onChange={handleChange}
            placeholder="Enter your username"
            required
          />
          <input
            type="text"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            placeholder="Enter your phone number"
            required
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
          />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            required
          />
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm your password"
            required
          />
          <select
            name="accountType"
            value={formData.accountType}
            onChange={handleChange}
          >
            <option value="Customer">Customer</option>
            <option value="Service Agent">Service Agent</option>
            <option value="Admin">Admin</option>
          </select>

          <button type="submit" className="signUp-button">
            Sign Up
          </button>

          <p className="login-prompt">
            Already have an account? <a href="/login">Login here</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
