import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setQuestions } from "./quizSlice";
import QuizPage from "./QuizPage";

function Quiz() {
  const { name: selectedQuiz, quizzes } = useSelector((state) => state.home);
  const { questions, index } = useSelector((state) => state.quiz);
  const selectedQuizData = quizzes.find((item) => item.title === selectedQuiz);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [randomQuestions, setRandomQuestions] = useState([]);

  const currentQuestion = randomQuestions[index];

  const getRandomQuestions = (questions, numberOfQuestions = 10) => {
    const shuffled = [...questions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, numberOfQuestions);
  };

  const getAllQuestions = () => {
    return quizzes.reduce((acc, quiz) => acc.concat(quiz.questions), []);
  };

  useEffect(() => {
    if (selectedQuizData?.questions) {
      const randomSelectedQuestions = getRandomQuestions(selectedQuizData.questions);
      setRandomQuestions(randomSelectedQuestions);
      dispatch(setQuestions(randomSelectedQuestions));
    }
  }, [selectedQuiz, selectedQuizData, dispatch]);

  const handleRandomSelection = () => {
    const allQuestions = getAllQuestions();
    const randomSelectedQuestions = getRandomQuestions(allQuestions);
    setRandomQuestions(randomSelectedQuestions);
    dispatch(setQuestions(randomSelectedQuestions));
  };

  const handleQuizCompletion = () => {
    const calculatedScore = randomQuestions.reduce((acc, question) => {
      return acc + (question.correct ? 1 : 0);
    }, 0);

    navigate("/finish", { state: { score: calculatedScore } });
  };

  useEffect(() => {
    if (index >= randomQuestions.length) {
      handleQuizCompletion();
    }
  }, [index, randomQuestions.length]);

  return (
    <div>
      {selectedQuiz === "Random" && (
        <button
          onClick={handleRandomSelection}
          className="rounded-full bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 px-6 py-3 text-black shadow-lg hover:from-purple-500 hover:via-pink-600 hover:to-red-600 transition-all duration-300"
        >
          Click to randomize questions
        </button>
      )}
      {currentQuestion && (
        <QuizPage key={currentQuestion.question} question={currentQuestion} explanation={currentQuestion.explanation} />
      )}
    </div>
  );
}

export default Quiz;
