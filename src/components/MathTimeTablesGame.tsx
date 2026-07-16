import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, RefreshCw, Play } from 'lucide-react';
import { playPop, speak } from '../utils/audio';
import { ActivityProps } from './ActivityWrapper';

interface TimeTableLevel {
  num1: number;
  num2: number;
  missingPosition: 'result' | 'factor2'; // e.g. 2 x 3 = ? or 2 x ? = 6
  toyEmoji: string;
  toyName: string;
}

const TOYS = [
  { emoji: '🧸', name: 'teddy bears' },
  { emoji: '🍎', name: 'sweet apples' },
  { emoji: '🚗', name: 'toy cars' },
  { emoji: '🎈', name: 'balloons' },
  { emoji: '🐱', name: 'kittens' },
  { emoji: '🍓', name: 'strawberries' },
  { emoji: '🐶', name: 'puppies' },
  { emoji: '⭐', name: 'stars' },
  { emoji: '🍦', name: 'ice creams' },
  { emoji: '🚀', name: 'rockets' },
  { emoji: '🍩', name: 'donuts' },
  { emoji: '🐼', name: 'pandas' },
];

export default function MathTimeTablesGame({ level, onAnswer }: ActivityProps) {
  const [challenge, setChallenge] = useState<TimeTableLevel | null>(null);
  const [options, setOptions] = useState<number[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [quizStatus, setQuizStatus] = useState<'waiting' | 'correct' | 'wrong'>('waiting');
  const [shake, setShake] = useState(false);
  const [score, setScore] = useState(0);

  // Correct answer calculation
  const correctAnswer = useMemo(() => {
    if (!challenge) return 0;
    return challenge.missingPosition === 'result' ? challenge.num1 * challenge.num2 : challenge.num2;
  }, [challenge]);

  const speakQuizChallenge = (chal: TimeTableLevel) => {
    if (chal.missingPosition === 'result') {
      speak(`What is ${chal.num1} times ${chal.num2}?`);
    } else {
      speak(`${chal.num1} times what number equals ${chal.num1 * chal.num2}?`);
    }
  };

  const generateQuizChallenge = () => {
    const toy = TOYS[Math.floor(Math.random() * TOYS.length)];
    let num1 = 1;
    let num2 = 1;

    // Difficulty grouping:
    // Level 1: 1x and 2x tables (multiplier up to 5)
    // Level 2: 5x and 10x tables (multiplier up to 10)
    // Level 3: 3x and 4x tables (multiplier up to 10)
    // Level 4: 6x, 7x, 8x tables (multiplier up to 10)
    // Level 5: Mixed tables 1x to 10x (multiplier up to 10)
    if (level === 1) {
      num1 = Math.random() > 0.5 ? 1 : 2;
      num2 = Math.floor(Math.random() * 5) + 1; // 1 to 5
    } else if (level === 2) {
      num1 = Math.random() > 0.5 ? 5 : 10;
      num2 = Math.floor(Math.random() * 10) + 1; // 1 to 10
    } else if (level === 3) {
      num1 = Math.random() > 0.5 ? 3 : 4;
      num2 = Math.floor(Math.random() * 10) + 1;
    } else if (level === 4) {
      const factors = [6, 7, 8];
      num1 = factors[Math.floor(Math.random() * factors.length)];
      num2 = Math.floor(Math.random() * 10) + 1;
    } else {
      num1 = Math.floor(Math.random() * 10) + 1;
      num2 = Math.floor(Math.random() * 10) + 1;
    }

    const missingPosition = Math.random() > 0.75 ? 'factor2' : 'result';

    setChallenge({
      num1,
      num2,
      missingPosition,
      toyEmoji: toy.emoji,
      toyName: toy.name,
    });
    setSelectedAnswer(null);
    setQuizStatus('waiting');
  };

  useEffect(() => {
    generateQuizChallenge();
  }, [level]);

  useEffect(() => {
    if (!challenge) return;
    const ans = correctAnswer;
    const opts = new Set<number>();
    opts.add(ans);

    const step = challenge.missingPosition === 'result' ? challenge.num1 : 1;

    while (opts.size < 3) {
      const dev = (Math.floor(Math.random() * 3) + 1) * (Math.random() > 0.5 ? 1 : -1) * step;
      const candidate = ans + dev;
      if (candidate > 0 && candidate !== ans) {
        opts.add(candidate);
      }
    }

    setOptions(Array.from(opts).sort((a, b) => a - b));

    const timer = setTimeout(() => {
      speakQuizChallenge(challenge);
    }, 400);

    return () => clearTimeout(timer);
  }, [challenge, correctAnswer]);

  const handleAnswerClick = (num: number) => {
    if (quizStatus === 'correct' || !challenge) return;

    setSelectedAnswer(num);

    if (num === correctAnswer) {
      setQuizStatus('correct');
      setScore(prev => prev + 5);
      onAnswer(true);

      const randomCheers = [
        "Splendid!",
        "Double star job!",
        "You are a times table champion!",
        "Awesome multiplication!"
      ];
      
      const speechText = challenge.missingPosition === 'result'
        ? `${randomCheers[Math.floor(Math.random() * randomCheers.length)]} ${challenge.num1} times ${challenge.num2} is indeed ${num}!`
        : `Super! Yes, ${challenge.num1} times ${num} equals ${challenge.num1 * challenge.num2}!`;

      speak(speechText);

      setTimeout(() => {
        generateQuizChallenge();
      }, 2500);
    } else {
      setQuizStatus('wrong');
      setShake(true);
      onAnswer(false);
      
      speak(`Oh! Let's count row by row to find the answer!`);

      setTimeout(() => {
        setShake(false);
        setQuizStatus('waiting');
        setSelectedAnswer(null);
      }, 1500);
    }
  };

  const resetQuiz = () => {
    playPop();
    setScore(0);
    generateQuizChallenge();
  };

  return (
    <div id="math_timestables_game_main" className="flex flex-col items-center w-full max-w-3xl mx-auto p-4 sm:p-6 bg-white border-4 border-rose-400 rounded-[32px] shadow-sm">
      
      {/* Quiz Header Score */}
      <div className="w-full flex justify-between items-center mb-4">
        <span className="flex items-center gap-1.5 text-rose-500 font-black text-sm">
          🎮 Quiz Score: {score}
        </span>
        <button
          onClick={resetQuiz}
          className="hover:text-rose-500 transition-colors flex items-center gap-1 cursor-pointer text-[10px] font-black uppercase text-kid-sub"
        >
          <RefreshCw size={11} /> Reset Score
        </button>
      </div>

      {challenge && (
        <div className="w-full flex flex-col items-center">
          
          {/* Equation Card */}
          <div id="equation_bubble_card" className="w-full bg-kid-cream/55 p-6 rounded-[28px] border-4 border-dashed border-rose-300/35 flex flex-col items-center mb-6 shadow-inner relative">
            
            {/* Speaker Button */}
            <button 
              onClick={() => speakQuizChallenge(challenge)}
              className="absolute top-4 right-4 p-2 bg-white hover:bg-stone-50 border-2 border-stone-200 rounded-full shadow-sm cursor-pointer"
            >
              <Volume2 size={16} className="text-rose-400" />
            </button>

            <div className="flex items-center gap-4 text-4xl sm:text-5xl font-black text-kid-dark tracking-tight mb-6 select-none mt-2">
              <span>{challenge.num1}</span>
              <span className="text-kid-red">×</span>
              <span>
                {challenge.missingPosition === 'factor2' && selectedAnswer === null ? (
                  <span className="text-kid-purple animate-bounce">?</span>
                ) : challenge.missingPosition === 'factor2' ? (
                  <span className="text-kid-purple font-black">{selectedAnswer}</span>
                ) : (
                  challenge.num2
                )}
              </span>
              <span className="text-kid-blue-text">=</span>
              <span>
                {challenge.missingPosition === 'result' && selectedAnswer === null ? (
                  <span className="text-kid-purple animate-bounce">?</span>
                ) : challenge.missingPosition === 'result' ? (
                  <span className="text-kid-green-dark font-black">{selectedAnswer}</span>
                ) : (
                  challenge.num1 * challenge.num2
                )}
              </span>
            </div>

            {/* Supporting visual array - compact size for helper */}
            <div className="flex flex-col gap-1.5 p-3 bg-white/80 rounded-[20px] border-2 border-dashed border-stone-200 shadow-inner max-w-full overflow-auto">
              {Array.from({ length: challenge.num1 }).map((_, rIdx) => (
                <div key={`quiz-row-${rIdx}`} className="flex gap-1.5 justify-center">
                  {Array.from({ length: challenge.num2 }).map((_, cIdx) => (
                    <div
                      key={`quiz-col-${cIdx}`}
                      className="w-8 h-8 rounded-lg bg-stone-50 border border-stone-100 flex items-center justify-center animate-pulse"
                    >
                      <span className="text-lg select-none">{challenge.toyEmoji}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <p className="text-[10px] font-bold text-kid-sub mt-4">
              💡 Hint: There are {challenge.num1} rows of {challenge.num2} {challenge.toyEmoji} above! Count them!
            </p>

          </div>

          {/* Choices balloon selectors */}
          <div id="choices_area" className="w-full bg-kid-cream/25 p-6 rounded-3xl border-3 border-stone-200/50 flex flex-col items-center">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-rose-400 mb-4">
              👇 Tap the correct balloon to answer!
            </h4>

            <div className="grid grid-cols-3 gap-4 w-full max-w-md">
              {options.map((num) => {
                const isMatchOfSelected = selectedAnswer === num;
                return (
                  <motion.button
                    key={num}
                    whileHover={{ scale: 1.06 }}
                    whileTap={{ scale: 0.94 }}
                    animate={shake && isMatchOfSelected && quizStatus === 'wrong' ? { x: [-10, 10, -10, 10, 0] } : {}}
                    transition={{ duration: 0.3 }}
                    disabled={selectedAnswer !== null}
                    onClick={() => handleAnswerClick(num)}
                    className={`p-5 rounded-[22px] border-3 shadow-md flex flex-col items-center justify-center cursor-pointer transition-all ${
                      isMatchOfSelected && quizStatus === 'correct'
                        ? 'border-kid-green-dark bg-kid-green-bg text-kid-green-dark scale-102 font-black text-3xl'
                        : isMatchOfSelected && quizStatus === 'wrong'
                          ? 'border-kid-red bg-red-50 text-kid-red font-black text-3xl'
                          : 'bg-white hover:bg-stone-50 border-stone-200 hover:border-rose-400 text-kid-dark font-black text-3xl'
                    }`}
                  >
                    {num}
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Footer Level Info */}
          <div className="w-full mt-6 pt-4 border-t border-stone-100 text-center text-[10px] font-black uppercase text-kid-sub">
            <span>
              Level {level}: {
                level === 1 ? "1x & 2x Tables (simple multiplication)" :
                level === 2 ? "5x & 10x Tables (skip counting master)" :
                level === 3 ? "3x & 4x Tables (intermediate math)" :
                level === 4 ? "6x, 7x & 8x Tables (advanced explorer)" :
                "Mixed Tables up to 10x10"
              }
            </span>
          </div>

        </div>
      )}

    </div>
  );
}
