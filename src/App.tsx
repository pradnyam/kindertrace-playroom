import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import TracingBoard from './components/TracingBoard';
import PatternMatch from './components/PatternMatch';
import BalloonPop from './components/BalloonPop';
import ArithmeticMath from './components/ArithmeticMath';
import SpellingFlashcards from './components/SpellingFlashcards';
import ActivityWrapper from './components/ActivityWrapper';
import ColorShapeSorter from './components/ColorShapeSorter';
import AnimalDiscovery from './components/AnimalDiscovery';
import OrderingComparison from './components/OrderingComparison';
import LogicSequences from './components/LogicSequences';
import ShapeGeometry from './components/ShapeGeometry';
import MoneyAussie from './components/MoneyAussie';
import ClockTelling from './components/ClockTelling';
import MissingNumbers from './components/MissingNumbers';
import NumberComparison from './components/NumberComparison';
import { playPop, playChime, speak } from './utils/audio';
import { Sparkles, Gamepad2, Award, Heart, Shield, Undo2, Star, BookOpen, Smile, Palette, Wand2, Boxes, Dog, ListOrdered, TrainFront, Shapes, Coins, Clock } from 'lucide-react';

type Tab = 'lobby' | 'tracing' | 'patterns' | 'counting' | 'math' | 'spelling' | 'sorting' | 'discovery' | 'ordering' | 'logic' | 'geometry' | 'money' | 'clock' | 'missing_numbers' | 'number_comparison';

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
      case 'math':
        speak("Welcome to Creative Math Sandbox! Let's count warm toys and solve math equations!");
        break;
      case 'spelling':
        speak("Spelling flashcards! Let's spell bubble words together!");
        break;
      case 'sorting':
        speak("Welcome to the Sorting Room! Match colors and shapes!");
        break;
      case 'discovery':
        speak("Animal Kingdom! Can you find all the animal friends?");
        break;
      case 'ordering':
        speak("Let's put things in order! From smallest to biggest!");
        break;
      case 'logic':
        speak("Logic Train! Help the train solve the cargo patterns!");
        break;
      case 'geometry':
        speak("Shape Explorer! Let's learn about shapes and geometry!");
        break;
      case 'money':
        speak("Money Sandbox! Let's learn about Australian coins!");
        break;
      case 'clock':
        speak("Telling Time! Let's learn how to read a clock!");
        break;
      case 'missing_numbers':
        speak("Welcome to the Missing Numbers game! Let's find the missing stepping stones!");
        break;
      case 'number_comparison':
        speak("Welcome to Greater or Lesser! Let's compare numbers!");
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

              {/* Lobby Games Grid */}
              <div id="lobby_games_grid" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-6xl px-2">
                
                {/* Play Card 1: Letter Tracing */}
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => changeRoom('tracing')}
                  className="bg-white p-6 rounded-[32px] border-b-8 border-kid-peach-dark flex items-center gap-5 text-left group shadow-sm hover:shadow-md cursor-pointer"
                >
                  <div className="w-16 h-16 rounded-2xl bg-kid-peach flex flex-shrink-0 items-center justify-center text-white text-4xl shadow-inner group-hover:scale-110 transition-transform">
                    Aa
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-kid-dark tracking-tight">
                      Trace Letters
                    </h3>
                    <p className="text-kid-sub text-[10px] font-semibold mt-1 leading-tight">
                      Practice drawing letters and numbers with stars!
                    </p>
                  </div>
                </motion.button>

                {/* Play Card 2: Pattern Match */}
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => changeRoom('patterns')}
                  className="bg-white p-6 rounded-[32px] border-b-8 border-kid-purple/70 flex items-center gap-5 text-left group shadow-sm hover:shadow-md cursor-pointer"
                >
                  <div className="w-16 h-16 rounded-2xl bg-kid-purple flex flex-shrink-0 items-center justify-center text-white text-4xl shadow-inner group-hover:scale-110 transition-transform">
                    🧩
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-kid-dark tracking-tight">
                      Pattern Matching
                    </h3>
                    <p className="text-kid-sub text-[10px] font-semibold mt-1 leading-tight">
                      Complete visual sequences of toys and animals!
                    </p>
                  </div>
                </motion.button>

                {/* Play Card 3: Balloon Pop Counting */}
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => changeRoom('counting')}
                  className="bg-white p-6 rounded-[32px] border-b-8 border-kid-blue/70 flex items-center gap-5 text-left group shadow-sm hover:shadow-md cursor-pointer"
                >
                  <div className="w-16 h-16 rounded-2xl bg-kid-blue flex flex-shrink-0 items-center justify-center text-white text-4xl shadow-inner group-hover:scale-110 transition-transform">
                    🎈
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-kid-dark tracking-tight">
                      Pop & Count
                    </h3>
                    <p className="text-kid-sub text-[10px] font-semibold mt-1 leading-tight">
                      Count floating items and match numbers!
                    </p>
                  </div>
                </motion.button>

                {/* Play Card 4: Geometry */}
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => changeRoom('geometry')}
                  className="bg-white p-6 rounded-[32px] border-b-8 border-kid-green-mint/70 flex items-center gap-5 text-left group shadow-sm hover:shadow-md cursor-pointer"
                >
                  <div className="w-16 h-16 rounded-2xl bg-kid-green-mint flex flex-shrink-0 items-center justify-center text-white text-4xl shadow-inner group-hover:scale-110 transition-transform">
                    <Shapes size={32} strokeWidth={3} />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-kid-dark tracking-tight">
                      Shape Explorer
                    </h3>
                    <p className="text-kid-sub text-[10px] font-semibold mt-1 leading-tight">
                      Learn about 2D and 3D shapes and geometry!
                    </p>
                  </div>
                </motion.button>

                {/* Play Card 5: Money */}
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => changeRoom('money')}
                  className="bg-white p-6 rounded-[32px] border-b-8 border-yellow-500/70 flex items-center gap-5 text-left group shadow-sm hover:shadow-md cursor-pointer"
                >
                  <div className="w-16 h-16 rounded-2xl bg-yellow-400 flex flex-shrink-0 items-center justify-center text-white text-4xl shadow-inner group-hover:scale-110 transition-transform">
                    <Coins size={32} strokeWidth={3} />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-kid-dark tracking-tight">
                      Money Sandbox
                    </h3>
                    <p className="text-kid-sub text-[10px] font-semibold mt-1 leading-tight">
                      Learn and count Australian coins!
                    </p>
                  </div>
                </motion.button>

                {/* Play Card 6: Clock */}
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => changeRoom('clock')}
                  className="bg-white p-6 rounded-[32px] border-b-8 border-sky-500/70 flex items-center gap-5 text-left group shadow-sm hover:shadow-md cursor-pointer"
                >
                  <div className="w-16 h-16 rounded-2xl bg-sky-400 flex flex-shrink-0 items-center justify-center text-white text-4xl shadow-inner group-hover:scale-110 transition-transform">
                    <Clock size={32} strokeWidth={3} />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-kid-dark tracking-tight">
                      Telling Time
                    </h3>
                    <p className="text-kid-sub text-[10px] font-semibold mt-1 leading-tight">
                      Match analog and digital clocks!
                    </p>
                  </div>
                </motion.button>

                {/* Play Card 7: Basic Arithmetic */}
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => changeRoom('math')}
                  className="bg-white p-6 rounded-[32px] border-b-8 border-kid-peach-dark flex items-center gap-5 text-left group shadow-sm hover:shadow-md cursor-pointer"
                >
                  <div className="w-16 h-16 rounded-2xl bg-kid-peach flex flex-shrink-0 items-center justify-center text-white text-4xl shadow-inner group-hover:scale-110 transition-transform">
                    🧮
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-kid-dark tracking-tight">
                      Arithmetic Math
                    </h3>
                    <p className="text-kid-sub text-[10px] font-semibold mt-1 leading-tight">
                      Solve small additions and subtractions!
                    </p>
                  </div>
                </motion.button>

                {/* Play Card 8: Spelling */}
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => changeRoom('spelling')}
                  className="bg-white p-6 rounded-[32px] border-b-8 border-kid-red-dark flex items-center gap-5 text-left group shadow-sm hover:shadow-md cursor-pointer"
                >
                  <div className="w-16 h-16 rounded-2xl bg-kid-red flex flex-shrink-0 items-center justify-center text-white text-4xl shadow-inner group-hover:scale-110 transition-transform">
                    ✏️
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-kid-dark tracking-tight">
                      Spelling Cards
                    </h3>
                    <p className="text-kid-sub text-[10px] font-semibold mt-1 leading-tight">
                      Spell animal, fruit, and sky words!
                    </p>
                  </div>
                </motion.button>

                {/* Play Card 9: Sorting */}
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => changeRoom('sorting')}
                  className="bg-white p-6 rounded-[32px] border-b-8 border-kid-yellow-dark flex items-center gap-5 text-left group shadow-sm hover:shadow-md cursor-pointer"
                >
                  <div className="w-16 h-16 rounded-2xl bg-kid-yellow flex flex-shrink-0 items-center justify-center text-white text-4xl shadow-inner group-hover:scale-110 transition-transform">
                    <Boxes size={32} strokeWidth={3} />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-kid-dark tracking-tight">
                      Color & Shape
                    </h3>
                    <p className="text-kid-sub text-[10px] font-semibold mt-1 leading-tight">
                      Match objects into correct buckets!
                    </p>
                  </div>
                </motion.button>

                {/* Play Card 10: Missing Numbers */}
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => changeRoom('missing_numbers')}
                  className="bg-white p-6 rounded-[32px] border-b-8 border-kid-purple/70 flex items-center gap-5 text-left group shadow-sm hover:shadow-md cursor-pointer"
                >
                  <div className="w-16 h-16 rounded-2xl bg-kid-purple flex flex-shrink-0 items-center justify-center text-white text-4xl shadow-inner group-hover:scale-110 transition-transform">
                    ❓
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-kid-dark tracking-tight">
                      Missing Numbers
                    </h3>
                    <p className="text-kid-sub text-[10px] font-semibold mt-1 leading-tight">
                      Find the missing number in the line!
                    </p>
                  </div>
                </motion.button>

                {/* Play Card 11: Compare Numbers */}
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => changeRoom('number_comparison')}
                  className="bg-white p-6 rounded-[32px] border-b-8 border-kid-blue/70 flex items-center gap-5 text-left group shadow-sm hover:shadow-md cursor-pointer"
                >
                  <div className="w-16 h-16 rounded-2xl bg-kid-blue flex flex-shrink-0 items-center justify-center text-white text-4xl shadow-inner group-hover:scale-110 transition-transform">
                    🐊
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-kid-dark tracking-tight">
                      Compare Numbers
                    </h3>
                    <p className="text-kid-sub text-[10px] font-semibold mt-1 leading-tight">
                      Choose which number is greater or lesser!
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

          {activeTab === 'math' && (
            <motion.div
              key="math"
              initial={{ opacity: 0, x: 200 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -200 }}
              transition={{ type: 'spring', damping: 20 }}
              className="w-full"
            >
              <ActivityWrapper title="Arithmetic Math Playroom" description="Solve math equations with toy counters!">
                {(props) => <ArithmeticMath {...props} />}
              </ActivityWrapper>
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

          {activeTab === 'sorting' && (
            <motion.div
              key="sorting"
              initial={{ opacity: 0, x: 200 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -200 }}
              transition={{ type: 'spring', damping: 20 }}
              className="w-full"
            >
              <ActivityWrapper title="Color & Shape Sorter" description="Adaptive sorting sandbox!">
                {(props) => <ColorShapeSorter {...props} />}
              </ActivityWrapper>
            </motion.div>
          )}

          {activeTab === 'discovery' && (
            <motion.div
              key="discovery"
              initial={{ opacity: 0, x: 200 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -200 }}
              transition={{ type: 'spring', damping: 20 }}
              className="w-full"
            >
              <ActivityWrapper title="Animal Kingdom Discovery" description="Identify animal friends!">
                {(props) => <AnimalDiscovery {...props} />}
              </ActivityWrapper>
            </motion.div>
          )}

          {activeTab === 'ordering' && (
            <motion.div
              key="ordering"
              initial={{ opacity: 0, x: 200 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -200 }}
              transition={{ type: 'spring', damping: 20 }}
              className="w-full"
            >
              <ActivityWrapper title="Ordering & Comparison" description="Smallest to biggest!">
                {(props) => <OrderingComparison {...props} />}
              </ActivityWrapper>
            </motion.div>
          )}

          {activeTab === 'logic' && (
            <motion.div
              key="logic"
              initial={{ opacity: 0, x: 200 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -200 }}
              transition={{ type: 'spring', damping: 20 }}
              className="w-full"
            >
              <ActivityWrapper title="Logic Sequence Train" description="Complete cargo patterns!">
                {(props) => <LogicSequences {...props} />}
              </ActivityWrapper>
            </motion.div>
          )}

          {activeTab === 'geometry' && (
            <motion.div
              key="geometry"
              initial={{ opacity: 0, x: 200 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -200 }}
              transition={{ type: 'spring', damping: 20 }}
              className="w-full"
            >
              <ActivityWrapper title="Shape Explorer" description="Learn about shapes and geometry!">
                {(props) => <ShapeGeometry {...props} />}
              </ActivityWrapper>
            </motion.div>
          )}

          {activeTab === 'money' && (
            <motion.div
              key="money"
              initial={{ opacity: 0, x: 200 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -200 }}
              transition={{ type: 'spring', damping: 20 }}
              className="w-full"
            >
              <ActivityWrapper title="Money Sandbox" description="Learn about Australian coins!">
                {(props) => <MoneyAussie {...props} />}
              </ActivityWrapper>
            </motion.div>
          )}

          {activeTab === 'clock' && (
            <motion.div
              key="clock"
              initial={{ opacity: 0, x: 200 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -200 }}
              transition={{ type: 'spring', damping: 20 }}
              className="w-full"
            >
              <ActivityWrapper title="Telling Time" description="Match analog and digital clocks!">
                {(props) => <ClockTelling {...props} />}
              </ActivityWrapper>
            </motion.div>
          )}

          {activeTab === 'missing_numbers' && (
            <motion.div
              key="missing_numbers"
              initial={{ opacity: 0, x: 200 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -200 }}
              transition={{ type: 'spring', damping: 20 }}
              className="w-full"
            >
              <ActivityWrapper title="Missing Numbers" description="Find the missing stepping stone!">
                {(props) => <MissingNumbers {...props} />}
              </ActivityWrapper>
            </motion.div>
          )}

          {activeTab === 'number_comparison' && (
            <motion.div
              key="number_comparison"
              initial={{ opacity: 0, x: 200 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -200 }}
              transition={{ type: 'spring', damping: 20 }}
              className="w-full"
            >
              <ActivityWrapper title="Compare Numbers" description="Greater, lesser, or equal!">
                {(props) => <NumberComparison {...props} />}
              </ActivityWrapper>
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
