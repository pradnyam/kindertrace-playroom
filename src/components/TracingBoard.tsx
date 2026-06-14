import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TRACING_ITEMS, TracingItem } from '../data/tracingPaths';
import { playPop, playChime, playBuzz, playSparkle, playStarPickup, speak } from '../utils/audio';
import { Sparkles, RefreshCw, ArrowRight, Palette, Award, CheckCircle, Volume2, Star } from 'lucide-react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  life: number;
  shape: 'circle' | 'star';
}

export default function TracingBoard() {
  const [filterType, setFilterType] = useState<'letter' | 'number'>('letter');
  const items = TRACING_ITEMS.filter(i => i.type === filterType);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentItem = items[currentIndex] || items[0];

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushType, setBrushType] = useState<'rainbow' | 'sparkle' | 'bubble'>('rainbow');
  const [collectedCheckpoints, setCollectedCheckpoints] = useState<number[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [strokesCount, setStrokesCount] = useState(0);
  const [prevPoint, setPrevPoint] = useState<{ x: number; y: number } | null>(null);

  // Initialize Canvas
  useEffect(() => {
    resetCanvas();
    // Announce the letter and the phonics
    speakItem(currentItem);
  }, [currentItem]);

  // Particle animation loop
  useEffect(() => {
    let animId: number;
    const updateParticles = () => {
      setParticles(prev => 
        prev
          .map(p => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            vy: p.vy + 0.1, // mild gravity
            life: p.life - 1,
            alpha: Math.max(0, p.alpha - 0.02)
          }))
          .filter(p => p.life > 0)
      );
      animId = requestAnimationFrame(updateParticles);
    };
    animId = requestAnimationFrame(updateParticles);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Sync canvas drawing of custom particle sparkles on a canvas overlay or directly in state
  const addBrushParticles = (x: number, y: number) => {
    const newParticles: Particle[] = [];
    const count = brushType === 'sparkle' ? 5 : 2;
    const colors = 
      brushType === 'rainbow' 
        ? ['#ff007f', '#ffaa00', '#33ff33', '#00e5ff', '#a020f0', '#ff00ff']
        : brushType === 'sparkle'
          ? ['#ffe600', '#ffd700', '#fffacd', '#ffffff']
          : ['#ffc0cb', '#87cefa', '#98fb98', '#dda0dd'];

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.5 + Math.random() * 2;
      newParticles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 0.5,
        size: brushType === 'bubble' ? 6 + Math.random() * 10 : 3 + Math.random() * 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1,
        life: 30 + Math.floor(Math.random() * 20),
        shape: brushType === 'sparkle' ? 'star' : 'circle'
      });
    }
    setParticles(prev => [...prev, ...newParticles].slice(-100)); // limit active particles
  };

  const speakItem = (item: TracingItem) => {
    if (item.type === 'letter') {
      speak(`${item.label}! ${item.label} is for ${item.word || ''}`);
    } else {
      speak(`${item.label}! Let's write ${item.label}`);
    }
  };

  const resetCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Set fixed coordinate space of 400x400
    canvas.width = 400;
    canvas.height = 400;
    
    const context = canvas.getContext('2d');
    if (!context) return;
    
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.lineWidth = 18;
    contextRef.current = context;
    
    setCollectedCheckpoints([]);
    setIsCompleted(false);
    setStrokesCount(0);
    setPrevPoint(null);
  };

  // Check if pointer is near any checkpoint
  const checkCheckpoints = (x: number, y: number) => {
    if (isCompleted) return;

    currentItem.checkpoints.forEach((cp, idx) => {
      if (collectedCheckpoints.includes(idx)) return;

      // Scale normalised checkpoints (0-100) to target 400x400 canvas sizes
      const cpX = cp.x * 4;
      const cpY = cp.y * 4;

      const dist = Math.hypot(x - cpX, y - cpY);
      
      // Let's check order. For 4-year-olds we can optionally allow free order collection,
      // but enforcing strict visual checkpoint pickup 1 -> 2 -> 3 makes it a game!
      // Let's require them to pick up in order, or if they pick up, say, the active one.
      // Actually, picking up in exact numerical order helps them learn sequential progression!
      // Let's check: Is this checkpoint the next uncollected one? Let's check!
      const nextNeededIdx = currentItem.checkpoints.findIndex((_, index) => !collectedCheckpoints.includes(index));

      if (dist < 26) {
        if (idx === nextNeededIdx) {
          // Correct order pickup!
          const newCollected = [...collectedCheckpoints, idx];
          setCollectedCheckpoints(newCollected);
          playStarPickup(idx);
          speak(cp.label); // speak the number of star: "one", "two", "three"!
          
          // Confetti around this star
          addBrushParticles(cpX, cpY);
          addBrushParticles(cpX, cpY);

          // Check if sequence is complete
          if (newCollected.length === currentItem.checkpoints.length) {
            triggerCompletion();
          }
        } else {
          // If they touch a future star out-of-order, play a soft warning bubble sound
          // but don't penalize them. Helps them locate star 1 first!
        }
      }
    });
  };

  const triggerCompletion = () => {
    setIsCompleted(true);
    playChime();
    setTimeout(() => {
      speak(`Hooray! You did it! Beautiful tracing of ${currentItem.label}!`);
    }, 450);
  };

  // Coordinates resolution
  const getCoordinates = (e: React.MouseEvent | React.TouchEvent): { x: number; y: number } | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();
    let clientX = 0;
    let clientY = 0;

    if ('touches' in e) {
      if (e.touches.length === 0) return null;
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    // Map DOM client coords to high-res canvas coordinate scale
    const x = ((clientX - rect.left) / rect.width) * canvas.width;
    const y = ((clientY - rect.top) / rect.height) * canvas.height;
    return { x, y };
  };

  // Drawing Handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const coords = getCoordinates(e.nativeEvent);
    if (!coords) return;

    setIsDrawing(true);
    setPrevPoint(coords);
    playSparkle();
    checkCheckpoints(coords.x, coords.y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!isDrawing || !contextRef.current || !prevPoint) return;

    const coords = getCoordinates(e.nativeEvent);
    if (!coords) return;

    const ctx = contextRef.current;
    ctx.beginPath();
    ctx.moveTo(prevPoint.x, prevPoint.y);
    ctx.lineTo(coords.x, coords.y);

    // Dynamic Brush Customizer
    if (brushType === 'rainbow') {
      const hue = (strokesCount * 3) % 360;
      ctx.strokeStyle = `hsl(${hue}, 100%, 60%)`;
      ctx.shadowBlur = 0;
      ctx.lineWidth = 18;
    } else if (brushType === 'sparkle') {
      ctx.strokeStyle = '#ffe600';
      ctx.shadowColor = '#ffd700';
      ctx.shadowBlur = 10;
      ctx.lineWidth = 12;
    } else {
      // bubble style
      ctx.strokeStyle = 'rgba(135,206,250, 0.75)';
      ctx.shadowBlur = 0;
      ctx.lineWidth = 24;
      // Draw tiny bubble centers
      ctx.fillStyle = '#ffffff';
      ctx.arc(coords.x, coords.y, 4, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.stroke();
    
    // Add custom particles
    addBrushParticles(coords.x, coords.y);
    setStrokesCount(prev => prev + 1);

    // Frame Sparkle tick sound
    if (strokesCount % 6 === 0) {
      playSparkle();
    }

    // Check star progression
    checkCheckpoints(coords.x, coords.y);
    setPrevPoint(coords);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    setPrevPoint(null);
  };

  const handleNextItem = () => {
    playPop();
    const nextIdx = (currentIndex + 1) % items.length;
    setCurrentIndex(nextIdx);
  };

  const handlePrevItem = () => {
    playPop();
    const prevIdx = (currentIndex - 1 + items.length) % items.length;
    setCurrentIndex(prevIdx);
  };

  const selectItem = (idx: number) => {
    playPop();
    setCurrentIndex(idx);
  };

  return (
    <div id="playing_board_main" className="flex flex-col items-center w-full max-w-5xl mx-auto p-4 sm:p-6 bg-white border-4 border-kid-green-mint rounded-[32px] shadow-sm overflow-hidden">
      
      {/* Category selector */}
      <div id="filter_buttons" className="flex gap-4 mb-6">
        <button
          id="btn_filter_letters"
          onClick={() => {
            playPop();
            setFilterType('letter');
            setCurrentIndex(0);
          }}
          className={`px-8 py-3 rounded-full text-lg font-black transition-all transform hover:scale-102 active:scale-98 shadow-sm cursor-pointer ${
            filterType === 'letter'
              ? 'bg-kid-red text-white border-2 border-kid-red-dark shadow-[0_4px_0_#EE8E8E]'
              : 'bg-white text-kid-dark border-3 border-kid-green-mint hover:bg-kid-green-light/20'
          }`}
        >
          🔤 Magic Letters
        </button>
        <button
          id="btn_filter_numbers"
          onClick={() => {
            playPop();
            setFilterType('number');
            setCurrentIndex(0);
          }}
          className={`px-8 py-3 rounded-full text-lg font-black transition-all transform hover:scale-102 active:scale-98 shadow-sm cursor-pointer ${
            filterType === 'number'
              ? 'bg-kid-peach text-white border-2 border-kid-peach-dark shadow-[0_4px_0_#E9C08B]'
              : 'bg-white text-kid-dark border-3 border-kid-green-mint hover:bg-kid-green-light/20'
          }`}
        >
          🔢 Bouncy Numbers
        </button>
      </div>

      {/* Bubble Carousel of Characters */}
      <div id="item_carousel_container" className="w-full relative mb-6">
        <div id="item_scroll" className="flex gap-3 overflow-x-auto py-3 px-4 scrollbar-thin justify-start sm:justify-center items-center">
          {items.map((it, idx) => {
            const isSelected = idx === currentIndex;
            return (
              <button
                id={`carousel_btn_${it.id}`}
                key={it.id}
                onClick={() => selectItem(idx)}
                className={`flex-shrink-0 w-14 h-14 rounded-full font-black text-2xl flex items-center justify-center transition-all transform border-2 cursor-pointer ${
                  isSelected
                    ? 'bg-kid-peach text-white border-kid-peach-dark scale-110 shadow-[0_4px_0_#E9C08B]'
                    : 'bg-white text-kid-dark border-3 border-kid-green-mint/30 hover:bg-kid-cream'
                }`}
              >
                {it.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Workspace Sandbox Row: Controls (L) + Board (Mid/R) */}
      <div id="workspace_sandbox_grid" className="w-full grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
        
        {/* Magic Brush Selectors */}
        <div id="brush_controls_card" className="md:col-span-3 flex md:flex-col justify-around md:justify-center gap-4 bg-white p-5 rounded-[24px] border-3 border-kid-green-mint shadow-inner">
          <div className="text-kid-sub font-black text-center text-xs hidden md:block uppercase tracking-wider mb-2">
            🎨 Magic Brushes
          </div>
          
          <button
            id="btn_brush_rainbow"
            onClick={() => { playPop(); setBrushType('rainbow'); }}
            className={`flex items-center gap-2 py-3.5 px-4 rounded-2xl font-black transition-all border text-sm w-full justify-center cursor-pointer ${
              brushType === 'rainbow'
                ? 'bg-gradient-to-r from-kid-red via-kid-yellow to-kid-blue text-white border-transparent scale-102 shadow-[0_4px_0_#98C4E6]'
                : 'bg-white text-kid-dark border-3 border-kid-green-mint/50 hover:bg-slate-50'
            }`}
          >
            📊 Rainbow Trace
          </button>

          <button
            id="btn_brush_sparkle"
            onClick={() => { playPop(); setBrushType('sparkle'); }}
            className={`flex items-center gap-2 py-3.5 px-4 rounded-2xl font-black transition-all border text-sm w-full justify-center cursor-pointer ${
              brushType === 'sparkle'
                ? 'bg-kid-yellow text-kid-dark border-2 border-amber-400 scale-102 shadow-[0_4px_0_#D9B346]'
                : 'bg-white text-kid-dark border-3 border-kid-green-mint/50 hover:bg-slate-50'
            }`}
          >
            ✨ Sparkle Stars
          </button>

          <button
            id="btn_brush_bubble"
            onClick={() => { playPop(); setBrushType('bubble'); }}
            className={`flex items-center gap-2 py-3.5 px-4 rounded-2xl font-black transition-all border text-sm w-full justify-center cursor-pointer ${
              brushType === 'bubble'
                ? 'bg-kid-blue text-white border-2 border-blue-400 scale-102 shadow-[0_4px_0_#89B3FE]'
                : 'bg-white text-kid-dark border-3 border-kid-green-mint/50 hover:bg-slate-50'
            }`}
          >
            🎈 Bubble Pop
          </button>
        </div>

        {/* Tracing Stage Panel */}
        <div id="tracing_canvas_container" className="md:col-span-6 flex flex-col items-center justify-center">
          <div className="relative w-full max-w-[400px] aspect-square bg-white rounded-[32px] border-4 border-kid-peach shadow-[0_6px_0_#E9C08B] flex items-center justify-center overflow-hidden">
            
            {/* Guide letter SVG behind canvas */}
            <svg
              viewBox="0 0 100 100"
              className="absolute inset-0 w-full h-full pointer-events-none select-none p-4 opacity-15 animate-pulse"
            >
              <path
                d={currentItem.svgPath}
                fill="none"
                stroke="#666"
                strokeWidth="15"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="4,6"
              />
            </svg>

            {/* Glowing guideline for user tracing */}
            <svg
              viewBox="0 0 100 100"
              className="absolute inset-0 w-full h-full pointer-events-none select-none p-4"
            >
              <path
                d={currentItem.svgPath}
                fill="none"
                stroke="#F2EFE9"
                strokeWidth="11"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            {/* Main Interactive Drawing Canvas */}
            <canvas
              id="tracing-drawing-canvas"
              ref={canvasRef}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              className="absolute inset-0 w-full h-full cursor-crosshair z-10 touch-none"
            />

            {/* Interactive Particle Layer Drawing (Optional HTML Sparkles overlay for absolute magic!) */}
            <div className="absolute inset-0 pointer-events-none z-20">
              {particles.map((p, i) => (
                <div
                  key={i}
                  className="absolute rounded-full"
                  style={{
                    left: `${(p.x / 400) * 100}%`,
                    top: `${(p.y / 400) * 100}%`,
                    width: `${p.size}px`,
                    height: `${p.size}px`,
                    backgroundColor: p.color,
                    opacity: p.alpha,
                    transform: 'translate(-50%, -50%)',
                    clipPath: p.shape === 'star' ? 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)' : undefined
                  }}
                />
              ))}
            </div>

            {/* Checkpoint Star Targets */}
            {currentItem.checkpoints.map((cp, idx) => {
              const isCollected = collectedCheckpoints.includes(idx);
              const isNext = collectedCheckpoints.length === idx;
              
              return (
                <button
                  id={`checkpoint_${idx}`}
                  key={idx}
                  className="absolute pointer-events-none select-none z-30 transition-all duration-300 transform -translate-x-1/2 -translate-y-1/2 cursor-default"
                  style={{
                    left: `${cp.x}%`,
                    top: `${cp.y}%`,
                  }}
                >
                  <motion.div
                    animate={{
                      scale: isCollected ? [1, 1.3, 1] : isNext ? [1, 1.2, 1] : 1,
                      rotate: isCollected ? 360 : 0
                    }}
                    transition={{
                      repeat: isNext ? Infinity : 0,
                      duration: isNext ? 1.5 : 0.4
                    }}
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm shadow-md border-3 ${
                      isCollected
                        ? 'bg-kid-green-dark text-white border-kid-green-mint scale-105'
                        : isNext
                          ? 'bg-kid-yellow text-kid-dark border-amber-400 animate-pulse ring-4 ring-orange-100'
                          : 'bg-white text-kid-sub border-kid-green-mint/30'
                    }`}
                  >
                    {isCollected ? '★' : cp.label}
                  </motion.div>
                </button>
              );
            })}

            {/* Bouncy Cartoon Mascot Overlay on Successful Trace */}
            <AnimatePresence>
              {isCompleted && (
                <motion.div
                  id="completion_mascot_overlay"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="absolute inset-0 bg-white/95 z-40 flex flex-col items-center justify-center p-6 text-center"
                >
                  <motion.div
                    animate={{ y: [0, -15, 0] }}
                    transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
                    className="text-8xl mb-4 select-none"
                  >
                    {currentItem.emoji}
                  </motion.div>
                  <motion.h3 
                     initial={{ scale: 0.8 }}
                     animate={{ scale: [1, 1.1, 1] }}
                     className="text-3xl font-black text-kid-dark tracking-tight"
                  >
                    {currentItem.word ? `${currentItem.label} is for ${currentItem.word}!` : `Super Tracing!`}
                  </motion.h3>
                  <p className="text-kid-sub mt-2 font-bold">Amazing job, tracing hero! You collected {currentItem.checkpoints.length} stars!</p>

                  <div className="flex gap-4 mt-6">
                    <button
                      id="btn_finish_clear"
                      onClick={() => { playPop(); resetCanvas(); }}
                      className="px-6 py-3 bg-white hover:bg-stone-50 text-kid-dark font-black rounded-full transition-all border-3 border-kid-green-mint text-sm flex items-center gap-2 cursor-pointer"
                    >
                      <RefreshCw size={16} /> Draw Again
                    </button>
                    <button
                      id="btn_finish_next"
                      onClick={() => {
                        handleNextItem();
                      }}
                      className="px-8 py-3 bg-kid-red hover:bg-kid-red-dark text-white font-black rounded-full transition-all flex items-center gap-2 text-sm shadow-[0_4px_0_#EE8E8E] cursor-pointer"
                    >
                      Next <ArrowRight size={16} strokeWidth={3} />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </div>

        {/* Fun Info Action Card (R) */}
        <div id="item_detail_card" className="md:col-span-3 flex flex-col items-center justify-between bg-white p-6 rounded-[24px] border-3 border-kid-peach shadow-sm text-center">
          <div className="flex flex-col items-center w-full">
            <div className="text-7xl mb-3 select-none filter drop-shadow-md animate-bounce duration-1000">
              {currentItem.emoji}
            </div>
            <h2 className="text-4xl font-black text-kid-dark tracking-tight">
              {currentItem.label}
            </h2>
            {currentItem.word && (
              <p className="text-xl font-black text-kid-peach-dark mt-1 uppercase tracking-wider">
                {currentItem.word}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2.5 mt-6 w-full">
            <button
              id="speaker_btn"
              onClick={() => { playPop(); speakItem(currentItem); }}
              className="w-full py-3 px-4 bg-white hover:bg-slate-50 text-kid-dark font-bold rounded-2xl text-xs flex items-center justify-center gap-2 transition-all border-3 border-kid-green-mint cursor-pointer"
            >
              <Volume2 size={16} className="text-kid-green-dark" /> Hear Voice
            </button>
            <button
              id="clear_drawings_btn"
              onClick={() => { playChime(); resetCanvas(); }}
              className="w-full py-3 px-4 bg-white hover:bg-slate-50 text-kid-dark font-bold rounded-2xl text-xs flex items-center justify-center gap-2 transition-all border-3 border-kid-green-mint/30 cursor-pointer"
            >
              <RefreshCw size={16} className="text-kid-sub" /> Clean Crayon
            </button>
          </div>

          {/* Quick instructions */}
          <div className="mt-6 p-4 bg-kid-cream/70 rounded-2xl border-2 border-dashed border-kid-peach text-center w-full">
            <p className="text-[11px] font-black text-kid-dark leading-relaxed uppercase tracking-wider">
              👉 START on Star <span className="font-extrabold text-kid-red-dark">1</span> and glide!
            </p>
          </div>
        </div>
      </div>

      {/* Navigation footer */}
      <div id="tracing_footer" className="w-full flex justify-between items-center mt-8 p-3 bg-white rounded-2xl border-3 border-kid-green-mint">
        <button
          id="btn_prev_item"
          onClick={handlePrevItem}
          className="px-6 py-2.5 bg-white text-kid-dark font-black rounded-full border-3 border-kid-green-mint hover:bg-slate-50 text-xs sm:text-sm cursor-pointer"
        >
          ⬅️ Previous Character
        </button>
        <div className="flex items-center gap-1.5 text-xs text-kid-sub font-black uppercase">
          <Award className="text-kid-peach" size={18} /> Collected Stars: {collectedCheckpoints.length} / {currentItem.checkpoints.length}
        </div>
        <button
          id="btn_next_item"
          onClick={handleNextItem}
          className="px-6 py-2.5 bg-white text-kid-dark font-black rounded-full border-3 border-kid-green-mint hover:bg-slate-50 text-xs sm:text-sm cursor-pointer"
        >
          Next Character ➡️
        </button>
      </div>

    </div>
  );
}
