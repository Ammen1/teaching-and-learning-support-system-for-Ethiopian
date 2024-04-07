import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function QuizList() {
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/quiz/quiz/')
      .then(response => response.json())
      .then(data => setQuizzes(data))
      .catch(error => console.error('Error fetching quizzes:', error));
  }, []);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-semibold mb-4">Quiz List</h1>
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {quizzes.map(quiz => (
          <li key={quiz.id} className="bg-white shadow-md rounded-md p-6">
            <h2 className="text-lg font-semibold mb-2">{quiz.title}</h2>
            <p className="text-gray-600 mb-2">{quiz.description}</p>
            <p className="text-gray-600 mb-2">Category: {quiz.category}</p>
            <p className="text-gray-600 mb-2">Pass Mark: {quiz.pass_mark}%</p>
            <Link to={`/quiz/${quiz.id}`} className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-md transition duration-300 ease-in-out">View Details</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default QuizList;
