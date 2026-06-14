import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { playPop, playChime, playBuzz, speak } from '../utils/audio';
import { RefreshCw, Star, Award } from 'lucide-react';

interface PopItem {
  id: number;
  x: number; // percentage left (15-85)
  y: number; // percentage top (20-75)
  color: string;
  emoji: string;
  isPopped: boolean;
  scale: number;
  rotation: number;
}

const BalloonColors = [
  'from-red-400 to-red-500',
  'from-blue-400 to-blue-500',
  'from-yellow-400 to-yellow-500',
  'from-green-400 to-green-500',
  'from-pink-400 to-pink-500',
  'from-purple-400 to-purple-500',
  'from-orange-400 to-orange-500'
];

const ToyEmojis = ['🎈', '🧸', '🐣', '🦖', '🚗', '🦁', '🌟'];

export default function BalloonPop() {
  const [targetCount, setTargetCount] = useState(5);
  const [items, setItems] = useState<PopItem[]>([]);
  const [poppedCount, setPoppedCount] = useState(0);
  const [choices, setChoices] = useState<number[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [gameState, setGameState] = useState<'popping' | 'answering' | 'completed'>('popping');
  const [selectedToy, setSelectedToy] = useState('🎈');

  useEffect(() => {
    startNewGame();
  }, []);

  const startNewGame = () => {
    playPop();
    const count = 3 + Math.floor(Math.random() * 6); // between 3 and 8
    setTargetCount(count);
    
    const randomToy = ToyEmojis[Math.floor(Math.random() * ToyEmojis.length)];
    setSelectedToy(randomToy);

    // Generate random positions without massive overlap
    const generated: PopItem[] = [];
    for (let i = 0; i < count; i++) {
      generated.push({
        id: i,
        x: 15 + Math.random() * 70, // 15% to 85%
        y: 20 + Math.random() * 55, // 20% to 75%
        color: BalloonColors[Math.floor(Math.random() * BalloonColors.length)],
        emoji: randomToy,
        isPopped: false,
        scale: 0.9 + Math.random() * 0.3,
        rotation: -20 + Math.random() * 40
      });
    }

    setItems(generated);
    setPoppedCount(0);
    setSelectedAnswer(null);
    setGameState('popping');

    // Generate numeric choices
    const wrong1 = count + (Math.random() > 0.5 ? 1 : -1);
    const wrong2 = count + (Math.random() > 0.5 ? 2 : -2);
    // filter boundaries
    const safeWrong1 = wrong1 === count ? count + 3 : wrong1 <= 0 ? count + 1 : wrong1;
    const safeWrong2 = wrong2 === count || wrong2 === safeWrong1 ? count + 2 : wrong2 <= 0 ? count + 3 : wrong2;

    const cards = [count, safeWrong1, safeWrong2].sort((a, b) => a - b);
    setChoices(cards);

    speak(`Count and pop! Tap the floating toys and pop them. Ready, set, go!`);
  };

  const handlePop = (id: number) => {
    const matched = items.find(it => it.id === id);
    if (!matched || matched.isPopped) return;

    playPop();
    const newCount = poppedCount + 1;
    setPoppedCount(newCount);

    setItems(prev => prev.map(item => item.id === id ? { ...item, isPopped: true } : item));
    
    // Speak numeric progression
    speak(`${newCount}!`);

    // Check if popping phase is complete
    if (newCount === targetCount) {
      setTimeout(() => {
        setGameState('answering');
        speak(`Hooray! All popped. How many toys did you pop? Let's choose the number!`);
      }, 750);
    }
  };

  const handleAnswerSelect = (num: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(num);

    if (num === targetCount) {
      playChime();
      speak(`Correct! Awesome counting. There were ${targetCount} items!`);
      setGameState('completed');
    } else {
      playBuzz();
      speak(`Let's count slowly again! Try another number.`);
      setTimeout(() => {
        setSelectedAnswer(null);
      }, 1500);
    }
  };

  return (
    <div id="balloon_pop_main" className="flex flex-col items-center w-full max-w-3xl mx-auto p-4 sm:p-6 bg-white border-4 border-kid-blue/70 rounded-[32px] shadow-sm overflow-hidden">
      
      {/* HUD Header */}
      <div id="pop_header" className="w-full flex justify-between items-center mb-4">
        <div className="bg-kid-blue/10 px-4 py-1.5 rounded-full border-2 border-kid-blue/40 flex items-center gap-1.5 text-kid-blue-text">
          <Award size={18} />
          <span className="text-xs font-black uppercase tracking-wider">Pop Room Adventure</span>
        </div>

        <button
          id="btn_restart_balloon"
          onClick={startNewGame}
          className="p-2.5 bg-white rounded-full border-3 border-kid-blue/40 hover:bg-slate-50 transition-all text-kid-blue-text shadow-xs cursor-pointer"
        >
          <RefreshCw size={16} />
        </button>
      </div>

      <h2 className="text-3xl font-black text-kid-dark text-center tracking-tight leading-none mb-2">
        Pop and Count! 🎈
      </h2>
      <p className="text-kid-sub text-sm font-bold text-center mb-6 max-w-sm">
        Fun bubble pop training! Count along with Toby the Tiger as you pop the items!
      </p>

      {/* Main Play Arena stage */}
      <div id="bubble_arena" className="w-full h-80 bg-kid-cream/75 rounded-[24px] border-4 border-[#CAFFBF] shadow-inner relative overflow-hidden mb-6">
        
        {/* Floating Clouds Background decor */}
        <div className="absolute top-4 left-6 opacity-30 select-none text-2xl font-bold text-kid-blue">☁️</div>
        <div className="absolute top-12 right-12 opacity-30 select-none text-3xl font-bold text-kid-blue">☁️</div>
        <div className="absolute bottom-6 left-16 opacity-20 select-none text-3xl font-bold text-kid-blue">☁️</div>

        <AnimatePresence>
          {gameState === 'popping' && items.map((it) => {
            if (it.isPopped) return null;
            return (
              <motion.button
                id={`balloon_btn_${it.id}`}
                key={it.id}
                initial={{ scale: 0, y: 300 }}
                animate={{ 
                  scale: it.scale,
                  y: 0,
                  rotate: [it.rotation, -it.rotation, it.rotation]
                }}
                exit={{ 
                  scale: 1.6, 
                  opacity: 0,
                  filter: "blur(4px)"
                }}
                transition={{
                  scale: { type: "spring", stiffness: 120 },
                  y: { type: "spring", damping: 14, stiffness: 45 },
                  rotate: { repeat: Infinity, duration: 4 + Math.random() * 3, ease: "easeInOut" }
                }}
                onClick={() => handlePop(it.id)}
                className={`absolute w-18 h-18 cursor-pointer rounded-full flex items-center justify-center text-4xl shadow-md border-3 border-white bg-gradient-to-br ${it.color} hover:brightness-110 active:scale-90`}
                style={{
                  left: `${it.x}%`,
                  top: `${it.y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                {it.emoji}
              </motion.button>
            );
          })}
        </AnimatePresence>

        {/* Phase transition overlays */}
        {gameState === 'answering' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 bg-white/95 flex flex-col items-center justify-center p-6 text-center"
          >
            <span className="text-6xl mb-3 select-none">📊</span>
            <h3 className="text-2xl font-black text-kid-dark tracking-tight">Pop Count Check!</h3>
            <p className="text-kid-sub font-bold mb-5">How many {selectedToy} toys did you pop? Select the card!</p>

            {/* Answer Cards */}
            <div className="flex gap-4">
              {choices.map((num) => {
                const isSelected = num === selectedAnswer;
                return (
                  <button
                    id={`btn_choice_${num}`}
                    key={num}
                    onClick={() => handleAnswerSelect(num)}
                    className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border-3 font-black text-3xl flex items-center justify-center shadow-sm transition-all active:scale-95 cursor-pointer ${
                      isSelected
                        ? 'bg-kid-red text-white border-kid-red-dark scale-105 shadow-[0_4px_0_#EE8E8E]'
                        : 'bg-white text-kid-dark border-kid-blue/40 hover:bg-slate-50'
                    }`}
                  >
                    {num}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Winning Level Completed Overlay */}
        {gameState === 'completed' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-kid-green-dark/95 flex flex-col items-center justify-center p-6 text-center text-white"
          >
            <motion.div
              animate={{ rotate: 360, scale: [1, 1.3, 1] }}
              transition={{ repeat: Infinity, duration: 3 }}
              className="text-7xl mb-3 select-none"
            >
              👑
            </motion.div>
            <h3 className="text-3xl font-black tracking-tight leading-none mb-2">Great Job!</h3>
            <p className="text-kid-green-light font-bold max-w-xs mb-6 text-sm">
              You counted exactly <span className="text-kid-yellow font-black text-xl">{targetCount}</span> items correctly and unlocked a golden crown!
            </p>

            <button
              id="pop_next_adventure_btn"
              onClick={startNewGame}
              className="px-8 py-3 bg-kid-yellow text-kid-dark font-black rounded-full shadow-[0_4px_0_#D9B346] transition-transform hover:scale-102 text-sm cursor-pointer"
            >
              Play Again 🎈
            </button>
          </motion.div>
        )}
      </div>

      {/* Progress counter info footer */}
      <div className="w-full flex justify-between items-center bg-white p-4 rounded-2xl border-3 border-kid-blue/30 text-xs text-kid-sub font-black uppercase tracking-tight">
        <span>Popped Bubble: {poppedCount} / {targetCount}</span>
        <button
          id="btn_reset_pop"
          onClick={startNewGame}
          className="hover:text-kid-red transition-all flex items-center gap-1.5 justify-center cursor-pointer"
        >
          <RefreshCw size={14} /> Regenerate Level
        </button>
      </div>

    </div>
  );
}
