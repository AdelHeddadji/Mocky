// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/HomePage';
import PastInterviewsPage from './components/PastInterviewsPage';
import NewInterviewPage from './components/NewInterviewPage';
import MockInterviewPage from './components/MockInterviewPage';
import { AuthProvider } from './components/AuthContext';
import { GoogleOAuthProvider } from '@react-oauth/google';

function App() {
  console.log("Hello World");
  return (
    <AuthProvider>
      <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            {/* Removed /login and /signup routes */}
            <Route path="/past-interviews" element={<PastInterviewsPage />} />
            <Route path="/new-interview" element={<NewInterviewPage />} />
            <Route path="/mock-interview" element={<MockInterviewPage />} />
          </Routes>
        </Router>
      </GoogleOAuthProvider>
    </AuthProvider>
  );
}

export default App;
