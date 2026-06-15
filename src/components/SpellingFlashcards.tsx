import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Award, Heart, RefreshCw, ArrowRight, Volume2, HelpCircle } from 'lucide-react';
import { playPop, playChime, playBuzz, speak } from '../utils/audio';

interface SpellingWord {
  word: string; // The word to spell, e.g. 'CAT'
  emoji: string; // Representing emoji, e.g. '🐱'
  hint: string;  // e.g. 'A fluffy little pet that meows!'
}

const SPELLING_WORDS: SpellingWord[] = [
  { word: 'CAT', emoji: '🐱', hint: 'A fluffy little pet that meows!' },
  { word: 'DOG', emoji: '🐶', hint: 'A playful puppy that barks!' },
  { word: 'SUN', emoji: '☀️', hint: 'Super warm and bright golden light in the sky!' },
  { word: 'TOY', emoji: '🧸', hint: 'A cute teddy bear to play and cuddle with!' },
  { word: 'FOX', emoji: '🦊', hint: 'A clever orange forest animal with a bushy tail!' },
  { word: 'PIG', emoji: '🐷', hint: 'A cute pink farm buddy that oinks!' },
  { word: 'BEE', emoji: '🐝', hint: 'A buzzing yellow friend that drafts sweet honey!' },
  { word: 'BALL', emoji: '⚽', hint: 'Roll it or kick it to play games with buddies!' },
  { word: 'FROG', emoji: '🐸', hint: 'A tiny green crawler that ribbits and leaps!' },
  { word: 'MILK', emoji: '🥛', hint: 'A cool, delicious white drink full of calcium!' },
  { word: 'FISH', emoji: '🐟', hint: 'A shiny friend that swims underwater!' },
  { word: 'CAKE', emoji: '🍰', hint: 'A sweet treat for birthdays and parties!' },
  { word: 'BOOK', emoji: '📖', hint: 'Flip the pages to read a magical story!' },
  { word: 'TREE', emoji: '🌳', hint: 'Tall and green with branches for birds to nest!' },
  { word: 'MOON', emoji: '🌙', hint: 'A glowing white shape in the night sky!' },
  { word: 'DUCK', emoji: '🦆', hint: 'A quacking friend that loves to paddle in ponds!' },
  { word: 'LION', emoji: '🦁', hint: 'A brave animal with a big golden mane that roars!' },
  { word: 'STAR', emoji: '⭐', hint: 'A tiny twinkling light high up in the sky!' },
  { word: 'BIRD', emoji: '🐦', hint: 'A chirping friend that flies with colorful wings!' },
  { word: 'BOAT', emoji: '⛵', hint: 'It floats on the water and sails across the sea!' }
];

