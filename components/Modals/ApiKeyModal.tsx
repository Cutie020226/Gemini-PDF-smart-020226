import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Key } from 'lucide-react';
import { motion } from 'framer-motion';

const ApiKeyModal: React.FC = () => {
  const { setApiKey, isKeyRequired } = useApp();
  const { colors } = useTheme();
  const [inputKey, setInputKey] = useState('');

  if (!isKeyRequired) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputKey.trim().length > 10) {
      setApiKey(inputKey.trim());
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-md rounded-2xl p-8 shadow-2xl border border-white/10"
        style={{ backgroundColor: colors.backgroundStart }}
      >
        <div className="flex flex-col items-center text-center mb-6">
            <div className="p-4 rounded-full bg-white/10 mb-4">
                <Key size={32} color={colors.accent} />
            </div>
            <h2 className="text-2xl font-serif font-bold text-white mb-2">Access Lumina</h2>
            <p className="text-white/60 text-sm">
                A valid Gemini API Key is required to power the agents.
                This key is stored locally in memory only.
            </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
            <input 
                type="password"
                placeholder="Enter Gemini API Key"
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value)}
                className="w-full bg-black/20 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
            />
            <button 
                type="submit"
                disabled={inputKey.length < 10}
                className="w-full py-3 rounded-lg font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: colors.accent, color: '#000' }}
            >
                Enter Workspace
            </button>
        </form>
        <div className="mt-4 text-center">
             <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-xs hover:underline text-white/50">
                 Get a key from Google AI Studio
             </a>
        </div>
      </motion.div>
    </div>
  );
};

export default ApiKeyModal;