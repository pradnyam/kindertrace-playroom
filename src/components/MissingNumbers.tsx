import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ActivityProps } from './ActivityWrapper';
import { speak, playPop } from '../utils/audio';
import { HelpCircle, Star, ArrowRight, Sparkles } from 'lucide-react';

interface SequenceItem {
  value: number;
  isMissing: boolean;
}

export default function MissingNumbers({ level, onAnswer }: ActivityProps) {
  const [sequence, setSequence] = useState<SequenceItem[]>([]);
  const [options, setOptions] = useState<number[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  useEffect(() => {
    generateChallenge();
  }, [level]);

  const generateChallenge = () => {
    setSelectedAnswer(null);
    setIsCorrect(null);

    let start = 1;
    let step = 1;
    let length = 4;
    let direction: 'forward' | 'backward' = 'forward';

    if (level === 1) {
      // Level 1: Numbers up to 10, sequential forward (e.g., 2, 3, 4, 5)
      start = Math.floor(Math.random() * 6) + 1; // 1 to 6
      step = 1;
      length = 4;
    } else if (level === 2) {
      // Level 2: Numbers up to 20, sequential forward (e.g., 11, 12, 13, 14, 15)
      start = Math.floor(Math.random() * 11) + 5; // 5 to 15
      step = 1;
      length = 5;
    } else if (level === 3) {
      // Level 3: Counting backwards up to 20 (e.g., 15, 14, 13, 12)
      start = Math.floor(Math.random() * 12) + 8; // 8 to 19
      step = 1;
      length = 4;
      direction = 'backward';
    } else if (level === 4) {
      // Level 4: Skip count by 2s or 5s forward (e.g., 2, 4, 6, 8)
      const isFives = Math.random() > 0.5;
      step = isFives ? 5 : 2;
      start = isFives 
        ? (Math.random() > 0.5 ? 5 : 10) 
        : (Math.floor(Math.random() * 5) + 1) * 2; // 2, 4, 6, 8, 10
      length = 4;
    } else {
      // Level 5: Skip count mixed / backwards (e.g., 10, 20, 30, 40) or backwards 2s
      const skipType = Math.floor(Math.random() * 3);
      if (skipType === 0) {
        step = 10;
        start = Math.floor(Math.random() * 3) * 10 + 10; // 10, 20, 30
        length = 4;
      } else if (skipType === 1) {
        step = 2;
        start = Math.floor(Math.random() * 5) + 12; // 12 to 16
        length = 4;
        direction = 'backward';
      } else {
        step = 5;
        start = 25;
        length = 4;
        direction = 'backward';
      }
    }

    // Generate sequence values
    const values: number[] = [];
    for (let i = 0; i < length; i++) {
      const offset = i * step;
      const val = direction === 'forward' ? start + offset : start - offset;
      values.push(val);
    }

    // Choose missing index (avoiding first and last items if possible on lower levels, but random is fine)
    const missingIndex = Math.floor(Math.random() * length);
    const correctVal = values[missingIndex];

    const seqItems: SequenceItem[] = values.map((val, idx) => ({
      value: val,
      isMissing: idx === missingIndex
    }));

    setSequence(seqItems);

    // Generate options
    const opts = new Set<number>();
    opts.add(correctVal);

    while (opts.size < 3) {
      // Generate option values close to the correct one
      const dev = (Math.floor(Math.random() * 3) + 1) * (Math.random() > 0.5 ? 1 : -1) * step;
      const candidate = correctVal + dev;
      if (candidate > 0 && candidate !== correctVal && !values.includes(candidate)) {
        opts.add(candidate);
      } else if (candidate <= 0 || values.includes(candidate)) {
        // Safe fallback options
        opts.add(correctVal + (opts.size * step * (Math.random() > 0.5 ? 1 : -1)));
      }
    }

    setOptions(Array.from(opts).sort((a, b) => a - b));

    // Audio cue
    const spokenSeq = seqItems.map(item => item.isMissing ? "what" : item.value).join(", ");
    setTimeout(() => {
      speak(`What number is missing? Let's count: ${spokenSeq}!`);
    }, 600);
  };

  const handleSelect = (num: number) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(num);
    const missingItem = sequence.find(item => item.isMissing);
    const correct = missingItem ? missingItem.value === num : false;
    setIsCorrect(correct);
    onAnswer(correct);

    if (correct) {
      speak(`You found it! The missing number is ${num}!`);
      setTimeout(generateChallenge, 2000);
    } else {
      speak(`Oops! Let's count again!`);
      setTimeout(() => {
        setSelectedAnswer(null);
        setIsCorrect(null);
      }, 1500);
    }
  };

  // Helper to render star/dot visuals for a number
  const renderVisualDots = (num: number, colorClass: string) => {
    if (num <= 0 || num > 25) return null; // Avoid rendering too many dots to prevent UI clutter
    return (
      <div className="flex flex-wrap gap-0.5 justify-center mt-2 max-w-[50px] mx-auto opacity-75">
        {Array.from({ length: num }).map((_, i) => (
          <span key={i} className={`text-[8px] sm:text-[10px] ${colorClass} select-none`}>⭐</span>
        ))}
      </div>
    );
  };

  return (
    <div id="missing_numbers_container" className="flex flex-col items-center w-full max-w-3xl mx-auto p-4 sm:p-6 bg-white border-4 border-kid-purple rounded-[32px] shadow-sm">
      
      <h3 className="text-2xl sm:text-3xl font-black text-kid-dark mb-8 text-center flex items-center gap-2">
        <Sparkles className="text-kid-purple animate-pulse" size={24} />
        Find the Missing Number!
      </h3>

      {/* Stepping Stones / Sequence Line */}
      <div className="w-full bg-kid-cream/45 p-6 sm:p-8 rounded-[24px] border-4 border-dashed border-kid-purple/20 flex flex-wrap justify-center items-center gap-4 sm:gap-6 mb-8 shadow-inner min-h-[140px]">
        {sequence.map((item, idx) => (
          <React.Fragment key={idx}>
            <motion.div
              layout
              initial={{ scale: 0, y: 20 }}
              animate={{ 
                scale: item.isMissing && selectedAnswer !== null && isCorrect ? [1, 1.1, 1] : 1, 
                y: 0 
              }}
              className={`w-16 h-16 sm:w-20 sm:h-20 rounded-[22px] border-3 shadow-md flex flex-col items-center justify-center relative select-none ${
                item.isMissing
                  ? selectedAnswer !== null
                    ? isCorrect
                      ? 'bg-kid-green-bg border-kid-green-mint text-kid-green-dark'
                      : 'bg-red-50 border-kid-red text-kid-red'
                    : 'bg-white border-dashed border-kid-purple/60 text-kid-purple animate-pulse'
                  : 'bg-white border-kid-peach/40 text-kid-dark'
              }`}
            >
              {item.isMissing ? (
                selectedAnswer !== null ? (
                  <span className="text-2xl sm:text-3xl font-black">
                    {selectedAnswer}
                  </span>
                ) : (
                  <HelpCircle size={28} className="text-kid-purple stroke-[3]" />
                )
              ) : (
                <span className="text-2xl sm:text-3xl font-black">
                  {item.value}
                </span>
              )}

              {/* Visual stars under numbers to help counting */}

            </motion.div>

            {idx < sequence.length - 1 && (
              <ArrowRight size={18} className="text-stone-300 stroke-[3] hidden sm:block" />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Choice Area */}
      <div className="w-full bg-kid-cream/20 p-6 rounded-3xl border-3 border-kid-purple/10 flex flex-col items-center">
        <h4 className="text-xs font-black uppercase tracking-widest text-kid-sub mb-4">
          👇 Tap the correct bubble
        </h4>

        <div className="flex justify-center gap-4 sm:gap-6 flex-wrap">
          {options.map((num) => {
            const isSelected = selectedAnswer === num;
            return (
              <motion.button
                key={num}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => handleSelect(num)}
                disabled={selectedAnswer !== null}
                className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 flex flex-col items-center justify-center cursor-pointer transition-all shadow-md ${
                  isSelected
                    ? isCorrect
                      ? 'bg-kid-green-bg border-kid-green-dark text-kid-green-dark scale-105'
                      : 'bg-red-50 border-kid-red text-kid-red'
                    : 'bg-white border-kid-purple/30 hover:border-kid-purple text-kid-dark hover:bg-stone-50'
                }`}
              >
                <span className="text-2xl sm:text-3xl font-black">{num}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Description / Level footer info */}
      <div className="w-full mt-8 pt-4 border-t-3 border-kid-purple/10 flex justify-between items-center text-[10px] text-kid-sub font-black uppercase tracking-tight">
        <span>
          Level {level}: {
            level === 1 ? "Numbers up to 10" :
            level === 2 ? "Numbers up to 20" :
            level === 3 ? "Counting Backwards" :
            level === 4 ? "Skip Count by 2 & 5" :
            "Mixed Patterns"
          }
        </span>
        <button
          onClick={generateChallenge}
          className="hover:text-kid-purple transition-colors font-bold cursor-pointer"
        >
          New Pattern 🔄
        </button>
      </div>

    </div>
  );
}
