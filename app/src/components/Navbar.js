import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import { AuthContext } from './AuthContext';

function Navbar({ openModal }) {
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  // Toggle dropdown menu visibility
  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  // Handle user logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    navigate('/');
  };

  return (
    <div className="navbar">
      <div className="navbar-left">
        <Link to="/" className="navbar-link">Home</Link>
        <Link to="/past-interviews" className="navbar-link">Past Interviews</Link>
        <Link to="/new-interview" className="navbar-link">New Interview</Link>
      </div>
      <div className="navbar-right">
        <button className="upgrade-button">Upgrade</button>
        {isLoggedIn ? (
          <div className="profile-icon" onClick={toggleDropdown}>
            <img src="https://via.placeholder.com/40" alt="Profile" />
            {showDropdown && (
              <div className="dropdown-menu">
                <button className="dropdown-item" onClick={handleLogout}>Log Out</button>
              </div>
            )}
          </div>
        ) : (
          <button className="sign-in-button" onClick={() => openModal('login')}>Sign In</button>
        )}
      </div>
    </div>
  );
}

export default Navbar;
