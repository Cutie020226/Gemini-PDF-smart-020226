import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';

interface HolographicCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const HolographicCard: React.FC<HolographicCardProps> = ({ children, className, onClick }) => {
  const { colors } = useTheme();
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();

    const width = rect.width;
    const height = rect.height;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className={`relative rounded-xl p-[1px] cursor-pointer ${className}`}
    >
        {/* Border Gradient wrapper */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/20 to-transparent opacity-50 pointer-events-none" />
        
        {/* Main Content */}
        <div 
            className="relative h-full w-full rounded-xl backdrop-blur-md p-6 border border-white/10 shadow-2xl transition-colors duration-300"
            style={{ 
                backgroundColor: colors.card,
                transform: "translateZ(20px)"
            }}
        >
            {children}
            
            {/* Shiny reflection effect */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />
        </div>
    </motion.div>
  );
};

export default HolographicCard;