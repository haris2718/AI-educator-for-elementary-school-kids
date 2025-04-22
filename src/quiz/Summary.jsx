import quizCompletedImg from "../images/logo.jpg";

export default function Summary({ userAnswers, questions = [] }) {
  const skippedAnswers = userAnswers.filter((answer) => answer === null);
  const correctAnswers = userAnswers.filter(
    (answer, index) => answer === questions[index]?.correctAnswer
  );

  const skippedAnswersShare = Math.round(
    (skippedAnswers.length / userAnswers.length) * 100
  );

  const correctAnswersShare = Math.round(
    (correctAnswers.length / userAnswers.length) * 100
  );

  const wrongAnswersShare = 100 - skippedAnswersShare - correctAnswersShare;

  return (
    <div className="bg-gray-200 text-black rounded-xl p-6 text-center w-2/5 mx-auto border-2 border-black shadow-xl">
      <img
        className="h-32 w-42 rounded-xl shadow-md mb-6"
        src={quizCompletedImg}
        alt="Trophy Icon"
      />
      <h2 className="uppercase text-5xl text-shadow">Quiz Completed!</h2>
      <div className="flex justify-center gap-6 p-6 uppercase">
        <p className="grid w-1/3">
          <span className="text-xl text-shadow">{skippedAnswersShare}%</span>
          <span className="text-xs p-2">skipped</span>
        </p>
        <p className="grid w-1/3">
          <span className="text-xl text-shadow">{correctAnswersShare}%</span>
          <span className="text-xs p-2">answered correctly</span>
        </p>
        <p className="grid w-1/3">
          <span className="text-xl text-shadow">{wrongAnswersShare}%</span>
          <span className="text-xs p-2">answered incorrectly</span>
        </p>
      </div>
      <div className="border-t-4 border-black rounded m-6"></div>
      <ol>
        {userAnswers.map((answer, index) => {
          let cssClass = "";

          if (answer === null) {
            cssClass += " text-yellow-500";
          } else if (answer === questions[index]?.correctAnswer) {
            cssClass += " text-green-600";
          } else {
            cssClass += " text-red-600";
          }

          return (
            <li key={index} className="m-6 font-semibold">
              <h3 className="bg-black w-6 mx-auto rounded-xl text-white mb-2">
                {index + 1}
              </h3>
              <p className="mb-1">{questions[index]?.text ?? "N/A"}</p>
              <p className={cssClass}>{answer ?? "Skipped"}</p>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
