import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { playPop, playChime, playBuzz, speak } from '../utils/audio';
import { RefreshCw, ArrowRight, Star, Sparkles, Trophy, CheckCircle, Heart } from 'lucide-react';

interface PatternLevel {
  id: number;
  sequence: { emoji: string; label: string; color: string }[];
  answer: { emoji: string; label: string; color: string };
  options: { emoji: string; label: string; color: string }[];
  description: string;
}

const PATTERN_LEVELS: PatternLevel[] = [
  {
    id: 1,
    description: "🍎 Alternating Pattern (ABAB)",
    sequence: [
      { emoji: '🍎', label: 'Apple', color: 'bg-rose-100 border-rose-300 text-rose-500' },
      { emoji: '🍌', label: 'Banana', color: 'bg-yellow-100 border-yellow-300 text-yellow-600' },
      { emoji: '🍎', label: 'Apple', color: 'bg-rose-100 border-rose-300 text-rose-500' },
      { emoji: '🍌', label: 'Banana', color: 'bg-yellow-100 border-yellow-300 text-yellow-600' }
    ],
    answer: { emoji: '🍎', label: 'Apple', color: 'bg-rose-100 border-rose-300 text-rose-500' },
    options: [
      { emoji: '🍇', label: 'Grapes', color: 'bg-purple-100 border-purple-300 text-purple-600' },
      { emoji: '🍎', label: 'Apple', color: 'bg-rose-100 border-rose-300 text-rose-500' },
      { emoji: '🥕', label: 'Carrot', color: 'bg-orange-100 border-orange-300 text-orange-600' }
    ]
  },
  {
    id: 2,
    description: "🔴 Color Balloons (ABAB)",
    sequence: [
      { emoji: '🎈', label: 'Red Balloon', color: 'bg-red-100 border-red-300 text-red-500' },
      { emoji: '🔷', label: 'Blue Diamond', color: 'bg-blue-100 border-blue-300 text-blue-500' },
      { emoji: '🎈', label: 'Red Balloon', color: 'bg-red-100 border-red-300 text-red-500' },
      { emoji: '🔷', label: 'Blue Diamond', color: 'bg-blue-100 border-blue-300 text-blue-500' }
    ],
    answer: { emoji: '🎈', label: 'Red Balloon', color: 'bg-red-100 border-red-300 text-red-500' },
    options: [
      { emoji: '🔶', label: 'Orange Diamond', color: 'bg-orange-100 border-orange-300 text-orange-500' },
      { emoji: '🎈', label: 'Red Balloon', color: 'bg-red-100 border-red-300 text-red-500' },
      { emoji: '🟢', label: 'Green Ball', color: 'bg-green-100 border-green-300 text-green-500' }
    ]
  },
  {
    id: 3,
    description: "🐱 Animal Buddies (AABB)",
    sequence: [
      { emoji: '🐱', label: 'Kitty', color: 'bg-amber-100 border-amber-300 text-amber-500' },
      { emoji: '🐱', label: 'Kitty', color: 'bg-amber-100 border-amber-300 text-amber-500' },
      { emoji: '🐶', label: 'Puppy', color: 'bg-blue-100 border-blue-300 text-blue-500' },
      { emoji: '🐶', label: 'Puppy', color: 'bg-blue-100 border-blue-300 text-blue-500' },
      { emoji: '🐱', label: 'Kitty', color: 'bg-amber-100 border-amber-300 text-amber-500' }
    ],
    answer: { emoji: '🐱', label: 'Kitty', color: 'bg-amber-100 border-amber-300 text-amber-500' },
    options: [
      { emoji: '🦁', label: 'Lion', color: 'bg-yellow-100 border-yellow-300 text-yellow-600' },
      { emoji: '🐱', label: 'Kitty', color: 'bg-amber-100 border-amber-300 text-amber-500' },
      { emoji: '🐶', label: 'Puppy', color: 'bg-blue-100 border-blue-300 text-blue-500' }
    ]
  },
  {
    id: 4,
    description: "⭐️ Night Sky (ABCABC)",
    sequence: [
      { emoji: '☀️', label: 'Sun', color: 'bg-yellow-100 border-yellow-300 text-yellow-500' },
      { emoji: '🌙', label: 'Moon', color: 'bg-indigo-100 border-indigo-200 text-indigo-500' },
      { emoji: '⭐', label: 'Star', color: 'bg-amber-100 border-amber-300 text-amber-500' },
      { emoji: '☀️', label: 'Sun', color: 'bg-yellow-100 border-yellow-300 text-yellow-500' },
      { emoji: '🌙', label: 'Moon', color: 'bg-indigo-100 border-indigo-200 text-indigo-500' }
    ],
    answer: { emoji: '⭐', label: 'Star', color: 'bg-amber-100 border-amber-300 text-amber-500' },
    options: [
      { emoji: '⭐', label: 'Star', color: 'bg-amber-100 border-amber-300 text-amber-500' },
      { emoji: '☁️', label: 'Cloud', color: 'bg-slate-100 border-slate-300 text-slate-500' },
      { emoji: '🪐', label: 'Saturn', color: 'bg-orange-100 border-orange-300 text-orange-500' }
    ]
  },
  {
    id: 5,
    description: "🍒 Sweet Treats (AABBAABB)",
    sequence: [
      { emoji: '🍓', label: 'Strawberry', color: 'bg-red-100 border-red-300 text-red-500' },
      { emoji: '🍓', label: 'Strawberry', color: 'bg-red-100 border-red-300 text-red-500' },
      { emoji: '🍩', label: 'Donut', color: 'bg-pink-100 border-pink-200 text-pink-500' },
      { emoji: '🍩', label: 'Donut', color: 'bg-pink-100 border-pink-200 text-pink-500' },
      { emoji: '🍓', label: 'Strawberry', color: 'bg-red-100 border-red-300 text-red-500' },
      { emoji: '🍓', label: 'Strawberry', color: 'bg-red-100 border-red-300 text-red-500' },
      { emoji: '🍩', label: 'Donut', color: 'bg-pink-100 border-pink-200 text-pink-500' }
    ],
    answer: { emoji: '🍩', label: 'Donut', color: 'bg-pink-100 border-pink-200 text-pink-500' },
    options: [
      { emoji: '🍪', label: 'Cookie', color: 'bg-amber-100 border-amber-300 text-amber-600' },
      { emoji: '🍓', label: 'Strawberry', color: 'bg-red-100 border-red-300 text-red-500' },
      { emoji: '🍩', label: 'Donut', color: 'bg-pink-100 border-pink-200 text-pink-500' }
    ]
  }
];

