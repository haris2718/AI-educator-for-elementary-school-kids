import { useState, useEffect } from "react";
import Summary from "./Summary.jsx";
import './Quiz.css';
import correctSound from "./assets/sounds/correct.wav";
import incorrectSound from "./assets/sounds/incorrect.mp3";

export default function Quiz({apiEndpoint}) {
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [incorrectQuestions, setIncorrectQuestions] = useState([]);
  const [questionsQueue, setQuestionsQueue] = useState([]);
  const [showCorrectness, setShowCorrectness] = useState(false);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  const quizIsComplete = (activeQuestionIndex === questionsQueue.length - 1) && (incorrectQuestions.length === 0);

    // Έλεγχος και φόρτωση των δεδομένων από CSV "http://localhost/xampp/quiz_end_point.php"
    useEffect(() => {
      fetch(apiEndpoint)
        .then((response) => response.json())
        .then((data) => {
          setQuestions(data);
          setQuestionsQueue(data);
        })
        .catch((error) => console.error("Error fetching questions:", error));
    }, []);

  const playSound = (sound) => {
    const audio = new Audio(sound);
    audio.play();
  };



  const handleSelectAnswer = (answer) => {
    setSelectedAnswer(answer);
  };

  const handleCheckAnswer = () => {
    if (!questionsQueue || questionsQueue.length === 0) {
      return; // Μην συνεχίζεις αν η questionsQueue είναι κενή ή undefined
    }

    const currentQuestion = questionsQueue[activeQuestionIndex];
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;

    if (isCorrect) {
      playSound(correctSound);
      setIncorrectQuestions((prev) => prev.filter((q) => q.text !== currentQuestion.text));
      setProgress((activeQuestionIndex/questionsQueue.length) * 100)
    } else {
      playSound(incorrectSound);
      setIncorrectQuestions((prev) => [...prev, currentQuestion]);

      // Προσθήκη της λανθασμένης ερώτησης στο τέλος της ουράς
      setQuestionsQueue((prevQuestions) => {
        // Επιστρέφουμε τον νέο πίνακα με την προσθήκη της ερώτησης στο τέλος
        return [...prevQuestions, currentQuestion];
      });
    }

    setShowCorrectness(true);
  };

  const handleNextQuestion = () => {
    // Διασφάλιση ότι δεν θα υπερβούμε τον αριθμό των ερωτήσεων
    if (activeQuestionIndex + 1 < questionsQueue.length) {
      setUserAnswers((prevUserAnswers) => [...prevUserAnswers, selectedAnswer]);
      setSelectedAnswer(null);
      setShowCorrectness(false);
      setActiveQuestionIndex((prevIndex) => prevIndex + 1);
      
    }
  };

  if (questionsQueue.length === 0) {
    return <div>Loading questions...</div>; // Διασφάλιση ότι οι ερωτήσεις είναι έτοιμες
  }

  if (quizIsComplete) {
    return <Summary userAnswers={userAnswers} questions={questionsQueue} />;
  }



  return (
    <div className="quiz-container">
      <div className="progress-container">
        <div className="progress-bar" style={{ width: `${progress}%` }}></div>
      </div>
      <h3>Πρόοδος: {Math.round(progress)}%</h3>

      <h2 className="question-title">{questionsQueue[activeQuestionIndex]?.text}</h2> {/* Προστασία για περίπτωση κενής ερώτησης */}

      <div className="answer-buttons">
        {questionsQueue[activeQuestionIndex]?.answers.map((answer, index) => (
          <button
            key={index}
            onClick={() => handleSelectAnswer(answer)}
            className={`answer-button 
              ${selectedAnswer === answer ? 'selected' : ''} 
              ${showCorrectness && answer === questionsQueue[activeQuestionIndex].correctAnswer ? 'correct' : ''}
              ${showCorrectness && selectedAnswer === answer && answer !== questionsQueue[activeQuestionIndex].correctAnswer ? 'incorrect' : ''}
            `}
            disabled={showCorrectness} // Απενεργοποίηση κουμπιών μετά τον έλεγχο απάντησης
          >
            {answer}
          </button>
        ))}
      </div>

      <div className="button-container">
        <button
          onClick={handleCheckAnswer}
          disabled={selectedAnswer === null || showCorrectness} // Απενεργοποίηση κουμπιού αν δεν υπάρχει απάντηση ή έχει γίνει ήδη έλεγχος
          className={`control-button ${selectedAnswer ? 'active' : ''}`}
        >
          Έλεγχος
        </button>

        {showCorrectness && (
          <button
            onClick={handleNextQuestion}
            className="control-button next-button"
            style={{ cursor: "pointer" }} // Ρύθμιση του δείκτη ως χειρός
          >
            Επόμενη
          </button>
        )}
      </div>
    </div>
  );
}