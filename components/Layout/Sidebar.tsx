import React from 'react';
import ReactMarkdown from 'react-markdown';
import { useApp } from '../../contexts/AppContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Bot, Sparkles, AlertTriangle, FileText } from 'lucide-react';

const Sidebar: React.FC = () => {
  const { documents, synthesisResult, runSynthesis } = useApp();
  const { colors } = useTheme();

  return (
    <div className="h-full flex flex-col border-l border-white/10 backdrop-blur-xl transition-colors duration-300"
         style={{ backgroundColor: colors.glass, color: colors.text }}>
      
      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <h2 className="text-2xl font-serif mb-1 flex items-center gap-2">
            <Bot size={24} color={colors.accent} />
            Agentic Insights
        </h2>
        <p className="text-xs opacity-70">
            {documents.length} Documents Analyzed
        </p>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
        
        {/* Synthesis Button */}
        {documents.length > 1 && !synthesisResult && (
            <div className="p-6 rounded-xl border border-white/10 bg-white/5 text-center">
                <p className="mb-4 text-sm opacity-80">Multiple documents detected.</p>
                <button 
                    onClick={runSynthesis}
                    className="px-6 py-2 rounded-full font-medium transition-all hover:scale-105 active:scale-95 flex items-center gap-2 mx-auto"
                    style={{ backgroundColor: colors.accent, color: '#000' }}
                >
                    <Sparkles size={16} />
                    Synthesize Knowledge
                </button>
            </div>
        )}

        {/* Synthesis Result */}
        {synthesisResult && (
            <div className="animate-fade-in-up">
                <div className="flex items-center gap-2 mb-4">
                    <Sparkles size={18} color={colors.accent} />
                    <h3 className="font-semibold text-lg">Meta-Analysis</h3>
                </div>
                <div className="prose prose-invert prose-sm max-w-none">
                    <ReactMarkdown>{synthesisResult}</ReactMarkdown>
                </div>
            </div>
        )}

        {/* Document Cards (Mini) */}
        {documents.map((doc) => (
            <div key={doc.id} className="p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-2 mb-2">
                    <FileText size={16} className="opacity-70" />
                    <h4 className="font-medium truncate">{doc.name}</h4>
                </div>
                
                {/* Summary */}
                <div className="mb-4 text-sm opacity-80 leading-relaxed">
                    {doc.summary}
                </div>

                {/* Risks */}
                {doc.risks && (
                    <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-xs">
                        <div className="flex items-center gap-2 mb-1 text-red-300 font-semibold">
                            <AlertTriangle size={12} />
                            <span>Critic's Report</span>
                        </div>
                        <div className="prose prose-invert prose-xs max-w-none text-red-100/80">
                             <ReactMarkdown>{doc.risks}</ReactMarkdown>
                        </div>
                    </div>
                )}
            </div>
        ))}
        
        {documents.length === 0 && (
            <div className="text-center opacity-50 mt-10">
                <p>Upload a PDF to begin analysis.</p>
            </div>
        )}

      </div>
    </div>
  );
};

export default Sidebar;