import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ActivityProps } from './ActivityWrapper';

// --- Shared Types & Configurations ---

interface Shape {
  id: string;
  name: string;
  sides: number;
  corners: number;
  type: '2d' | '3d';
  color: string;
}

const SHAPES: Shape[] = [
  { id: 'circle', name: 'Circle', sides: 0, corners: 0, type: '2d', color: '#FF6B6B' },
  { id: 'square', name: 'Square', sides: 4, corners: 4, type: '2d', color: '#4DABF7' },
  { id: 'triangle', name: 'Triangle', sides: 3, corners: 3, type: '2d', color: '#51CF66' },
  { id: 'rectangle', name: 'Rectangle', sides: 4, corners: 4, type: '2d', color: '#FCC419' },
  { id: 'pentagon', name: 'Pentagon', sides: 5, corners: 5, type: '2d', color: '#845EF7' },
  { id: 'hexagon', name: 'Hexagon', sides: 6, corners: 6, type: '2d', color: '#FF922B' },
  { id: 'octagon', name: 'Octagon', sides: 8, corners: 8, type: '2d', color: '#F06595' },
  { id: 'star', name: 'Star', sides: 10, corners: 5, type: '2d', color: '#FFD43B' },
  { id: 'sphere', name: 'Sphere', sides: 0, corners: 0, type: '3d', color: '#FF6B6B' },
  { id: 'cube', name: 'Cube', sides: 6, corners: 8, type: '3d', color: '#4DABF7' },
  { id: 'cone', name: 'Cone', sides: 1, corners: 1, type: '3d', color: '#51CF66' },
  { id: 'cylinder', name: 'Cylinder', sides: 2, corners: 0, type: '3d', color: '#FCC419' },
];

const COLORS_LIST = [
  { value: 'red', label: 'Red', hex: '#FF6B6B', bgClass: 'bg-red-500 border-red-300 text-white' },
  { value: 'blue', label: 'Blue', hex: '#4DABF7', bgClass: 'bg-blue-500 border-blue-300 text-white' },
  { value: 'yellow', label: 'Yellow', hex: '#FCC419', bgClass: 'bg-yellow-400 border-yellow-200 text-stone-800' },
  { value: 'green', label: 'Green', hex: '#51CF66', bgClass: 'bg-green-500 border-green-300 text-white' },
];

const SORTER_SHAPES = [
  { id: 'circle', name: 'Circle' },
  { id: 'square', name: 'Square' },
  { id: 'triangle', name: 'Triangle' },
  { id: 'star', name: 'Star' },
];

// --- Shape SVG Renderer ---

