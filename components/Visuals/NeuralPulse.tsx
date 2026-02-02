import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';

const NeuralPulse: React.FC<{ message?: string }> = ({ message }) => {
  const { colors } = useTheme();

  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="relative w-64 h-64">
        {/* Central Pulse */}
        <motion.div
          className="absolute inset-0 rounded-full opacity-50"
          style={{ background: colors.accent }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.3, 0.1, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        {/* Orbital Rings representing Neural Pathways */}
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute inset-0 border-2 rounded-full"
            style={{ 
                borderColor: colors.accent,
                borderTopColor: 'transparent',
                borderBottomColor: 'transparent'
            }}
            animate={{ rotate: 360 }}
            transition={{
              duration: 3 - i * 0.5,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}

        {/* Synapse Firing */}
        <motion.div
             className="absolute top-1/2 left-1/2 w-4 h-4 -ml-2 -mt-2 rounded-full bg-white shadow-[0_0_20px_white]"
             animate={{
                 scale: [1, 1.2, 1],
                 opacity: [0.8, 1, 0.8]
             }}
             transition={{ duration: 0.2, repeat: Infinity }}
        />
      </div>
      
      <motion.p 
        className="mt-8 text-xl font-light tracking-widest text-white uppercase"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        {message || "Agent Thinking..."}
      </motion.p>
    </div>
  );
};

export default NeuralPulse;