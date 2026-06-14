import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TRACING_ITEMS, TracingItem } from '../data/tracingPaths';
import { playPop, playChime, speak } from '../utils/audio';
import { Volume2, Sparkles, Heart, Award, Star } from 'lucide-react';

export default function PhonicsBoard() {
  const letters = TRACING_ITEMS.filter(it => it.type === 'letter');
  const [selectedCard, setSelectedCard] = useState<TracingItem | null>(null);

  const handleCardClick = (item: TracingItem) => {
    playPop();
    setSelectedCard(item);
    
    // Friendly, playful phonetic pronunciation for letter cards
    const letterSound = item.label.toLowerCase();
    const pronunciation = `${item.label}... ${letterSound}, ${letterSound}, ${item.word || ''}!`;
    speak(pronunciation);
  };

  const closeOverlay = () => {
    playPop();
    setSelectedCard(null);
  };

  return (
    <div id="phonics_soundboard_main" className="flex flex-col items-center w-full max-w-5xl mx-auto p-4 sm:p-6 bg-white border-4 border-kid-red-dark rounded-[32px] shadow-sm overflow-hidden">
      
      {/* Visual Header */}
      <div id="phonics_header" className="w-full flex justify-between items-center mb-6">
        <div className="bg-kid-red/10 border-2 border-kid-red-dark/30 px-4 py-1.5 rounded-full text-kid-red-dark flex items-center gap-1.5 font-black text-xs uppercase tracking-wider">
          <Sparkles className="animate-spin text-kid-red-dark" size={14} /> Flashcard Learning Room
        </div>
        <div className="text-kid-sub font-black text-xs uppercase flex items-center gap-1">
          <Heart fill="currentColor" className="text-kid-red animate-pulse" size={14} /> Tap and Hear Phonics!
        </div>
      </div>

      <h2 className="text-3xl font-black text-kid-dark tracking-tight leading-none mb-2 text-center uppercase">
        Magic Letter Sounds! 🅰️
      </h2>
      <p className="text-kid-sub text-sm font-bold text-center mb-6 max-w-md">
        Click any magic bubble to speak the letter, make its special animal sound, and see the card!
      </p>

      {/* Grid of Alphabet cards */}
      <div id="alphabet_cards_grid" className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 sm:gap-4 w-full">
        {letters.map((item, index) => (
          <motion.button
            id={`phonics_card_${item.id}`}
            key={item.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03, type: 'spring', stiffness: 120 }}
            onClick={() => handleCardClick(item)}
            className={`aspect-square p-2.5 rounded-[24px] border-3 cursor-pointer bg-white border-kid-red/25 hover:border-kid-red shadow-[0_4px_0_#FFE6E6] flex flex-col items-center justify-between text-center transition-all group`}
          >
            {/* Balloon layout details */}
            <span className="text-lg font-black text-kid-red-dark uppercase tracking-tight group-hover:scale-110 transition-transform">
              {item.label}
            </span>
            <span className="text-4xl filter drop-shadow-sm select-none my-1 block">
              {item.emoji}
            </span>
            <span className="text-[11px] font-black text-kid-sub uppercase tracking-tight truncate w-full">
              {item.word}
            </span>
          </motion.button>
        ))}
      </div>

      {/* Immersive overlay flashcard card display */}
      <AnimatePresence>
        {selectedCard && (
          <motion.div
            id="phonics_overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-stone-900/40 backdrop-blur-md z-50 flex items-center justify-center p-4"
            onClick={closeOverlay}
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              transition={{ type: 'spring', damping: 15 }}
              onClick={(e) => e.stopPropagation()} // keep click internal
              className="bg-white rounded-[32px] p-6 sm:p-8 border-4 border-kid-red-dark max-w-sm w-full shadow-2xl flex flex-col items-center text-center relative overflow-hidden"
            >
              {/* Confetti background stars decorative design */}
              <div className="absolute top-4 left-4 text-rose-100 text-3xl select-none animate-bounce">🎈</div>
              <div className="absolute bottom-4 right-4 text-amber-100 text-3xl select-none animate-bounce">⭐</div>

              <div className="w-16 h-16 rounded-full bg-kid-red/10 border-2 border-kid-red-dark flex items-center justify-center text-kid-red-dark font-black text-3xl shadow-sm mb-4">
                {selectedCard.label}
              </div>

              {/* Massive Emoji */}
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 0.9, 1.1, 1],
                  rotate: [0, -5, 5, -5, 0]
                }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                className="text-8xl my-6 select-none filter drop-shadow-md"
              >
                {selectedCard.emoji}
              </motion.div>

              <h3 className="text-3xl font-black text-kid-red-dark uppercase tracking-tight">
                {selectedCard.word}
              </h3>

              <p className="text-kid-sub font-bold text-sm mt-2 max-w-xs leading-relaxed">
                Let's repeat after Toby: <br />
                <span className="font-black text-kid-dark">"{selectedCard.label} is for {selectedCard.word}!"</span>
              </p>

              {/* Action buttons */}
              <div className="flex gap-3 mt-6 w-full">
                <button
                  id="btn_replay_voice"
                  onClick={() => { playPop(); handleCardClick(selectedCard); }}
                  className="flex-1 py-3 bg-white hover:bg-slate-50 text-kid-dark font-black rounded-full text-xs flex items-center justify-center gap-2 transition-all border-3 border-kid-red-dark/30 cursor-pointer"
                >
                  <Volume2 size={16} className="text-kid-red-dark" /> Hear Voice
                </button>
                <button
                  id="btn_close_word"
                  onClick={closeOverlay}
                  className="flex-1 py-3 bg-kid-red hover:bg-kid-red-dark text-white font-black rounded-full text-xs transition-all shadow-[0_4px_0_#EE8E8E] cursor-pointer"
                >
                  Done! 🟢
                </button>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* sound board details footer */}
      <div className="w-full mt-8 pt-4 border-t-3 border-kid-red-dark/10 flex justify-between text-xs text-kid-sub font-black uppercase tracking-tight">
        <span>Click for Phonics Speech feedback</span>
        <span>A to Z learning board</span>
      </div>

    </div>
  );
}