const ShapeRenderer = ({ shape, size = 100 }: { shape: Shape; size?: number }) => {
  const center = size / 2;
  const radius = size * 0.4;

  const getPoints = (sides: number, rotateOffset = -Math.PI / 2) => {
    const points = [];
    for (let i = 0; i < sides; i++) {
      const angle = rotateOffset + (i * 2 * Math.PI) / sides;
      points.push(`${center + radius * Math.cos(angle)},${center + radius * Math.sin(angle)}`);
    }
    return points.join(' ');
  };

  switch (shape.id) {
    case 'circle':
      return <circle cx={center} cy={center} r={radius} fill={shape.color} />;
    case 'square':
    case 'rectangle':
      const w = shape.id === 'square' ? radius * 1.5 : radius * 1.8;
      const h = shape.id === 'square' ? radius * 1.5 : radius * 1.2;
      return <rect x={center - w / 2} y={center - h / 2} width={w} height={h} fill={shape.color} rx={4} />;
    case 'triangle':
      return <polygon points={getPoints(3)} fill={shape.color} />;
    case 'pentagon':
      return <polygon points={getPoints(5)} fill={shape.color} />;
    case 'hexagon':
      return <polygon points={getPoints(6)} fill={shape.color} />;
    case 'octagon':
      return <polygon points={getPoints(8)} fill={shape.color} />;
    case 'star':
      const starPoints = [];
      const innerRadius = radius * 0.4;
      for (let i = 0; i < 10; i++) {
        const r = i % 2 === 0 ? radius : innerRadius;
        const angle = -Math.PI / 2 + (i * Math.PI) / 5;
        starPoints.push(`${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`);
      }
      return <polygon points={starPoints.join(' ')} fill={shape.color} />;
    case 'sphere':
      return (
        <g>
          <defs>
            <radialGradient id="sphereGrad" cx="30%" cy="30%" r="50%">
              <stop offset="0%" stopColor="white" stopOpacity="0.4" />
              <stop offset="100%" stopColor="black" stopOpacity="0.2" />
            </radialGradient>
          </defs>
          <circle cx={center} cy={center} r={radius} fill={shape.color} />
          <circle cx={center} cy={center} r={radius} fill="url(#sphereGrad)" />
        </g>
      );
    case 'cube':
      return (
        <g transform={`translate(${center - radius}, ${center - radius}) scale(${radius / 40})`}>
          <path d="M 10 10 L 50 10 L 50 50 L 10 50 Z" fill={shape.color} stroke="black" strokeWidth="2" />
          <path d="M 10 10 L 30 0 L 70 0 L 50 10 Z" fill={shape.color} stroke="black" strokeWidth="2" opacity="0.8" />
          <path d="M 50 10 L 70 0 L 70 40 L 50 50 Z" fill={shape.color} stroke="black" strokeWidth="2" opacity="0.6" />
        </g>
      );
    case 'cone':
      return (
        <g transform={`translate(${center - radius}, ${center - radius}) scale(${radius / 40})`}>
          <path d="M 40 0 L 10 60 L 70 60 Z" fill={shape.color} stroke="black" strokeWidth="2" />
          <ellipse cx="40" cy="60" rx="30" ry="10" fill={shape.color} stroke="black" strokeWidth="2" opacity="0.6" />
        </g>
      );
    case 'cylinder':
      return (
        <g transform={`translate(${center - radius}, ${center - radius}) scale(${radius / 40})`}>
          <rect x="10" y="10" width="60" height="50" fill={shape.color} stroke="black" strokeWidth="2" />
          <ellipse cx="40" cy="10" rx="30" ry="10" fill={shape.color} stroke="black" strokeWidth="2" />
          <ellipse cx="40" cy="60" rx="30" ry="10" fill={shape.color} stroke="black" strokeWidth="2" opacity="0.6" />
        </g>
      );
    default:
      return null;
  }
};

// --- Sorter Game Interface Definitions ---

interface SortItem {
  id: string;
  type: 'color' | 'shape';
  value: string; // color value (red, etc.) or shape id (circle, etc.)
  shapeId: string;
  colorHex: string;
  label: string;
}

interface Bucket {
  id: string;
  type: 'color' | 'shape';
  value: string;
  label: string;
  colorHex: string;
  bgClass: string;
  shapeId?: string;
}

// --- Unified Playroom Component ---

