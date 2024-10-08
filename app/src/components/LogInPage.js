// src/components/LogInPage.js
import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './LandingPage.css';
import { AuthContext } from './AuthContext';
import { GoogleLogin } from '@react-oauth/google';

function LogInPage({ onClose, isModal, handleSwitchToSignup }) {
  console.log("LogInPage component is rendering.");
  console.log("API URL:", process.env.REACT_APP_API_URL);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setIsLoggedIn } = useContext(AuthContext);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isGoogleProcessing, setIsGoogleProcessing] = useState(false);

  const handleLogIn = async (event) => {
    event.preventDefault();
    setIsProcessing(true);
    setError('');

    console.log("Attempting to log in with email:", email);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: email, // Use "username" as the key as required by the API
          password: password,
        }),
      });

      const data = await response.json();
      console.log("Login response data:", data);

      if (response.ok) {
        console.log("Login successful");
        setIsLoggedIn(true);
        onClose && onClose();
        navigate('/'); // Redirect to the home page after login
      } else {
        console.error("Login failed with response data:", data);
        setError(data.detail || 'Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Login Error:', error);
      setError('An error occurred during login. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGoogleLoginSuccess = async (credentialResponse) => {
    console.log("Google Login: Initiating request...");

    const { credential } = credentialResponse;
    setIsGoogleProcessing(true);
    setError('');

    console.log("Sending Google login request with the following data:");
    console.log({
      token: credential,
    });

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/google-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: credential,
        }),
      });

      console.log("Received response:", response);

      const data = await response.json();
      console.log("Response data:", data);

      if (response.ok) {
        console.log("Google login was successful");
        setIsLoggedIn(true);
        onClose && onClose();
        navigate('/'); // Redirect to the home page after login
      } else {
        console.error("Google login failed with response data:", data);
        setError(data.detail || 'Google login failed. Please try again.');
      }
    } catch (err) {
      console.error('Google Login Error:', err);
      setError('An error occurred during Google login. Please try again.');
    } finally {
      setIsGoogleProcessing(false);
    }
  };

  const handleGoogleLoginError = () => {
    console.log('Google Login Failed');
    setError('Google login failed. Please try again.');
  };

  return (
    <div className={isModal ? 'modal-login-form' : 'landing-page'}>
      {!isModal && (
        <div className="landing-content">
          <h1>Welcome Back</h1>
          <p>Log in to your account to continue.</p>
        </div>
      )}

      <div className="sign-up-form">
        {isModal && <h2>Log In</h2>}
        <form onSubmit={handleLogIn}>
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
            />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
            />
          </div>
          <button type="submit" className="sign-up-button" disabled={isProcessing}>
            {isProcessing ? 'Processing...' : 'Log In'}
          </button>
        </form>
        {error && <p style={{ color: 'red' }}>{error}</p>}

        <p>Or log in with:</p>

        {/* Google Login Button */}
        <div className="google-login-container">
          <GoogleLogin
            onSuccess={handleGoogleLoginSuccess}
            onError={handleGoogleLoginError}
            disabled={isGoogleProcessing}
          />
        </div>

        {isGoogleProcessing && <p>Processing Google login...</p>}

        {isModal && (
          <p>
            Don't have an account?{' '}
            {/* Use a link styled as a button to switch to signup */}
            <Link
              to="#"
              onClick={handleSwitchToSignup}
              className="switch-button"
              style={{ textDecoration: 'none', color: '#646cff', cursor: 'pointer' }}
            >
              Sign Up Here
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}

export default LogInPage;
