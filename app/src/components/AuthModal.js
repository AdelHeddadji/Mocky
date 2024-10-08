import React, { useState } from 'react';
import LogInPage from './LogInPage';
import SignUpPage from './SignUpPage';
import './Modal.css'; // Import the modal CSS

function AuthModal({ onClose, initialForm = 'login' }) {
  const [currentForm, setCurrentForm] = useState(initialForm); // 'login' or 'signup'

  const handleSwitchToLogin = () => {
    setCurrentForm('login');
  };

  const handleSwitchToSignup = () => {
    setCurrentForm('signup');
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <button className="close-button" onClick={onClose}>X</button>
        {currentForm === 'login' ? (
          <LogInPage
            isModal={true}
            onClose={onClose}
            handleSwitchToSignup={handleSwitchToSignup}
          />
        ) : (
          <SignUpPage
            isModal={true}
            onClose={onClose}
            handleSwitchToLogin={handleSwitchToLogin}
          />
        )}
      </div>
    </div>
  );
}

export default AuthModal;

