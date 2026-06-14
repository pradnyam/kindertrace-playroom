import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ActivityProps } from './ActivityWrapper';
import { speak } from '../utils/audio';

interface Animal {
  id: string;
  name: string;
  emoji: string;
  sound: string;
  instruction: string;
}

const ANIMALS: Animal[] = [
  { id: 'lion', name: 'Lion', emoji: '🦁', sound: 'Roar!', instruction: 'Find the Lion!' },
  { id: 'elephant', name: 'Elephant', emoji: '🐘', sound: 'Toot!', instruction: 'Find the Elephant!' },
  { id: 'cow', name: 'Cow', emoji: '🐮', sound: 'Moo!', instruction: 'Find the Cow!' },
  { id: 'duck', name: 'Duck', emoji: '🦆', sound: 'Quack!', instruction: 'Find the Duck!' },
  { id: 'monkey', name: 'Monkey', emoji: '🐒', sound: 'Ooh ooh aah aah!', instruction: 'Find the Monkey!' },
  { id: 'frog', name: 'Frog', emoji: '🐸', sound: 'Ribbit!', instruction: 'Find the Frog!' },
  { id: 'cat', name: 'Cat', emoji: '🐱', sound: 'Meow!', instruction: 'Find the Cat!' },
  { id: 'dog', name: 'Dog', emoji: '🐶', sound: 'Woof!', instruction: 'Find the Dog!' },
];

export default function AnimalDiscovery({ level, onAnswer }: ActivityProps) {
  const [options, setOptions] = useState<Animal[]>([]);
  const [target, setTarget] = useState<Animal | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    generateNewChallenge();
  }, [level]);

  const generateNewChallenge = () => {
    setIsSuccess(false);
    const count = level <= 2 ? 2 : level <= 4 ? 3 : 4;
    const shuffled = [...ANIMALS].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, count);
    const newTarget = selected[Math.floor(Math.random() * selected.length)];
    
    setOptions(selected);
    setTarget(newTarget);
    
    // Voice prompt
    setTimeout(() => {
        if (level >= 3 && Math.random() > 0.5) {
            speak(`Which animal says ${newTarget.sound}`);
        } else {
            speak(newTarget.instruction);
        }
    }, 500);
  };

  const handleChoice = (animal: Animal) => {
    if (isSuccess || !target) return;

    if (animal.id === target.id) {
      setIsSuccess(true);
      speak(`${target.name}! ${target.sound}`);
      onAnswer(true);
      setTimeout(() => {
        generateNewChallenge();
      }, 1500);
    } else {
      onAnswer(false);
      speak(`That's the ${animal.name}. Try to find the ${target.name}!`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-4">
      <div id="animal_stage" className="w-full max-w-2xl bg-sky-50 rounded-[48px] p-8 border-4 border-sky-200 shadow-inner min-h-[300px] flex items-center justify-center relative overflow-hidden">
        {/* Background Decors */}
        <div className="absolute top-4 left-4 text-4xl opacity-20">☁️</div>
        <div className="absolute top-10 right-10 text-4xl opacity-20">☁️</div>
        <div className="absolute bottom-4 left-1/4 text-4xl opacity-20">🌿</div>
        <div className="absolute bottom-4 right-1/4 text-4xl opacity-20">🌳</div>

        <div className="grid grid-cols-2 gap-8 z-10">
          {options.map((animal) => (
            <motion.button
              key={animal.id}
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleChoice(animal)}
              className={`w-32 h-32 sm:w-40 sm:h-40 bg-white rounded-[32px] border-4 flex items-center justify-center text-6xl sm:text-7xl shadow-lg transition-colors ${
                isSuccess && animal.id === target?.id ? 'border-kid-green-mint bg-kid-green-bg' : 'border-sky-100 hover:border-sky-300'
              }`}
            >
              <AnimatePresence mode="wait">
                {level === 5 && !isSuccess ? (
                    <motion.div
                        key="hiding"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 20, opacity: 0 }}
                        className="relative"
                    >
                         <span className="opacity-10">❓</span>
                         <motion.span 
                            animate={{ y: [0, -10, 0] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className="absolute inset-0 flex items-center justify-center"
                         >
                            {animal.emoji}
                         </motion.span>
                    </motion.div>
                ) : (
                    <motion.span
                        key="visible"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                    >
                        {animal.emoji}
                    </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          ))}
        </div>
      </div>
      
      {target && (
        <div className="mt-8 bg-white px-6 py-2 rounded-full border-2 border-sky-100 shadow-sm">
           <p className="text-sky-400 font-black text-sm uppercase tracking-widest">
              Level {level}: {level >= 3 ? "Sound Association" : "Visual Identification"}
           </p>
        </div>
      )}
    </div>
  );
}
