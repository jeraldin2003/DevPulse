import { useState } from "react";

export default function QuizPanel() {
    const [quizState, setQuizState] = useState("selection"); // selection, playing, finished
    const [difficulty, setDifficulty] = useState("");
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const startQuiz = async (selectedDifficulty) => {
        setDifficulty(selectedDifficulty);
        setLoading(true);
        setError(null);
        setQuizState("playing");
        setScore(0);
        setCurrentQuestionIndex(0);

        try {
            let url = "https://opentdb.com/api.php?amount=10&type=multiple";
            if (selectedDifficulty !== "random") {
                url += `&difficulty=${selectedDifficulty}`;
            }

            const response = await fetch(url);
            if (!response.ok) throw new Error("Failed to fetch questions");
            const data = await response.json();
            
            if (data.results && data.results.length > 0) {
                // Shuffle answers for each question
                const formattedQuestions = data.results.map((q) => {
                    const answers = [...q.incorrect_answers, q.correct_answer].sort(() => Math.random() - 0.5);
                    return {
                        ...q,
                        options: answers
                    };
                });
                setQuestions(formattedQuestions);
            } else {
                throw new Error("No questions found");
            }
        } catch (err) {
            setError(err.message);
            setQuizState("selection");
        } finally {
            setLoading(false);
        }
    };

    const handleAnswerClick = (selectedOption, correctAnswer) => {
        if (selectedOption === correctAnswer) {
            setScore(score + 1);
        }
        
        if (currentQuestionIndex + 1 < questions.length) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            setQuizState("finished");
        }
    };

    if (quizState === "selection") {
        return (
            <div className="flex flex-col items-center justify-center p-8 bg-white border border-slate-200 rounded-xl shadow-sm">
                <h2 className="text-2xl font-bold mb-6 text-slate-800">Start a New Quiz</h2>
                <p className="text-slate-600 mb-8">Select difficulty (10 questions)</p>
                <div className="grid grid-cols-2 gap-4 w-full max-w-md">
                    {["easy", "medium", "hard", "random"].map((level) => (
                        <button
                            key={level}
                            onClick={() => startQuiz(level)}
                            className="px-6 py-3 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold rounded-lg transition-colors border border-blue-200 capitalize cursor-pointer"
                        >
                            {level}
                        </button>
                    ))}
                </div>
                {error && <p className="text-rose-500 mt-4">{error}</p>}
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center p-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (quizState === "finished") {
        return (
            <div className="flex flex-col items-center justify-center p-12 bg-white border border-slate-200 rounded-xl shadow-sm">
                <h2 className="text-3xl font-bold mb-4 text-slate-800">Quiz Completed!</h2>
                <p className="text-xl text-slate-600 mb-8">
                    Your Score: <span className="font-bold text-blue-600">{score}</span> / {questions.length}
                </p>
                <button
                    onClick={() => setQuizState("selection")}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors shadow-sm cursor-pointer"
                >
                    Play Again
                </button>
            </div>
        );
    }

    const currentQuestion = questions[currentQuestionIndex];

    return (
        <div className="flex flex-col max-w-2xl mx-auto">
            <div className="flex justify-between items-center mb-6 px-2">
                <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
                    Question {currentQuestionIndex + 1} of {questions.length}
                </span>
                <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
                    Score: {score}
                </span>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm mb-6">
                <div className="flex justify-between items-start mb-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800 capitalize">
                        {currentQuestion.category}
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                        currentQuestion.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                        currentQuestion.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                    }`}>
                        {currentQuestion.difficulty}
                    </span>
                </div>
                <h3 
                    className="text-xl font-medium text-slate-800 mb-6"
                    dangerouslySetInnerHTML={{ __html: currentQuestion.question }}
                />

                <div className="flex flex-col gap-3">
                    {currentQuestion.options.map((option, index) => (
                        <button
                            key={index}
                            onClick={() => handleAnswerClick(option, currentQuestion.correct_answer)}
                            className="text-left w-full px-5 py-4 rounded-lg border border-slate-200 hover:border-blue-500 hover:bg-blue-50 transition-all text-slate-700 cursor-pointer"
                            dangerouslySetInnerHTML={{ __html: option }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}