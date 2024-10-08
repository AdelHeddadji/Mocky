import React, { useState, useEffect } from 'react';
import Navbar from './Navbar'; // Import the Navbar component
import './PastInterviewsPage.css';

function PastInterviewsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [pastInterviews, setPastInterviews] = useState([]);
  const [filteredInterviews, setFilteredInterviews] = useState([]);

  useEffect(() => {
    const dummyInterviews = [
      { id: 1, name: 'Amazon SDE Interview', date: '2024-05-20' },
      { id: 2, name: 'Google SWE Interview', date: '2024-06-15' },
      { id: 3, name: 'Microsoft Backend Engineer Interview', date: '2024-07-10' },
      { id: 4, name: 'Facebook Frontend Engineer Interview', date: '2024-08-05' },
    ];
    setPastInterviews(dummyInterviews);
    setFilteredInterviews(dummyInterviews);
  }, []);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);

    const filtered = pastInterviews.filter((interview) =>
      interview.name.toLowerCase().includes(event.target.value.toLowerCase())
    );
    setFilteredInterviews(filtered);
  };

  return (
    <div className="past-interviews-page">
      <Navbar /> {/* Include the Navbar component */}

      {/* Main Content */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search for a past interview..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>
      <div className="interviews-list">
        {filteredInterviews.length > 0 ? (
          filteredInterviews.map((interview) => (
            <div key={interview.id} className="interview-item">
              <h3>{interview.name}</h3>
              <p>{interview.date}</p>
            </div>
          ))
        ) : (
          <p>No interviews found</p>
        )}
      </div>
    </div>
  );
}

export default PastInterviewsPage;
