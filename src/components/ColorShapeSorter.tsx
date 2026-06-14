import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ActivityProps } from './ActivityWrapper';

interface SortItem {
  id: string;
  type: 'color' | 'shape';
  value: string; // color name or shape name
  emoji: string;
}

interface Bucket {
  id: string;
  type: 'color' | 'shape';
  value: string;
  label: string;
  color: string; // Tailwind bg color
}

const COLORS = [
  { value: 'red', label: 'Red', color: 'bg-red-500', emoji: '🍎' },
  { value: 'blue', label: 'Blue', color: 'bg-blue-500', emoji: '🐬' },
  { value: 'yellow', label: 'Yellow', color: 'bg-yellow-400', emoji: '🐥' },
  { value: 'green', label: 'Green', color: 'bg-green-500', emoji: '🐸' },
];

const SHAPES = [
  { value: 'circle', label: 'Circle', emoji: '⭕' },
  { value: 'square', label: 'Square', emoji: '⬜' },
  { value: 'triangle', label: 'Triangle', emoji: '🔺' },
  { value: 'star', label: 'Star', emoji: '⭐' },
];

export default function ColorShapeSorter({ level, onAnswer }: ActivityProps) {
  const [currentItem, setCurrentItem] = useState<SortItem | null>(null);
  const [buckets, setBuckets] = useState<Bucket[]>([]);
  const [isSuccess, setIsSuccess] = useState(false);

  // Generate game state based on level
  useEffect(() => {
    generateNewChallenge();
  }, [level]);

  const generateNewChallenge = () => {
    setIsSuccess(false);
    let activeBuckets: Bucket[] = [];
    let item: SortItem;

    if (level <= 2) {
      // Color sorting (Level 1-2)
      const count = level === 1 ? 2 : 3;
      const selectedColors = [...COLORS].sort(() => 0.5 - Math.random()).slice(0, count);
      activeBuckets = selectedColors.map(c => ({
        id: c.value,
        type: 'color',
        value: c.value,
        label: c.label,
        color: c.color,
      }));
      const target = selectedColors[Math.floor(Math.random() * selectedColors.length)];
      item = { id: Math.random().toString(), type: 'color', value: target.value, emoji: target.emoji };
    } else if (level <= 4) {
      // Shape sorting (Level 3-4)
      const count = level === 3 ? 2 : 3;
      const selectedShapes = [...SHAPES].sort(() => 0.5 - Math.random()).slice(0, count);
      activeBuckets = selectedShapes.map(s => ({
        id: s.value,
        type: 'shape',
        value: s.value,
        label: s.label,
        color: 'bg-slate-200', // Neutral color for shape sorting
      }));
      const target = selectedShapes[Math.floor(Math.random() * selectedShapes.length)];
      item = { id: Math.random().toString(), type: 'shape', value: target.value, emoji: target.emoji };
    } else {
      // Mixed sorting (Level 5)
      const useColor = Math.random() > 0.5;
      if (useColor) {
        activeBuckets = COLORS.map(c => ({ id: c.value, type: 'color', value: c.value, label: c.label, color: c.color }));
        const target = COLORS[Math.floor(Math.random() * COLORS.length)];
        item = { id: Math.random().toString(), type: 'color', value: target.value, emoji: target.emoji };
      } else {
        activeBuckets = SHAPES.map(s => ({ id: s.value, type: 'shape', value: s.value, label: s.label, color: 'bg-slate-200' }));
        const target = SHAPES[Math.floor(Math.random() * SHAPES.length)];
        item = { id: Math.random().toString(), type: 'shape', value: target.value, emoji: target.emoji };
      }
    }

    setBuckets(activeBuckets);
    setCurrentItem(item);
  };

  const handleDrop = (bucketValue: string) => {
    if (!currentItem || isSuccess) return;

    if (currentItem.value === bucketValue) {
      setIsSuccess(true);
      onAnswer(true);
      setTimeout(() => {
        generateNewChallenge();
      }, 1000);
    } else {
      onAnswer(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-between h-full p-4">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-black text-kid-dark">
          {level <= 2 ? "Match the Color!" : level <= 4 ? "Match the Shape!" : "Where does it go?"}
        </h3>
      </div>

      {/* Item to Sort */}
      <div className="flex-grow flex items-center justify-center mb-12">
        <AnimatePresence mode="wait">
          {currentItem && !isSuccess && (
            <motion.div
              key={currentItem.id}
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, opacity: 0 }}
              drag
              dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
              dragElastic={0.9}
              onDragEnd={(_, info) => {
                  // Check if dropped near any bucket
                  // This is a simplified "click" interaction for now as drag-to-target is complex without a library like dnd-kit
                  // But we can simulate it with click on item then click on bucket, 
                  // or just check the final position.
              }}
              className="w-32 h-32 bg-white rounded-[40px] border-4 border-kid-peach shadow-xl flex items-center justify-center text-6xl cursor-grab active:cursor-grabbing z-10"
            >
              {currentItem.emoji}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Buckets */}
      <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-4 px-4">
        {buckets.map((bucket) => (
          <motion.button
            key={bucket.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleDrop(bucket.value)}
            className={`h-32 rounded-[32px] border-4 border-white shadow-lg flex flex-col items-center justify-center gap-2 transition-colors relative overflow-hidden ${bucket.color}`}
          >
             <div className="absolute inset-0 bg-black/10 opacity-0 hover:opacity-100 transition-opacity" />
             <span className="text-4xl">
                {bucket.type === 'color' ? '🗑️' : SHAPES.find(s => s.value === bucket.value)?.emoji}
             </span>
             <span className="text-sm font-black text-white uppercase tracking-widest drop-shadow-md">
                {bucket.label}
             </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
