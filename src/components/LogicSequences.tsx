import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ActivityProps } from './ActivityWrapper';
import { speak } from '../utils/audio';

interface SequenceItem {
  id: string;
  emoji: string;
  label: string;
  color: string;
}

const ITEMS: SequenceItem[] = [
  { id: 'apple', emoji: '🍎', label: 'Apple', color: 'bg-red-100' },
  { id: 'banana', emoji: '🍌', label: 'Banana', color: 'bg-yellow-100' },
  { id: 'star', emoji: '⭐', label: 'Star', color: 'bg-amber-100' },
  { id: 'heart', emoji: '❤️', label: 'Heart', color: 'bg-rose-100' },
  { id: 'balloon', emoji: '🎈', label: 'Balloon', color: 'bg-blue-100' },
  { id: 'car', emoji: '🚗', label: 'Car', color: 'bg-red-100' },
];

export default function LogicSequences({ level, onAnswer }: ActivityProps) {
  const [sequence, setSequence] = useState<(SequenceItem | null)[]>([]);
  const [options, setOptions] = useState<SequenceItem[]>([]);
  const [answer, setAnswer] = useState<SequenceItem | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    generateNewChallenge();
  }, [level]);

  const generateNewChallenge = () => {
    setIsSuccess(false);
    let pattern: SequenceItem[] = [];
    let fullSequence: (SequenceItem | null)[] = [];
    let currentAnswer: SequenceItem;

    const shuffled = [...ITEMS].sort(() => 0.5 - Math.random());

    if (level <= 2) {
      // ABAB
      const [a, b] = shuffled.slice(0, 2);
      pattern = [a, b, a, b];
      currentAnswer = a;
      fullSequence = [a, b, a, b, null];
      currentAnswer = a; // Wait, ABAB[A]
    } else if (level <= 4) {
      // ABCABC
      const [a, b, c] = shuffled.slice(0, 3);
      pattern = [a, b, c, a, b, c];
      fullSequence = [a, b, c, a, b, null];
      currentAnswer = c;
    } else {
      // Complex patterns / Middle missing
      const [a, b] = shuffled.slice(0, 2);
      fullSequence = [a, null, a, b, a, b];
      currentAnswer = b;
    }

    // Ensure currentAnswer is set correctly for the null spot
    const nullIndex = fullSequence.indexOf(null);
    if (level <= 2) {
        currentAnswer = shuffled[0]; // A
        fullSequence[nullIndex] = null;
    } else if (level <= 4) {
        currentAnswer = shuffled[2]; // C
    } else {
        currentAnswer = shuffled[1]; // B
    }

    setSequence(fullSequence);
    setAnswer(currentAnswer);

    // Options: answer + 2 randoms
    const otherOptions = ITEMS.filter(i => i.id !== currentAnswer.id).sort(() => 0.5 - Math.random()).slice(0, 2);
    setOptions([currentAnswer, ...otherOptions].sort(() => 0.5 - Math.random()));

    setTimeout(() => {
        speak("What comes next in the pattern?");
    }, 500);
  };

  const handleChoice = (choice: SequenceItem) => {
    if (isSuccess || !answer) return;

    if (choice.id === answer.id) {
      setIsSuccess(true);
      const newSequence = [...sequence];
      const nullIndex = newSequence.indexOf(null);
      newSequence[nullIndex] = choice;
      setSequence(newSequence);
      onAnswer(true);
      speak("Perfect! You solved the pattern!");
      setTimeout(() => {
        generateNewChallenge();
      }, 2000);
    } else {
      onAnswer(false);
      speak("Not quite, look closely at the pattern!");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-4">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-black text-kid-dark">
          The Logic Train 🚂
        </h3>
        <p className="text-kid-sub font-bold text-sm">Help the train finish its cargo!</p>
      </div>

      {/* The Train Track */}
      <div className="w-full max-w-3xl overflow-x-auto pb-8 mb-8">
        <div className="flex items-center gap-4 justify-center min-w-max px-8">
            <div className="text-6xl filter drop-shadow-md">🚂</div>
            {sequence.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: idx * 0.1 }}
                className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border-4 border-dashed flex items-center justify-center text-4xl shadow-sm relative ${
                  item ? 'bg-white border-stone-100' : 'bg-stone-50 border-stone-200'
                }`}
              >
                {item ? (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                  >
                    {item.emoji}
                  </motion.span>
                ) : (
                  <span className="text-stone-300 font-black animate-pulse">?</span>
                )}
                
                {/* Connector */}
                <div className="absolute -right-5 top-1/2 -translate-y-1/2 w-6 h-2 bg-stone-200" />
              </motion.div>
            ))}
        </div>
      </div>

      {/* Choice Area */}
      <div className="w-full max-w-md bg-white p-6 rounded-[40px] border-4 border-stone-100 shadow-sm">
        <div className="flex justify-center gap-6">
          {options.map((option) => (
            <motion.button
              key={option.id}
              whileHover={{ scale: 1.1, y: -5 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleChoice(option)}
              className="w-20 h-20 sm:w-24 sm:h-24 bg-stone-50 rounded-3xl border-2 border-stone-100 flex items-center justify-center text-5xl shadow-sm cursor-pointer hover:bg-white hover:border-stone-200 transition-all"
            >
              {option.emoji}
            </motion.button>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <p className="text-stone-400 font-black text-xs uppercase tracking-widest px-4 py-1 rounded-full bg-stone-100">
           Level {level}: {level <= 2 ? "Simple AB" : level <= 4 ? "Triple ABC" : "Mixed Logic"}
        </p>
      </div>
    </div>
  );
}