export default function SpellingFlashcards() {
  const [levelIndex, setLevelIndex] = useState(0);
  const [score, setScore] = useState(0);
  
  const currentItem = SPELLING_WORDS[levelIndex % SPELLING_WORDS.length];
  const { word, emoji, hint } = currentItem;

  // Track the spelt characters inputted so far
  const [speltLetters, setSpeltLetters] = useState<string[]>([]);
  const [shuffledPool, setShuffledPool] = useState<{ id: string; letter: string; used: boolean }[]>([]);
  const [shakeLetterId, setShakeLetterId] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isRevealing, setIsRevealing] = useState(true);

  // Re-build word bubble inputs when level changes
  useEffect(() => {
    // Take the correct letters of the word
    const letters = word.split('');
    
    // Create random helper distraction letters to fill up options to at least 6
    const poolLetters = [...letters];
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    while (poolLetters.length < Math.max(6, letters.length + 2)) {
      const randomChar = alphabet[Math.floor(Math.random() * alphabet.length)];
      if (!poolLetters.includes(randomChar)) {
        poolLetters.push(randomChar);
      }
    }

    // Shuffle pool
    const shuffled = poolLetters
      .map((l, index) => ({ id: `${l}-${index}-${Math.random()}`, letter: l, used: false }))
      .sort(() => Math.random() - 0.5);

    setShuffledPool(shuffled);
    setSpeltLetters([]);
    setIsCompleted(false);
    setIsRevealing(true);

    const revealTimer = setTimeout(() => {
      setIsRevealing(false);
    }, 3000);

    return () => clearTimeout(revealTimer);
  }, [levelIndex, word]);

  // Read word out loud on load
  const speakHint = () => {
    speak(`Let's spell ${word.split('').join(' ')}! ${emoji} represents ${word}!`);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      speakHint();
    }, 450);
    return () => clearTimeout(timer);
  }, [levelIndex, word]);

  const handleBalloonTap = (bubbleId: string, char: string) => {
    if (isCompleted || isRevealing) return;

    // Determine the next index we need to fill
    const nextIndexToFill = speltLetters.length;
    const expectedLetter = word[nextIndexToFill];

    if (char === expectedLetter) {
      // Correct! Add to spelt array, play chime step, set used status
      playPop();
      const newSpelt = [...speltLetters, char];
      setSpeltLetters(newSpelt);
      
      // Mark bubble as temporarily used/invisible
      setShuffledPool(prev => prev.map(item => item.id === bubbleId ? { ...item, used: true } : item));
      
      speak(char); // Pronounce letter

      // Check if that completes the word
      if (newSpelt.length === word.length) {
        setIsCompleted(true);
        setScore(prev => prev + 10);
        setTimeout(() => {
          playChime();
          // Voice: Spell word aloud and cheer!
          const spelledWordSpoken = word.split('').join(' ');
          speak(`Fantastic! ${spelledWordSpoken} spells ${word}! ${emoji} is amazing!`);
        }, 300);
      }
    } else {
      // Wrong! Shake the balloon and give audio warning
      playBuzz();
      setShakeLetterId(bubbleId);
      setTimeout(() => setShakeLetterId(null), 500);
      speak(`Try another letter! Look for the letter ${expectedLetter}.`);
    }
  };

  const handleNextLevel = () => {
    playPop();
    setLevelIndex(prev => prev + 1);
  };

  const handleBackspace = () => {
    if (speltLetters.length === 0 || isCompleted || isRevealing) return;
    playPop();
    const removedLetter = speltLetters[speltLetters.length - 1];
    
    // Remove last spelt letter
    setSpeltLetters(prev => prev.slice(0, -1));
    
    // Release the last used match from pool
    // Find the first matching bubble that is current marked as used
    const itemToRelease = shuffledPool.find(item => item.letter === removedLetter && item.used);
    if (itemToRelease) {
      setShuffledPool(prev => prev.map(item => item.id === itemToRelease.id ? { ...item, used: false } : item));
    }
  };

  const resetGame = () => {
    playPop();
    setScore(0);
    setLevelIndex(0);
    speak("Spelling board restarted! Let's trace and spell cute words together!");
  };

  return (
    <div id="spelling_flash_main" className="flex flex-col items-center w-full max-w-3xl mx-auto p-4 sm:p-6 bg-white border-4 border-kid-red-dark rounded-[32px] shadow-sm overflow-hidden">
      
      {/* Header HUD */}
      <div id="spelling_hud" className="w-full flex justify-between items-center mb-4">
        <div className="flex items-center gap-2 bg-kid-red/10 px-4 py-1.5 rounded-full border-2 border-kid-red-dark/30">
          <Sparkles className="text-kid-red-dark animate-spin" size={16} />
          <span className="text-xs font-black text-kid-red-dark uppercase tracking-widest">
            Spelling Card {levelIndex + 1} of {SPELLING_WORDS.length}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-kid-green-dark font-black text-base">
          ⭐ Spell Point: {score}
        </div>
      </div>

      <h2 className="text-3xl font-black text-kid-dark text-center tracking-tight leading-none mb-2 uppercase">
        Spell & Learn Sandbox! ✏️
      </h2>
      <p className="text-kid-sub text-sm font-bold text-center mb-6 max-w-sm">
        {isRevealing ? "Look closely at the spelling!" : "Match the matching balloons in order to write the flashcard word!"}
      </p>

      {/* Main Flashcard Display Screen */}
      <div id="main_spell_canvas" className="w-full bg-kid-cream/55 p-6 rounded-[24px] border-4 border-dashed border-kid-red/30 flex flex-col items-center mb-6 shadow-inner text-center relative">
        
        {/* Animated Card Emoji */}
        <motion.div
          animate={isCompleted ? { scale: [1, 1.2, 1], rotate: [0, -15, 15, 0] } : { y: [0, -6, 0] }}
          transition={isCompleted ? { duration: 0.8 } : { repeat: Infinity, duration: 3, ease: 'easeInOut' }}
          className="text-8xl mb-3 select-none filter drop-shadow-md cursor-pointer"
          onClick={() => { playChime(); speak(`${word}! ${hint}`); }}
        >
          {emoji}
        </motion.div>

        {/* Level Words Helper hint */}
        <p className="text-sm font-black text-kid-dark mt-1 mb-4 italic text-kid-sub max-w-md">
          " {hint} "
        </p>

        {/* Spelt Slots Row */}
        <div id="word_spell_slots" className="flex gap-3 justify-center items-center my-4">
          {word.split('').map((char, index) => {
            const currentFilledValue = speltLetters[index];
            const isFilled = !!currentFilledValue;
            return (
              <motion.div
                id={`spell_slot_${index}`}
                key={index}
                animate={isFilled || isRevealing ? { scale: [1, 1.15, 1] } : {}}
                className={`w-14 h-14 sm:w-16 sm:h-16 rounded-[20px] pb-1.5 border-4 flex items-center justify-center text-3xl font-black transition-all ${
                  isFilled || isRevealing
                    ? 'bg-white border-kid-peach-dark text-kid-dark shadow-[0_4px_0_#E9C08B]'
                    : isCompleted
                      ? 'bg-kid-green-bg border-kid-green-mint text-kid-green-dark'
                      : 'bg-white border-dashed border-slate-300 text-slate-300 animate-pulse'
                }`}
              >
                {isFilled ? currentFilledValue : (isRevealing ? word[index] : '?')}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Interactive Balloon Alphabet Bubbles Pool */}
      <div id="alphabet_pool_box" className={`w-full bg-slate-50 p-6 rounded-[28px] border-3 border-kid-red/20 flex flex-col items-center transition-opacity ${isRevealing ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
        <h3 className="text-xs font-black uppercase tracking-widest text-kid-sub mb-4">
          {isRevealing ? "Wait for it..." : "🎈 Tap the spelling bubbles in order"}
        </h3>

        {/* Bubble balloons pool list */}
        <div className="flex flex-wrap gap-3 justify-center max-w-xl">
          {shuffledPool.map((b) => (
            <AnimatePresence key={b.id}>
              {!b.used && (
                <motion.button
                  id={`alphabet_bubble_${b.letter}`}
                  onClick={() => handleBalloonTap(b.id, b.letter)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  animate={shakeLetterId === b.id ? { x: [-10, 10, -10, 10, 0] } : {}}
                  transition={{ duration: 0.3 }}
                  className="w-14 h-14 rounded-full bg-white border-3 border-sky-300 hover:border-sky-450 flex items-center justify-center text-2xl font-black text-kid-dark cursor-pointer shadow-[0_4px_0_#A0C4FF]"
                >
                  {b.letter}
                </motion.button>
              )}
            </AnimatePresence>
          ))}
        </div>

        {/* Input tools layout */}
        {!isCompleted && speltLetters.length > 0 && (
          <button
            id="spelling_undo_btn"
            onClick={handleBackspace}
            className="mt-6 px-4 py-2 bg-white text-xs font-black text-kid-dark rounded-full border-2 border-kid-peach hover:bg-slate-50 flex items-center gap-1 cursor-pointer transition-all uppercase shadow-xs"
          >
            ↩️ Delete Last Bullet
          </button>
        )}
      </div>

      {/* Celebration Award modal layout if completed */}
      <AnimatePresence>
        {isCompleted && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="w-full flex flex-col items-center justify-center mt-6 p-5 bg-kid-green-bg border-3 border-kid-green-mint rounded-[24px] text-center"
          >
            <div className="flex gap-1 justify-center mb-1 text-kid-green-dark">
              <span>🌟</span>
              <span className="text-xl">⭐</span>
              <span>🌟</span>
            </div>
            <p className="text-lg font-black text-kid-green-dark">
              Spelled correctly! You are a Spelling Champion!
            </p>
            <button
              id="spell_next_level_btn"
              onClick={handleNextLevel}
              className="mt-4 px-8 py-3 bg-kid-red hover:bg-kid-red-dark text-white font-black rounded-full shadow-[0_4px_0_#EE8E8E] text-sm transition-transform hover:scale-102 flex items-center gap-2 cursor-pointer"
            >
              Play Next Word <ArrowRight size={16} strokeWidth={3} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* sound board details footer */}
      <div className="w-full mt-8 pt-4 border-t-3 border-kid-red-dark/10 flex justify-between items-center text-xs text-kid-sub font-black uppercase tracking-tight">
        <button
          onClick={speakHint}
          className="hover:text-kid-red-dark transition-all flex items-center gap-1 cursor-pointer"
        >
          <Volume2 size={13} className="text-kid-red-dark" /> Hear Word Hint Again
        </button>
        <button
          id="btn_reset_spell_game"
          onClick={resetGame}
          className="hover:text-kid-red transition-colors flex items-center gap-1 cursor-pointer"
        >
          <RefreshCw size={12} /> Reset Points
        </button>
      </div>

    </div>
  );
}
