import React from 'react';
import { motion } from 'motion/react';
import { BookOpen, Gamepad2 } from 'lucide-react';

interface StudyQuizMenuProps {
  onModeSelect?: (mode: 'study' | 'quiz') => void;
  currentMode?: 'study' | 'quiz';
}

export default function StudyQuizMenu({ onModeSelect, currentMode = 'study' }: StudyQuizMenuProps) {
  const handleSelect = (mode: 'study' | 'quiz') => {
    onModeSelect?.(mode);
  };

  return (
    <div className="flex items-center gap-2">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => handleSelect('study')}
        className={`flex items-center gap-2 px-4 py-3 rounded-full font-bold text-sm transition-all ${
          currentMode === 'study'
            ? 'bg-kid-blue text-white shadow-lg border-3 border-kid-blue'
            : 'bg-white text-kid-blue border-3 border-kid-blue hover:bg-blue-50'
        }`}
      >
        <BookOpen size={18} /> 
        <span>Study</span>
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => handleSelect('quiz')}
        className={`flex items-center gap-2 px-4 py-3 rounded-full font-bold text-sm transition-all ${
          currentMode === 'quiz'
            ? 'bg-kid-yellow text-kid-dark shadow-lg border-3 border-kid-yellow'
            : 'bg-white text-kid-yellow border-3 border-kid-yellow hover:bg-yellow-50'
        }`}
      >
        <Gamepad2 size={18} /> 
        <span>Quiz</span>
      </motion.button>
    </div>
  );
}
