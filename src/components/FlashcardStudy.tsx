import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowRight, Volume2, RefreshCw } from 'lucide-react';
import { playPop, speak } from '../utils/audio';

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

export default function FlashcardStudy() {
  const [cardIndex, setCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const currentCard = FLASHCARD_WORDS[cardIndex % FLASHCARD_WORDS.length];
  const { word, emoji, hint, category } = currentCard;

  const speakWord = () => {
    speak(`Let's learn ${word}! ${emoji} represents ${word}! ${hint}`);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      speakWord();
    }, 300);
    return () => clearTimeout(timer);
  }, [cardIndex, word]);

  const handleNextCard = () => {
    playPop();
    setCardIndex(prev => prev + 1);
    setIsFlipped(false);
  };

  const handleFlip = () => {
    playPop();
    setIsFlipped(!isFlipped);
    if (!isFlipped) {
      speak(`The spelling is: ${word.split('').join(' ')}`);
    }
  };

  const handleReset = () => {
    playPop();
    setCardIndex(0);
    setIsFlipped(false);
    speak('Flashcard study restarted! Let\'s learn to spell!');
  };

  const categoryColors: Record<string, string> = {
    animal: 'bg-orange-100 border-orange-400 text-orange-700',
    object: 'bg-purple-100 border-purple-400 text-purple-700',
    nature: 'bg-green-100 border-green-400 text-green-700',
    bodypart: 'bg-pink-100 border-pink-400 text-pink-700',
  };

  return (
    <div className="flex flex-col items-center w-full max-w-3xl mx-auto p-4 sm:p-6 bg-white border-4 border-kid-blue rounded-[32px] shadow-sm">
      {/* Header */}
      <div className="w-full flex justify-between items-center mb-6">
        <div className="flex items-center gap-2 bg-kid-blue/10 px-4 py-1.5 rounded-full border-2 border-kid-blue/30">
          <Sparkles className="text-kid-blue animate-pulse" size={16} />
          <span className="text-xs font-black text-kid-blue uppercase tracking-widest">
            Card {cardIndex + 1} of {FLASHCARD_WORDS.length}
          </span>
        </div>
        <div className={`text-xs font-black px-3 py-1.5 rounded-full border-2 ${categoryColors[category]}`}>
          {category.toUpperCase()}
        </div>
      </div>

      <h2 className="text-3xl font-black text-kid-dark text-center mb-2 uppercase">
        📚 Flashcard Study Room
      </h2>
      <p className="text-kid-sub text-sm font-bold text-center mb-8 max-w-sm">
        Click the card to see the emoji and hint! Learn how to spell each word!
      </p>

      {/* Flashcard */}
      <div className="w-full max-w-md mb-8 cursor-pointer relative" onClick={handleFlip}>
        <AnimatePresence mode="wait">
          {isFlipped ? (
            <motion.div
              key="word-side"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-gradient-to-br from-kid-blue to-kid-blue/70 p-12 rounded-[28px] border-4 border-kid-blue shadow-lg aspect-square flex flex-col items-center justify-center text-center relative overflow-hidden"
            >
              {/* Decorative elements */}
              <div className="absolute top-3 right-3 text-2xl opacity-30 select-none">✨</div>
              <div className="absolute bottom-3 left-3 text-2xl opacity-30 select-none">✨</div>
              <div className="flex flex-col items-center gap-4">
                <div className="text-5xl font-black text-white tracking-widest select-none">
                  {word}
                </div>
                <div className="text-sm font-bold text-white/90 mt-2 select-none">
                  (Click to see the emoji)
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="emoji-side"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-gradient-to-br from-kid-blue to-kid-blue/70 p-12 rounded-[28px] border-4 border-kid-blue shadow-lg aspect-square flex flex-col items-center justify-center text-center relative overflow-hidden"
            >
              {/* Decorative elements */}
              <div className="absolute top-3 right-3 text-2xl opacity-30 select-none">✨</div>
              <div className="absolute bottom-3 left-3 text-2xl opacity-30 select-none">✨</div>

              <div className="flex flex-col items-center gap-6">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="text-9xl select-none"
                >
                  {emoji}
                </motion.div>
                <div className="text-2xl font-black text-white select-none">
                  Click me!
                </div>
                <div className="text-white/80 text-sm font-semibold max-w-xs italic select-none">
                  "{hint}"
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Hint Display */}
      {isFlipped && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-kid-green-bg border-3 border-kid-green-mint rounded-[20px] p-4 text-center mb-6"
        >
          <p className="text-kid-dark font-bold text-sm">
            💡 {hint}
          </p>
        </motion.div>
      )}

      {/* Controls */}
      <div className="flex flex-col gap-3 w-full max-w-xs">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleNextCard}
          className="w-full px-6 py-3 bg-kid-blue hover:bg-kid-blue/90 text-white font-black rounded-full shadow-lg transition-all flex items-center justify-center gap-2 text-sm"
        >
          Next Card <ArrowRight size={16} />
        </motion.button>

        <button
          onClick={speakWord}
          className="px-4 py-2 bg-white text-kid-blue font-bold rounded-full border-2 border-kid-blue hover:bg-blue-50 flex items-center justify-center gap-2 text-xs transition-all"
        >
          <Volume2 size={14} /> Hear Word Again
        </button>

        <button
          onClick={handleReset}
          className="px-4 py-2 bg-stone-100 text-kid-dark font-bold rounded-full border-2 border-stone-300 hover:bg-stone-200 flex items-center justify-center gap-2 text-xs transition-all"
        >
          <RefreshCw size={14} /> Reset
        </button>
      </div>

      {/* Footer Info */}
      <div className="w-full mt-8 pt-4 border-t-2 border-kid-blue/20 text-center text-xs text-kid-sub font-semibold">
        📖 Study Mode: Learn to spell at your own pace. No pressure, just learning!
      </div>
    </div>
  );
}