export function ShapeColorPlayroom({
  level,
  onAnswer,
  defaultSubMode = 'identifier',
}: ActivityProps & { defaultSubMode?: 'identifier' | 'sorter' }) {
  const [subMode, setSubMode] = useState<'identifier' | 'sorter'>(defaultSubMode);

  // --- Shape Identifier State ---
  const [target, setTarget] = useState<Shape | null>(null);
  const [options, setOptions] = useState<Shape[]>([]);
  const [question, setQuestion] = useState('');
  const [isAnswered, setIsAnswered] = useState(false);
  const [lastShapeId, setLastShapeId] = useState<string | null>(null);

  // --- Sorter State ---
  const [currentItem, setCurrentItem] = useState<SortItem | null>(null);
  const [buckets, setBuckets] = useState<Bucket[]>([]);
  const [isSuccess, setIsSuccess] = useState(false);

  // Generate game state on load, level change, or subMode switch
  useEffect(() => {
    if (subMode === 'identifier') {
      generateIdentifierChallenge();
    } else {
      generateSorterChallenge();
    }
  }, [level, subMode]);

  // --- Generate Shape Identifier Challenge ---
  const generateIdentifierChallenge = () => {
    setIsAnswered(false);
    let currentTarget: Shape;
    let currentOptions: Shape[] = [];
    let currentQuestion = '';

    const availableShapes = SHAPES.filter(s => s.id !== lastShapeId);

    if (level <= 2) {
      // Basic 2D shapes
      const basicShapes = availableShapes.filter(s => ['circle', 'square', 'triangle', 'rectangle'].includes(s.id));
      currentTarget = basicShapes[Math.floor(Math.random() * basicShapes.length)];
      currentOptions = [...basicShapes].sort(() => 0.5 - Math.random());
      currentQuestion = `Can you find the ${currentTarget.name}?`;
    } else if (level === 3) {
      // Advanced 2D shapes
      const advancedShapes = availableShapes.filter(s => s.type === '2d');
      currentTarget = advancedShapes[Math.floor(Math.random() * advancedShapes.length)];
      const others = advancedShapes.filter(s => s.id !== currentTarget.id).sort(() => 0.5 - Math.random()).slice(0, 3);
      currentOptions = [currentTarget, ...others].sort(() => 0.5 - Math.random());
      currentQuestion = `Which one is the ${currentTarget.name}?`;
    } else if (level === 4) {
      // Counting sides/corners
      const sideShapes = availableShapes.filter(s => s.type === '2d' && s.sides > 0);
      currentTarget = sideShapes[Math.floor(Math.random() * sideShapes.length)];
      const askSides = Math.random() > 0.5;
      currentQuestion = askSides 
        ? `How many sides does a ${currentTarget.name} have?` 
        : `How many corners does a ${currentTarget.name} have?`;
      
      const correctValue = askSides ? currentTarget.sides : currentTarget.corners;
      const numOptions = [correctValue];
      while (numOptions.length < 4) {
        const offset = Math.floor(Math.random() * 5) - 2;
        const val = correctValue + offset;
        if (val > 0 && !numOptions.includes(val)) {
          numOptions.push(val);
        }
      }
      numOptions.sort((a, b) => a - b);
      
      setTarget(currentTarget);
      setQuestion(currentQuestion);
      setOptions(numOptions.map(n => ({ id: n.toString(), name: n.toString(), sides: n, corners: n, type: '2d', color: '#FFF' })));
      setLastShapeId(currentTarget.id);
      return;
    } else {
      // 3D shapes
      const shapes3d = availableShapes.filter(s => s.type === '3d');
      currentTarget = shapes3d[Math.floor(Math.random() * shapes3d.length)];
      currentOptions = [...shapes3d].sort(() => 0.5 - Math.random());
      currentQuestion = `Can you find the ${currentTarget.name}?`;
    }

    setTarget(currentTarget);
    setOptions(currentOptions);
    setQuestion(currentQuestion);
    setLastShapeId(currentTarget.id);
  };

  // --- Generate Sorter Challenge ---
  const generateSorterChallenge = () => {
    setIsSuccess(false);
    let activeBuckets: Bucket[] = [];
    let item: SortItem;

    // Level 1-2: Color sorting, Level 3-4: Shape sorting, Level 5: Mixed sorting
    const useColor = level <= 2 ? true : level <= 4 ? false : Math.random() > 0.5;

    if (useColor) {
      // Color sorting
      const count = level === 1 ? 2 : 3;
      const selectedColors = [...COLORS_LIST].sort(() => 0.5 - Math.random()).slice(0, count);
      activeBuckets = selectedColors.map(c => ({
        id: c.value,
        type: 'color',
        value: c.value,
        label: c.label,
        colorHex: c.hex,
        bgClass: c.bgClass,
      }));
      const targetColor = selectedColors[Math.floor(Math.random() * selectedColors.length)];
      const randomShape = SORTER_SHAPES[Math.floor(Math.random() * SORTER_SHAPES.length)];
      item = {
        id: Math.random().toString(),
        type: 'color',
        value: targetColor.value,
        shapeId: randomShape.id,
        colorHex: targetColor.hex,
        label: targetColor.label,
      };
    } else {
      // Shape sorting
      const count = level === 3 ? 2 : 3;
      const selectedShapes = [...SORTER_SHAPES].sort(() => 0.5 - Math.random()).slice(0, count);
      activeBuckets = selectedShapes.map(s => ({
        id: s.id,
        type: 'shape',
        value: s.id,
        label: s.name,
        colorHex: '#E2E8F0', // Neutral light grey for shape outlines
        bgClass: 'bg-stone-100 hover:bg-stone-200 border-stone-300 text-stone-700',
        shapeId: s.id,
      }));
      const targetShape = selectedShapes[Math.floor(Math.random() * selectedShapes.length)];
      const randomColor = COLORS_LIST[Math.floor(Math.random() * COLORS_LIST.length)];
      item = {
        id: Math.random().toString(),
        type: 'shape',
        value: targetShape.id,
        shapeId: targetShape.id,
        colorHex: randomColor.hex,
        label: targetShape.name,
      };
    }

    setBuckets(activeBuckets);
    setCurrentItem(item);
  };

  // --- Handlers ---
  const handleSelectIdentifier = (shape: Shape) => {
    if (isAnswered) return;

    const isCorrect = level === 4 
      ? shape.name === (question.includes('sides') ? target?.sides.toString() : target?.corners.toString())
      : shape.id === target?.id;

    if (isCorrect) {
      setIsAnswered(true);
      onAnswer(true);
      setTimeout(generateIdentifierChallenge, 1500);
    } else {
      onAnswer(false);
    }
  };

  const handleDropSorter = (bucketValue: string) => {
    if (!currentItem || isSuccess) return;

    if (currentItem.value === bucketValue) {
      setIsSuccess(true);
      onAnswer(true);
      setTimeout(generateSorterChallenge, 1500);
    } else {
      onAnswer(false);
    }
  };

  return (
    <div className="flex flex-col items-center w-full min-h-[450px]">
      
      {/* Dynamic Sub-Mode Toggle */}
      <div className="flex bg-stone-100 p-1.5 rounded-full border-2 border-stone-200 w-fit mb-8 shadow-sm">
        <button
          onClick={() => setSubMode('identifier')}
          className={`px-6 py-2 rounded-full text-xs font-black transition-all flex items-center gap-2 ${
            subMode === 'identifier'
              ? 'bg-kid-yellow text-white shadow-md'
              : 'text-stone-500 hover:text-stone-700'
          }`}
        >
          🔷 Shape Identifier
        </button>
        <button
          onClick={() => setSubMode('sorter')}
          className={`px-6 py-2 rounded-full text-xs font-black transition-all flex items-center gap-2 ${
            subMode === 'sorter'
              ? 'bg-kid-yellow text-white shadow-md'
              : 'text-stone-500 hover:text-stone-700'
          }`}
        >
          🗑️ Color & Shape Sorter
        </button>
      </div>

      {/* --- Shape Identifier Sub-mode Render --- */}
      {subMode === 'identifier' && (
        <div className="flex flex-col items-center justify-center w-full text-center">
          <motion.div
            key={question}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h3 className="text-3xl font-black text-kid-dark mb-4">{question}</h3>
            {level === 4 && target && (
              <div className="flex justify-center mb-4">
                <svg width="120" height="120" viewBox="0 0 100 100">
                  <ShapeRenderer shape={target} size={100} />
                </svg>
              </div>
            )}
          </motion.div>

          <div className="grid grid-cols-2 gap-6 w-full max-w-md">
            {options.map((shape) => (
              <motion.button
                key={shape.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSelectIdentifier(shape)}
                className={`h-40 bg-white rounded-[40px] border-4 border-kid-peach shadow-lg flex flex-col items-center justify-center gap-2 transition-all ${
                  isAnswered && (level === 4 ? shape.name === (question.includes('sides') ? target?.sides.toString() : target?.corners.toString()) : shape.id === target?.id)
                    ? 'bg-kid-green-bg border-kid-green-mint scale-105'
                    : 'hover:border-kid-peach-dark'
                }`}
              >
                {level === 4 ? (
                  <span className="text-5xl font-black text-kid-dark">{shape.name}</span>
                ) : (
                  <svg width="80" height="80" viewBox="0 0 100 100">
                    <ShapeRenderer shape={shape} size={100} />
                  </svg>
                )}
                {level !== 4 && (
                  <span className="text-xs font-black text-kid-sub uppercase tracking-widest">
                    {shape.name}
                  </span>
                )}
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* --- Color & Shape Sorter Sub-mode Render --- */}
      {subMode === 'sorter' && (
        <div className="flex flex-col items-center justify-between w-full">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-black text-kid-dark">
              {level <= 2 ? "Match the Color!" : level <= 4 ? "Match the Shape!" : "Where does it go?"}
            </h3>
            <p className="text-xs font-bold text-kid-sub mt-1">
              Drag or tap the object, then choose the right bucket below!
            </p>
          </div>

          {/* Item to Sort */}
          <div className="flex items-center justify-center min-h-[160px] mb-8 w-full">
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
                  className="w-32 h-32 bg-white rounded-[40px] border-4 border-kid-peach shadow-xl flex items-center justify-center cursor-grab active:cursor-grabbing z-10 hover:border-kid-peach-dark transition-colors"
                >
                  <svg width="80" height="80" viewBox="0 0 100 100">
                    <ShapeRenderer
                      shape={{
                        id: currentItem.shapeId,
                        name: currentItem.label,
                        sides: 0,
                        corners: 0,
                        type: '2d',
                        color: currentItem.colorHex,
                      }}
                      size={100}
                    />
                  </svg>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Buckets */}
          <div className="w-full max-w-2xl grid grid-cols-2 sm:grid-cols-4 gap-6 px-4">
            {buckets.map((bucket) => (
              <motion.button
                key={bucket.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleDropSorter(bucket.value)}
                className={`h-36 rounded-[32px] border-4 border-white shadow-lg flex flex-col items-center justify-center gap-3 transition-colors relative overflow-hidden ${bucket.bgClass}`}
              >
                {/* Click animation overlay effect */}
                <div className="absolute inset-0 bg-black/5 opacity-0 hover:opacity-100 transition-opacity" />
                
                {bucket.type === 'color' ? (
                  // Color Bucket visual representation
                  <div 
                    className="w-12 h-12 rounded-full border-4 border-white shadow-md"
                    style={{ backgroundColor: bucket.colorHex }}
                  />
                ) : (
                  // Shape Bucket visual representation (light outline)
                  <svg width="50" height="50" viewBox="0 0 100 100">
                    <ShapeRenderer
                      shape={{
                        id: bucket.shapeId!,
                        name: bucket.label,
                        sides: 0,
                        corners: 0,
                        type: '2d',
                        color: 'rgba(0, 0, 0, 0.15)', // transparent outline representation
                      }}
                      size={100}
                    />
                  </svg>
                )}

                <span className="text-xs font-black uppercase tracking-widest drop-shadow-sm">
                  {bucket.label}
                </span>
              </motion.button>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}

// Default export is the ShapeGeometry wrapper pointing to identifier mode,
// and we export ColorShapeSorter as a named wrapper pointing to sorter mode.
export default function ShapeGeometry(props: ActivityProps) {
  return <ShapeColorPlayroom {...props} defaultSubMode="identifier" />;
}

export function ColorShapeSorter(props: ActivityProps) {
  return <ShapeColorPlayroom {...props} defaultSubMode="sorter" />;
}
