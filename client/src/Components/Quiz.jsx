import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Quiz = () => {
  const [choices, setChoices] = useState([]);

  useEffect(() => {
    fetchChoices();
  }, []);

  const fetchChoices = () => {
    axios.get('http://127.0.0.1:8000/api/quiz/choice/')
      .then(response => {
        setChoices(response.data);
      })
      .catch(error => {
        console.error('Error fetching choices:', error);
      });
  };

  const handleNext = () => {
    console.log('Move to next question');
  };

  return (
    <div>
      <h1>Quiz</h1>
      <div style={{ marginBottom: '20px' }}>
        {choices.map(choice => (
          <div
            key={choice.id}
            style={{
              padding: '10px',
              marginBottom: '10px',
              borderRadius: '5px',
              border: `1px solid ${choice.correct ? 'green' : 'red'}`,
              backgroundColor: choice.correct ? '#eaffea' : '#ffe8e8',
            }}
          >
            {choice.choice}
          </div>
        ))}
      </div>
      <button
        style={{
          padding: '10px 20px',
          backgroundColor: '#007bff',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
        onClick={handleNext}
      >
        Next
      </button>
    </div>
  );
};

export default Quiz;
