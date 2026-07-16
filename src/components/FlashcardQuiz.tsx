import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowRight, Volume2, RefreshCw } from 'lucide-react';
import { playPop, playChime, playBuzz, speak } from '../utils/audio';
import { ActivityProps } from './ActivityWrapper';

interface FlashcardWord {
  word: string;
  emoji: string;
  hint: string;
  category: 'animal' | 'object' | 'nature' | 'bodypart';
}

const FLASHCARD_WORDS: FlashcardWord[] = [
  // Animals
  { word: 'CAT', emoji: '🐱', hint: 'A fluffy little pet that meows!', category: 'animal' },
  { word: 'DOG', emoji: '🐶', hint: 'A playful puppy that barks!', category: 'animal' },
  { word: 'FOX', emoji: '🦊', hint: 'A clever orange forest animal with a bushy tail!', category: 'animal' },
  { word: 'PIG', emoji: '🐷', hint: 'A cute pink farm buddy that oinks!', category: 'animal' },
  { word: 'BEE', emoji: '🐝', hint: 'A buzzing yellow friend that makes honey!', category: 'animal' },
  { word: 'FROG', emoji: '🐸', hint: 'A tiny green crawler that ribbits and leaps!', category: 'animal' },
  { word: 'FISH', emoji: '🐟', hint: 'A shiny friend that swims underwater!', category: 'animal' },
  { word: 'DUCK', emoji: '🦆', hint: 'A quacking friend that loves to paddle in ponds!', category: 'animal' },
  { word: 'LION', emoji: '🦁', hint: 'A brave animal with a big golden mane that roars!', category: 'animal' },
  { word: 'BIRD', emoji: '🐦', hint: 'A chirping friend that flies with colorful wings!', category: 'animal' },
  
  // Objects
  { word: 'TOY', emoji: '🧸', hint: 'A cute teddy bear to play and cuddle with!', category: 'object' },
  { word: 'BALL', emoji: '⚽', hint: 'Roll it or kick it to play games with buddies!', category: 'object' },
  { word: 'MILK', emoji: '🥛', hint: 'A cool, delicious white drink full of calcium!', category: 'object' },
  { word: 'CAKE', emoji: '🍰', hint: 'A sweet treat for birthdays and parties!', category: 'object' },
  { word: 'BOOK', emoji: '📖', hint: 'Flip the pages to read a magical story!', category: 'object' },
  { word: 'BOAT', emoji: '⛵', hint: 'It floats on the water and sails across the sea!', category: 'object' },
  
  // Nature
  { word: 'SUN', emoji: '☀️', hint: 'Super warm and bright golden light in the sky!', category: 'nature' },
  { word: 'TREE', emoji: '🌳', hint: 'Tall and green with branches for birds to nest!', category: 'nature' },
  { word: 'MOON', emoji: '🌙', hint: 'A glowing white shape in the night sky!', category: 'nature' },
  { word: 'STAR', emoji: '⭐', hint: 'A tiny twinkling light high up in the sky!', category: 'nature' },
  
  // Body Parts
  { word: 'HEAD', emoji: '🗣️', hint: 'The top part of your body where your brain is!', category: 'bodypart' },
  { word: 'HAND', emoji: '✋', hint: 'At the end of your arm with five fingers!', category: 'bodypart' },
  { word: 'FOOT', emoji: '🦶', hint: 'At the end of your leg - you walk on it!', category: 'bodypart' },
  { word: 'EYES', emoji: '👀', hint: 'You use these to see the world around you!', category: 'bodypart' },
  { word: 'NOSE', emoji: '👃', hint: 'On your face - you smell with it!', category: 'bodypart' },
  { word: 'EARS', emoji: '👂', hint: 'On the sides of your head - you hear with them!', category: 'bodypart' },
  { word: 'MOUTH', emoji: '👄', hint: 'You eat and talk with it!', category: 'bodypart' },
  { word: 'TEETH', emoji: '😁', hint: 'In your mouth - you chew food with them!', category: 'bodypart' },
  { word: 'ARMS', emoji: '💪', hint: 'Between your shoulders and hands - you hug with them!', category: 'bodypart' },
  { word: 'LEGS', emoji: '🦵', hint: 'You walk and run on them!', category: 'bodypart' },
];

