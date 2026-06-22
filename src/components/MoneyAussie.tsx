import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ActivityProps } from './ActivityWrapper';

interface Coin {
  id: string;
  value: number;
  label: string;
  color: string;
  size: string; // Tailwind size class
  textColor: string;
}

const COINS: Coin[] = [
  { id: '5c', value: 0.05, label: '5c', color: 'bg-slate-300', size: 'w-16 h-16', textColor: 'text-slate-600' },
  { id: '10c', value: 0.10, label: '10c', color: 'bg-slate-300', size: 'w-20 h-20', textColor: 'text-slate-600' },
  { id: '20c', value: 0.20, label: '20c', color: 'bg-slate-300', size: 'w-24 h-24', textColor: 'text-slate-600' },
  { id: '50c', value: 0.50, label: '50c', color: 'bg-slate-300', size: 'w-28 h-28', textColor: 'text-slate-600' },
  { id: '1d', value: 1.00, label: '$1', color: 'bg-yellow-400', size: 'w-24 h-24', textColor: 'text-yellow-700' },
  { id: '2d', value: 2.00, label: '$2', color: 'bg-yellow-400', size: 'w-20 h-20', textColor: 'text-yellow-700' },
];

export default function MoneyAussie({ level, onAnswer }: ActivityProps) {
  const [targetValue, setTargetValue] = useState(0);
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState<Coin[]>([]);
  const [selectedCoins, setSelectedCoins] = useState<Coin[]>([]);
  const [isAnswered, setIsAnswered] = useState(false);

  useEffect(() => {
    generateChallenge();
  }, [level]);

  const generateChallenge = () => {
    setIsAnswered(false);
    setSelectedCoins([]);
    
    if (level === 1) {
      // Match the coin (Identify $1, $2, etc.)
      const target = COINS[Math.floor(Math.random() * COINS.length)];
      setTargetValue(target.value);
      setQuestion(`Can you find the ${target.label} coin?`);
      
      const otherCoins = COINS.filter(c => c.id !== target.id);
      const randomOthers = otherCoins.sort(() => 0.5 - Math.random()).slice(0, 3);
      setOptions([target, ...randomOthers].sort(() => 0.5 - Math.random()));
    } else if (level === 2) {
      // "Find the 50 cent coin" - similar but harder selection
      const target = COINS[Math.floor(Math.random() * COINS.length)];
      setTargetValue(target.value);
      setQuestion(`Where is the ${target.label}?`);
      setOptions([...COINS].sort(() => 0.5 - Math.random()));
    } else if (level === 3) {
      // Basic counting (e.g., "How much is two $1 coins?")
      const coin = COINS[Math.floor(Math.random() * 2) + 4]; // $1 or $2
      const count = Math.floor(Math.random() * 2) + 2;
      setTargetValue(coin.value * count);
      setQuestion(`How much is ${count} ${coin.label} coins?`);
      
      const correct = coin.value * count;
      const fakeOptions = [correct, correct + 1, correct - 1, correct + 2].filter(v => v > 0);
      setOptions(fakeOptions.map(v => ({ id: v.toString(), value: v, label: `$${v}`, color: 'bg-white', size: 'w-20 h-20', textColor: 'text-kid-dark' })));
    } else {
      // Simple combinations / Making a total
      const total = (Math.floor(Math.random() * 5) + 1);
      setTargetValue(total);
      setQuestion(`Tap the coins to make $${total}!`);
      setOptions(COINS.filter(c => c.value >= 0.5));
    }
  };

  const handleSelect = (coin: Coin) => {
    if (isAnswered) return;

    if (level <= 3) {
      if (coin.value === targetValue) {
        setIsAnswered(true);
        onAnswer(true);
        setTimeout(generateChallenge, 1500);
      } else {
        onAnswer(false);
      }
    } else {
      const newSelected = [...selectedCoins, coin];
      const currentTotal = newSelected.reduce((sum, c) => sum + c.value, 0);
      setSelectedCoins(newSelected);

      if (currentTotal === targetValue) {
        setIsAnswered(true);
        onAnswer(true);
        setTimeout(generateChallenge, 1500);
      } else if (currentTotal > targetValue) {
        onAnswer(false);
        setSelectedCoins([]);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-4 text-center">
      <motion.div
        key={question}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h3 className="text-3xl font-black text-kid-dark mb-2">{question}</h3>
        {level > 3 && (
            <div className="text-xl font-bold text-kid-sub">
                Total: ${selectedCoins.reduce((sum, c) => sum + c.value, 0).toFixed(2)}
            </div>
        )}
      </motion.div>

      <div className="flex flex-wrap justify-center gap-6 w-full max-w-2xl">
        {options.map((coin, index) => (
          <motion.button
            key={`${coin.id}-${index}`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleSelect(coin)}
            className={`${coin.size} ${coin.color} rounded-full border-4 border-black/10 shadow-lg flex items-center justify-center transition-all relative overflow-hidden`}
          >
            <div className="absolute inset-0 bg-white/10" />
            <span className={`text-xl font-black ${coin.textColor} drop-shadow-sm`}>
              {coin.label}
            </span>
          </motion.button>
        ))}
      </div>

      {level > 3 && selectedCoins.length > 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-8 flex gap-2"
          >
              <button 
                onClick={() => setSelectedCoins([])}
                className="px-4 py-2 bg-slate-200 rounded-full text-xs font-black text-slate-500 uppercase tracking-widest hover:bg-slate-300 transition-colors"
              >
                  Reset Coins
              </button>
          </motion.div>
      )}
    </div>
  );
}
