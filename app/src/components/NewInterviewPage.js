import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar'; // Import the Navbar component
import './NewInterviewPage.css'; // CSS file for styling

function NewInterviewPage() {
  const [interviewName, setInterviewName] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [timeFrame, setTimeFrame] = useState('');
  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();

    // Log the new interview details (this can be replaced with logic to save it to a database)
    console.log('New Interview Details:', { interviewName, jobDescription, difficulty, timeFrame });

    // Navigate to the Mock Interview page after form submission
    navigate('/mock-interview', { state: { interviewName, jobDescription, difficulty, timeFrame } });
  };

  return (
    <div className="new-interview-page">
      <Navbar /> {/* Include the Navbar component */}

      {/* Main Content */}
      <div className="new-interview-content">
        <h1>Create a New Interview</h1>
        <form className="new-interview-form" onSubmit={handleSubmit}>
          {/* Interview Name */}
          <div className="form-group">
            <label htmlFor="interviewName">Interview Name</label>
            <input
              type="text"
              id="interviewName"
              value={interviewName}
              onChange={(e) => setInterviewName(e.target.value)}
              placeholder="Enter the interview name"
              required
            />
          </div>

          {/* Job Description */}
          <div className="form-group">
            <label htmlFor="jobDescription">Job Description</label>
            <textarea
              id="jobDescription"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description here"
              rows="5"
              required
            />
          </div>

          {/* Difficulty Level */}
          <div className="form-group">
            <label>Difficulty</label>
            <div className="difficulty-options">
              <label>
                <input
                  type="radio"
                  name="difficulty"
                  value="Easy"
                  checked={difficulty === 'Easy'}
                  onChange={(e) => setDifficulty(e.target.value)}
                />
                Easy
              </label>
              <label>
                <input
                  type="radio"
                  name="difficulty"
                  value="Medium"
                  checked={difficulty === 'Medium'}
                  onChange={(e) => setDifficulty(e.target.value)}
                />
                Medium
              </label>
              <label>
                <input
                  type="radio"
                  name="difficulty"
                  value="Hard"
                  checked={difficulty === 'Hard'}
                  onChange={(e) => setDifficulty(e.target.value)}
                />
                Hard
              </label>
            </div>
          </div>

          {/* Time Frame */}
          <div className="form-group">
            <label htmlFor="timeFrame">Time Frame (minutes)</label>
            <input
              type="number"
              id="timeFrame"
              value={timeFrame}
              onChange={(e) => setTimeFrame(e.target.value)}
              placeholder="e.g., 30, 60, 90"
              required
            />
          </div>

          {/* Submit Button */}
          <button type="submit" className="create-button">Create Interview</button>
        </form>
      </div>
    </div>
  );
}

export default NewInterviewPage;
