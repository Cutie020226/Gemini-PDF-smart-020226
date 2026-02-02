import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { DocumentData } from '../types';
import { extractTextFromPDF } from '../services/pdfService';
import { analyzeDocumentStructure, analyzeDocumentRisks, synthesizeDocuments } from '../services/geminiService';

interface AppContextType {
  documents: DocumentData[];
  isProcessing: boolean;
  synthesisResult: string | null;
  processingStage: string;
  addDocument: (file: File) => Promise<void>;
  runSynthesis: () => Promise<void>;
  removeDocument: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [documents, setDocuments] = useState<DocumentData[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState('');
  const [synthesisResult, setSynthesisResult] = useState<string | null>(null);

  const addDocument = useCallback(async (file: File) => {
    setIsProcessing(true);
    setProcessingStage('Extracting Text...');
    try {
      // 1. Extract Text
      const text = await extractTextFromPDF(file);
      
      setProcessingStage('The Architect is analyzing structure...');
      // 2. Architect Agent
      const structure = await analyzeDocumentStructure(text);
      
      setProcessingStage('The Critic is assessing risks...');
      // 3. Critic Agent
      const risks = await analyzeDocumentRisks(text);

      const newDoc: DocumentData = {
        id: crypto.randomUUID(),
        name: file.name,
        text,
        summary: structure.summary,
        keywords: structure.keywords || [],
        risks,
        analysisDate: Date.now(),
      };

      setDocuments(prev => [...prev, newDoc]);
    } catch (error) {
      console.error(error);
      alert("Failed to process document");
    } finally {
      setIsProcessing(false);
      setProcessingStage('');
    }
  }, []);

  const runSynthesis = useCallback(async () => {
    if (documents.length === 0) return;
    setIsProcessing(true);
    setProcessingStage('Synthesizing Meta-Analysis...');
    
    try {
      const summaries = documents.map(d => `Document: ${d.name}\nSummary: ${d.summary}\nCritic's Risks: ${d.risks}`);
      const result = await synthesizeDocuments(summaries);
      setSynthesisResult(result || "No result generated.");
    } catch (error) {
      console.error(error);
      setSynthesisResult("Error during synthesis.");
    } finally {
      setIsProcessing(false);
      setProcessingStage('');
    }
  }, [documents]);

  const removeDocument = (id: string) => {
    setDocuments(prev => prev.filter(d => d.id !== id));
  };

  return (
    <AppContext.Provider value={{ documents, isProcessing, processingStage, synthesisResult, addDocument, runSynthesis, removeDocument }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};