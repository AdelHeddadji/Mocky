import React, { useState } from 'react';
import LogInPage from './LogInPage';
import SignUpPage from './SignUpPage';

function AuthContainer({ onClose, isModal }) {
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'signup'

  const switchAuthMode = (mode) => {
    setAuthMode(mode);
  };

  return authMode === 'login' ? (
    <LogInPage
      onClose={onClose}
      isModal={isModal}
      switchAuthMode={switchAuthMode}
    />
  ) : (
    <SignUpPage
      onClose={onClose}
      isModal={isModal}
      switchAuthMode={switchAuthMode}
    />
  );
}

export default AuthContainer;
