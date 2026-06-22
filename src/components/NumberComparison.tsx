import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ActivityProps } from './ActivityWrapper';
import { speak, playPop } from '../utils/audio';
import { Sparkles, HelpCircle } from 'lucide-react';

interface ComparisonChallenge {
  num1: number;
  num2: number;
  label1: string; // for math equations in level 5
  label2: string; // for math equations in level 5
  emoji: string;
  questionType: 'bigger' | 'smaller' | 'sign';
  correctSign: '<' | '>' | '=';
  correctAnswer: number | string; // value or sign
}

const EMOJIS = ['🍎', '🍪', '⭐', '🎈', '🐶', '🍓', '🥕', '🐝'];

export default function NumberComparison({ level, onAnswer }: ActivityProps) {
  const [challenge, setChallenge] = useState<ComparisonChallenge | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  useEffect(() => {
    generateChallenge();
  }, [level]);

  const generateChallenge = () => {
    setSelectedAnswer(null);
    setIsCorrect(null);

    const emoji = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
    let num1 = 1;
    let num2 = 1;
    let label1 = '';
    let label2 = '';
    let questionType: 'bigger' | 'smaller' | 'sign' = 'bigger';

    if (level === 1) {
      // Level 1: Which is bigger (1-10)
      questionType = 'bigger';
      num1 = Math.floor(Math.random() * 10) + 1;
      num2 = Math.floor(Math.random() * 10) + 1;
      while (num1 === num2) {
        num2 = Math.floor(Math.random() * 10) + 1;
      }
    } else if (level === 2) {
      // Level 2: Which is smaller (1-15)
      questionType = 'smaller';
      num1 = Math.floor(Math.random() * 15) + 1;
      num2 = Math.floor(Math.random() * 15) + 1;
      while (num1 === num2) {
        num2 = Math.floor(Math.random() * 15) + 1;
      }
    } else if (level === 3) {
      // Level 3: Alligator sign < > = (1-10)
      questionType = 'sign';
      num1 = Math.floor(Math.random() * 10) + 1;
      num2 = Math.floor(Math.random() * 10) + 1;
      // Allow equal sometimes
      if (Math.random() > 0.7) {
        num2 = num1;
      }
    } else if (level === 4) {
      // Level 4: Alligator sign < > = (1-20)
      questionType = 'sign';
      num1 = Math.floor(Math.random() * 20) + 1;
      num2 = Math.floor(Math.random() * 20) + 1;
      if (Math.random() > 0.7) {
        num2 = num1;
      }
    } else {
      // Level 5: Equation comparisons (e.g. 2+3 vs 6)
      questionType = 'sign';
      const eqType1 = Math.random() > 0.5;
      const eqType2 = Math.random() > 0.5;
      
      const val1_a = Math.floor(Math.random() * 9) + 1;
      const val1_b = Math.floor(Math.random() * 9) + 1;
      const val2_a = Math.floor(Math.random() * 9) + 1;
      const val2_b = Math.floor(Math.random() * 9) + 1;

      num1 = eqType1 ? (val1_a + val1_b) : Math.abs(val1_a - val1_b) + 1;
      label1 = eqType1 ? `${val1_a} + ${val1_b}` : `${Math.max(val1_a, val1_b) + 1} - ${Math.min(val1_a, val1_b)}`;
      
      num2 = eqType2 ? (val2_a + val2_b) : Math.abs(val2_a - val2_b) + 1;
      label2 = eqType2 ? `${val2_a} + ${val2_b}` : `${Math.max(val2_a, val2_b) + 1} - ${Math.min(val2_a, val2_b)}`;
    }

    let correctSign: '<' | '>' | '=' = '=';
    if (num1 > num2) correctSign = '>';
    else if (num1 < num2) correctSign = '<';

    let correctAnswer: number | string = '';
    if (questionType === 'bigger') {
      correctAnswer = num1 > num2 ? num1 : num2;
    } else if (questionType === 'smaller') {
      correctAnswer = num1 < num2 ? num1 : num2;
    } else {
      correctAnswer = correctSign;
    }

    const newChallenge: ComparisonChallenge = {
      num1,
      num2,
      label1: label1 || String(num1),
      label2: label2 || String(num2),
      emoji,
      questionType,
      correctSign,
      correctAnswer
    };

    setChallenge(newChallenge);

    // Audio cue
    setTimeout(() => {
      if (questionType === 'bigger') {
        speak(`Which number is bigger? ${num1} or ${num2}?`);
      } else if (questionType === 'smaller') {
        speak(`Which number is smaller? ${num1} or ${num2}?`);
      } else {
        if (level === 5) {
          speak(`Is ${label1} greater than, less than, or equal to ${label2}?`);
        } else {
          speak(`Is ${num1} greater than, less than, or equal to ${num2}?`);
        }
      }
    }, 600);
  };

  const handleChoice = (choice: string | number) => {
    if (!challenge || selectedAnswer !== null) return;

    setSelectedAnswer(choice);
    const correct = choice === challenge.correctAnswer;
    setIsCorrect(correct);
    onAnswer(correct);

    if (correct) {
      if (challenge.questionType === 'bigger') {
        speak(`Correct! ${choice} is bigger!`);
      } else if (challenge.questionType === 'smaller') {
        speak(`Correct! ${choice} is smaller!`);
      } else {
        const signWord = challenge.correctSign === '>' ? 'greater than' : challenge.correctSign === '<' ? 'less than' : 'equal to';
        speak(`That's right! ${challenge.label1} is ${signWord} ${challenge.label2}!`);
      }
      setTimeout(generateChallenge, 2200);
    } else {
      speak(`Oops! Try again!`);
      setTimeout(() => {
        setSelectedAnswer(null);
        setIsCorrect(null);
      }, 1500);
    }
  };

  if (!challenge) return null;

  const renderVisualItems = (num: number) => {
    // Limit to 15 to keep screen clean
    const count = Math.min(num, 15);
    return (
      <div className="flex flex-wrap gap-1 justify-center p-3 bg-stone-50 rounded-2xl border border-stone-200/50 max-w-[150px] min-h-[60px] items-center">
        {Array.from({ length: count }).map((_, i) => (
          <span key={i} className="text-xl select-none filter drop-shadow-xs">{challenge.emoji}</span>
        ))}
        {num > 15 && <span className="text-[10px] font-black text-kid-sub">+{num - 15} more</span>}
      </div>
    );
  };

  return (
    <div id="number_comparison_container" className="flex flex-col items-center w-full max-w-3xl mx-auto p-4 sm:p-6 bg-white border-4 border-kid-blue rounded-[32px] shadow-sm">
      
      <h3 className="text-2xl sm:text-3xl font-black text-kid-dark mb-4 text-center flex items-center gap-2">
        <Sparkles className="text-kid-blue animate-pulse" size={24} />
        {challenge.questionType === 'bigger' && "Which number is BIGGER?"}
        {challenge.questionType === 'smaller' && "Which number is SMALLER?"}
        {challenge.questionType === 'sign' && "Greater, Lesser, or Equal?"}
      </h3>

      {/* Play Area */}
      <div className="w-full bg-kid-cream/45 p-6 sm:p-8 rounded-[24px] border-4 border-dashed border-kid-blue/20 flex justify-center items-center gap-4 sm:gap-8 mb-8 shadow-inner">
        
        {/* Left Card */}
        <motion.button
          whileHover={challenge.questionType !== 'sign' ? { scale: 1.05 } : {}}
          whileTap={challenge.questionType !== 'sign' ? { scale: 0.95 } : {}}
          onClick={() => challenge.questionType !== 'sign' && handleChoice(challenge.num1)}
          disabled={selectedAnswer !== null || challenge.questionType === 'sign'}
          className={`flex-1 max-w-[200px] p-4 bg-white rounded-[24px] border-3 shadow-md flex flex-col items-center gap-3 transition-all ${
            challenge.questionType !== 'sign'
              ? 'cursor-pointer hover:border-kid-blue/60 border-stone-200'
              : 'border-stone-200'
          } ${
            selectedAnswer !== null && challenge.questionType !== 'sign' && challenge.num1 === challenge.correctAnswer
              ? 'bg-kid-green-bg border-kid-green-mint text-kid-green-dark'
              : selectedAnswer === challenge.num1 && !isCorrect
                ? 'bg-red-50 border-kid-red'
                : ''
          }`}
        >
          <span className="text-4xl sm:text-5xl font-black text-kid-dark">
            {challenge.label1}
          </span>
          {challenge.questionType !== 'sign' && renderVisualItems(challenge.num1)}
        </motion.button>

        {/* Center Slot (Sign / vs bubble) */}
        <div className="flex flex-col items-center justify-center min-w-[70px]">
          {challenge.questionType === 'sign' ? (
            <motion.div
              animate={selectedAnswer !== null && isCorrect ? { scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] } : {}}
              className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 flex items-center justify-center shadow-md select-none ${
                selectedAnswer !== null
                  ? isCorrect
                    ? 'bg-kid-green-bg border-kid-green-dark text-kid-green-dark'
                    : 'bg-red-50 border-kid-red text-kid-red'
                  : 'bg-white border-dashed border-kid-blue/60 text-kid-blue'
              }`}
            >
              {selectedAnswer !== null ? (
                <span className="text-3xl sm:text-4xl font-black select-none">
                  {selectedAnswer}
                </span>
              ) : (
                <HelpCircle size={28} className="text-kid-blue stroke-[3]" />
              )}
            </motion.div>
          ) : (
            <span className="text-2xl font-black text-stone-300">vs</span>
          )}
        </div>

        {/* Right Card */}
        <motion.button
          whileHover={challenge.questionType !== 'sign' ? { scale: 1.05 } : {}}
          whileTap={challenge.questionType !== 'sign' ? { scale: 0.95 } : {}}
          onClick={() => challenge.questionType !== 'sign' && handleChoice(challenge.num2)}
          disabled={selectedAnswer !== null || challenge.questionType === 'sign'}
          className={`flex-1 max-w-[200px] p-4 bg-white rounded-[24px] border-3 shadow-md flex flex-col items-center gap-3 transition-all ${
            challenge.questionType !== 'sign'
              ? 'cursor-pointer hover:border-kid-blue/60 border-stone-200'
              : 'border-stone-200'
          } ${
            selectedAnswer !== null && challenge.questionType !== 'sign' && challenge.num2 === challenge.correctAnswer
              ? 'bg-kid-green-bg border-kid-green-mint text-kid-green-dark'
              : selectedAnswer === challenge.num2 && !isCorrect
                ? 'bg-red-50 border-kid-red'
                : ''
          }`}
        >
          <span className="text-4xl sm:text-5xl font-black text-kid-dark">
            {challenge.label2}
          </span>
          {challenge.questionType !== 'sign' && renderVisualItems(challenge.num2)}
        </motion.button>

      </div>

      {/* Choice Area (only shown for "sign" comparison type) */}
      {challenge.questionType === 'sign' && (
        <div className="w-full bg-kid-cream/20 p-6 rounded-3xl border-3 border-kid-blue/10 flex flex-col items-center">
          <h4 className="text-xs font-black uppercase tracking-widest text-kid-sub mb-4">
            👇 Choose the correct alligator math sign
          </h4>

          <div className="grid grid-cols-3 gap-4 w-full max-w-sm">
            {[
              { sign: '>', desc: 'Greater than', descShort: 'Left is bigger' },
              { sign: '=', desc: 'Equal', descShort: 'Both same' },
              { sign: '<', desc: 'Less than', descShort: 'Right is bigger' }
            ].map(({ sign, desc, descShort }) => {
              const isSelected = selectedAnswer === sign;
              return (
                <motion.button
                  key={sign}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleChoice(sign)}
                  disabled={selectedAnswer !== null}
                  className={`p-3 rounded-[20px] border-3 flex flex-col items-center justify-center cursor-pointer transition-all shadow-md ${
                    isSelected
                      ? isCorrect
                        ? 'bg-kid-green-bg border-kid-green-dark text-kid-green-dark'
                        : 'bg-red-50 border-kid-red text-kid-red'
                      : 'bg-white border-kid-blue/30 hover:border-kid-blue text-kid-dark'
                  }`}
                >
                  {/* Alligator Teeth SVG representation inside sign */}
                  <span className="text-3xl font-black">{sign}</span>
                  <span className="text-[9px] font-bold text-kid-sub mt-1 leading-none">
                    {descShort}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>
      )}

      {/* Level Footer */}
      <div className="w-full mt-8 pt-4 border-t-3 border-kid-blue/10 flex justify-between items-center text-[10px] text-kid-sub font-black uppercase tracking-tight">
        <span>
          Level {level}: {
            level === 1 ? "Bigger Numbers (1-10)" :
            level === 2 ? "Smaller Numbers (1-15)" :
            level === 3 ? "Alligator Sign (1-10)" :
            level === 4 ? "Alligator Sign (1-20)" :
            "Equation Comparisons"
          }
        </span>
        <button
          onClick={generateChallenge}
          className="hover:text-kid-blue transition-colors font-bold cursor-pointer"
        >
          New Challenge 🔄
        </button>
      </div>

    </div>
  );
}
