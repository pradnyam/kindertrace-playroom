import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ActivityProps } from './ActivityWrapper';
import { speak } from '../utils/audio';

interface OrderItem {
  id: string;
  size: number;
  emoji: string;
  label: string;
}

const ITEMS = [
  { emoji: '🍎', label: 'Apple' },
  { emoji: '🧸', label: 'Teddy Bear' },
  { emoji: '🦖', label: 'Dino' },
  { emoji: '🍦', label: 'Ice Cream' },
];

export default function OrderingComparison({ level, onAnswer }: ActivityProps) {
  const [items, setItems] = useState<OrderItem[]>([]);
  const [slots, setSlots] = useState<(OrderItem | null)[]>([]);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    generateNewChallenge();
  }, [level]);

  const generateNewChallenge = () => {
    setIsSuccess(false);
    const count = level <= 1 ? 2 : level <= 3 ? 3 : 4;
    const baseItem = ITEMS[Math.floor(Math.random() * ITEMS.length)];
    
    // Create items with distinct sizes
    const newItems: OrderItem[] = [];
    const sizes = [1, 1.3, 1.6, 1.9, 2.2].sort(() => 0.5 - Math.random()).slice(0, count);
    
    sizes.forEach((size, i) => {
      newItems.push({
        id: `item-${i}`,
        size,
        emoji: baseItem.emoji,
        label: baseItem.label,
      });
    });

    setItems([...newItems].sort(() => 0.5 - Math.random()));
    setSlots(new Array(count).fill(null));
    
    setTimeout(() => {
        speak(`Put the ${baseItem.label}s in order from smallest to biggest!`);
    }, 500);
  };

  const handlePlace = (item: OrderItem, slotIndex: number) => {
    if (isSuccess) return;

    // Check if this item is the smallest available that SHOULD go here
    const sortedRemaining = [...items].sort((a, b) => a.size - b.size);
    const smallestRemaining = sortedRemaining[0];

    if (item.id === smallestRemaining.id) {
      // Correct!
      const newSlots = [...slots];
      newSlots[slotIndex] = item;
      setSlots(newSlots);
      setItems(items.filter(i => i.id !== item.id));

      if (items.length === 1) {
        setIsSuccess(true);
        onAnswer(true);
        speak("Amazing! You sorted them perfectly!");
        setTimeout(() => {
          generateNewChallenge();
        }, 2000);
      } else {
        speak("That's right!");
      }
    } else {
      // Wrong
      onAnswer(false);
      speak("Oops! Try looking for the smallest one next.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-4">
      {/* The Magic Shelf */}
      <div className="w-full max-w-2xl bg-amber-50 rounded-[32px] p-8 border-b-8 border-amber-200 shadow-md mb-12 flex justify-center items-end gap-4 min-h-[200px] relative">
         <div className="absolute bottom-2 left-0 right-0 h-2 bg-amber-100 rounded-full mx-4" />
         
         {slots.map((slot, idx) => (
           <div 
            key={idx}
            className="w-24 h-24 sm:w-32 sm:h-32 border-4 border-dashed border-amber-200 rounded-2xl flex items-center justify-center relative"
           >
             <AnimatePresence>
               {slot && (
                 <motion.div
                   initial={{ scale: 0, y: -20 }}
                   animate={{ scale: 1, y: 0 }}
                   className="flex flex-col items-center"
                   style={{ fontSize: `${slot.size * 2}rem` }}
                 >
                   {slot.emoji}
                 </motion.div>
               )}
             </AnimatePresence>
             {!slot && (
               <span className="text-amber-100 font-black text-4xl">{idx + 1}</span>
             )}
           </div>
         ))}
      </div>

      {/* Available Items */}
      <div className="flex flex-wrap justify-center gap-6 p-6 bg-white/50 rounded-[40px] border-4 border-dashed border-stone-200">
        <AnimatePresence>
          {items.map((item) => (
            <motion.button
              key={item.id}
              layout
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handlePlace(item, slots.findIndex(s => s === null))}
              className="w-24 h-24 sm:w-32 sm:h-32 bg-white rounded-3xl shadow-lg border-2 border-stone-100 flex items-center justify-center cursor-pointer"
              style={{ fontSize: `${item.size * 2}rem` }}
            >
              {item.emoji}
            </motion.button>
          ))}
        </AnimatePresence>
      </div>

      <div className="mt-8">
        <p className="text-amber-500 font-black text-sm uppercase tracking-widest bg-amber-100/50 px-4 py-1 rounded-full">
           Level {level}: {level === 1 ? "Pair Comparison" : "Sequence Ordering"}
        </p>
      </div>
    </div>
  );
}
