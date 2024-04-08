import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, Checkbox, Label, Button } from "flowbite-react";

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
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {quizzes.map(quiz => (
          <Card key={quiz.id} className="w-full rounded-md overflow-hidden shadow-lg">
            <Button className="text-xl text-black font-semibold mb-2">{quiz.category}</Button>
            <div className="p-6 ">
              <Card className="text-xl h-20 font-semibold mb-2">{quiz.title}</Card>
              <Button className="text-gray-600 mb-4">Pass Mark: {quiz.pass_mark}%</Button>
              <Button className="text-gray-600 mb-4">course: {quiz.course.title}</Button>
              <Button className="text-gray-600 mb-4">Level: {quiz.course.level}</Button>

              <Link
                to={`/quiz/${quiz.id}`}
                className="inline-block px-2 py-2 bg-gradient-to-r from-indigo-900 via-purple-700 to-pink-900  text-white rounded-md transition duration-300 ease-in-out"
              >
                View Details
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default QuizList;
