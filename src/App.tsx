import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import TracingBoard from './components/TracingBoard';
import PatternMatch from './components/PatternMatch';
import BalloonPop from './components/BalloonPop';
import ArithmeticMath from './components/ArithmeticMath';
import SpellingFlashcards from './components/SpellingFlashcards';
import FlashcardStudy from './components/FlashcardStudy';
import FlashcardQuiz from './components/FlashcardQuiz';
import ActivityWrapper, { GameMode } from './components/ActivityWrapper';
import AnimalDiscovery from './components/AnimalDiscovery';
import OrderingComparison from './components/OrderingComparison';
import LogicSequences from './components/LogicSequences';
import ShapeGeometry from './components/ShapeGeometry';
import MoneyAussie from './components/MoneyAussie';
import ClockStudy from './components/ClockStudy';
import ClockQuiz from './components/ClockQuiz';
import MissingNumbers from './components/MissingNumbers';
import NumberComparison from './components/NumberComparison';
import MathTimeTablesStudy from './components/MathTimeTablesStudy';
import MathTimeTablesGame from './components/MathTimeTablesGame';
import StudyQuizMenu from './components/StudyQuizMenu';
import { playPop, playChime, speak } from './utils/audio';
import { Sparkles, Gamepad2, Award, Heart, Shield, Undo2, Star, BookOpen, Smile, Palette, Wand2, Boxes, Dog, ListOrdered, TrainFront, Shapes, Coins, Clock } from 'lucide-react';

