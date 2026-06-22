import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ActivityProps } from './ActivityWrapper';

interface TimeOption {
  hours: number;
  minutes: number;
}

export default function ClockTelling({ level, onAnswer }: ActivityProps) {
  const [targetTime, setTargetTime] = useState<TimeOption>({ hours: 12, minutes: 0 });
  const [options, setOptions] = useState<TimeOption[]>([]);
  const [isAnswered, setIsAnswered] = useState(false);

  useEffect(() => {
    generateChallenge();
  }, [level]);

  const generateChallenge = () => {
    setIsAnswered(false);
    let h = Math.floor(Math.random() * 12) + 1;
    let m = 0;

    if (level === 1) {
      m = 0; // O'clock
    } else if (level === 2) {
      m = Math.random() > 0.5 ? 0 : 30; // O'clock or Half past
    } else if (level === 3) {
      m = [0, 15, 30, 45][Math.floor(Math.random() * 4)]; // Quarters
    } else {
      m = Math.floor(Math.random() * 12) * 5; // 5 minute intervals
    }

    const correct: TimeOption = { hours: h, minutes: m };
    setTargetTime(correct);

    const fakeOptions: TimeOption[] = [correct];
    while (fakeOptions.length < 4) {
      const fh = Math.floor(Math.random() * 12) + 1;
      const fm = level === 1 ? 0 : level === 2 ? (Math.random() > 0.5 ? 0 : 30) : Math.floor(Math.random() * 12) * 5;
      if (!fakeOptions.find(o => o.hours === fh && o.minutes === fm)) {
        fakeOptions.push({ hours: fh, minutes: fm });
      }
    }
    setOptions(fakeOptions.sort(() => 0.5 - Math.random()));
  };

  const handleSelect = (option: TimeOption) => {
    if (isAnswered) return;

    if (option.hours === targetTime.hours && option.minutes === targetTime.minutes) {
      setIsAnswered(true);
      onAnswer(true);
      setTimeout(generateChallenge, 1500);
    } else {
      onAnswer(false);
    }
  };

  const formatTime = (time: TimeOption) => {
    return `${time.hours}:${time.minutes.toString().padStart(2, '0')}`;
  };

  // SVG Clock Hand rotations
  // Level 1: snap hour hand to exact hour to avoid angle confusion for beginners
  const hourRotation = (level === 1)
    ? (targetTime.hours % 12) * 30
    : (targetTime.hours % 12) * 30 + (targetTime.minutes / 60) * 30;
  const minuteRotation = targetTime.minutes * 6;

  return (
    <div className="flex flex-col items-center justify-center h-full p-4 text-center">
      <h3 className="text-3xl font-black text-kid-dark mb-8">What time is it?</h3>

      {/* Analog Clock Face */}
      <div className="relative w-64 h-64 mb-12">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {/* Outer Ring */}
          <circle cx="50" cy="50" r="48" fill="white" stroke="#E9C08B" strokeWidth="4" />
          
          {/* Tick Marks */}
          {[...Array(60)].map((_, i) => (
            <line
              key={i}
              x1="50" y1="5" x2="50" y2={i % 5 === 0 ? 10 : 7}
              stroke={i % 5 === 0 ? "#374151" : "#9CA3AF"}
              strokeWidth={i % 5 === 0 ? "1.5" : "0.5"}
              transform={`rotate(${i * 6} 50 50)`}
            />
          ))}

          {/* Numbers */}
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((n) => {
            const angle = (n * 30 - 90) * (Math.PI / 180);
            const x = 50 + 36 * Math.cos(angle);
            const y = 50 + 36 * Math.sin(angle);
            return (
              <text
                key={n}
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-[7px] font-black fill-kid-dark select-none"
              >
                {n}
              </text>
            );
          })}

          {/* Minute Hand */}
          <motion.g
            animate={{ rotate: minuteRotation }}
            transition={{ type: 'spring', stiffness: 50 }}
            style={{
              originX: 0.5,       // Equates to 50%
              originY: 1,         // Equates to 100%
              transformBox: 'fill-box'
            }}
          >
            <line
              x1="50" y1="50" x2="50" y2="12"
              stroke="#4B5563" strokeWidth="2.5" strokeLinecap="round"
            />
            <path d="M 50 12 L 48 16 L 52 16 Z" fill="#4B5563" />
          </motion.g>

          {/* Hour Hand */}
          <motion.g
            animate={{ rotate: hourRotation }}
            transition={{ type: 'spring' }}
            style={{
              originX: 0.5,       // Equates to 50%
              originY: 1,         // Equates to 100%
              transformBox: 'fill-box'
            }}
          >
            <line
              x1="50" y1="50" x2="50" y2="25"
              stroke="#DC2626" strokeWidth="5" strokeLinecap="round"
            />
            <path d="M 50 25 L 46 32 L 54 32 Z" fill="#DC2626" />
          </motion.g>

          {/* Center Pin */}
          <circle cx="50" cy="50" r="3.5" fill="#1F2937" stroke="white" strokeWidth="1" />
        </svg>
      </div>

      {/* Digital Time Options */}
      <div className="grid grid-cols-2 gap-4 w-full max-w-md">
        {options.map((option, index) => (
          <motion.button
            key={index}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSelect(option)}
            className={`h-24 bg-white rounded-[32px] border-4 border-kid-peach shadow-lg flex items-center justify-center text-3xl font-black text-kid-dark transition-all ${
              isAnswered && option.hours === targetTime.hours && option.minutes === targetTime.minutes
                ? 'bg-kid-green-bg border-kid-green-mint scale-105'
                : 'hover:border-kid-peach-dark'
            }`}
          >
            {formatTime(option)}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
