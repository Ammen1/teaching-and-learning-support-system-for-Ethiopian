import React, { useState, useEffect } from 'react';
import { Card, Checkbox, Label, Button } from "flowbite-react";

const QuestionComponent = ({ id }) => {
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedChoices, setSelectedChoices] = useState({});
    const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
    const [quizCompleted, setQuizCompleted] = useState(false);
    const [quizPassMark, setQuizPassMark] = useState(50);
    const [nextDisabled, setNextDisabled] = useState(true);
    const [prevDisabled, setPrevDisabled] = useState(true);
    const [showExplanation, setShowExplanation] = useState(false);

    useEffect(() => {
        fetch(`http://127.0.0.1:8000/api/quiz/get_question_and_choices/${id}/`)
            .then(response => response.json())
            .then(data => {
                setQuestions(data);
                initializeSelectedChoices(data);
                setQuizPassMark(Math.ceil(data.length / 2));
            })
            .catch(error => console.error('Error fetching questions:', error));
    }, [id]);

    useEffect(() => {
        if (Object.values(selectedChoices).some(choice => choice === true)) {
            setNextDisabled(false);
        } else {
            setNextDisabled(true);
        }

        setPrevDisabled(currentQuestionIndex === 0);
    }, [selectedChoices, currentQuestionIndex]);

    const initializeSelectedChoices = (data) => {
        const initialSelectedChoices = {};
        data.forEach(question => {
            question.choices.forEach(choice => {
                initialSelectedChoices[choice.id] = false;
            });
        });
        setSelectedChoices(initialSelectedChoices);
    };

    const handleChoiceClick = (choiceId, correct) => {
        setSelectedChoices(prevState => ({
            ...prevState,
            [choiceId]: !prevState[choiceId]
        }));
        if (correct) {
            setCorrectAnswersCount(prevCount => prevCount + 1);
        }
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex === questions.length - 1) {
            setQuizCompleted(true);
        } else {
            setCurrentQuestionIndex(prevIndex => prevIndex + 1);
            initializeSelectedChoices(questions.slice(currentQuestionIndex + 1));
        }
    };

    const handlePrevQuestion = () => {
        if (currentQuestionIndex !== 0) {
            setCurrentQuestionIndex(prevIndex => prevIndex - 1);
        }
    };

    const renderChoices = (choices) => {
        const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
        return choices.map((choice, index) => (
            <div key={choice.id} className="flex items-center h-28 w-auto">
                <Checkbox
                    id={choice.id}
                    checked={selectedChoices[choice.id]}
                    onChange={() => handleChoiceClick(choice.id, choice.correct)}
                    className="mr-2 font-bold"
                />
                <Label htmlFor={choice.id} className={`cursor-pointer font-bold text-2xl ${selectedChoices[choice.id] && choice.correct ? 'text-green-600  underline' : (selectedChoices[choice.id] && !choice.correct ? 'text-red-600 underline' : 'text-gray-800')}`}>
                    {letters[index]}
                </Label>
                <span className="ml-2 text-md">{choice.choice}</span>
            </div>
        ));
    };

    return (
        <div className="max-w-lg mx-auto p-4 w-full">
            {questions.length > 0 && (
                <Card className="bg-white shadow-md rounded-lg p-6">
                    {quizCompleted ? (
                        <div>
                            <h3 className="text-2xl font-semibold mb-4">Congratulations! You finished the quiz.</h3>
                            {correctAnswersCount >= quizPassMark ? (
                                <p className="text-green-600">You passed the quiz.</p>
                            ) : (
                                <p className="text-red-600">You did not pass the quiz.</p>
                            )}
                            <p className="mt-4 text-sm text-gray-600">Correct Answers: {correctAnswersCount}</p>
                        </div>
                    ) : (
                        <div>
                            <h3 className="text-2xl font-semibold mb-2">{questions[currentQuestionIndex].content}</h3>
                            {questions[currentQuestionIndex].choices && renderChoices(questions[currentQuestionIndex].choices)}
                            <div className="flex justify-between mt-4">
                                <Button 
                                    onClick={handlePrevQuestion}
                                    disabled={prevDisabled}
                                    className="bg-gray-400 hover:bg-gray-500 text-white font-semibold px-6 py-3 rounded-md focus:outline-none transition duration-300"
                                >
                                    Previous
                                </Button>
                                <Button 
                                    onClick={handleNextQuestion} 
                                    disabled={nextDisabled} 
                                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-md focus:outline-none transition duration-300"
                                >
                                    {currentQuestionIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
                                </Button>
                            </div>
                            {showExplanation && (
                                <div>
                                    <h3 className="text-lg font-semibold mt-4">Explanation:</h3>
                                    <p className="text-gray-800">{questions[currentQuestionIndex].explanation}</p>
                                </div>
                            )}
                            <Button 
                                outline 
                                className="mt-4 text-lg text-gray-600"
                                onClick={() => setShowExplanation(!showExplanation)}
                            >
                                {showExplanation ? 'Hide Explanation' : 'Show Explanation'}
                            </Button>
                            <Button 
                                outline 
                                className="mt-4 text-lg text-gray-600 ml-auto"
                            >
                                Correct Answers: {correctAnswersCount}
                            </Button>
                        </div>
                    )}
                </Card>
            )}
        </div>
    );
};

export default QuestionComponent;
