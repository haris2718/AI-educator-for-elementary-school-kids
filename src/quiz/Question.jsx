import QuestionTimer from "./QuestionTimer";
import Answers from "./Answers";
import { useState } from "react";

export default function Question({ index, question, onSelectAnswer, onSkipAnswer }) {
  const [answer, setAnswer] = useState({
    selectedAnswer: "",
    isCorrect: null,
  });

  let timer = 10000;
  if (answer.selectedAnswer) {
    timer = 1000;
  }
  if (answer.isCorrect != null) {
    timer = 2000;
  }

  function handleSelectAnswer(selectedAnswer) {
    setAnswer({ selectedAnswer, isCorrect: null });
    setTimeout(() => {
      setAnswer({
        selectedAnswer,
        isCorrect: question.correctAnswer === selectedAnswer,
      });
      setTimeout(() => {
        onSelectAnswer(selectedAnswer);
      }, 2000);
    }, 1000);
  }

  let answerState = "";
  if (answer.selectedAnswer && answer.isCorrect !== null) {
    answerState = answer.isCorrect ? "correct" : "wrong";
  } else if (answer.selectedAnswer) {
    answerState = "answered";
  }

  return (
    <div id="question" className="rounded-xl p-10 w-3/4 mx-auto text-center border-2 shadow-2xl">
      <QuestionTimer
        key={timer}
        timeout={timer}
        onTimeOut={answer.selectedAnswer === "" ? onSkipAnswer : null}
        mode={answerState}
      />
      <h2 className="question-text">{question.text}</h2>
      <Answers
        answers={question.answers}
        selectedAnswer={answer.selectedAnswer}
        answerState={answerState}
        onSelect={handleSelectAnswer}
      />
    </div>
  );
}
