import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, RefreshCw, Sparkles, BookOpen } from 'lucide-react';
import { playPop, speak } from '../utils/audio';
import { ActivityProps } from './ActivityWrapper';

interface TimeTableLevel {
  num1: number;
  num2: number;
  missingPosition: 'result' | 'factor2';
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

export interface MathTimeTablesProps extends ActivityProps {
  mode?: 'study' | 'quiz';
}

export default function MathTimeTables({ level, onAnswer, mode = 'quiz' }: MathTimeTablesProps) {
  // Explorer/Study State
  const [selectedFactor, setSelectedFactor] = useState<number>(2);
  const [selectedMultiplier, setSelectedMultiplier] = useState<number>(3);
  const [explorerToyIndex, setExplorerToyIndex] = useState<number>(0);
  
  // Quiz State
  const [challenge, setChallenge] = useState<TimeTableLevel | null>(null);
  const [options, setOptions] = useState<number[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [quizStatus, setQuizStatus] = useState<'waiting' | 'correct' | 'wrong'>('waiting');
  const [shake, setShake] = useState(false);
  const [score, setScore] = useState(0);

  const explorerToy = useMemo(() => TOYS[explorerToyIndex % TOYS.length], [explorerToyIndex]);

  // Quiz equation details
  const correctAnswer = useMemo(() => {
    if (!challenge) return 0;
    return challenge.missingPosition === 'result' ? challenge.num1 * challenge.num2 : challenge.num2;
  }, [challenge]);

  const speakExplorerEquation = (f1: number, f2: number) => {
    speak(`${f1} times ${f2} equals ${f1 * f2}! That is ${f1} rows of ${f2} ${explorerToy.name}!`);
  };

  const speakQuizChallenge = (chal: TimeTableLevel) => {
    if (chal.missingPosition === 'result') {
      speak(`What is ${chal.num1} times ${chal.num2}?`);
    } else {
      speak(`${chal.num1} times what number equals ${chal.num1 * chal.num2}?`);
    }
  };

  const changeExplorerToy = () => {
    playPop();
    setExplorerToyIndex(prev => prev + 1);
  };

  // Generate quiz challenge based on ActivityWrapper level
  const generateQuizChallenge = () => {
    const toy = TOYS[Math.floor(Math.random() * TOYS.length)];
    let num1 = 1;
    let num2 = 1;

    if (level === 1) {
      num1 = Math.random() > 0.5 ? 1 : 2;
      num2 = Math.floor(Math.random() * 5) + 1;
    } else if (level === 2) {
      num1 = Math.random() > 0.5 ? 5 : 10;
      num2 = Math.floor(Math.random() * 10) + 1;
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

  // Generate quiz options
  useEffect(() => {
    if (mode !== 'quiz' || !challenge) return;
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
  }, [challenge, correctAnswer, mode]);

  useEffect(() => {
    if (mode === 'quiz') {
      generateQuizChallenge();
    }
  }, [level, mode]);

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

  if (mode === 'study') {
    return (
      <div id="math_timestables_study_mode" className="w-full flex flex-col items-center">
        
        {/* Pick a Times Table */}
        <div className="w-full bg-kid-cream/35 p-5 rounded-3xl border-3 border-dashed border-kid-blue/20 mb-8 flex flex-col items-center">
          <span className="text-xs font-black uppercase text-kid-sub tracking-widest mb-3">
            🎈 Pick a Times Table
          </span>
          <div className="flex flex-wrap justify-center gap-2.5">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
              const factorEmojis = ['🐰', '🐶', '🐱', '🐯', '🦁', '🐨', '🐼', '🦊', '🐷', '🐴'];
              return (
                <button
                  key={num}
                  onClick={() => {
                    playPop();
                    setSelectedFactor(num);
                    speakExplorerEquation(num, selectedMultiplier);
                  }}
                  className={`py-2.5 px-4.5 rounded-2xl font-black text-base cursor-pointer flex items-center gap-2 border-3 transition-all ${
                    selectedFactor === num
                      ? 'bg-kid-blue border-kid-blue-text text-white scale-108 shadow-md'
                      : 'bg-white border-stone-200 hover:border-kid-blue text-kid-dark'
                  }`}
                >
                  <span className="text-lg">{factorEmojis[num - 1]}</span>
                  <span>{num}x</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Interactive Counting Tapping Board (Increased font sizes) */}
        <div className="w-full bg-white p-8 rounded-[36px] border-4 border-kid-blue shadow-inner flex flex-col items-center mb-10">
          <div className="w-full flex justify-between items-center mb-4">
            <span className="text-xs font-black uppercase text-kid-sub tracking-widest bg-stone-100 py-1.5 px-4 rounded-full">
              👉 Counting Tapping Board
            </span>
            <button
              onClick={changeExplorerToy}
              className="bg-stone-50 hover:bg-stone-100 border-2 border-stone-200 py-1.5 px-4 rounded-full text-xs font-black text-kid-dark transition-all cursor-pointer"
            >
              Change Toys {explorerToy.emoji} 🔄
            </button>
          </div>

          {/* Equation Label (Huge font size for study mode) */}
          <div className="flex items-center gap-4 text-5xl sm:text-6xl font-black text-kid-dark mb-6 bg-stone-50 py-3 px-8 rounded-full border-3 border-stone-150 relative">
            <span>{selectedFactor}</span>
            <span className="text-kid-red">×</span>
            <span>{selectedMultiplier}</span>
            <span className="text-kid-blue-text">=</span>
            <span className="text-kid-green-dark">{selectedFactor * selectedMultiplier}</span>
            
            <Volume2 
              size={24} 
              className="text-kid-blue-text hover:scale-110 active:scale-95 cursor-pointer ml-3" 
              onClick={() => speakExplorerEquation(selectedFactor, selectedMultiplier)} 
            />
          </div>

          {/* Large study detail description sentence */}
          <p className="text-sm sm:text-base font-black text-kid-sub text-center mb-6">
            💡 Study Detail: <span className="text-kid-blue-text">{selectedFactor} rows</span> of <span className="text-kid-purple">{selectedMultiplier} {explorerToy.emoji} ({explorerToy.name})</span> equals <span className="text-kid-green-dark">{selectedFactor * selectedMultiplier}</span> in total!
          </p>

          {/* Large Toy Visuals Grid */}
          <div className="flex flex-col gap-3.5 p-6 bg-kid-cream/20 rounded-[28px] border-3 border-dashed border-stone-200/60 max-w-full overflow-auto shadow-inner">
            {Array.from({ length: selectedFactor }).map((_, rIdx) => (
              <div key={`row-${rIdx}`} className="flex gap-3 justify-center items-center">
                <span className="text-xs font-bold text-stone-400 w-12 text-right">Row {rIdx + 1}:</span>
                <div className="flex gap-2">
                  {Array.from({ length: selectedMultiplier }).map((_, cIdx) => {
                    const cellNum = (rIdx * selectedMultiplier) + cIdx + 1;
                    return (
                      <motion.div
                        key={`col-${cIdx}`}
                        whileHover={{ scale: 1.2, rotate: 6 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => {
                          playPop();
                          speak(String(cellNum));
                        }}
                        className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white border-2 border-stone-200 hover:border-kid-blue cursor-pointer flex flex-col items-center justify-center relative shadow-sm"
                      >
                        <span className="text-2xl sm:text-3xl select-none">{explorerToy.emoji}</span>
                        <span className="absolute bottom-1 right-1.5 text-[8px] sm:text-[9px] font-bold text-stone-400">
                          {cellNum}
                        </span>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Tapping instruction hint */}
          <div className="w-full mt-6 pt-4 border-t border-stone-100 text-center text-xs font-bold text-kid-sub">
            <span>👉 Point and tap at each {explorerToy.emoji} to practice counting aloud!</span>
          </div>
        </div>

        {/* Whole Times Table Display */}
        <div className="w-full">
          <h4 className="text-center text-base sm:text-lg font-black text-kid-dark mb-6 flex items-center justify-center gap-2">
            <Sparkles size={20} className="text-kid-yellow animate-pulse" />
            The Whole {selectedFactor}x Times Table Chart
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((mult) => {
              const result = selectedFactor * mult;
              const isSelected = selectedMultiplier === mult;
              return (
                <motion.div
                  key={mult}
                  whileHover={{ scale: 1.03 }}
                  onClick={() => {
                    playPop();
                    setSelectedMultiplier(mult);
                    speakExplorerEquation(selectedFactor, mult);
                  }}
                  className={`p-6 sm:p-8 rounded-[28px] border-4 text-center cursor-pointer flex flex-col justify-center items-center transition-all min-h-[140px] ${
                    isSelected
                      ? 'bg-kid-cream border-kid-blue shadow-md scale-102'
                      : 'bg-white border-stone-200/50 hover:border-kid-blue shadow-xs'
                  }`}
                >
                  {/* Huge font sizes for times table equations */}
                  <div className="flex items-center justify-center gap-2.5 text-3xl sm:text-4xl font-black text-kid-dark select-none w-full">
                    <span>{selectedFactor}</span>
                    <span className="text-kid-red text-2xl">×</span>
                    <span>{mult}</span>
                    <span className="text-kid-blue-text text-3xl">=</span>
                    <span className="text-kid-green-dark text-4xl sm:text-5xl">{result}</span>
                  </div>

                  <div className="mt-4 flex items-center justify-center gap-2 text-xs font-black uppercase text-kid-sub tracking-widest">
                    <span>Tap to Study</span>
                    <Volume2
                      size={15}
                      className="text-stone-400 hover:text-kid-blue-text transition-colors cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        playPop();
                        speak(`${selectedFactor} times ${mult} is ${result}`);
                      }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

      </div>
    );
  }

  // Quiz Mode
  return (
    <div id="math_timestables_quiz_mode" className="flex flex-col items-center w-full max-w-3xl mx-auto p-4 sm:p-6 bg-white border-4 border-rose-400 rounded-[32px] shadow-sm">
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
          <div id="equation_bubble_card" className="w-full bg-kid-cream/55 p-6 rounded-[28px] border-4 border-dashed border-rose-300/35 flex flex-col items-center mb-6 shadow-inner relative">
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
