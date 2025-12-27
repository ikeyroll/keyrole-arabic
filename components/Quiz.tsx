
import React, { useState, useEffect, useMemo } from 'react';
import { Word } from '../types';
import { X, CheckCircle, XCircle, Trophy, RotateCcw, ArrowRight } from 'lucide-react';

interface QuizProps {
  words: Word[];
  learnedIds: number[];
  onClose: () => void;
}

interface QuizQuestion {
  word: Word;
  options: string[];
  correctAnswer: string;
}

const Quiz: React.FC<QuizProps> = ({ words, learnedIds, onClose }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const learnedWords = useMemo(() => {
    return words.filter(word => learnedIds.includes(word.id));
  }, [words, learnedIds]);

  const quizQuestions = useMemo(() => {
    if (learnedWords.length === 0) return [];
    
    const shuffled = [...learnedWords].sort(() => Math.random() - 0.5);
    const questions: QuizQuestion[] = shuffled.map(word => {
      const wrongOptions = words
        .filter(w => w.id !== word.id)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map(w => w.meaning);
      
      const allOptions = [...wrongOptions, word.meaning].sort(() => Math.random() - 0.5);
      
      return {
        word,
        options: allOptions,
        correctAnswer: word.meaning
      };
    });
    
    return questions;
  }, [learnedWords, words]);

  if (learnedWords.length === 0) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
          <div className="text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy className="text-gray-400" size={40} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">No Words to Quiz</h2>
            <p className="text-gray-500 mb-6">
              You haven't marked any words as learned yet. Tick some words first to start the quiz!
            </p>
            <button
              onClick={onClose}
              className="w-full bg-pink-500 text-white py-3 rounded-xl font-semibold hover:bg-pink-600 transition-colors"
            >
              Got it!
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = quizQuestions[currentQuestionIndex];

  const handleAnswerSelect = (answer: string) => {
    if (isAnswered) return;
    
    setSelectedAnswer(answer);
    setIsAnswered(true);
    
    if (answer === currentQuestion.correctAnswer) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      setQuizCompleted(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setScore(0);
    setQuizCompleted(false);
  };

  if (quizCompleted) {
    const percentage = Math.round((score / quizQuestions.length) * 100);
    
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
          <div className="text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-pink-500 to-rose-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-pink-200">
              <Trophy className="text-white" size={48} />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Quiz Complete!</h2>
            <p className="text-gray-500 mb-6">Great job on completing the quiz!</p>
            
            <div className="bg-gray-50 rounded-2xl p-6 mb-6">
              <div className="text-5xl font-bold text-pink-500 mb-2">{percentage}%</div>
              <div className="text-gray-600 font-medium">
                {score} out of {quizQuestions.length} correct
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleRestart}
                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
              >
                <RotateCcw size={18} />
                Retry
              </button>
              <button
                onClick={onClose}
                className="flex-1 bg-pink-500 text-white py-3 rounded-xl font-semibold hover:bg-pink-600 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-pink-500 rounded-xl flex items-center justify-center">
              <Trophy className="text-white" size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Vocabulary Quiz</h2>
              <p className="text-xs text-gray-500">
                Question {currentQuestionIndex + 1} of {quizQuestions.length}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="mb-6">
          <div className="w-full bg-gray-100 rounded-full h-2 mb-2">
            <div
              className="bg-pink-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestionIndex + 1) / quizQuestions.length) * 100}%` }}
            />
          </div>
          <div className="text-right text-xs text-gray-500 font-medium">
            Score: {score}/{quizQuestions.length}
          </div>
        </div>

        <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl p-8 mb-6 text-center">
          <p className="text-sm text-gray-500 mb-3 uppercase tracking-wider font-bold">
            What does this mean?
          </p>
          <div className="text-6xl font-bold arabic-font text-gray-800 mb-3">
            {currentQuestion.word.arabic}
          </div>
          <div className="text-lg text-pink-600 font-medium mb-1">
            {currentQuestion.word.transliteration}
          </div>
        </div>

        <div className="space-y-3 mb-6">
          {currentQuestion.options.map((option, index) => {
            const isCorrect = option === currentQuestion.correctAnswer;
            const isSelected = option === selectedAnswer;
            
            let buttonClass = 'w-full p-4 rounded-xl border-2 font-semibold text-left transition-all ';
            
            if (!isAnswered) {
              buttonClass += 'border-gray-200 bg-white hover:border-pink-300 hover:bg-pink-50 text-gray-700';
            } else {
              if (isCorrect) {
                buttonClass += 'border-green-500 bg-green-50 text-green-700';
              } else if (isSelected && !isCorrect) {
                buttonClass += 'border-red-500 bg-red-50 text-red-700';
              } else {
                buttonClass += 'border-gray-200 bg-gray-50 text-gray-500';
              }
            }
            
            return (
              <button
                key={index}
                onClick={() => handleAnswerSelect(option)}
                disabled={isAnswered}
                className={buttonClass}
              >
                <div className="flex items-center justify-between">
                  <span>{option}</span>
                  {isAnswered && isCorrect && (
                    <CheckCircle className="text-green-500" size={20} />
                  )}
                  {isAnswered && isSelected && !isCorrect && (
                    <XCircle className="text-red-500" size={20} />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {isAnswered && (
          <button
            onClick={handleNext}
            className="w-full bg-pink-500 text-white py-4 rounded-xl font-semibold hover:bg-pink-600 transition-colors flex items-center justify-center gap-2"
          >
            {currentQuestionIndex < quizQuestions.length - 1 ? (
              <>
                Next Question
                <ArrowRight size={18} />
              </>
            ) : (
              <>
                View Results
                <Trophy size={18} />
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default Quiz;
