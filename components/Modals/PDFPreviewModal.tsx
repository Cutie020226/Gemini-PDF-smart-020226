import React, { useState, useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import { useTheme } from '../../contexts/ThemeContext';
import { motion } from 'framer-motion';
import { X, Check, BrainCircuit } from 'lucide-react';
import { AGENTS } from '../../agents';
import { AgentProfile } from '../../types';

const PDFPreviewModal: React.FC = () => {
  const { stagedFile, stagedFilePageCount, clearStagedDocument, processStagedDocument, getThumbnail } = useApp();
  const { colors } = useTheme();
  
  const [selectedPages, setSelectedPages] = useState<number[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<AgentProfile | null>(null); // Null = Default
  const [keepPrompt, setKeepPrompt] = useState(false);
  const [thumbnails, setThumbnails] = useState<Record<number, string>>({});

  useEffect(() => {
    if (stagedFile) {
        // Select all by default
        setSelectedPages(Array.from({ length: stagedFilePageCount }, (_, i) => i + 1));
        
        // Load thumbnails lazily
        const loadThumbs = async () => {
            const thumbs: Record<number, string> = {};
            // Limit thumbnail generation to first 12 pages for performance in preview
            const limit = Math.min(stagedFilePageCount, 12);
            for (let i = 1; i <= limit; i++) {
                thumbs[i] = await getThumbnail(i);
            }
            setThumbnails(thumbs);
        };
        loadThumbs();
    }
  }, [stagedFile, stagedFilePageCount, getThumbnail]);

  if (!stagedFile) return null;

  const togglePage = (p: number) => {
      setSelectedPages(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]);
  };

  const handleProcess = () => {
      if (selectedPages.length === 0) return alert("Select at least one page.");
      processStagedDocument(selectedPages, selectedAgent, keepPrompt);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-6xl h-[90vh] rounded-2xl flex overflow-hidden shadow-2xl border border-white/10"
        style={{ backgroundColor: colors.backgroundStart }}
      >
        
        {/* Left: Page Selection */}
        <div className="flex-1 flex flex-col border-r border-white/10 p-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-serif text-white">Select Pages ({selectedPages.length})</h3>
                <div className="flex gap-2 text-sm">
                    <button onClick={() => setSelectedPages(Array.from({length: stagedFilePageCount}, (_, i) => i + 1))} className="px-3 py-1 rounded bg-white/10 hover:bg-white/20">All</button>
                    <button onClick={() => setSelectedPages([])} className="px-3 py-1 rounded bg-white/10 hover:bg-white/20">None</button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-2">
                {Array.from({ length: stagedFilePageCount }, (_, i) => i + 1).map(pageNum => (
                    <div 
                        key={pageNum}
                        onClick={() => togglePage(pageNum)}
                        className={`relative aspect-[3/4] rounded-lg cursor-pointer border-2 transition-all group ${selectedPages.includes(pageNum) ? 'border-sky-500 shadow-[0_0_15px_rgba(14,165,233,0.3)]' : 'border-white/10 opacity-60 hover:opacity-100'}`}
                    >
                        {thumbnails[pageNum] ? (
                            <img src={thumbnails[pageNum]} alt={`Page ${pageNum}`} className="w-full h-full object-cover rounded-md" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-white/5">
                                <span className="text-white/30">Page {pageNum}</span>
                            </div>
                        )}
                        
                        {/* Checkbox Overlay */}
                        <div className={`absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center transition-colors ${selectedPages.includes(pageNum) ? 'bg-sky-500' : 'bg-black/50'}`}>
                            {selectedPages.includes(pageNum) && <Check size={14} color="white" />}
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Right: Agent Config */}
        <div className="w-96 flex flex-col bg-black/20 p-6">
            <div className="flex justify-between items-start mb-6">
                <h3 className="text-xl font-serif text-white">Analysis Config</h3>
                <button onClick={clearStagedDocument} className="p-1 rounded-full hover:bg-white/10"><X size={20} className="text-white/70" /></button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
                
                {/* Agent Selection */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-white/70 mb-2">Select Agent</label>
                    <select 
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                        onChange={(e) => {
                            const agent = AGENTS.find(a => a.id === e.target.value);
                            setSelectedAgent(agent || null);
                        }}
                        value={selectedAgent?.id || ''}
                    >
                        <option value="">Default (Architect + Critic)</option>
                        {['Visualization', 'Analysis', 'Critique', 'Creative', 'Summary'].map(cat => (
                            <optgroup key={cat} label={cat}>
                                {AGENTS.filter(a => a.category === cat).map(a => (
                                    <option key={a.id} value={a.id}>{a.name} ({a.role})</option>
                                ))}
                            </optgroup>
                        ))}
                    </select>

                    {/* Agent Description */}
                    <div className="mt-4 p-4 rounded-lg bg-white/5 border border-white/5 text-sm">
                        <div className="flex items-center gap-2 mb-2 text-sky-400">
                             <BrainCircuit size={16} />
                             <span className="font-semibold">{selectedAgent ? selectedAgent.name : 'Standard Protocol'}</span>
                        </div>
                        <p className="opacity-70 leading-relaxed">
                            {selectedAgent ? selectedAgent.description : 'Uses dual-agent processing: "The Architect" extracts structure and "The Critic" identifies risks.'}
                        </p>
                    </div>
                </div>

                {/* Options */}
                <div className="mb-6">
                     <label className="flex items-center gap-3 p-3 rounded-lg bg-white/5 cursor-pointer hover:bg-white/10 transition-colors">
                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${keepPrompt ? 'bg-sky-500 border-sky-500' : 'border-white/30'}`}>
                            {keepPrompt && <Check size={12} />}
                        </div>
                        <input type="checkbox" className="hidden" checked={keepPrompt} onChange={() => setKeepPrompt(!keepPrompt)} />
                        <span className="text-sm">Include Prompt in Results</span>
                     </label>
                </div>

            </div>

            {/* Action */}
            <button 
                onClick={handleProcess}
                disabled={selectedPages.length === 0}
                className="w-full py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-sky-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:grayscale"
                style={{ backgroundColor: colors.accent, color: '#000' }}
            >
                Start Analysis
            </button>
        </div>

      </motion.div>
    </div>
  );
};

export default PDFPreviewModal;