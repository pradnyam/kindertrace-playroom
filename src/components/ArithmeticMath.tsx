import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Award, RefreshCw, Volume2, Sparkles } from 'lucide-react';
import { playPop, speak } from '../utils/audio';
import { ActivityProps } from './ActivityWrapper';

interface MathLevel {
  num1: number;
  num2: number;
  operator: '+' | '-';
  toyEmoji: string;
  toyName: string;
}

const TOYS = [
  { emoji: '🧸', name: 'teddy bears' },
  { emoji: '🍎', name: 'apples' },
  { emoji: '🚗', name: 'toy cars' },
  { emoji: '🎈', name: 'balloons' },
  { emoji: '🐱', name: 'kittens' },
  { emoji: '🍓', name: 'strawberries' },
  { emoji: '🐶', name: 'puppies' },
  { emoji: '⭐', name: 'sparkle stars' },
  { emoji: '🍦', name: 'ice creams' },
  { emoji: '🚀', name: 'rocket ships' },
];

export default function ArithmeticMath({ level, onAnswer }: ActivityProps) {
  const [currentLevel, setCurrentLevel] = useState<MathLevel | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [status, setStatus] = useState<'waiting' | 'correct' | 'wrong'>('waiting');
  const [shake, setShake] = useState(false);
  const [score, setScore] = useState(0);

  // Correct answer calculation
  const correctAnswer = useMemo(() => {
    if (!currentLevel) return 0;
    return currentLevel.operator === '+' ? currentLevel.num1 + currentLevel.num2 : currentLevel.num1 - currentLevel.num2;
  }, [currentLevel]);

  const [options, setOptions] = useState<number[]>([]);

  const generateLevelData = () => {
    const toy = TOYS[Math.floor(Math.random() * TOYS.length)];
    
    // Adaptive difficulty logic:
    // Level 1: Addition 1-5
    // Level 2: Subtraction 1-5
    // Level 3: Addition 1-10
    // Level 4: Subtraction 1-10
    // Level 5: Mixed 1-20
    const isAddition = level === 1 ? true : level === 2 ? false : level === 3 ? true : level === 4 ? false : Math.random() > 0.5;
    
    const range = level <= 2 ? 5 : level <= 4 ? 10 : 15;
    const num1 = Math.floor(Math.random() * (range - 1)) + 2;
    const num2 = Math.floor(Math.random() * (isAddition ? (range - num1 + 1) : num1 - 1)) + 1;

    setCurrentLevel({
      num1,
      num2,
      operator: isAddition ? '+' : '-',
      toyEmoji: toy.emoji,
      toyName: toy.name,
    });
    setSelectedAnswer(null);
    setStatus('waiting');
  };

  useEffect(() => {
    generateLevelData();
  }, [level]);

  useEffect(() => {
    if (!currentLevel) return;
    const opts = new Set<number>();
    opts.add(correctAnswer);
    
    while (opts.size < 3) {
      const dev = Math.floor(Math.random() * 5) - 2; // -2 to +2
      const candidate = correctAnswer + dev;
      if (candidate >= 0 && candidate !== correctAnswer) {
        opts.add(candidate);
      }
    }
    
    setOptions(Array.from(opts).sort((a, b) => a - b));
  }, [currentLevel, correctAnswer]);

  const speakEquation = () => {
    if (!currentLevel) return;
    const verbalOperator = currentLevel.operator === '+' ? "plus" : "minus";
    const phrase = `What is ${currentLevel.num1} ${verbalOperator} ${currentLevel.num2}? Let's look at the ${currentLevel.toyName}!`;
    speak(phrase);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      speakEquation();
    }, 400);
    return () => clearTimeout(timer);
  }, [currentLevel]);

  const handleAnswerClick = (num: number) => {
    if (status === 'correct' || !currentLevel) return;

    setSelectedAnswer(num);
    if (num === correctAnswer) {
      setStatus('correct');
      setScore(prev => prev + 5);
      onAnswer(true);
      
      const randomCheers = [
        "That's right!",
        "Excellent!",
        "Super math explorer!",
        "You got it!"
      ];
      speak(`${randomCheers[Math.floor(Math.random() * randomCheers.length)]} ${currentLevel.num1} ${currentLevel.operator === '+' ? 'plus' : 'minus'} ${currentLevel.num2} equals ${num}!`);
      
      setTimeout(() => {
        generateLevelData();
      }, 2500);
    } else {
      setStatus('wrong');
      setShake(true);
      onAnswer(false);
      setTimeout(() => {
        setShake(false);
        setStatus('waiting');
        setSelectedAnswer(null);
      }, 1500);
      speak(`Oops! Let's count them again!`);
    }
  };

  const resetGame = () => {
    playPop();
    setScore(0);
    generateLevelData();
    speak("Let's restart! Point at the toys to count them!");
  };

  const renderToyVisuals = () => {
    if (!currentLevel) return null;
    const { num1, num2, operator, toyEmoji, toyName } = currentLevel;
    
    if (operator === '+') {
      return (
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8 w-full py-4">
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-black text-kid-sub uppercase mb-2 tracking-widest bg-white py-1 px-3 rounded-full border-2 border-kid-peach/40">
              {num1} {toyName}
            </span>
            <div className="flex flex-wrap gap-2 max-w-[180px] justify-center bg-white p-4 rounded-3xl border-3 border-kid-peach/50 shadow-inner">
              {Array.from({ length: num1 }).map((_, i) => (
                <motion.span
                  key={`n1-${i}`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 0.05, type: 'spring' }}
                  onClick={() => { playPop(); speak(`${i + 1}`); }}
                  className="text-3xl select-none filter drop-shadow-xs cursor-pointer hover:scale-125 hover:rotate-6 active:scale-95 transition-transform"
                >
                  {toyEmoji}
                </motion.span>
              ))}
            </div>
          </div>

          <div className="text-4xl font-black text-kid-red filter drop-shadow-xs">+</div>

          <div className="flex flex-col items-center">
            <span className="text-[10px] font-black text-kid-sub uppercase mb-2 tracking-widest bg-white py-1 px-3 rounded-full border-2 border-kid-blue/40">
              {num2} {toyName}
            </span>
            <div className="flex flex-wrap gap-2 max-w-[180px] justify-center bg-white p-4 rounded-3xl border-3 border-kid-blue/50 shadow-inner">
              {Array.from({ length: num2 }).map((_, i) => (
                <motion.span
                  key={`n2-${i}`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 0.05, type: 'spring' }}
                  onClick={() => { playPop(); speak(`${num1 + i + 1}`); }}
                  className="text-3xl select-none filter drop-shadow-xs cursor-pointer hover:scale-125 hover:rotate-6 active:scale-95 transition-transform"
                >
                  {toyEmoji}
                </motion.span>
              ))}
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="flex flex-col items-center justify-center w-full py-4">
          <span className="text-[10px] font-black text-kid-sub uppercase mb-2 tracking-widest bg-white py-1 px-3 rounded-full border-2 border-kid-purple/40">
            Start with {num1}, take away {num2} {toyName}
          </span>
          
          <div className="flex flex-wrap gap-3 max-w-[400px] justify-center bg-white p-6 rounded-[32px] border-4 border-dashed border-kid-purple/30 shadow-inner">
            {Array.from({ length: num1 }).map((_, i) => {
              const isCrossedOut = i >= (num1 - num2);
              return (
                <div key={`sub-${i}`} className="relative">
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: isCrossedOut ? 0.8 : 1, opacity: isCrossedOut ? 0.3 : 1 }}
                    className="text-4xl select-none filter drop-shadow-xs block cursor-pointer transition-all"
                    onClick={() => {
                      if (isCrossedOut) {
                        playPop();
                        speak("Taken away!");
                      } else {
                        playPop();
                        speak(`${i + 1}`);
                      }
                    }}
                  >
                    {toyEmoji}
                  </motion.span>
                  
                  {isCrossedOut && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute inset-0 flex items-center justify-center pointer-events-none select-none text-red-500/80 font-black text-3xl"
                    >
                      ❌
                    </motion.div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      );
    }
  };

  if (!currentLevel) return null;

  return (
    <div id="arithmetic_math_main" className="flex flex-col items-center w-full max-w-3xl mx-auto p-4 sm:p-6 bg-white border-4 border-kid-peach-dark rounded-[32px] shadow-sm overflow-hidden">
      
      <div id="math_header" className="w-full flex justify-between items-center mb-4">
        <div className="flex items-center gap-1.5 text-kid-green-dark font-black text-sm">
          ⭐ Score: {score}
        </div>
      </div>

      <div id="equation_bubble_card" className="w-full bg-kid-cream/55 p-6 rounded-[24px] border-4 border-dashed border-kid-peach/30 flex flex-col items-center mb-6 shadow-inner">
        <div className="flex items-center gap-4 text-4xl sm:text-5xl font-black text-kid-dark tracking-tight mb-4 select-none">
          <span>{currentLevel.num1}</span>
          <span className="text-kid-red">{currentLevel.operator}</span>
          <span>{currentLevel.num2}</span>
          <span className="text-kid-blue-text">=</span>
          <span className="text-kid-purple animate-pulse">?</span>
        </div>

        {renderToyVisuals()}

        <p className="text-[10px] font-bold text-kid-sub mt-2 border-t border-kid-peach/20 pt-2 w-full text-center">
          💡 Tip: Click on any {currentLevel.toyEmoji} to count aloud!
        </p>
      </div>

      <div id="math_choice_area" className="w-full bg-kid-cream/30 p-6 rounded-3xl border-3 border-kid-peach/20 flex flex-col items-center">
        <h3 className="text-[10px] font-black uppercase tracking-widest text-kid-peach-dark mb-4">
          👇 Pick the correct answer
        </h3>

        <div className="grid grid-cols-3 gap-4 w-full max-w-md">
          {options.map((num) => {
            const isMatchOfSelected = selectedAnswer === num;
            return (
              <motion.button
                id={`math_option_btn_${num}`}
                key={num}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                animate={shake && isMatchOfSelected && status === 'wrong' ? { x: [-10, 10, -10, 10, 0] } : {}}
                transition={{ duration: 0.3 }}
                onClick={() => handleAnswerClick(num)}
                className={`p-4 rounded-[20px] border-3 flex flex-col items-center justify-center cursor-pointer transition-all ${
                  isMatchOfSelected && status === 'correct'
                    ? 'border-kid-green-dark bg-kid-green-bg scale-102 shadow-xs'
                    : isMatchOfSelected && status === 'wrong'
                      ? 'border-kid-red bg-red-50 text-kid-red'
                      : 'bg-white hover:bg-slate-50 border-kid-peach/20 hover:border-kid-peach/50 shadow-xs text-2xl font-black text-kid-dark'
                }`}
              >
                <span className="text-3xl font-extrabold">{num}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      <div className="w-full mt-8 pt-4 border-t-3 border-kid-peach/10 flex justify-between items-center text-[10px] text-kid-sub font-black uppercase tracking-tight">
        <span className="flex items-center gap-1">
          <Volume2 size={13} className="text-kid-peach-dark hover:scale-110 cursor-pointer" onClick={speakEquation} /> Hear Question Again
        </span>
        <button
          id="btn_reset_math_game"
          onClick={resetGame}
          className="hover:text-kid-red transition-colors flex items-center gap-1 cursor-pointer"
        >
          <RefreshCw size={12} /> Reset Score
        </button>
      </div>

    </div>
  );
}
