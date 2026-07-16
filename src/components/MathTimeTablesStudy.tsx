import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Volume2, Sparkles, BookOpen } from 'lucide-react';
import { playPop, speak } from '../utils/audio';

const TOYS = [
  { emoji: '🧸', name: 'teddy bears' },
  { emoji: '🍎', name: 'sweet apples' },
  { emoji: '🚗', name: 'toy cars' },
  { emoji: '🎈', name: 'balloons' },
  { emoji: '🐱', name: 'kittens' },
  { emoji: '🍓', name: 'strawberries' },
  { emoji: '🐶', name: 'puppies' },
  { emoji: '⭐', name: 'stars' },
  { emoji: '🍦', name: 'ice creams' },
  { emoji: '🚀', name: 'rockets' },
  { emoji: '🍩', name: 'donuts' },
  { emoji: '🐼', name: 'pandas' },
];

export default function MathTimeTablesStudy() {
  const [selectedFactor, setSelectedFactor] = useState<number>(2);
  const [selectedMultiplier, setSelectedMultiplier] = useState<number>(3);
  const [explorerToyIndex, setExplorerToyIndex] = useState<number>(0);

  const explorerToy = useMemo(() => TOYS[explorerToyIndex % TOYS.length], [explorerToyIndex]);

  const speakExplorerEquation = (f1: number, f2: number) => {
    speak(`${f1} times ${f2} equals ${f1 * f2}! That is ${f1} rows of ${f2} ${explorerToy.name}!`);
  };

  const changeExplorerToy = () => {
    playPop();
    setExplorerToyIndex(prev => prev + 1);
  };

  return (
    <div id="math_timestables_study_main" className="flex flex-col items-center w-full max-w-4xl mx-auto p-4 sm:p-6 bg-white border-4 border-kid-blue rounded-[32px] shadow-sm">
      
      {/* Title */}
      <div className="text-center mb-6">
        <h3 className="text-2xl sm:text-3xl font-black text-kid-dark flex items-center justify-center gap-2">
          <BookOpen className="text-kid-blue" size={28} />
          Times Tables Study Room
        </h3>
        <p className="text-xs font-bold text-kid-sub mt-1">
          Pick a table below to explore numbers and count cute toys!
        </p>
      </div>

      {/* Pick a Times Table */}
      <div className="w-full bg-kid-cream/35 p-4 rounded-2xl border-2 border-dashed border-kid-blue/20 mb-6 flex flex-col items-center">
        <span className="text-[10px] font-black uppercase text-kid-sub tracking-wider mb-2">
          🎈 Pick a Times Table
        </span>
        <div className="flex flex-wrap justify-center gap-2">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
            const factorEmojis = ['🐰', '🐶', '🐱', '🐯', '🦁', '🐨', '🐼', '🦊', '🐷', '🐴'];
            return (
              <button
                key={num}
                onClick={() => {
                  playPop();
                  setSelectedFactor(num);
                  speakExplorerEquation(num, selectedMultiplier);
                }}
                className={`py-2 px-3.5 rounded-xl font-black text-sm cursor-pointer flex items-center gap-1.5 border-2 transition-all ${
                  selectedFactor === num
                    ? 'bg-kid-blue border-kid-blue-text text-white scale-105 shadow-sm'
                    : 'bg-white border-stone-200 hover:border-kid-blue text-kid-dark'
                }`}
              >
                <span>{factorEmojis[num - 1]}</span>
                <span>{num}x</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Interactive Counting Tapping Board */}
      <div className="w-full bg-white p-6 rounded-[28px] border-4 border-kid-blue shadow-inner flex flex-col items-center mb-8">
        <div className="w-full flex justify-between items-center mb-3">
          <span className="text-[10px] font-black uppercase text-kid-sub tracking-wider bg-stone-100 py-1 px-3 rounded-full">
            👉 Tapping Board (Count Aloud)
          </span>
          <button
            onClick={changeExplorerToy}
            className="bg-stone-50 hover:bg-stone-100 border border-stone-200 py-1 px-3 rounded-full text-[9px] font-black text-kid-dark transition-all cursor-pointer"
          >
            Change Toys {explorerToy.emoji} 🔄
          </button>
        </div>

        {/* Equation Label */}
        <div className="flex items-center gap-3 text-4xl sm:text-5xl font-black text-kid-dark mb-4 bg-stone-50 py-2 px-6 rounded-full border-2 border-stone-100 relative">
          <span>{selectedFactor}</span>
          <span className="text-kid-red">×</span>
          <span>{selectedMultiplier}</span>
          <span className="text-kid-blue-text">=</span>
          <span className="text-kid-green-dark">{selectedFactor * selectedMultiplier}</span>
          
          <Volume2 
            size={20} 
            className="text-kid-blue-text hover:scale-110 active:scale-95 cursor-pointer ml-2" 
            onClick={() => speakExplorerEquation(selectedFactor, selectedMultiplier)} 
          />
        </div>

        <p className="text-xs font-black text-kid-sub text-center mb-4">
          📚 That is <span className="text-kid-blue-text">{selectedFactor} rows</span> of <span className="text-kid-purple">{selectedMultiplier} {explorerToy.emoji} ({explorerToy.name})</span>!
        </p>

        {/* Toy Visuals Grid */}
        <div className="flex flex-col gap-2.5 p-4 bg-kid-cream/20 rounded-[24px] border-3 border-dashed border-stone-200/60 max-w-full overflow-auto">
          {Array.from({ length: selectedFactor }).map((_, rIdx) => (
            <div key={`row-${rIdx}`} className="flex gap-2.5 justify-center items-center">
              <span className="text-[9px] font-bold text-stone-300 w-10 text-right">Row {rIdx + 1}:</span>
              <div className="flex gap-1.5">
                {Array.from({ length: selectedMultiplier }).map((_, cIdx) => {
                  const cellNum = (rIdx * selectedMultiplier) + cIdx + 1;
                  return (
                    <motion.div
                      key={`col-${cIdx}`}
                      whileHover={{ scale: 1.2, rotate: 6 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => {
                        playPop();
                        speak(String(cellNum));
                      }}
                      className="w-10 h-10 rounded-xl bg-white border-2 border-stone-200 hover:border-kid-blue cursor-pointer flex flex-col items-center justify-center relative shadow-xs"
                    >
                      <span className="text-xl select-none">{explorerToy.emoji}</span>
                      <span className="absolute bottom-0.5 right-1 text-[7px] font-bold text-stone-400">
                        {cellNum}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Click to count hint */}
        <div className="w-full mt-4 pt-4 border-t border-stone-100 text-center text-[10px] font-bold text-kid-sub">
          <span>💡 Click on any toy emoji to count it aloud!</span>
        </div>
      </div>

      {/* Whole Times Table Display */}
      <div className="w-full">
        <h4 className="text-center text-sm font-black text-kid-dark mb-4 flex items-center justify-center gap-1.5">
          <Sparkles size={16} className="text-kid-yellow animate-pulse" />
          The Whole {selectedFactor}x Times Table
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((mult) => {
            const result = selectedFactor * mult;
            const isSelected = selectedMultiplier === mult;
            return (
              <motion.div
                key={mult}
                whileHover={{ scale: 1.02 }}
                onClick={() => {
                  playPop();
                  setSelectedMultiplier(mult);
                  speakExplorerEquation(selectedFactor, mult);
                }}
                className={`p-6 rounded-[24px] border-3 text-center cursor-pointer flex flex-col justify-center items-center transition-all min-h-[130px] ${
                  isSelected
                    ? 'bg-kid-cream border-kid-blue shadow-md'
                    : 'bg-white border-stone-200/50 hover:border-kid-blue shadow-xs'
                }`}
              >
                <div className="flex items-center justify-center gap-2 text-2xl sm:text-3xl font-black text-kid-dark select-none w-full">
                  <span>{selectedFactor}</span>
                  <span className="text-kid-red text-xl">×</span>
                  <span>{mult}</span>
                  <span className="text-kid-blue-text text-2xl">=</span>
                  <span className="text-kid-green-dark text-3xl sm:text-4xl">{result}</span>
                </div>

                <div className="mt-3 flex items-center justify-center gap-1.5 text-[10px] font-black uppercase text-kid-sub tracking-wider">
                  <span>Tap to study</span>
                  <Volume2
                    size={13}
                    className="text-stone-400 hover:text-kid-blue-text transition-colors cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      playPop();
                      speak(`${selectedFactor} times ${mult} is ${result}`);
                    }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