export default function PatternMatch() {
  const [levelIndex, setLevelIndex] = useState(0);
  const currentLevel = PATTERN_LEVELS[levelIndex];
  
  const [placedAnswer, setPlacedAnswer] = useState<{ emoji: string; label: string; color: string } | null>(null);
  const [status, setStatus] = useState<'waiting' | 'correct' | 'wrong'>('waiting');
  const [score, setScore] = useState(0);

  useEffect(() => {
    // Announce level description
    speak(`Pattern matching! Look at the sequence. What comes next?`);
  }, [levelIndex]);

  const handleChoiceClick = (option: typeof currentLevel.options[0]) => {
    if (status === 'correct') return;
    
    playPop();
    const isRight = option.emoji === currentLevel.answer.emoji;
    
    setPlacedAnswer(option);

    if (isRight) {
      setStatus('correct');
      setScore(prev => prev + 1);
      playChime();
      speak(`Excellent! You placed the ${option.label}! That fits the pattern!`);
    } else {
      setStatus('wrong');
      playBuzz();
      speak(`Oops! Let's think, is the ${option.label} correct? Try another one.`);
      
      // Reset the placed answer back to blank after a brief shake
      setTimeout(() => {
        setPlacedAnswer(null);
        setStatus('waiting');
      }, 1200);
    }
  };

  const nextLevel = () => {
    playPop();
    setPlacedAnswer(null);
    setStatus('waiting');
    setLevelIndex((prev) => (prev + 1) % PATTERN_LEVELS.length);
  };

  const resetGame = () => {
    playChime();
    setLevelIndex(0);
    setPlacedAnswer(null);
    setStatus('waiting');
    setScore(0);
  };

  return (
    <div id="pattern_match_main" className="flex flex-col items-center w-full max-w-3xl mx-auto p-4 sm:p-6 bg-white border-4 border-kid-purple/70 rounded-[32px] shadow-sm overflow-hidden">
      
      {/* Mini head info */}
      <div id="pattern_header" className="w-full flex justify-between items-center mb-6">
        <div className="flex items-center gap-2 bg-kid-purple/10 px-4 py-1.5 rounded-full border-2 border-kid-purple/40">
          <Sparkles className="text-kid-purple animate-spin" size={16} />
          <span className="text-xs font-black text-kid-purple uppercase tracking-widest">
            Level {levelIndex + 1} of {PATTERN_LEVELS.length}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-kid-peach-dark font-black text-base">
          ⭐ Match Gained: {score}
        </div>
      </div>

      {/* Main playful instructions for child */}
      <h2 className="text-3xl font-black text-kid-dark text-center tracking-tight leading-none mb-2">
        What Comes Next? 🤔
      </h2>
      <p className="text-kid-sub text-sm font-bold text-center mb-6 max-w-md">
        Match the rhythm of the toys and fruits! Click the missing buddy to complete the path!
      </p>

      {/* Bouncy horizontal Pattern Track */}
      <div id="sequence_track" className="w-full bg-kid-cream/55 p-6 rounded-[24px] border-4 border-dashed border-kid-purple/30 flex flex-wrap justify-center items-center gap-3 mb-10 shadow-inner">
        {currentLevel.sequence.map((it, idx) => (
          <motion.div
            key={idx}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: idx * 0.1, type: "spring", stiffness: 100 }}
            className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl border-2 flex items-center justify-center text-4xl shadow-xs ${it.color}`}
          >
            {it.emoji}
          </motion.div>
        ))}

        {/* The target Slot */}
        <motion.div
          animate={{
            scale: status === 'correct' ? [1, 1.2, 1] : [1, 1.05, 1],
            borderColor: status === 'correct' ? '#5A8040' : status === 'wrong' ? '#EE8E8E' : '#BDB2FF'
          }}
          transition={{ repeat: status === 'waiting' ? Infinity : 0, duration: 1.5 }}
          className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl border-4 border-dashed flex flex-col items-center justify-center transition-all shadow-md relative ${
            placedAnswer 
              ? placedAnswer.color 
              : 'bg-white text-kid-purple border-kid-purple'
          }`}
        >
          {placedAnswer ? (
            <span className="text-4xl animate-bounce">{placedAnswer.emoji}</span>
          ) : (
            <span className="text-3xl font-black animate-pulse text-kid-purple/80">?</span>
          )}

          {/* Correct star badge */}
          {status === 'correct' && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-3 -right-3 bg-kid-green-dark text-white rounded-full p-1 border-2 border-white shadow-md"
            >
              <Heart size={14} fill="currentColor" />
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Candidates area */}
      <div id="choice_area" className="w-full bg-kid-cream/30 p-6 rounded-3xl border-3 border-kid-purple/20 flex flex-col items-center">
        <h3 className="text-xs font-black uppercase tracking-widest text-kid-purple mb-4">
          👇 Pick the matching buddy
        </h3>

        <div id="choices_options" className="flex justify-center gap-4 sm:gap-6 w-full max-w-md">
          {currentLevel.options.map((option, idx) => {
            const isMatchOfPlaced = placedAnswer?.emoji === option.emoji;
            const cardShake = status === 'wrong' && isMatchOfPlaced;

            return (
              <motion.button
                id={`option_card_${idx}`}
                key={idx}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                animate={cardShake ? { x: [-10, 10, -10, 10, 0] } : {}}
                transition={{ duration: 0.3 }}
                onClick={() => handleChoiceClick(option)}
                className={`flex-1 p-4 rounded-[20px] border-3 flex flex-col items-center cursor-pointer transition-all ${
                  isMatchOfPlaced && status === 'correct'
                    ? 'border-kid-green-dark bg-[#E2F0D9] scale-102 shadow-xs'
                    : 'bg-white hover:bg-slate-50 border-kid-purple/20 hover:border-kid-purple/50 shadow-xs'
                }`}
              >
                <span className="text-4xl sm:text-5xl mb-2 filter drop-shadow-xs">{option.emoji}</span>
                <span className="text-xs font-black text-kid-dark block uppercase tracking-tight">{option.label}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Navigation and Success Card Overlay overlay */}
      <AnimatePresence>
        {status === 'correct' && (
          <motion.div
            id="pattern_feedback_success_banner"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="w-full flex flex-col items-center justify-center mt-6 p-5 bg-kid-green-bg border-3 border-kid-green-mint rounded-[24px] text-center"
          >
            <div className="flex gap-1.5 justify-center mb-1 text-kid-green-dark">
              <Star fill="currentColor" size={20} className="animate-spin" />
              <Star fill="currentColor" size={20} />
              <Star fill="currentColor" size={20} />
            </div>
            <p className="text-lg font-black text-kid-green-dark">
              Pattern Solved! Beautiful visual synchronization!
            </p>
            <button
              id="pattern_next_level_btn"
              onClick={nextLevel}
              className="mt-4 px-8 py-3 bg-kid-red hover:bg-kid-red-dark text-white font-black rounded-full shadow-[0_4px_0_#EE8E8E] text-sm transition-transform hover:scale-102 flex items-center gap-2 cursor-pointer"
            >
              Play Next Level <ArrowRight size={16} strokeWidth={3} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Level bar */}
      <div className="w-full mt-8 pt-4 border-t-3 border-kid-purple/10 flex justify-between text-xs text-kid-sub font-black">
        <span>Visual synchronization academy</span>
        <button
          id="btn_reset_pattern_game"
          onClick={resetGame}
          className="hover:text-kid-red transition-colors flex items-center gap-1 cursor-pointer"
        >
          <RefreshCw size={12} /> Reset Points
        </button>
      </div>

    </div>
  );
}
