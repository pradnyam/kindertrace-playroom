import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Trophy, Award, Heart, RefreshCw, ArrowRight, Volume2 } from 'lucide-react';
import { playPop, playChime, playBuzz, speak } from '../utils/audio';

interface MathLevel {
  num1: number;
  num2: number;
  operator: '+' | '-';
  toyEmoji: string;
  toyName: string;
}

const MATH_LEVELS: MathLevel[] = [
  { num1: 2, num2: 1, operator: '+', toyEmoji: '🧸', toyName: 'teddy bears' },
  { num1: 3, num2: 2, operator: '+', toyEmoji: '🍎', toyName: 'apples' },
  { num1: 4, num2: 1, operator: '-', toyEmoji: '🚗', toyName: 'toy cars' },
  { num1: 5, num2: 3, operator: '+', toyEmoji: '🎈', toyName: 'balloons' },
  { num1: 6, num2: 2, operator: '-', toyEmoji: '🐱', toyName: 'kittens' },
  { num1: 2, num2: 2, operator: '+', toyEmoji: '🍓', toyName: 'strawberries' },
  { num1: 7, num2: 3, operator: '-', toyEmoji: '🐶', toyName: 'puppies' },
  { num1: 4, num2: 4, operator: '+', toyEmoji: '⭐', toyName: 'sparkle stars' },
  { num1: 8, num2: 4, operator: '-', toyEmoji: '🍦', toyName: 'ice creams' },
  { num1: 5, num2: 4, operator: '+', toyEmoji: '🚀', toyName: 'rocket ships' }
];

