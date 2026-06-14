import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import TracingBoard from './components/TracingBoard';
import PatternMatch from './components/PatternMatch';
import BalloonPop from './components/BalloonPop';
import PhonicsBoard from './components/PhonicsBoard';
import ArithmeticMath from './components/ArithmeticMath';
import SpellingFlashcards from './components/SpellingFlashcards';
import { playPop, playChime, speak } from './utils/audio';
import { Sparkles, Gamepad2, Award, Heart, Shield, Undo2, Star, BookOpen, Smile, Palette, Wand2 } from 'lucide-react';

type Tab = 'lobby' | 'tracing' | 'patterns' | 'counting' | 'phonics' | 'math' | 'spelling';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('lobby');
  const [trophyCount, setTrophyCount] = useState(0);

  useEffect(() => {
    // Say a warm greeting on load
    setTimeout(() => {
      speak("Welcome to KinderTrace Playroom! Let's choose a game to play!");
    }, 800);
  }, []);

  const changeRoom = (room: Tab) => {
    playChime();
    setActiveTab(room);
    
    // Voice announcements when entering specific playroom activities
    switch(room) {
      case 'tracing':
        speak("Let's draw! Choose a letter to start tracing!");
        break;
      case 'patterns':
        speak("Let's solve puzzle patterns!");
        break;
      case 'counting':
        speak("Welcome to the balloon counting room! Pop them all!");
        break;
      case 'phonics':
        speak("Phonics flashcards! Click any letter to hear its bubble sound!");
        break;
      case 'math':
        speak("Welcome to Creative Math Sandbox! Let's count warm toys and solve math equations!");
        break;
      case 'spelling':
        speak("Spelling flashcards! Let's spell bubble words together!");
        break;
      case 'lobby':
        speak("Back to the playroom lobby!");
        break;
    }
  };

  return (
    <div id="full-app-container" className="min-h-screen bg-kid-cream p-4 sm:p-8 flex flex-col justify-between select-none">
      
      {/* Playroom top bar header */}
      <header id="kinder_app_header" className="w-full max-w-5xl mx-auto flex justify-between items-center mb-6 sm:mb-8">
        <div id="brand_macho" className="flex items-center gap-4">
          <button
            id="brand_lobby_shortcut"
            onClick={() => changeRoom('lobby')}
            className="flex items-center gap-4 focus:outline-none select-none text-left"
          >
            <motion.div
              animate={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="w-16 h-16 bg-kid-red rounded-2xl flex items-center justify-center shadow-[0_6px_0_#EE8E8E] sm:w-16 sm:h-16"
            >
              <span className="text-4xl text-white font-black">?</span>
            </motion.div>
            <div>
              <h1 className="text-2xl sm:text-4xl font-black text-kid-dark tracking-tight leading-none uppercase">
                KinderTrace
              </h1>
              <span className="text-xs sm:text-sm font-bold text-kid-sub">
                Let's trace together, little explorer! 🐯
              </span>
            </div>
          </button>
        </div>

        {/* Global points & navigation shortcuts */}
        <div id="header_controls" className="flex items-center gap-3">
          {activeTab !== 'lobby' && (
            <button
              id="back_to_lobby_btn"
              onClick={() => changeRoom('lobby')}
              className="flex items-center gap-1.5 py-2.5 px-4 bg-white hover:bg-stone-50 text-kid-dark font-extrabold rounded-full border-3 border-kid-peach shadow-sm transition-all text-xs"
            >
              <Undo2 size={14} strokeWidth={3} className="text-kid-peach-dark" /> Room Lobby
            </button>
          )}

          <div id="trophy_star_bubble" className="bg-white border-4 border-kid-green-mint rounded-full px-4 sm:px-6 py-2 flex items-center gap-2 shadow-sm text-sm sm:text-base font-bold text-kid-dark">
            <span>⭐</span>
            <span className="font-extrabold text-kid-dark">Super Kid</span>
          </div>
        </div>
      </header>

      {/* Main Sandbox Interactive Stage */}
      <main id="kinder_app_main_stage" className="flex-grow flex items-center justify-center w-full max-w-5xl mx-auto py-2">
        <AnimatePresence mode="wait">
          {activeTab === 'lobby' && (
            <motion.div
              key="lobby"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', damping: 20 }}
              className="w-full flex flex-col items-center"
            >
              
              {/* Mascot Welcome Balloon Banner */}
              <div id="mascot_welcome_box" className="bg-white p-6 rounded-[32px] border-4 border-kid-yellow shadow-inner text-center max-w-lg mb-8 relative">
                {/* Float elements decor */}
                <span className="absolute -top-4 -left-4 text-3xl select-none">🎈</span>
                <span className="absolute -bottom-4 -right-4 text-3xl select-none">⭐</span>

                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                  className="text-6xl mb-3 select-none"
                >
                  🐯
                </motion.div>
                <h2 className="text-2xl sm:text-3xl font-black text-kid-dark tracking-tight leading-none mb-2">
                  Welcome to KinderTrace!
                </h2>
                <p className="text-kid-sub font-bold text-sm">
                  Let's choose an awesome game below to trace shapes, count elements, and play! All voices and sounds are kid-friendly!
                </p>
              </div>

              {/* Four Giant Lobby Cards */}
              <div id="lobby_games_grid" className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-4xl px-2">
                
                {/* Play Card 1: Letter Tracing */}
                <motion.button
                  id="lobby_card_tracing"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => changeRoom('tracing')}
                  className="bg-white p-6 rounded-[32px] border-b-8 border-kid-peach-dark flex items-center gap-5 text-left group shadow-sm hover:shadow-md cursor-pointer"
                >
                  <div className="w-16 h-16 rounded-2xl bg-kid-peach flex flex-shrink-0 items-center justify-center text-white text-4xl shadow-inner group-hover:scale-110 transition-transform">
                    Aa
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-kid-dark tracking-tight">
                      Trace Letters & Numbers
                    </h3>
                    <p className="text-kid-sub text-xs font-semibold mt-1 leading-relaxed">
                      Practice drawing letters and numbers with crayon stars! Friendly instructions guided by sound waves.
                    </p>
                  </div>
                </motion.button>

                {/* Play Card 2: Pattern Match */}
                <motion.button
                  id="lobby_card_patterns"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => changeRoom('patterns')}
                  className="bg-white p-6 rounded-[32px] border-b-8 border-kid-purple/70 flex items-center gap-5 text-left group shadow-sm hover:shadow-md cursor-pointer"
                >
                  <div className="w-16 h-16 rounded-2xl bg-kid-purple flex flex-shrink-0 items-center justify-center text-white text-4xl shadow-inner group-hover:scale-110 transition-transform">
                    🧩
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-kid-dark tracking-tight">
                      Pattern Matching Game
                    </h3>
                    <p className="text-kid-sub text-xs font-semibold mt-1 leading-relaxed">
                      Complete visual sequences of toys, delicious fruits and cute animals to build school readiness!
                    </p>
                  </div>
                </motion.button>

                {/* Play Card 3: Balloon Pop Counting */}
                <motion.button
                  id="lobby_card_counting"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => changeRoom('counting')}
                  className="bg-white p-6 rounded-[32px] border-b-8 border-kid-blue/70 flex items-center gap-5 text-left group shadow-sm hover:shadow-md cursor-pointer"
                >
                  <div className="w-16 h-16 rounded-2xl bg-kid-blue flex flex-shrink-0 items-center justify-center text-white text-4xl shadow-inner group-hover:scale-110 transition-transform">
                    🎈
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-kid-dark tracking-tight">
                      Pop & Count Balloons
                    </h3>
                    <p className="text-kid-sub text-xs font-semibold mt-1 leading-relaxed">
                      Bubble room pops! Count floating items aloud with audio and match correct numbers.
                    </p>
                  </div>
                </motion.button>

                {/* Play Card 4: Phonics cards */}
                <motion.button
                  id="lobby_card_phonics"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => changeRoom('phonics')}
                  className="bg-white p-6 rounded-[32px] border-b-8 border-kid-green-mint flex items-center gap-5 text-left group shadow-sm hover:shadow-md cursor-pointer"
                >
                  <div className="w-16 h-16 rounded-2xl bg-kid-green-mint flex flex-shrink-0 items-center justify-center text-white text-4xl shadow-inner group-hover:scale-110 transition-transform">
                    🅰️
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-kid-dark tracking-tight">
                      Letter Phonics Board
                    </h3>
                    <p className="text-kid-sub text-xs font-semibold mt-1 leading-relaxed">
                      Sound sandbox! Click alphabet card bubbles to hear high pitch spoken English phonics lessons.
                    </p>
                  </div>
                </motion.button>

                {/* Play Card 5: Basic Arithmetic Sandbox */}
                <motion.button
                  id="lobby_card_math"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => changeRoom('math')}
                  className="bg-white p-6 rounded-[32px] border-b-8 border-kid-peach-dark flex items-center gap-5 text-left group shadow-sm hover:shadow-md cursor-pointer"
                >
                  <div className="w-16 h-16 rounded-2xl bg-kid-peach flex flex-shrink-0 items-center justify-center text-white text-4xl shadow-inner group-hover:scale-110 transition-transform">
                    🧮
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-kid-dark tracking-tight">
                      Arithmetic Math Playroom
                    </h3>
                    <p className="text-kid-sub text-xs font-semibold mt-1 leading-relaxed">
                      Math sandbox! Count cute toy teddy bears, yummy apples, and balloons to solve small additions and subtractions.
                    </p>
                  </div>
                </motion.button>

                {/* Play Card 6: Spelling Flashcards */}
                <motion.button
                  id="lobby_card_spelling"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => changeRoom('spelling')}
                  className="bg-white p-6 rounded-[32px] border-b-8 border-kid-red-dark flex items-center gap-5 text-left group shadow-sm hover:shadow-md cursor-pointer"
                >
                  <div className="w-16 h-16 rounded-2xl bg-kid-red flex flex-shrink-0 items-center justify-center text-white text-4xl shadow-inner group-hover:scale-110 transition-transform">
                    ✏️
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-kid-dark tracking-tight">
                      Spelling Flashcards
                    </h3>
                    <p className="text-kid-sub text-xs font-semibold mt-1 leading-relaxed">
                      Let's spell together! Click on matching balloon letters in sequence to spell cute animal, fruit, and sky words.
                    </p>
                  </div>
                </motion.button>

              </div>
            </motion.div>
          )}

          {/* Individual Interactive Rooms */}
          {activeTab === 'tracing' && (
            <motion.div
              key="tracing"
              initial={{ opacity: 0, x: 200 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -200 }}
              transition={{ type: 'spring', damping: 20 }}
              className="w-full"
            >
              <TracingBoard />
            </motion.div>
          )}

          {activeTab === 'patterns' && (
            <motion.div
              key="patterns"
              initial={{ opacity: 0, x: 200 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -200 }}
              transition={{ type: 'spring', damping: 20 }}
              className="w-full"
            >
              <PatternMatch />
            </motion.div>
          )}

          {activeTab === 'counting' && (
            <motion.div
              key="counting"
              initial={{ opacity: 0, x: 200 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -200 }}
              transition={{ type: 'spring', damping: 20 }}
              className="w-full"
            >
              <BalloonPop />
            </motion.div>
          )}

          {activeTab === 'phonics' && (
            <motion.div
              key="phonics"
              initial={{ opacity: 0, x: 200 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -200 }}
              transition={{ type: 'spring', damping: 20 }}
              className="w-full"
            >
              <PhonicsBoard />
            </motion.div>
          )}

          {activeTab === 'math' && (
            <motion.div
              key="math"
              initial={{ opacity: 0, x: 200 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -200 }}
              transition={{ type: 'spring', damping: 20 }}
              className="w-full"
            >
              <ArithmeticMath />
            </motion.div>
          )}

          {activeTab === 'spelling' && (
            <motion.div
              key="spelling"
              initial={{ opacity: 0, x: 200 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -200 }}
              transition={{ type: 'spring', damping: 20 }}
              className="w-full"
            >
              <SpellingFlashcards />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Playroom bottom bar */}
      <footer id="kinder_app_footer" className="w-full max-w-5xl mx-auto mt-8 p-4 bg-white/70 rounded-2xl border-t-4 border-amber-50/50 flex flex-col sm:flex-row justify-between items-center text-center gap-2">
        <div className="text-[11px] font-bold text-stone-400 uppercase tracking-widest flex items-center gap-1 justify-center">
          <Smile className="text-amber-500 animate-pulse" size={13} /> Pure kid safety area • Offline audio • Zero ads
        </div>
        <p className="text-[11px] font-black text-amber-500 uppercase tracking-widest">
          Created for Kindergarten practice 🌟
        </p>
      </footer>

    </div>
  );
}
