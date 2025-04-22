import { useRef } from "react";

export default function Answers({
  answers,
  selectedAnswer,
  answerState,
  onSelect,
}) {
  const shuffledAnswers = useRef();

  if (!shuffledAnswers.current) {
    shuffledAnswers.current = [...answers];
    shuffledAnswers.current.sort(() => Math.random() - 0.5);
  }

  return (
    <ul className="my-8">
      {shuffledAnswers.current.map((answer) => {
        const isSelected = selectedAnswer === answer;
        let cssClass = "w-full py-2 rounded-xl";

        if (answerState === "answered" && isSelected) {
          cssClass += " bg-orange-300";
        }

        if (answerState === "correct" && isSelected) {
          cssClass += " bg-green-600";
        }

        if (answerState === "wrong" && isSelected) {
          cssClass += " bg-rose-500";
        }

        return (
          <li
            className="answer w-3/4 my-2 mx-auto text-center text-black rounded-xl shadow-lg bg-white hover:bg-cyan-200"
            key={answer}
          >
            <button
              className={cssClass}
              onClick={() => onSelect(answer)}
              disabled={answerState !== ""}
            >
              {answer}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