export default function ArithmeticMath() {
  const [levelIndex, setLevelIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [status, setStatus] = useState<'waiting' | 'correct' | 'wrong'>('waiting');
  const [shake, setShake] = useState(false);

  const currentLevel = MATH_LEVELS[levelIndex % MATH_LEVELS.length];
  const { num1, num2, operator, toyEmoji, toyName } = currentLevel;

  // Correct answer calculation
  const correctAnswer = operator === '+' ? num1 + num2 : num1 - num2;

  // Generate 3 unique candy options (one correct, two close incorrect ones)
  const [options, setOptions] = useState<number[]>([]);

  useEffect(() => {
    const opts = new Set<number>();
    opts.add(correctAnswer);
    
    // Add random options close to correct answer, ensuring they are >= 0
    while (opts.size < 3) {
      const dev = Math.floor(Math.random() * 4) - 2; // -2 to +2
      const candidate = correctAnswer + dev;
      if (candidate >= 0 && candidate <= 12) {
        opts.add(candidate);
      }
    }
    
    setOptions(Array.from(opts).sort((a, b) => a - b));
    setSelectedAnswer(null);
    setStatus('waiting');
  }, [levelIndex, correctAnswer]);

  // Read equation aloud on level load
  const speakEquation = () => {
    const verbalOperator = operator === '+' ? "plus" : "minus";
    const phrase = `What is ${num1} ${verbalOperator} ${num2}? Let's look at the ${toyName}!`;
    speak(phrase);
  };

  useEffect(() => {
    // Speak on initial load or level change with a slight delay
    const timer = setTimeout(() => {
      speakEquation();
    }, 400);
    return () => clearTimeout(timer);
  }, [levelIndex]);

  const handleAnswerClick = (num: number) => {
    if (status === 'correct') return; // already solved

    setSelectedAnswer(num);
    if (num === correctAnswer) {
      playChime();
      setStatus('correct');
      setScore(prev => prev + 5);
      const randomCheers = [
        "That's right!",
        "Double stars for you! Excellent!",
        "Super math explorer!",
        "You got it, clever friend!"
      ];
      speak(`${randomCheers[Math.floor(Math.random() * randomCheers.length)]} ${num1} ${operator === '+' ? 'plus' : 'minus'} ${num2} equals ${num}!`);
    } else {
      playBuzz();
      setStatus('wrong');
      setShake(true);
      setTimeout(() => setShake(false), 500);
      speak(`Oops! Let's count them again! Touch and count the toys.`);
    }
  };

  const handleNextLevel = () => {
    playPop();
    setLevelIndex(prev => prev + 1);
  };

  const resetGame = () => {
    playPop();
    setScore(0);
    setLevelIndex(0);
    speak("Let's restart our Math Sandbox challenge! Point at the toys to count them!");
  };

  // Render individual toy icons for addition or subtraction representation
  const renderToyVisuals = () => {
    if (operator === '+') {
      return (
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8 w-full py-4">
          {/* First group */}
          <div className="flex flex-col items-center">
            <span className="text-xs font-black text-kid-sub uppercase mb-2 tracking-widest bg-white py-1 px-3 rounded-full border-2 border-kid-peach/40">
              {num1} {toyName}
            </span>
            <div className="flex flex-wrap gap-2 max-w-[200px] justify-center bg-white p-4 rounded-3xl border-3 border-kid-peach/50 shadow-inner">
              {Array.from({ length: num1 }).map((_, i) => (
                <motion.span
                  key={`n1-${i}`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 0.1, type: 'spring' }}
                  onClick={() => { playPop(); speak(`${i + 1}`); }}
                  className="text-4xl select-none filter drop-shadow-xs cursor-pointer hover:scale-125 hover:rotate-6 active:scale-95 transition-transform"
                >
                  {toyEmoji}
                </motion.span>
              ))}
            </div>
          </div>

          {/* Plus Sign */}
          <div className="text-5xl font-black text-kid-red filter drop-shadow-xs">+</div>

          {/* Second group */}
          <div className="flex flex-col items-center">
            <span className="text-xs font-black text-kid-sub uppercase mb-2 tracking-widest bg-white py-1 px-3 rounded-full border-2 border-kid-blue/40">
              {num2} {toyName}
            </span>
            <div className="flex flex-wrap gap-2 max-w-[200px] justify-center bg-white p-4 rounded-3xl border-3 border-kid-blue/50 shadow-inner">
              {Array.from({ length: num2 }).map((_, i) => (
                <motion.span
                  key={`n2-${i}`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 0.1, type: 'spring' }}
                  onClick={() => { playPop(); speak(`${num1 + i + 1}`); }}
                  className="text-4xl select-none filter drop-shadow-xs cursor-pointer hover:scale-125 hover:rotate-6 active:scale-95 transition-transform"
                >
                  {toyEmoji}
                </motion.span>
              ))}
            </div>
          </div>
        </div>
      );
    } else {
      // Subtraction: Draw the set of num1 toys, with num2 toys visually "crossed out" or dim with active tap to blow bubbles!
      return (
        <div className="flex flex-col items-center justify-center w-full py-4">
          <span className="text-xs font-black text-kid-sub uppercase mb-2 tracking-widest bg-white py-1 px-3 rounded-full border-2 border-kid-purple/40">
            Start with {num1}, take away {num2} {toyName}
          </span>
          
          <div className="flex flex-wrap gap-3 max-w-[450px] justify-center bg-white p-6 rounded-[32px] border-4 border-dashed border-kid-purple/30 shadow-inner">
            {Array.from({ length: num1 }).map((_, i) => {
              // Crossed out toys are the last num2 elements
              const isCrossedOut = i >= (num1 - num2);
              return (
                <div key={`sub-${i}`} className="relative group">
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: isCrossedOut ? 0.8 : 1, opacity: isCrossedOut ? 0.35 : 1 }}
                    className="text-5xl select-none filter drop-shadow-xs block cursor-pointer transition-all"
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
                      className="absolute inset-0 flex items-center justify-center pointer-events-none select-none text-red-500/80 font-black text-5xl"
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

  return (
    <div id="arithmetic_math_main" className="flex flex-col items-center w-full max-w-3xl mx-auto p-4 sm:p-6 bg-white border-4 border-kid-peach-dark rounded-[32px] shadow-sm overflow-hidden">
      
      {/* Header HUD */}
      <div id="math_header" className="w-full flex justify-between items-center mb-4">
        <div className="flex items-center gap-2 bg-kid-peach/10 px-4 py-1.5 rounded-full border-2 border-kid-peach-dark/40">
          <Sparkles className="text-kid-peach-dark animate-spin" size={16} />
          <span className="text-xs font-black text-kid-peach-dark uppercase tracking-widest">
            Math Level {levelIndex + 1} of {MATH_LEVELS.length}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-kid-green-dark font-black text-base">
          ⭐ Score Gained: {score}
        </div>
      </div>

      <h2 className="text-3xl font-black text-kid-dark text-center tracking-tight leading-none mb-2">
        Creative Math Sandbox! 🧮
      </h2>
      <p className="text-kid-sub text-sm font-bold text-center mb-4 max-w-md">
        Count the bubbly toys below to solve the equation!
      </p>

      {/* Main Equation Board Screen */}
      <div id="equation_bubble_card" className="w-full bg-kid-cream/55 p-6 rounded-[24px] border-4 border-dashed border-kid-peach/30 flex flex-col items-center mb-6 shadow-inner">
        {/* Math Equation Formula */}
        <div className="flex items-center gap-4 text-5xl sm:text-6xl font-black text-kid-dark tracking-tight mb-4 select-none">
          <span>{num1}</span>
          <span className="text-kid-red">{operator}</span>
          <span>{num2}</span>
          <span className="text-kid-blue-text">=</span>
          <span className="text-kid-purple animate-pulse">?</span>
        </div>

        {/* Generative Interactive Toy Counters */}
        {renderToyVisuals()}

        {/* Instruction label */}
        <p className="text-xs font-bold text-kid-sub mt-2 border-t border-kid-peach/20 pt-2 w-full text-center">
          💡 Tip: Click on any {toyEmoji} to hear its number buddy aloud!
        </p>
      </div>

      {/* Multiple Choice Card Area */}
      <div id="math_choice_area" className="w-full bg-kid-cream/30 p-6 rounded-3xl border-3 border-kid-peach/20 flex flex-col items-center">
        <h3 className="text-xs font-black uppercase tracking-widest text-kid-peach-dark mb-4">
          👇 Click the correct card answer
        </h3>

        <div className="grid grid-cols-3 gap-4 sm:gap-6 w-full">
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
                className={`p-4 sm:p-6 rounded-[24px] border-3 flex flex-col items-center justify-center cursor-pointer transition-all ${
                  isMatchOfSelected && status === 'correct'
                    ? 'border-kid-green-dark bg-kid-green-bg scale-102 shadow-xs'
                    : isMatchOfSelected && status === 'wrong'
                      ? 'border-kid-red bg-red-50 text-kid-red scale-102'
                      : 'bg-white hover:bg-slate-50 border-kid-peach/20 hover:border-kid-peach/50 shadow-xs text-3xl font-black text-kid-dark shadow-[0_4px_0_#FFE6CC]'
                }`}
              >
                <span className="text-4xl font-extrabold">{num}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Celebratory Alert Banner for Completed Levels */}
      <AnimatePresence>
        {status === 'correct' && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="w-full flex flex-col items-center justify-center mt-6 p-5 bg-kid-green-bg border-3 border-kid-green-mint rounded-[24px] text-center"
          >
            <div className="flex gap-1.5 justify-center mb-1 text-kid-green-dark">
              <Award fill="currentColor" size={20} className="animate-bounce" />
              <Award fill="currentColor" size={20} className="scale-125" />
              <Award fill="currentColor" size={20} className="animate-bounce" />
            </div>
            <p className="text-lg font-black text-kid-green-dark">
              Correct! Excellent Addition & Subtraction!
            </p>
            <button
              id="math_next_level_btn"
              onClick={handleNextLevel}
              className="mt-4 px-8 py-3 bg-kid-red hover:bg-kid-red-dark text-white font-black rounded-full shadow-[0_4px_0_#EE8E8E] text-sm transition-transform hover:scale-102 flex items-center gap-2 cursor-pointer"
            >
              Play Next Level <ArrowRight size={16} strokeWidth={3} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer info/Reset */}
      <div className="w-full mt-8 pt-4 border-t-3 border-kid-peach/10 flex justify-between items-center text-xs text-kid-sub font-black uppercase tracking-tight">
        <span className="flex items-center gap-1">
          <Volume2 size={13} className="text-kid-peach-dark hover:scale-110 cursor-pointer" onClick={speakEquation} /> Click voice to hear math equation again
        </span>
        <button
          id="btn_reset_math_game"
          onClick={resetGame}
          className="hover:text-kid-red transition-colors flex items-center gap-1 cursor-pointer"
        >
          <RefreshCw size={12} /> Reset Points
        </button>
      </div>

    </div>
  );
}
