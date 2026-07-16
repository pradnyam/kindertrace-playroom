import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Clock, Sunrise, School, Soup, Laptop, Moon } from 'lucide-react';

export default function ClockStudy() {
  const [hours, setHours] = useState(12);
  const [minutes, setMinutes] = useState(0);

  // SVGs Rotation
  const hourRotation = (hours % 12) * 30 + (minutes / 60) * 30;
  const minuteRotation = minutes * 6;

  const handleHourChange = (amount: number) => {
    setHours((prev) => {
      let next = prev + amount;
      if (next > 12) return 1;
      if (next < 1) return 12;
      return next;
    });
  };

  const handleMinuteChange = (amount: number) => {
    setMinutes((prev) => {
      let next = prev + amount;
      if (next >= 60) {
        next = 0;
        handleHourChange(1); // Increment hour on minute overflow
      } else if (next < 0) {
        next = 55;
        handleHourChange(-1); // Decrement hour
      }
      return next;
    });
  };

  const setPresetTime = (h: number, m: number) => {
    setHours(h);
    setMinutes(m);
  };

  const formatTime = (h: number, m: number) => {
    return `${h}:${m.toString().padStart(2, '0')}`;
  };

  const getTimeExplanation = () => {
    if (minutes === 0) {
      return `This is ${hours} o'clock! The minute hand points straight up to 12 (00 minutes).`;
    }
    if (minutes === 30) {
      return `This is half past ${hours}! The minute hand has gone halfway around the clock to 6 (30 minutes).`;
    }
    if (minutes === 15) {
      return `This is quarter past ${hours}! The minute hand has gone a quarter of the way around to 3 (15 minutes).`;
    }
    if (minutes === 45) {
      const nextHour = hours === 12 ? 1 : hours + 1;
      return `This is quarter to ${nextHour}! The minute hand points to 9 (45 minutes). It is almost ${nextHour} o'clock!`;
    }
    
    return `The time is ${hours}:${minutes.toString().padStart(2, '0')}. The hour hand is pointing past ${hours}, and the minute hand has moved ${minutes} ticks around the clock face.`;
  };

  const presets = [
    { name: 'Morning Wake Up', icon: Sunrise, h: 7, m: 0, time: '7:00 AM', desc: 'Time to rise and shine!' },
    { name: 'School Starts', icon: School, h: 9, m: 0, time: '9:00 AM', desc: 'Let\'s learn together!' },
    { name: 'Lunch Time', icon: Soup, h: 12, m: 0, time: '12:00 PM', desc: 'Yummy food time!' },
    { name: 'Play Time', icon: Clock, h: 3, m: 30, time: '3:30 PM', desc: 'Fun games in the sandbox!' },
    { name: 'Bed Time', icon: Moon, h: 8, m: 0, time: '8:00 PM', desc: 'Sweet dreams explorer!' },
  ];

  return (
    <div className="flex flex-col items-center justify-center p-4 max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <h3 className="text-3xl font-black text-kid-dark flex items-center justify-center gap-2">
          ⏰ Interactive Clock Playground
        </h3>
        <p className="text-sm font-bold text-kid-sub mt-2">
          Explore how the hands move! Click the buttons or presets below to see the time change.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center w-full bg-white p-8 rounded-[40px] border-4 border-kid-peach shadow-lg mb-8">
        
        {/* Analog Clock Face with Minutes outside */}
        <div className="flex flex-col items-center justify-center">
          <div className="relative w-64 h-64 sm:w-72 sm:h-72">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              {/* Outer Ring */}
              <circle cx="50" cy="50" r="48" fill="white" stroke="#E9C08B" strokeWidth="4" />
              
              {/* Soft Minute outer track border */}
              <circle cx="50" cy="50" r="40" fill="none" stroke="#FCECDA" strokeWidth="0.5" strokeDasharray="1 1" />

              {/* Tick Marks */}
              {[...Array(60)].map((_, i) => (
                <line
                  key={i}
                  x1="50" y1="10" x2="50" y2={i % 5 === 0 ? 13 : 11}
                  stroke={i % 5 === 0 ? "#8C8C70" : "#D1D5DB"}
                  strokeWidth={i % 5 === 0 ? "1" : "0.5"}
                  transform={`rotate(${i * 6} 50 50)`}
                />
              ))}

              {/* Numbers (Hours & Minutes outside) */}
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((n) => {
                const angle = (n * 30 - 90) * (Math.PI / 180);
                // Hours coordinates (inner circle)
                const hx = 50 + 29 * Math.cos(angle);
                const hy = 50 + 29 * Math.sin(angle);
                
                // Minutes coordinates (outer ring)
                const mx = 50 + 44 * Math.cos(angle);
                const my = 50 + 44 * Math.sin(angle);
                const minuteVal = (n * 5) % 60;
                const minuteText = minuteVal.toString().padStart(2, '0');
                
                return (
                  <g key={n}>
                    {/* Hour (1-12) */}
                    <text
                      x={hx}
                      y={hy}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="text-[8px] font-black fill-kid-dark select-none"
                    >
                      {n}
                    </text>
                    {/* Minute (05-00) */}
                    <text
                      x={mx}
                      y={my}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="text-[4px] font-black fill-kid-blue-text select-none"
                    >
                      {minuteText}
                    </text>
                  </g>
                );
              })}

              {/* Minute Hand */}
              <motion.g
                animate={{ rotate: minuteRotation }}
                transition={{ type: 'spring', stiffness: 50 }}
                style={{
                  originX: 0.5,
                  originY: 1,
                  transformBox: 'fill-box'
                }}
              >
                {/* Pointer line */}
                <line
                  x1="50" y1="50" x2="50" y2="12"
                  stroke="#8C8C70" strokeWidth="2.2" strokeLinecap="round"
                />
                <path d="M 50 12 L 48 16 L 52 16 Z" fill="#8C8C70" />
              </motion.g>

              {/* Hour Hand */}
              <motion.g
                animate={{ rotate: hourRotation }}
                transition={{ type: 'spring', stiffness: 50 }}
                style={{
                  originX: 0.5,
                  originY: 1,
                  transformBox: 'fill-box'
                }}
              >
                {/* Pointer line */}
                <line
                  x1="50" y1="50" x2="50" y2="22"
                  stroke="#FF6B6B" strokeWidth="4" strokeLinecap="round"
                />
                <path d="M 50 22 L 47 28 L 53 28 Z" fill="#FF6B6B" />
              </motion.g>

              {/* Center Pin */}
              <circle cx="50" cy="50" r="3.5" fill="#5A5A40" stroke="white" strokeWidth="1" />
            </svg>
          </div>
        </div>

        {/* Learning Description & Controls */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left h-full justify-between">
          <div className="w-full">
            <h4 className="text-xs font-black text-kid-sub uppercase tracking-wider mb-1">Current Sandbox Time</h4>
            
            {/* Live Digital Display */}
            <div className="text-5xl font-black text-kid-dark bg-stone-50 border-3 border-stone-200 py-3 px-6 rounded-3xl w-fit mb-4 font-mono shadow-inner tracking-wider">
              {formatTime(hours, minutes)}
            </div>

            {/* Explanation box */}
            <div className="bg-kid-peach bg-opacity-20 border-2 border-kid-peach p-5 rounded-3xl mb-6 text-sm font-semibold text-kid-dark min-h-[100px]">
              <Sparkles className="text-kid-peach-dark inline-block mr-2 mb-1" size={16} />
              {getTimeExplanation()}
            </div>
          </div>

          {/* Time Tuner Buttons */}
          <div className="w-full space-y-3">
            <h5 className="text-xs font-black text-kid-sub uppercase tracking-wider">Tune the Time</h5>
            <div className="flex gap-4 w-full">
              <div className="flex flex-col items-center flex-1 gap-2 bg-stone-50 border border-stone-200 p-2.5 rounded-2xl">
                <span className="text-[10px] font-black text-stone-400 uppercase">Hour Hand (Red)</span>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleHourChange(-1)}
                    className="w-10 h-10 bg-white border-2 border-stone-200 hover:border-kid-peach text-kid-dark font-black rounded-xl text-md active:scale-95 transition-all shadow-sm"
                  >
                    -
                  </button>
                  <button 
                    onClick={() => handleHourChange(1)}
                    className="w-10 h-10 bg-white border-2 border-stone-200 hover:border-kid-peach text-kid-dark font-black rounded-xl text-md active:scale-95 transition-all shadow-sm"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex flex-col items-center flex-1 gap-2 bg-stone-50 border border-stone-200 p-2.5 rounded-2xl">
                <span className="text-[10px] font-black text-stone-400 uppercase">Minute Hand (Grey)</span>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleMinuteChange(-5)}
                    className="w-10 h-10 bg-white border-2 border-stone-200 hover:border-kid-peach text-kid-dark font-black rounded-xl text-md active:scale-95 transition-all shadow-sm"
                  >
                    -
                  </button>
                  <button 
                    onClick={() => handleMinuteChange(5)}
                    className="w-10 h-10 bg-white border-2 border-stone-200 hover:border-kid-peach text-kid-dark font-black rounded-xl text-md active:scale-95 transition-all shadow-sm"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Preset Cards Slider */}
      <div className="w-full">
        <h4 className="text-md font-black text-kid-dark mb-4 px-2">🌟 Practice with Daily Routines</h4>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          {presets.map((preset, idx) => {
            const Icon = preset.icon;
            const isSelected = hours === preset.h && minutes === preset.m;
            return (
              <motion.button
                key={idx}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setPresetTime(preset.h, preset.m)}
                className={`p-4 rounded-3xl border-4 text-center flex flex-col items-center justify-center gap-2 cursor-pointer transition-all shadow-sm ${
                  isSelected
                    ? 'bg-kid-green-bg border-kid-green-mint scale-105 shadow-md'
                    : 'bg-white border-stone-100 hover:border-kid-peach'
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  isSelected ? 'bg-kid-green-mint text-kid-green-dark' : 'bg-stone-50 text-kid-sub'
                }`}>
                  <Icon size={20} />
                </div>
                <div className="flex flex-col text-center">
                  <span className="text-[11px] font-black text-kid-dark leading-tight">{preset.name}</span>
                  <span className="text-[10px] font-bold text-kid-blue-text font-mono mt-0.5">{preset.time}</span>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
