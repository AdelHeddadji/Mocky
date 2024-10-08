import React, { useState, useContext } from 'react';
import Navbar from './Navbar'; // Import the Navbar component
import './HomePage.css';
import './LandingPage.css';
import AuthModal from './AuthModal'; // Import the AuthModal component
import { AuthContext } from './AuthContext';

function HomePage() {
  const { isLoggedIn } = useContext(AuthContext);
  const [showModal, setShowModal] = useState(false);

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className="homepage">
      <Navbar openModal={openModal} />

      {/* Main Content */}
      <div className="homepage-content">
        <h1 className="homepage-title">Prep Pal</h1>
        <p className="homepage-subtitle">An easy way to prepare for interviews</p>

        {!isLoggedIn && (
          <div className="auth-buttons">
            <button onClick={openModal}>Get Started</button>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-button" onClick={closeModal}>X</button>
            <AuthModal onClose={closeModal} />
          </div>
        </div>
      )}
    </div>
  );
}

export default HomePage;
