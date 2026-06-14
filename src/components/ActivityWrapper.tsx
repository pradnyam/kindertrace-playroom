import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, Trophy, Sparkles } from 'lucide-react';
import { playPop, playChime, playBuzz, speak } from '../utils/audio';

export interface ActivityProps {
  level: number;
  onAnswer: (isCorrect: boolean) => void;
}

interface ActivityWrapperProps {
  title: string;
  description: string;
  children: (props: ActivityProps) => React.ReactNode;
}

export default function ActivityWrapper({ title, description, children }: ActivityWrapperProps) {
  const [level, setLevel] = useState(1);
  const [successStreak, setSuccessStreak] = useState(0);
  const [mistakeCount, setMistakeCount] = useState(0);
  const [showLevelUp, setShowLevelUp] = useState(false);

  const handleAnswer = (isCorrect: boolean) => {
    if (isCorrect) {
      playPop();
      const newStreak = successStreak + 1;
      setSuccessStreak(newStreak);
      setMistakeCount(0); // Reset mistakes on success

      if (newStreak >= 3) {
        levelUp();
      } else {
        playChime();
        speak("Correct! Great job!");
      }
    } else {
      playBuzz();
      const newMistakes = mistakeCount + 1;
      setMistakeCount(newMistakes);
      setSuccessStreak(0); // Reset streak on mistake

      if (newMistakes >= 2) {
        levelDown();
      } else {
        speak("Oops! Let's try again.");
      }
    }
  };

  const levelUp = () => {
    if (level < 5) {
      const nextLevel = level + 1;
      setLevel(nextLevel);
      setSuccessStreak(0);
      setShowLevelUp(true);
      playChime();
      speak(`Wow! Level ${nextLevel}! You are getting smarter!`);
      setTimeout(() => setShowLevelUp(false), 2000);
    } else {
      playChime();
      speak("You mastered this game! You are a superstar!");
      setSuccessStreak(0); // Keep them at level 5
    }
  };

  const levelDown = () => {
    if (level > 1) {
      setLevel(prev => prev - 1);
      setMistakeCount(0);
      speak("Let's try something a bit easier.");
    } else {
      setMistakeCount(0); // Stay at level 1
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Progress Bar Container */}
      <div className="w-full max-w-2xl bg-white p-4 rounded-3xl border-4 border-kid-yellow mb-6 shadow-sm relative overflow-hidden">
        {/* Animated background subtle spark */}
        <div className="absolute top-0 right-0 p-2 opacity-20">
            <Sparkles className="text-kid-yellow animate-pulse" size={24} />
        </div>

        <div className="flex justify-between items-center mb-2 px-2">
          <div className="flex flex-col">
            <span className="text-xs font-black text-kid-dark uppercase tracking-widest flex items-center gap-1">
                <Trophy size={14} className="text-kid-yellow" /> Level {level}
            </span>
            <span className="text-[10px] font-bold text-kid-sub uppercase tracking-tight">
                {title}
            </span>
          </div>
          
          <div className="flex gap-1">
            {[1, 2, 3].map(i => (
              <motion.div
                key={i}
                animate={{ 
                    scale: successStreak >= i ? [1, 1.2, 1] : 1,
                    rotate: successStreak >= i ? [0, 10, -10, 0] : 0
                }}
                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                  successStreak >= i ? 'bg-kid-yellow border-kid-yellow-dark text-white' : 'bg-stone-100 border-stone-200 text-stone-300'
                }`}
              >
                <Star size={16} fill={successStreak >= i ? "currentColor" : "none"} />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Level Progress Bar */}
        <div className="w-full h-4 bg-stone-100 rounded-full overflow-hidden border-2 border-stone-200 p-0.5">
          <motion.div
            animate={{ width: `${(level / 5) * 100}%` }}
            transition={{ type: 'spring', stiffness: 50 }}
            className="h-full bg-kid-yellow rounded-full shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]"
          />
        </div>
      </div>

      {/* Main Content Stage */}
      <div className="w-full relative min-h-[400px]">
        <AnimatePresence>
          {showLevelUp && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="absolute inset-0 z-50 flex flex-col items-center justify-center pointer-events-none"
            >
              <div className="bg-white/95 p-10 rounded-[40px] border-8 border-kid-yellow shadow-2xl text-center">
                <motion.div
                  animate={{ 
                      rotate: [0, 15, -15, 0],
                      scale: [1, 1.2, 1]
                  }}
                  transition={{ repeat: Infinity, duration: 0.8 }}
                  className="text-8xl mb-4"
                >
                  🚀
                </motion.div>
                <h2 className="text-5xl font-black text-kid-dark mb-2 uppercase tracking-tighter">Level {level}!</h2>
                <p className="text-2xl font-bold text-kid-sub">Super Fast Learning! 🌟</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {children({ level, onAnswer: handleAnswer })}
      </div>
    </div>
  );
}
