// src/components/MockInterviewPage.js

import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';
import { Controlled as CodeMirror } from 'react-codemirror2';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/python/python';
import 'codemirror/mode/clike/clike';
import 'codemirror/mode/ruby/ruby';
import './MockInterviewPage.css';

function MockInterviewPage() {
  const location = useLocation();
  const { interviewName, jobDescription } = location.state || {};

  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [aiTranscript, setAiTranscript] = useState('AI is listening...');
  const [codeWidth, setCodeWidth] = useState(60); // Initial width percentage of code editor

  const getLanguageId = (language) => {
    switch (language) {
      case 'javascript':
        return 63;
      case 'python':
        return 71;
      case 'cpp':
        return 54;
      case 'c':
        return 50;
      case 'ruby':
        return 72;
      default:
        return 63;
    }
  };

  const handleLanguageChange = (e) => {
    setSelectedLanguage(e.target.value);
  };

  const runCode = async () => {
    setIsLoading(true);
    setOutput('');
    setError('');

    const encodedCode = btoa(code);
    const encodedStdin = btoa('');

    const options = {
      method: 'POST',
      url: 'https://judge0-ce.p.rapidapi.com/submissions',
      params: {
        base64_encoded: 'true',
        wait: 'false',
        fields: '*',
      },
      headers: {
        'x-rapidapi-key': '93b971729cmsh4f3b8828b8ca1d9p134aa9jsne28882df2daf',
        'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
        'Content-Type': 'application/json',
      },
      data: {
        language_id: getLanguageId(selectedLanguage),
        source_code: encodedCode,
        stdin: encodedStdin,
      },
    };

    try {
      const response = await axios.request(options);
      const token = response.data.token;

      if (!token) {
        throw new Error('Failed to retrieve submission token');
      }

      let result = await getSubmissionResult(token);
      let attempts = 0;

      while (result && result.status.id <= 2 && attempts < 10) {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        result = await getSubmissionResult(token);
        attempts++;
      }

      if (result) {
        if (result.stdout) {
          setOutput(`${atob(result.stdout)}`);
        } else if (result.stderr) {
          setOutput(`${atob(result.stderr)}`);
        } else if (result.compile_output) {
          setOutput(`${atob(result.compile_output)}`);
        } else {
          setOutput('No output returned.');
        }
      } else {
        setOutput('Failed to retrieve result.');
      }
    } catch (err) {
      if (err.response && err.response.status === 429) {
        setError('Error: Too many requests. Please wait and try again later.');
      } else {
        setError(`Error: ${err.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getSubmissionResult = async (token) => {
    try {
      const resultResponse = await axios.get(
        `https://judge0-ce.p.rapidapi.com/submissions/${token}?base64_encoded=true`,
        {
          headers: {
            'x-rapidapi-key': '93b971729cmsh4f3b8828b8ca1d9p134aa9jsne28882df2daf',
            'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
          },
        }
      );
      return resultResponse.data;
    } catch (err) {
      setError(`Error fetching submission result: ${err.message}`);
      return null;
    }
  };

  // Handle dragging to resize the code and output cards
  const handleMouseDown = (e) => {
    e.preventDefault();
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e) => {
    const newWidth = (e.clientX / window.innerWidth) * 100;
    if (newWidth > 40 && newWidth < 70) { // Set boundaries for the resize
      setCodeWidth(newWidth);
    }
  };

  const handleMouseUp = () => {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  return (
    <div className="mock-interview-page">
      <Navbar />

      <div className="mock-interview-content">
        {/* Problem Description Card */}
        {/* AI Transcript Card */}
        <div className="card ai-card">
          <h2>AI Transcript</h2>
          <p>{aiTranscript}</p>
        </div>

        {/* Code Editor and Terminal Container */}
        <div className="code-output-container">
          {/* Code Editor Card */}
          <div
            className="card code-editor-card"
            style={{ width: `${codeWidth}%` }}
          >
            <div className="language-selection">
              <label htmlFor="language">Select Language: </label>
              <select id="language" value={selectedLanguage} onChange={handleLanguageChange}>
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="cpp">C++</option>
                <option value="c">C</option>
                <option value="ruby">Ruby</option>
              </select>
            </div>
            <CodeMirror
              value={code}
              options={{
                mode: selectedLanguage === 'cpp' || selectedLanguage === 'c' ? 'text/x-csrc' : selectedLanguage,
                theme: 'material',
                lineNumbers: true,
              }}
              onBeforeChange={(editor, data, value) => setCode(value)}
            />
          </div>

          {/* Resizable Divider */}
          <div
            className="divider"
            onMouseDown={handleMouseDown}
            style={{ cursor: 'col-resize', backgroundColor: '#626366', width: '5px' }}
          />

          {/* Output Terminal Card */}
          <div
            className="card output-card"
            style={{ width: `${100 - codeWidth}%` }}
          >
            <div className="run-output-container">
              <button className="run-button" onClick={runCode} disabled={isLoading}>
                {isLoading ? 'Running...' : 'Run Code'}
              </button>
            </div>
            {/* Updated Terminal Style */}
            <div className="terminal">
              <pre>{output}</pre>
            </div>
          </div>
        </div>

        <div className="card problem-card">
          <h2>Problem Statement:</h2>
          <p>{jobDescription || 'Given an array of integers, find the maximum difference between two elements such that the larger element appears after the smaller one.'}</p>
        </div>

        {error && <div className="error-message">{error}</div>}
      </div>
    </div>
  );
}

export default MockInterviewPage;