export default function FlashcardQuiz({ level, onAnswer }: ActivityProps) {
  const [cardIndex, setCardIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [userInput, setUserInput] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [shakeInput, setShakeInput] = useState(false);

  const currentCard = FLASHCARD_WORDS[cardIndex % FLASHCARD_WORDS.length];
  const { word, emoji, hint, category } = currentCard;

  const speakQuestion = () => {
    speak(`How do you spell ${word}? Look at the ${emoji} emoji!`);
  };

  useEffect(() => {
    setFeedback(null);
    setUserInput([]);
    const timer = setTimeout(() => {
      speakQuestion();
    }, 300);
    return () => clearTimeout(timer);
  }, [cardIndex, word]);

  const handleLetterClick = (letter: string) => {
    if (feedback === null) {
      setUserInput(prev => [...prev, letter]);
    }
  };

  const handleRemoveLetter = (index: number) => {
    setUserInput(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    const currentWord = userInput.join('');
    
    if (currentWord === word) {
      playPop();
      setFeedback('correct');
      setScore(prev => prev + 1);
      speak(`Fantastic! You spelled ${word} correctly!`);
      onAnswer(true);
      
      setTimeout(() => {
        playChime();
        setCardIndex(prev => prev + 1);
      }, 1500);
    } else {
      playBuzz();
      setFeedback('wrong');
      setShakeInput(true);
      speak(`Oops! Try again. Look at the hint: ${hint}`);
      setTimeout(() => setShakeInput(false), 500);
      onAnswer(false);
    }
  };

  const handleReset = () => {
    playPop();
    setCardIndex(0);
    setScore(0);
    setUserInput([]);
    setFeedback(null);
    speak('Flashcard quiz restarted! Let\'s test your spelling!');
  };

  const getAllLetters = (): string[] => {
    const allLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    // Shuffle and limit to make it more challenging but manageable
    const shuffled = allLetters.sort(() => Math.random() - 0.5);
    // Always include the letters needed for the word, plus extra letters
    const needed = word.split('').filter((char, idx) => word.indexOf(char) === idx);
    const extra = shuffled.filter(l => !word.includes(l)).slice(0, Math.max(0, 8 - needed.length));
    return [...needed, ...extra].sort(() => Math.random() - 0.5);
  };

  const availableLetters = getAllLetters();

  const categoryColors: Record<string, string> = {
    animal: 'bg-orange-100 border-orange-400 text-orange-700',
    object: 'bg-purple-100 border-purple-400 text-purple-700',
    nature: 'bg-green-100 border-green-400 text-green-700',
    bodypart: 'bg-pink-100 border-pink-400 text-pink-700',
  };

  return (
    <div className="flex flex-col items-center w-full max-w-3xl mx-auto p-4 sm:p-6 bg-white border-4 border-kid-red-dark rounded-[32px] shadow-sm">
      {/* Header */}
      <div className="w-full flex justify-between items-center mb-6">
        <div className="flex items-center gap-2 bg-kid-red/10 px-4 py-1.5 rounded-full border-2 border-kid-red-dark/30">
          <Sparkles className="text-kid-red-dark animate-spin" size={16} />
          <span className="text-xs font-black text-kid-red-dark uppercase tracking-widest">
            Card {cardIndex + 1} of {FLASHCARD_WORDS.length}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className={`text-xs font-black px-3 py-1.5 rounded-full border-2 ${categoryColors[category]}`}>
            {category.toUpperCase()}
          </div>
          <div className="flex items-center gap-1.5 text-kid-green-dark font-black text-base">
            ⭐ {score}
          </div>
        </div>
      </div>

      <h2 className="text-3xl font-black text-kid-dark text-center mb-2 uppercase">
        🎮 Flashcard Quiz Mode
      </h2>
      <p className="text-kid-sub text-sm font-bold text-center mb-8 max-w-sm">
        Can you spell the word shown by the emoji?
      </p>

      {/* Emoji Display */}
      <motion.div
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="text-9xl mb-6 select-none cursor-pointer"
        onClick={speakQuestion}
      >
        {emoji}
      </motion.div>

      {/* Hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-kid-yellow/20 border-2 border-kid-yellow rounded-[16px] px-4 py-2 mb-8 text-center max-w-sm"
      >
        <p className="text-xs font-bold text-kid-dark">
          💡 Hint: {hint}
        </p>
      </motion.div>

      {/* Selected Letters Display */}
      <motion.div
        animate={shakeInput ? { x: [-10, 10, -10, 10, 0] } : {}}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md mb-6 p-4 rounded-[20px] border-4 border-kid-red bg-white min-h-20 flex flex-wrap items-center justify-center gap-2"
      >
        {userInput.length === 0 ? (
          <p className="text-kid-sub text-sm font-semibold">Click letters to spell the word...</p>
        ) : (
          userInput.map((letter, idx) => (
            <motion.button
              key={idx}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleRemoveLetter(idx)}
              className="w-12 h-12 bg-kid-blue text-white font-black text-lg rounded-lg shadow-md hover:bg-kid-blue/80 transition-all"
            >
              {letter}
            </motion.button>
          ))
        )}
      </motion.div>

      {/* Alphabet Buttons */}
      <div className="w-full max-w-2xl mb-6">
        <p className="text-kid-sub text-xs font-bold text-center mb-3">Choose letters to spell the word:</p>
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
          {availableLetters.map((letter) => {
            const isSelected = userInput.includes(letter);
            const canUse = userInput.filter(l => l === letter).length < word.split('').filter(l => l === letter).length;
            
            return (
              <motion.button
                key={letter}
                whileHover={canUse && !isSelected ? { scale: 1.1 } : {}}
                whileTap={canUse && !isSelected ? { scale: 0.95 } : {}}
                onClick={() => canUse && handleLetterClick(letter)}
                disabled={!canUse || feedback !== null}
                className={`w-full aspect-square text-sm font-black rounded-lg transition-all ${
                  isSelected
                    ? 'bg-kid-green-light text-kid-dark border-2 border-kid-green-dark opacity-60'
                    : feedback === 'correct'
                      ? 'bg-kid-green-light text-kid-dark border-2 border-kid-green-dark'
                      : feedback === 'wrong'
                        ? 'bg-red-200 text-red-700 border-2 border-red-400'
                        : 'bg-kid-yellow text-kid-dark border-2 border-kid-yellow hover:shadow-md'
                }`}
              >
                {letter}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Feedback Message */}
      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`mb-6 p-4 rounded-[16px] text-center font-black text-lg ${
              feedback === 'correct'
                ? 'bg-kid-green-bg border-2 border-kid-green-mint text-kid-green-dark'
                : 'bg-red-100 border-2 border-red-400 text-red-700'
            }`}
          >
            {feedback === 'correct' ? '✨ Perfect! You spelled it correctly!' : '❌ Not quite right. Try again!'}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Buttons */}
      <div className="flex flex-col gap-3 w-full max-w-sm">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSubmit}
          disabled={feedback !== null || userInput.length === 0}
          className="w-full px-6 py-3 bg-kid-red hover:bg-kid-red-dark text-white font-black rounded-full shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
        >
          {feedback === null ? 'Check Spelling' : 'Continue'}
          {feedback === null && <ArrowRight size={16} />}
        </motion.button>

        <button
          onClick={speakQuestion}
          className="px-4 py-2 bg-white text-kid-red font-bold rounded-full border-2 border-kid-red hover:bg-red-50 flex items-center justify-center gap-2 text-xs transition-all"
        >
          <Volume2 size={14} /> Hear Question
        </button>

        <button
          onClick={handleReset}
          className="px-4 py-2 bg-stone-100 text-kid-dark font-bold rounded-full border-2 border-stone-300 hover:bg-stone-200 flex items-center justify-center gap-2 text-xs transition-all"
        >
          <RefreshCw size={14} /> Reset Quiz
        </button>
      </div>

      {/* Footer Info */}
      <div className="w-full mt-8 pt-4 border-t-2 border-kid-red/20 text-center text-xs text-kid-sub font-semibold">
        🎯 Quiz Mode: Click the letters to spell the word correctly!
      </div>
    </div>
  );
}