type Tab = 'lobby' | 'tracing' | 'patterns' | 'counting' | 'math' | 'spelling' | 'discovery' | 'ordering' | 'logic' | 'geometry' | 'money' | 'clock' | 'missing_numbers' | 'number_comparison' | 'timestables_study' | 'timestables_game';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('lobby');
  const [trophyCount, setTrophyCount] = useState(0);
  const [gameMode, setGameMode] = useState<GameMode>('study');

  useEffect(() => {
    // Say a warm greeting on load
    setTimeout(() => {
      speak("Welcome to Kindy Playroom! Let's choose a game to play!");
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
        speak("Flashcard study! Let's learn to spell words together!");
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
        speak("Shape and Color Playroom! Let's learn shapes and sort them!");
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
      case 'timestables_study':
        speak("Welcome to Times Tables Study Room! Pick a table and count toys!");
        break;
      case 'timestables_game':
        speak("Welcome to Times Tables Balloon Pop Quiz! Let's solve multiplication questions!");
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
                Kindy Playroom
              </h1>
              <span className="text-xs sm:text-sm font-bold text-kid-sub">
                Let's play and learn together, little explorer! 🐯
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

          <StudyQuizMenu onModeSelect={setGameMode} currentMode={gameMode} />
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
                  Welcome to Kindy Playroom!
                </h2>
                <p className="text-kid-sub font-bold text-sm">
                  Let's choose an awesome game below to trace shapes, count elements, and play! All voices and sounds are kid-friendly!
                </p>
              </div>

              {/* Lobby Games Grid */}
              <div id="lobby_games_grid" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-6xl px-2">
                
                {/* Play Card 1: Letter Tracing */}
                {gameMode === 'study' && (
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
                )}

                {/* Play Card 2: Pattern Match */}
                {gameMode === 'study' && (
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
                )}

                {/* Play Card 3: Balloon Pop Counting */}
                {gameMode === 'study' && (
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
                )}

                {/* Play Card 4: Geometry */}
                {gameMode === 'study' && (
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
                      Shape & Color
                    </h3>
                    <p className="text-kid-sub text-[10px] font-semibold mt-1 leading-tight">
                      Explore shapes, count sides, and sort by colors & shapes!
                    </p>
                  </div>
                </motion.button>
                )}

                {/* Play Card 5: Money */}
                {gameMode === 'study' && (
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
                      Australian Currency
                    </h3>
                    <p className="text-kid-sub text-[10px] font-semibold mt-1 leading-tight">
                      Learn and count Australian coins!
                    </p>
                  </div>
                </motion.button>
                )}

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
                      Clock
                    </h3>
                    <p className="text-kid-sub text-[10px] font-semibold mt-1 leading-tight">
                      Match analog and digital clocks!
                    </p>
                  </div>
                </motion.button>

                {/* Play Card 7: Basic Arithmetic (Quiz Mode Only) */}
                {gameMode === 'quiz' && (
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
                )}

                {/* Play Card 8: Flashcard Study (Study Mode Only) */}
                {gameMode === 'study' && (
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => changeRoom('spelling')}
                  className="bg-white p-6 rounded-[32px] border-b-8 border-kid-blue flex items-center gap-5 text-left group shadow-sm hover:shadow-md cursor-pointer"
                >
                  <div className="w-16 h-16 rounded-2xl bg-kid-blue flex flex-shrink-0 items-center justify-center text-white text-4xl shadow-inner group-hover:scale-110 transition-transform">
                    📚
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-kid-dark tracking-tight">
                      Flashcard
                    </h3>
                    <p className="text-kid-sub text-[10px] font-semibold mt-1 leading-tight">
                      Learn spelling of animals, objects, nature, and body parts!
                    </p>
                  </div>
                </motion.button>
                )}

                {/* Play Card 9: Flashcard Quiz (Quiz Mode Only) */}
                {gameMode === 'quiz' && (
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
                      Flashcard
                    </h3>
                    <p className="text-kid-sub text-[10px] font-semibold mt-1 leading-tight">
                      Spell animal, object, nature, and body part words correctly!
                    </p>
                  </div>
                </motion.button>
                )}



                {/* Play Card 10: Missing Numbers */}
                {gameMode === 'quiz' && (
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
                )}

                {/* Play Card 11: Compare Numbers */}
                {gameMode === 'quiz' && (
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
                )}

                {/* Play Card 12: Times Tables Study (Study Mode Only) */}
                {gameMode === 'study' && (
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => changeRoom('timestables_study')}
                  className="bg-white p-6 rounded-[32px] border-b-8 border-kid-blue/70 flex items-center gap-5 text-left group shadow-sm hover:shadow-md cursor-pointer"
                >
                  <div className="w-16 h-16 rounded-2xl bg-kid-blue flex flex-shrink-0 items-center justify-center text-white text-4xl shadow-inner group-hover:scale-110 transition-transform">
                    🧮
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-kid-dark tracking-tight">
                      Times Tables
                    </h3>
                    <p className="text-kid-sub text-[10px] font-semibold mt-1 leading-tight">
                      Explore multiplication charts and visual group arrays!
                    </p>
                  </div>
                </motion.button>
                )}

                {/* Play Card 13: Times Tables Game (Quiz Mode Only) */}
                {gameMode === 'quiz' && (
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => changeRoom('timestables_game')}
                  className="bg-white p-6 rounded-[32px] border-b-8 border-rose-400/70 flex items-center gap-5 text-left group shadow-sm hover:shadow-md cursor-pointer"
                >
                  <div className="w-16 h-16 rounded-2xl bg-rose-300 flex flex-shrink-0 items-center justify-center text-white text-4xl shadow-inner group-hover:scale-110 transition-transform">
                    🎮
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-kid-dark tracking-tight">
                      Times Tables
                    </h3>
                    <p className="text-kid-sub text-[10px] font-semibold mt-1 leading-tight">
                      Pop balloons to test your multiplication skills and win trophies!
                    </p>
                  </div>
                </motion.button>
                )}

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

          {activeTab === 'math' && gameMode === 'quiz' && (
            <motion.div
              key="math"
              initial={{ opacity: 0, x: 200 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -200 }}
              transition={{ type: 'spring', damping: 20 }}
              className="w-full"
            >
              <ActivityWrapper 
                title="Arithmetic Math Playroom" 
                description="Solve math equations with toy counters!"
                mode={gameMode}
              >
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
              {gameMode === 'study' ? (
                <FlashcardStudy />
              ) : (
                <ActivityWrapper 
                  title="Flashcard Quiz Mode" 
                  description="Spell words correctly!"
                  mode={gameMode}
                >
                  {(props) => <FlashcardQuiz {...props} />}
                </ActivityWrapper>
              )}
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
              <ActivityWrapper 
                title="Animal Kingdom Discovery" 
                description="Identify animal friends!"
                mode={gameMode}
                studyContent={
                  <div className="space-y-3">
                    <h4 className="font-black text-lg text-kid-dark">🐾 Discovering Animals</h4>
                    <ul className="space-y-2 text-sm">
                      <li><strong>1. Animal Names:</strong> Each level shows you different animals. Listen to their names!</li>
                      <li><strong>2. Sound Clues:</strong> Many animals have special sounds - can you guess by their "moo", "woof", or "meow"?</li>
                      <li><strong>3. Visual Clues:</strong> Look at colors, patterns, and shapes to identify the animal.</li>
                      <li><strong>4. Fun Facts:</strong> Learn where animals live and what they eat!</li>
                      <li><strong>5. Try Again:</strong> If you get it wrong, listen carefully to the hint and try the next one!</li>
                    </ul>
                  </div>
                }
              >
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
              <ActivityWrapper 
                title="Ordering & Comparison" 
                description="Smallest to biggest!"
                mode={gameMode}
                studyContent={
                  <div className="space-y-3">
                    <h4 className="font-black text-lg text-kid-dark">📏 Learning to Order</h4>
                    <ul className="space-y-2 text-sm">
                      <li><strong>1. Size Matters:</strong> We can order things by size - small, medium, big!</li>
                      <li><strong>2. Smallest First:</strong> Put the tiniest item at the beginning.</li>
                      <li><strong>3. Biggest Last:</strong> Put the largest item at the end.</li>
                      <li><strong>4. In Between:</strong> Items in the middle should fit between smallest and biggest.</li>
                      <li><strong>5. Real Examples:</strong> Think about ordering cups, blocks, or dolls from smallest to biggest!</li>
                    </ul>
                  </div>
                }
              >
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
              <ActivityWrapper 
                title="Logic Sequence Train" 
                description="Complete cargo patterns!"
                mode={gameMode}
                studyContent={
                  <div className="space-y-3">
                    <h4 className="font-black text-lg text-kid-dark">🚂 Understanding Patterns</h4>
                    <ul className="space-y-2 text-sm">
                      <li><strong>1. What's a Pattern?</strong> A pattern is a sequence that repeats! Like red-blue-red-blue...</li>
                      <li><strong>2. Spot the Repeat:</strong> Look at what you see and figure out what comes next.</li>
                      <li><strong>3. Train Cargo:</strong> The cargo (boxes) follow a pattern. Can you guess the next one?</li>
                      <li><strong>4. Colors & Shapes:</strong> Patterns can be made with colors, shapes, numbers, or objects.</li>
                      <li><strong>5. Practice:</strong> Once you see the pattern, predicting the next item is easy-peasy!</li>
                    </ul>
                  </div>
                }
              >
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
              <ActivityWrapper 
                title="Shape & Color Playroom" 
                description="Explore shapes, count sides, and sort them by color or shape!"
                mode={gameMode}
                studyContent={
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-black text-lg text-kid-dark">🔷 Learning Shapes</h4>
                      <ul className="space-y-1.5 text-sm list-disc pl-5">
                        <li><strong>Basic Shapes:</strong> Circle, square, triangle, rectangle, pentagon, hexagon, octagon, star.</li>
                        <li><strong>Count the Sides:</strong> Triangles have 3 sides, squares have 4, circles have 0!</li>
                        <li><strong>3D Shapes:</strong> Sphere (ball), cube (box), cone, and cylinder!</li>
                      </ul>
                    </div>
                    <div className="border-t border-kid-peach pt-3">
                      <h4 className="font-black text-lg text-kid-dark">🎨 Learning to Sort</h4>
                      <ul className="space-y-1.5 text-sm list-disc pl-5">
                        <li><strong>What is Sorting?</strong> Sorting means putting similar things together into groups.</li>
                        <li><strong>Color Groups:</strong> Put red items in the red bucket, blue in the blue bucket!</li>
                        <li><strong>Shape Groups:</strong> Put circles in the circle bucket, squares in the square bucket!</li>
                      </ul>
                    </div>
                  </div>
                }
              >
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
              <ActivityWrapper 
                title="Australian Currency"
                description="Learn about Australian coins!"
                mode={gameMode}
                studyContent={
                  <div className="space-y-3">
                    <h4 className="font-black text-lg text-kid-dark">💰 Learning About Money</h4>
                    <ul className="space-y-2 text-sm">
                      <li><strong>1. Australian Coins:</strong> We have coins worth 5¢, 10¢, 20¢, 50¢, $1, and $2!</li>
                      <li><strong>2. Coin Values:</strong> Each coin has a different value. Bigger doesn't always mean more worth!</li>
                      <li><strong>3. Counting Money:</strong> Add up coins to find the total amount.</li>
                      <li><strong>4. Real Shopping:</strong> Understanding money helps you buy toys and treats!</li>
                      <li><strong>5. Save & Spend:</strong> You can save coins to buy something bigger later!</li>
                    </ul>
                  </div>
                }
              >
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
              {gameMode === 'study' ? (
                <ClockStudy />
              ) : (
                <ActivityWrapper 
                  title="Telling Time" 
                  description="Match analog and digital clocks!"
                  mode={gameMode}
                >
                  {(props) => <ClockQuiz {...props} />}
                </ActivityWrapper>
              )}
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
              <ActivityWrapper 
                title="Missing Numbers" 
                description="Find the missing stepping stone!"
                mode={gameMode}
                studyContent={
                  <div className="space-y-3">
                    <h4 className="font-black text-lg text-kid-dark">🔢 Finding Missing Numbers</h4>
                    <ul className="space-y-2 text-sm">
                      <li><strong>1. Number Sequence:</strong> Numbers go in order: 1, 2, 3, 4, 5... and so on!</li>
                      <li><strong>2. Spot the Gap:</strong> When a number is missing, look at what comes before and after.</li>
                      <li><strong>3. Fill the Gap:</strong> Think about what number should go in the empty space.</li>
                      <li><strong>4. Stepping Stones:</strong> Imagine crossing a river - you need every stepping stone!</li>
                      <li><strong>5. Harder Levels:</strong> As you level up, you'll find missing numbers in bigger sequences!</li>
                    </ul>
                  </div>
                }
              >
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
              <ActivityWrapper 
                title="Compare Numbers" 
                description="Greater, lesser, or equal!"
                mode={gameMode}
                studyContent={
                  <div className="space-y-3">
                    <h4 className="font-black text-lg text-kid-dark">⚖️ Comparing Numbers</h4>
                    <ul className="space-y-2 text-sm">
                      <li><strong>1. Greater Than:</strong> If 5 is bigger than 3, then 5 is "greater than" 3!</li>
                      <li><strong>2. Less Than:</strong> If 2 is smaller than 4, then 2 is "less than" 4!</li>
                      <li><strong>3. Equal To:</strong> If you have 3 apples and 3 oranges, they're equal!</li>
                      <li><strong>4. Symbols:</strong> We use &gt; for greater, &lt; for less, and = for equal.</li>
                      <li><strong>5. Tips:</strong> The "mouth" always points to the bigger number! 5 &gt; 2 (mouth faces the 5).</li>
                    </ul>
                  </div>
                }
              >
                {(props) => <NumberComparison {...props} />}
              </ActivityWrapper>
            </motion.div>
          )}

          {activeTab === 'timestables_study' && (
            <motion.div
              key="timestables_study"
              initial={{ opacity: 0, x: 200 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -200 }}
              transition={{ type: 'spring', damping: 20 }}
              className="w-full"
            >
              <MathTimeTablesStudy />
            </motion.div>
          )}

          {activeTab === 'timestables_game' && (
            <motion.div
              key="timestables_game"
              initial={{ opacity: 0, x: 200 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -200 }}
              transition={{ type: 'spring', damping: 20 }}
              className="w-full"
            >
              <ActivityWrapper 
                title="Times Tables Quiz Mode" 
                description="Pop correct balloons to win trophies and stars!"
                mode={gameMode}
              >
                {(props) => <MathTimeTablesGame {...props} />}
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
