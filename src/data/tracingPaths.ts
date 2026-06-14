export interface TracingItem {
  id: string; // "A", "B", "1", "2" etc.
  type: 'letter' | 'number';
  label: string; // "A", "B"
  word?: string; // "Apple", "Banana", "Cat"
  emoji: string; // "🍎", "🍌", "🐱"
  color: string; // Tailwind bg/text color preference
  checkpoints: { x: number; y: number; label: string }[];
  // SVG representation for the background guide path
  svgPath: string; 
}

export const TRACING_ITEMS: TracingItem[] = [
  // LETTERS
  {
    id: 'A',
    type: 'letter',
    label: 'A',
    word: 'Apple',
    emoji: '🍎',
    color: 'from-rose-400 to-rose-500',
    svgPath: 'M 50,15 L 20,85 M 50,15 L 80,85 M 32,55 L 68,55',
    checkpoints: [
      { x: 50, y: 15, label: '1' },
      { x: 35, y: 50, label: '2' },
      { x: 20, y: 85, label: '3' },
      { x: 65, y: 50, label: '4' },
      { x: 80, y: 85, label: '5' },
      { x: 35, y: 55, label: '6' },
      { x: 65, y: 55, label: '7' }
    ]
  },
  {
    id: 'B',
    type: 'letter',
    label: 'B',
    word: 'Butterfly',
    emoji: '🦋',
    color: 'from-pink-400 to-pink-500',
    svgPath: 'M 30,15 L 30,85 M 30,15 C 65,15 65,48 30,48 C 68,48 68,85 30,85',
    checkpoints: [
      { x: 30, y: 15, label: '1' },
      { x: 30, y: 50, label: '2' },
      { x: 30, y: 85, label: '3' },
      { x: 55, y: 30, label: '4' },
      { x: 30, y: 48, label: '5' },
      { x: 58, y: 65, label: '6' },
      { x: 45, y: 85, label: '7' }
    ]
  },
  {
    id: 'C',
    type: 'letter',
    label: 'C',
    word: 'Cat',
    emoji: '🐱',
    color: 'from-amber-400 to-amber-500',
    svgPath: 'M 75,25 C 50,15 25,35 25,50 C 25,65 50,85 75,75',
    checkpoints: [
      { x: 75, y: 25, label: '1' },
      { x: 50, y: 20, label: '2' },
      { x: 30, y: 40, label: '3' },
      { x: 30, y: 60, label: '4' },
      { x: 50, y: 80, label: '5' },
      { x: 75, y: 75, label: '6' }
    ]
  },
  {
    id: 'D',
    type: 'letter',
    label: 'D',
    word: 'Dinosaur',
    emoji: '🦖',
    color: 'from-emerald-400 to-emerald-500',
    svgPath: 'M 30,15 L 30,85 C 75,85 75,15 30,15',
    checkpoints: [
      { x: 30, y: 15, label: '1' },
      { x: 30, y: 50, label: '2' },
      { x: 30, y: 85, label: '3' },
      { x: 55, y: 25, label: '4' },
      { x: 68, y: 50, label: '5' },
      { x: 55, y: 75, label: '6' }
    ]
  },
  {
    id: 'E',
    type: 'letter',
    label: 'E',
    word: 'Elephant',
    emoji: '🐘',
    color: 'from-sky-400 to-sky-500',
    svgPath: 'M 30,15 L 30,85 M 30,15 L 75,15 M 30,50 L 65,50 M 30,85 L 75,85',
    checkpoints: [
      { x: 30, y: 15, label: '1' },
      { x: 30, y: 50, label: '2' },
      { x: 30, y: 85, label: '3' },
      { x: 55, y: 15, label: '4' },
      { x: 75, y: 15, label: '5' },
      { x: 55, y: 50, label: '6' },
      { x: 55, y: 85, label: '7' },
      { x: 75, y: 85, label: '8' }
    ]
  },
  {
    id: 'F',
    type: 'letter',
    label: 'F',
    word: 'Frog',
    emoji: '🐸',
    color: 'from-green-400 to-green-500',
    svgPath: 'M 30,15 L 30,85 M 30,15 L 75,15 M 30,50 L 65,50',
    checkpoints: [
      { x: 30, y: 15, label: '1' },
      { x: 30, y: 50, label: '2' },
      { x: 30, y: 85, label: '3' },
      { x: 55, y: 15, label: '4' },
      { x: 75, y: 15, label: '5' },
      { x: 50, y: 50, label: '6' }
    ]
  },
  {
    id: 'G',
    type: 'letter',
    label: 'G',
    word: 'Giraffe',
    emoji: '🦒',
    color: 'from-yellow-400 to-yellow-500',
    svgPath: 'M 75,25 C 50,15 25,35 25,50 C 25,65 50,85 75,85 L 75,55 L 55,55',
    checkpoints: [
      { x: 75, y: 25, label: '1' },
      { x: 50, y: 18, label: '2' },
      { x: 28, y: 40, label: '3' },
      { x: 28, y: 65, label: '4' },
      { x: 50, y: 82, label: '5' },
      { x: 75, y: 80, label: '6' },
      { x: 75, y: 55, label: '7' },
      { x: 58, y: 55, label: '8' }
    ]
  },
  {
    id: 'H',
    type: 'letter',
    label: 'H',
    word: 'Horse',
    emoji: '🐴',
    color: 'from-orange-400 to-orange-500',
    svgPath: 'M 25,15 L 25,85 M 75,15 L 75,85 M 25,50 L 75,50',
    checkpoints: [
      { x: 25, y: 15, label: '1' },
      { x: 25, y: 50, label: '2' },
      { x: 25, y: 85, label: '3' },
      { x: 75, y: 15, label: '4' },
      { x: 75, y: 50, label: '5' },
      { x: 75, y: 85, label: '6' },
      { x: 50, y: 50, label: '7' }
    ]
  },
  {
    id: 'I',
    type: 'letter',
    label: 'I',
    word: 'Ice Cream',
    emoji: '🍦',
    color: 'from-indigo-400 to-indigo-500',
    svgPath: 'M 35,15 L 65,15 M 50,15 L 50,85 M 35,85 L 65,85',
    checkpoints: [
      { x: 50, y: 15, label: '1' },
      { x: 50, y: 50, label: '2' },
      { x: 50, y: 85, label: '3' },
      { x: 35, y: 15, label: '4' },
      { x: 65, y: 15, label: '5' },
      { x: 35, y: 85, label: '6' },
      { x: 65, y: 85, label: '7' }
    ]
  },
  {
    id: 'J',
    type: 'letter',
    label: 'J',
    word: 'Jellyfish',
    emoji: '🪼',
    color: 'from-violet-400 to-violet-500',
    svgPath: 'M 40,15 L 75,15 M 60,15 L 60,70 C 60,82 40,85 30,75',
    checkpoints: [
      { x: 40, y: 15, label: '1' },
      { x: 75, y: 15, label: '2' },
      { x: 60, y: 35, label: '3' },
      { x: 60, y: 65, label: '4' },
      { x: 50, y: 80, label: '5' },
      { x: 30, y: 72, label: '6' }
    ]
  },
  {
    id: 'K',
    type: 'letter',
    label: 'K',
    word: 'Kangaroo',
    emoji: '🦘',
    color: 'from-amber-500 to-amber-600',
    svgPath: 'M 30,15 L 30,85 M 70,15 L 30,50 L 70,85',
    checkpoints: [
      { x: 30, y: 15, label: '1' },
      { x: 30, y: 50, label: '2' },
      { x: 30, y: 85, label: '3' },
      { x: 65, y: 20, label: '4' },
      { x: 48, y: 36, label: '5' },
      { x: 50, y: 65, label: '6' },
      { x: 68, y: 82, label: '7' }
    ]
  },
  {
    id: 'L',
    type: 'letter',
    label: 'L',
    word: 'Lion',
    emoji: '🦁',
    color: 'from-orange-500 to-amber-500',
    svgPath: 'M 30,15 L 30,85 L 75,85',
    checkpoints: [
      { x: 30, y: 15, label: '1' },
      { x: 30, y: 50, label: '2' },
      { x: 30, y: 85, label: '3' },
      { x: 52, y: 85, label: '4' },
      { x: 75, y: 85, label: '5' }
    ]
  },
  {
    id: 'M',
    type: 'letter',
    label: 'M',
    word: 'Monkey',
    emoji: '🐒',
    color: 'from-yellow-600 to-orange-400',
    svgPath: 'M 20,85 L 20,15 L 50,50 L 80,15 L 80,85',
    checkpoints: [
      { x: 20, y: 85, label: '1' },
      { x: 20, y: 50, label: '2' },
      { x: 20, y: 15, label: '3' },
      { x: 35, y: 32, label: '4' },
      { x: 50, y: 50, label: '5' },
      { x: 65, y: 32, label: '6' },
      { x: 80, y: 15, label: '7' },
      { x: 80, y: 50, label: '8' },
      { x: 80, y: 85, label: '9' }
    ]
  },
  {
    id: 'N',
    type: 'letter',
    label: 'N',
    word: 'Nest',
    emoji: '🪹',
    color: 'from-cyan-400 to-cyan-500',
    svgPath: 'M 25,85 L 25,15 L 75,85 L 75,15',
    checkpoints: [
      { x: 25, y: 85, label: '1' },
      { x: 25, y: 48, label: '2' },
      { x: 25, y: 15, label: '3' },
      { x: 42, y: 38, label: '4' },
      { x: 58, y: 62, label: '5' },
      { x: 75, y: 85, label: '6' },
      { x: 75, y: 48, label: '7' },
      { x: 75, y: 15, label: '8' }
    ]
  },
  {
    id: 'O',
    type: 'letter',
    label: 'O',
    word: 'Owl',
    emoji: '🦉',
    color: 'from-violet-500 to-fuchsia-500',
    svgPath: 'M 50,15 C 25,15 25,85 50,85 C 75,85 75,15 50,15',
    checkpoints: [
      { x: 50, y: 15, label: '1' },
      { x: 30, y: 32, label: '2' },
      { x: 25, y: 50, label: '3' },
      { x: 30, y: 68, label: '4' },
      { x: 50, y: 85, label: '5' },
      { x: 70, y: 68, label: '6' },
      { x: 75, y: 50, label: '7' },
      { x: 70, y: 32, label: '8' }
    ]
  },
  {
    id: 'P',
    type: 'letter',
    label: 'P',
    word: 'Penguin',
    emoji: '🐧',
    color: 'from-sky-500 to-blue-600',
    svgPath: 'M 30,15 L 30,85 M 30,15 C 65,15 65,50 30,50',
    checkpoints: [
      { x: 30, y: 15, label: '1' },
      { x: 30, y: 50, label: '2' },
      { x: 30, y: 85, label: '3' },
      { x: 50, y: 22, label: '4' },
      { x: 55, y: 35, label: '5' },
      { x: 42, y: 50, label: '6' }
    ]
  },
  {
    id: 'Q',
    type: 'letter',
    label: 'Q',
    word: 'Queen',
    emoji: '👑',
    color: 'from-yellow-400 to-amber-500',
    svgPath: 'M 50,15 C 25,15 25,81 50,81 C 75,81 75,15 50,15 M 58,58 L 80,85',
    checkpoints: [
      { x: 50, y: 15, label: '1' },
      { x: 28, y: 48, label: '2' },
      { x: 50, y: 81, label: '3' },
      { x: 72, y: 48, label: '4' },
      { x: 58, y: 58, label: '5' },
      { x: 68, y: 70, label: '6' },
      { x: 80, y: 85, label: '7' }
    ]
  },
  {
    id: 'R',
    type: 'letter',
    label: 'R',
    word: 'Rabbit',
    emoji: '🐰',
    color: 'from-rose-300 to-rose-450',
    svgPath: 'M 30,15 L 30,85 M 30,15 C 65,15 65,50 30,50 M 30,50 L 75,85',
    checkpoints: [
      { x: 30, y: 15, label: '1' },
      { x: 30, y: 50, label: '2' },
      { x: 30, y: 85, label: '3' },
      { x: 52, y: 22, label: '4' },
      { x: 52, y: 44, label: '5' },
      { x: 50, y: 62, label: '6' },
      { x: 72, y: 82, label: '7' }
    ]
  },
  {
    id: 'S',
    type: 'letter',
    label: 'S',
    word: 'Snail',
    emoji: '🐌',
    color: 'from-lime-400 to-lime-500',
    svgPath: 'M 70,22 C 55,10 25,20 30,38 C 35,55 70,50 70,68 C 70,82 40,88 28,75',
    checkpoints: [
      { x: 70, y: 22, label: '1' },
      { x: 48, y: 16, label: '2' },
      { x: 32, y: 32, label: '3' },
      { x: 50, y: 48, label: '4' },
      { x: 68, y: 60, label: '5' },
      { x: 55, y: 80, label: '6' },
      { x: 30, y: 75, label: '7' }
    ]
  },
  {
    id: 'T',
    type: 'letter',
    label: 'T',
    word: 'Tiger',
    emoji: '🐯',
    color: 'from-orange-500 to-amber-600',
    svgPath: 'M 20,15 L 80,15 M 50,15 L 50,85',
    checkpoints: [
      { x: 50, y: 15, label: '1' },
      { x: 50, y: 50, label: '2' },
      { x: 50, y: 85, label: '3' },
      { x: 20, y: 15, label: '4' },
      { x: 80, y: 15, label: '5' }
    ]
  },
  {
    id: 'U',
    type: 'letter',
    label: 'U',
    word: 'Umbrella',
    emoji: '☂️',
    color: 'from-indigo-400 to-purple-500',
    svgPath: 'M 25,15 L 25,65 C 25,85 75,85 75,65 L 75,15',
    checkpoints: [
      { x: 25, y: 15, label: '1' },
      { x: 25, y: 48, label: '2' },
      { x: 30, y: 72, label: '3' },
      { x: 50, y: 82, label: '4' },
      { x: 70, y: 72, label: '5' },
      { x: 75, y: 48, label: '6' },
      { x: 75, y: 15, label: '7' }
    ]
  },
  {
    id: 'V',
    type: 'letter',
    label: 'V',
    word: 'Violin',
    emoji: '🎻',
    color: 'from-pink-500 to-rose-450',
    svgPath: 'M 20,15 L 50,85 L 80,15',
    checkpoints: [
      { x: 20, y: 15, label: '1' },
      { x: 35, y: 50, label: '2' },
      { x: 50, y: 85, label: '3' },
      { x: 65, y: 50, label: '4' },
      { x: 80, y: 15, label: '5' }
    ]
  },
  {
    id: 'W',
    type: 'letter',
    label: 'W',
    word: 'Watermelon',
    emoji: '🍉',
    color: 'from-green-500 to-red-500',
    svgPath: 'M 15,15 L 32,85 L 50,45 L 68,85 L 85,15',
    checkpoints: [
      { x: 15, y: 15, label: '1' },
      { x: 25, y: 50, label: '2' },
      { x: 32, y: 85, label: '3' },
      { x: 42, y: 62, label: '4' },
      { x: 50, y: 45, label: '5' },
      { x: 58, y: 62, label: '6' },
      { x: 68, y: 85, label: '7' },
      { x: 78, y: 50, label: '8' },
      { x: 85, y: 15, label: '9' }
    ]
  },
  {
    id: 'X',
    type: 'letter',
    label: 'X',
    word: 'Xylophone',
    emoji: '🪘',
    color: 'from-cyan-400 to-blue-500',
    svgPath: 'M 20,15 L 80,85 M 80,15 L 20,85',
    checkpoints: [
      { x: 20, y: 15, label: '1' },
      { x: 35, y: 35, label: '2' },
      { x: 50, y: 50, label: '3' },
      { x: 65, y: 65, label: '4' },
      { x: 80, y: 85, label: '5' },
      { x: 80, y: 15, label: '6' },
      { x: 20, y: 85, label: '7' }
    ]
  },
  {
    id: 'Y',
    type: 'letter',
    label: 'Y',
    word: 'Yak',
    emoji: '🐂',
    color: 'from-amber-600 to-orange-700',
    svgPath: 'M 20,15 L 50,50 L 80,15 M 50,50 L 50,85',
    checkpoints: [
      { x: 20, y: 15, label: '1' },
      { x: 35, y: 32, label: '2' },
      { x: 50, y: 50, label: '3' },
      { x: 80, y: 15, label: '4' },
      { x: 50, y: 68, label: '5' },
      { x: 50, y: 85, label: '6' }
    ]
  },
  {
    id: 'Z',
    type: 'letter',
    label: 'Z',
    word: 'Zebra',
    emoji: '🦓',
    color: 'from-slate-700 to-slate-900',
    svgPath: 'M 25,18 L 75,18 L 25,82 L 75,82',
    checkpoints: [
      { x: 25, y: 18, label: '1' },
      { x: 50, y: 18, label: '2' },
      { x: 75, y: 18, label: '3' },
      { x: 58, y: 38, label: '4' },
      { x: 42, y: 60, label: '5' },
      { x: 25, y: 82, label: '6' },
      { x: 50, y: 82, label: '7' },
      { x: 75, y: 82, label: '8' }
    ]
  },

  // NUMBERS
  {
    id: '1',
    type: 'number',
    label: '1',
    word: 'One Sun',
    emoji: '☀️',
    color: 'from-yellow-400 to-amber-500',
    svgPath: 'M 35,28 L 50,15 L 50,85 M 35,85 L 65,85',
    checkpoints: [
      { x: 35, y: 28, label: '1' },
      { x: 50, y: 15, label: '2' },
      { x: 50, y: 50, label: '3' },
      { x: 50, y: 85, label: '4' },
      { x: 35, y: 85, label: '5' },
      { x: 65, y: 85, label: '6' }
    ]
  },
  {
    id: '2',
    type: 'number',
    label: '2',
    word: 'Two Ducks',
    emoji: '🦆🦆',
    color: 'from-lime-400 to-emerald-500',
    svgPath: 'M 30,30 C 30,10 70,10 70,35 C 70,55 30,80 30,82 L 70,82',
    checkpoints: [
      { x: 30, y: 30, label: '1' },
      { x: 50, y: 15, label: '2' },
      { x: 70, y: 30, label: '3' },
      { x: 58, y: 50, label: '4' },
      { x: 45, y: 65, label: '5' },
      { x: 30, y: 80, label: '6' },
      { x: 70, y: 80, label: '7' }
    ]
  },
  {
    id: '3',
    type: 'number',
    label: '3',
    word: 'Three Pigs',
    emoji: '🐷🐷🐷',
    color: 'from-pink-400 to-rose-450',
    svgPath: 'M 28,18 L 70,18 L 48,46 C 68,46 72,82 30,82',
    checkpoints: [
      { x: 28, y: 18, label: '1' },
      { x: 50, y: 18, label: '2' },
      { x: 70, y: 18, label: '3' },
      { x: 48, y: 46, label: '4' },
      { x: 65, y: 58, label: '5' },
      { x: 60, y: 75, label: '6' },
      { x: 30, y: 82, label: '7' }
    ]
  },
  {
    id: '4',
    type: 'number',
    label: '4',
    word: 'Four Cars',
    emoji: '🚗🚗🚗🚗',
    color: 'from-blue-400 to-sky-500',
    svgPath: 'M 55,85 L 55,15 L 20,62 L 75,62',
    checkpoints: [
      { x: 55, y: 15, label: '1' },
      { x: 38, y: 38, label: '2' },
      { x: 20, y: 62, label: '3' },
      { x: 45, y: 62, label: '4' },
      { x: 75, y: 62, label: '5' },
      { x: 55, y: 50, label: '6' },
      { x: 55, y: 85, label: '7' }
    ]
  },
  {
    id: '5',
    type: 'number',
    label: '5',
    word: 'Five Stars',
    emoji: '⭐️⭐️⭐️⭐️⭐️',
    color: 'from-amber-400 to-yellow-500',
    svgPath: 'M 65,18 L 30,18 L 30,48 C 45,40 70,45 70,68 C 70,85 38,88 28,75',
    checkpoints: [
      { x: 65, y: 18, label: '1' },
      { x: 48, y: 18, label: '2' },
      { x: 30, y: 18, label: '3' },
      { x: 30, y: 32, label: '4' },
      { x: 30, y: 48, label: '5' },
      { x: 50, y: 48, label: '6' },
      { x: 70, y: 60, label: '7' },
      { x: 52, y: 82, label: '8' },
      { x: 30, y: 78, label: '9' }
    ]
  },
  {
    id: '6',
    type: 'number',
    label: '6',
    word: 'Six Fish',
    emoji: '🐟🐟🐟🐟🐟🐟',
    color: 'from-aquamarine-400 to-cyan-500',
    svgPath: 'M 60,18 C 40,15 28,45 28,62 C 28,78 68,82 68,62 C 68,48 28,48 28,62',
    checkpoints: [
      { x: 60, y: 18, label: '1' },
      { x: 42, y: 28, label: '2' },
      { x: 30, y: 48, label: '3' },
      { x: 30, y: 72, label: '4' },
      { x: 50, y: 82, label: '5' },
      { x: 68, y: 70, label: '6' },
      { x: 60, y: 52, label: '7' },
      { x: 40, y: 55, label: '8' }
    ]
  },
  {
    id: '7',
    type: 'number',
    label: '7',
    word: 'Seven Apples',
    emoji: '🍎🍎🍎🍎🍎🍎🍎',
    color: 'from-rose-500 to-rose-600',
    svgPath: 'M 28,18 L 72,18 L 40,82',
    checkpoints: [
      { x: 28, y: 18, label: '1' },
      { x: 50, y: 18, label: '2' },
      { x: 72, y: 18, label: '3' },
      { x: 60, y: 38, label: '4' },
      { x: 50, y: 60, label: '5' },
      { x: 40, y: 82, label: '6' }
    ]
  },
  {
    id: '8',
    type: 'number',
    label: '8',
    word: 'Eight Bees',
    emoji: '🐝🐝🐝🐝🐝🐝🐝🐝',
    color: 'from-yellow-450 to-amber-500',
    svgPath: 'M 50,48 C 30,48 30,15 50,15 C 70,15 70,48 50,48 C 30,48 30,82 50,82 C 70,82 70,48 50,48',
    checkpoints: [
      { x: 50, y: 15, label: '1' },
      { x: 35, y: 30, label: '2' },
      { x: 65, y: 30, label: '3' },
      { x: 50, y: 48, label: '4' },
      { x: 35, y: 65, label: '5' },
      { x: 65, y: 65, label: '6' },
      { x: 50, y: 82, label: '7' }
    ]
  },
  {
    id: '9',
    type: 'number',
    label: '9',
    word: 'Nine Balloons',
    emoji: '🎈🎈🎈🎈🎈🎈🎈🎈🎈',
    color: 'from-violet-400 to-purple-500',
    svgPath: 'M 50,52 C 70,52 70,18 50,18 C 30,18 30,52 50,52 L 50,85',
    checkpoints: [
      { x: 50, y: 18, label: '1' },
      { x: 30, y: 35, label: '2' },
      { x: 50, y: 52, label: '3' },
      { x: 70, y: 35, label: '4' },
      { x: 50, y: 68, label: '5' },
      { x: 50, y: 85, label: '6' }
    ]
  }
];
