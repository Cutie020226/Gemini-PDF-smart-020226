import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { useApp } from '../../contexts/AppContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Bot, Sparkles, AlertTriangle, FileText, ChevronDown, ChevronRight, Terminal } from 'lucide-react';

const Sidebar: React.FC = () => {
  const { documents, synthesisResult, runSynthesis, removeDocument } = useApp();
  const { colors } = useTheme();
  
  // State to track expanded documents
  const [expandedDocs, setExpandedDocs] = useState<Record<string, boolean>>({});

  const toggleDoc = (id: string) => {
    setExpandedDocs(prev => ({...prev, [id]: !prev[id]}));
  };

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
      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
        
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
            <div className="animate-fade-in-up p-4 rounded-xl border border-sky-500/30 bg-sky-900/10">
                <div className="flex items-center gap-2 mb-4 text-sky-400">
                    <Sparkles size={18} />
                    <h3 className="font-semibold text-lg">Meta-Analysis</h3>
                </div>
                <div className="prose prose-invert prose-sm max-w-none">
                    <ReactMarkdown>{synthesisResult}</ReactMarkdown>
                </div>
            </div>
        )}

        {/* Document Cards */}
        {documents.map((doc) => {
            const isExpanded = expandedDocs[doc.id] ?? true; // Default expanded
            return (
                <div key={doc.id} className="rounded-xl border border-white/10 bg-white/5 overflow-hidden transition-all">
                    {/* Card Header */}
                    <div 
                        onClick={() => toggleDoc(doc.id)}
                        className="p-4 flex items-center justify-between cursor-pointer hover:bg-white/5"
                    >
                        <div className="flex items-center gap-2 overflow-hidden">
                            <FileText size={16} className="opacity-70 flex-shrink-0" />
                            <h4 className="font-medium truncate text-sm">{doc.name}</h4>
                        </div>
                        <div className="flex items-center gap-2">
                             <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/10 opacity-70">
                                {doc.agentUsed}
                             </span>
                             {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                        </div>
                    </div>

                    {/* Card Content */}
                    {isExpanded && (
                        <div className="p-4 pt-0 border-t border-white/5">
                            {/* Summary / Default Output */}
                            <div className="mt-4 mb-4 text-sm opacity-80 leading-relaxed">
                                {doc.summary}
                            </div>

                            {/* Raw Analysis (Custom Agent Output) */}
                            {doc.rawAnalysis && (
                                <div className="mt-4 p-3 rounded-lg bg-black/20 border border-white/5">
                                    <div className="prose prose-invert prose-sm max-w-none">
                                        <ReactMarkdown>{doc.rawAnalysis}</ReactMarkdown>
                                    </div>
                                </div>
                            )}

                            {/* Critic Risks (Standard Flow) */}
                            {doc.risks && !doc.rawAnalysis && (
                                <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-xs">
                                    <div className="flex items-center gap-2 mb-1 text-red-300 font-semibold">
                                        <AlertTriangle size={12} />
                                        <span>Critic's Report</span>
                                    </div>
                                    <div className="prose prose-invert prose-xs max-w-none text-red-100/80">
                                         <ReactMarkdown>{doc.risks}</ReactMarkdown>
                                    </div>
                                </div>
                            )}

                            {/* Prompt Debug Info */}
                            {doc.promptUsed && (
                                <div className="mt-4 pt-4 border-t border-white/5">
                                    <details className="text-xs opacity-50 cursor-pointer">
                                        <summary className="flex items-center gap-1 hover:text-sky-400 mb-2">
                                            <Terminal size={10} />
                                            System Instruction / Prompt
                                        </summary>
                                        <pre className="whitespace-pre-wrap font-mono bg-black/40 p-2 rounded">
                                            {doc.promptUsed}
                                        </pre>
                                    </details>
                                </div>
                            )}

                            <div className="mt-4 text-right">
                                <button 
                                    onClick={(e) => { e.stopPropagation(); removeDocument(doc.id); }}
                                    className="text-xs text-red-400 hover:text-red-300 hover:underline"
                                >
                                    Remove Document
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            );
        })}
        
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