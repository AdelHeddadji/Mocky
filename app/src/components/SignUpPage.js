// src/components/SignUpPage.js
import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './LandingPage.css';
import { AuthContext } from './AuthContext';
import { GoogleLogin } from '@react-oauth/google';

function SignUpPage({ onClose, isModal, handleSwitchToLogin }) {
  console.log("SignUpPage component is rendering.");
  console.log("API URL:", process.env.REACT_APP_API_URL);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const { setIsLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isGoogleProcessing, setIsGoogleProcessing] = useState(false);

  const handleSignup = async (event) => {
    event.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsProcessing(true);

    try {
      // Capture the current date and time as 'createdAt'
      const createdAt = new Date().toISOString();

      const response = await fetch(`${process.env.REACT_APP_API_URL}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          createdAt, // Include createdAt in the request
          is_google_account: false, // Explicitly set this to false for regular sign-ups
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsLoggedIn(true);
        if (onClose) {
          onClose();
        } else {
          navigate('/'); // Adjust the path as needed
        }
      } else {
        setError(data.detail || 'Signup failed. Please try again.');
      }
    } catch (err) {
      console.error('Signup Error:', err);
      setError(`Failed to sign up: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGoogleSignupSuccess = async (credentialResponse) => {
    console.log("Google Signup: Initiating request...");  // Log before the request

    const { credential } = credentialResponse;
    setIsGoogleProcessing(true);
    setError('');

    // Log the request details
    console.log("Sending Google signup request with the following data:");
    console.log({
      token: credential,
      password: "",
      createdAt: new Date().toISOString(),
      is_google_account: true
    });

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/google-signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: credential,
          createdAt: new Date().toISOString(),
          is_google_account: true,
        }),
      });

      console.log("Received response:", response);  // Log response object

      const data = await response.json();

      console.log("Response data:", data);  // Log parsed response data

      if (response.ok) {
        console.log("Signup was successful");
        setIsLoggedIn(true);
        if (onClose) {
          onClose();
        } else {
          navigate('/'); // Adjust the path as needed
        }
      } else {
        console.error("Signup failed with response data:", data);
        setError(data.detail || 'Google signup failed. Please try again.');
      }
    } catch (err) {
      console.error('Google Signup Error:', err);
      setError('An error occurred during Google signup. Please try again.');
    } finally {
      setIsGoogleProcessing(false);
    }
  };

  const handleGoogleSignupError = () => {
    console.log('Google Signup Failed');
    setError('Google signup failed. Please try again.');
  };

  return (
    <div className={isModal ? 'modal-signup-form' : 'landing-page'}>
      {!isModal && (
        <div className="landing-content">
          <h1>Create an Account</h1>
          <p>Sign up to get started with the platform.</p>
        </div>
      )}

      <div className="sign-up-form">
        {isModal && <h2>Sign Up</h2>}
        <form onSubmit={handleSignup}>
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
          <div className="input-group">
            <label>Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Confirm your password"
            />
          </div>
          <button type="submit" className="sign-up-button" disabled={isProcessing}>
            {isProcessing ? 'Processing...' : 'Sign Up'}
          </button>
        </form>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <p>Or sign up with:</p>

        {/* Google Sign Up Button */}
        <div className="google-login-container">
          <GoogleLogin
            onSuccess={handleGoogleSignupSuccess}
            onError={handleGoogleSignupError}
            disabled={isGoogleProcessing}
          />
        </div>

        {isGoogleProcessing && <p>Processing Google signup...</p>}

        {isModal && (
          <p>
            Already have an account?{' '}
            {/* Use a link styled as a button to switch to login */}
            <Link
              to="#"
              onClick={handleSwitchToLogin}
              className="switch-button"
              style={{ textDecoration: 'none', color: '#646cff', cursor: 'pointer' }}
            >
              Log In Here
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}

export default SignUpPage;
