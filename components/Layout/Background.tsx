import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

const Background: React.FC = () => {
  const { colors, currentTheme } = useTheme();

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden transition-colors duration-1000"
         style={{ background: `linear-gradient(135deg, ${colors.backgroundStart} 0%, ${colors.backgroundEnd} 100%)` }}>
      
      <AnimatePresence mode="wait">
        <motion.div
          key={currentTheme}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0"
        >
           {/* Abstract Orbs / Painterly Strokes */}
           <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] rounded-full blur-[100px] opacity-40 mix-blend-screen"
                style={{ background: `radial-gradient(circle, ${colors.accent} 0%, transparent 70%)` }} />
           
           <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full blur-[80px] opacity-30 mix-blend-overlay"
                style={{ background: `radial-gradient(circle, ${colors.node} 0%, transparent 70%)` }} />

           {/* Theme Specific Textures */}
           {currentTheme === 'VanGogh' && (
             <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none">
               <filter id="swirl">
                 <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="3" result="noise" />
                 <feDisplacementMap in="SourceGraphic" in2="noise" scale="20" />
               </filter>
               <rect width="100%" height="100%" filter="url(#swirl)" fill="transparent" />
             </svg>
           )}

           {currentTheme === 'Dali' && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-20"
                   style={{ background: 'radial-gradient(ellipse at center, transparent 0%, rgba(67, 40, 24, 0.8) 100%)' }} />
           )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Background;