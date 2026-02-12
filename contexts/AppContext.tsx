import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { DocumentData, AgentProfile } from '../types';
import { extractTextFromPages, getPageCount, renderPageToDataURL } from '../services/pdfService';
import { analyzeDocumentStructure, analyzeDocumentRisks, synthesizeDocuments, runAgentAnalysis } from '../services/geminiService';
import { AGENTS } from '../agents';

interface AppContextType {
  documents: DocumentData[];
  isProcessing: boolean;
  synthesisResult: string | null;
  processingStage: string;
  
  // Auth
  apiKey: string;
  setApiKey: (key: string) => void;
  isKeyRequired: boolean;

  // Staging
  stagedFile: File | null;
  stagedFilePageCount: number;
  stageDocument: (file: File) => Promise<void>;
  clearStagedDocument: () => void;
  
  // Processing
  processStagedDocument: (pages: number[], agent: AgentProfile | null, keepPrompt: boolean) => Promise<void>;
  
  runSynthesis: () => Promise<void>;
  removeDocument: (id: string) => void;
  
  // Helpers
  getThumbnail: (page: number) => Promise<string>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [apiKey, setApiKey] = useState<string>(process.env.API_KEY || '');
  const [documents, setDocuments] = useState<DocumentData[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState('');
  const [synthesisResult, setSynthesisResult] = useState<string | null>(null);

  // Staging state
  const [stagedFile, setStagedFile] = useState<File | null>(null);
  const [stagedFilePageCount, setStagedFilePageCount] = useState(0);

  const isKeyRequired = !process.env.API_KEY && !apiKey;

  const stageDocument = useCallback(async (file: File) => {
      try {
          const count = await getPageCount(file);
          setStagedFile(file);
          setStagedFilePageCount(count);
      } catch (e) {
          console.error(e);
          alert("Failed to read PDF structure. Is it a valid PDF?");
      }
  }, []);

  const clearStagedDocument = useCallback(() => {
      setStagedFile(null);
      setStagedFilePageCount(0);
  }, []);

  const getThumbnail = useCallback(async (page: number) => {
      if (!stagedFile) return '';
      return await renderPageToDataURL(stagedFile, page);
  }, [stagedFile]);

  const processStagedDocument = useCallback(async (pages: number[], agent: AgentProfile | null, keepPrompt: boolean) => {
    if (!stagedFile) return;

    setIsProcessing(true);
    setProcessingStage('Extracting Text from Selected Pages...');
    try {
      // 1. Extract Text
      const text = await extractTextFromPages(stagedFile, pages);
      
      let structure = { summary: '', keywords: [] as string[] };
      let risks = '';
      let rawAnalysis = '';
      let agentUsed = 'Default (Architect + Critic)';
      let promptUsed = '';

      if (agent) {
          // Use Custom Agent
          setProcessingStage(`${agent.name} is working...`);
          agentUsed = agent.name;
          promptUsed = agent.systemInstruction;
          rawAnalysis = await runAgentAnalysis(apiKey, text, agent);
          
          // Also get basic structure for the graph using Architect lightly or regex
          // For simplicity, we still run Architect for graph nodes, but the main view shows Agent output
          const basicStruct = await analyzeDocumentStructure(apiKey, text);
          structure = basicStruct;
          structure.summary = `Processed by ${agent.name}`; // Override summary for card
      } else {
          // Default Flow
          setProcessingStage('The Architect is analyzing structure...');
          structure = await analyzeDocumentStructure(apiKey, text);
          
          setProcessingStage('The Critic is assessing risks...');
          risks = await analyzeDocumentRisks(apiKey, text);
          promptUsed = "Default Architect & Critic Prompts";
      }

      const newDoc: DocumentData = {
        id: crypto.randomUUID(),
        name: stagedFile.name,
        text,
        summary: structure.summary,
        keywords: structure.keywords || [],
        risks,
        rawAnalysis,
        agentUsed,
        promptUsed: keepPrompt ? promptUsed : undefined,
        analysisDate: Date.now(),
      };

      setDocuments(prev => [...prev, newDoc]);
      clearStagedDocument();
    } catch (error) {
      console.error(error);
      alert("Failed to process document: " + (error as Error).message);
    } finally {
      setIsProcessing(false);
      setProcessingStage('');
    }
  }, [stagedFile, apiKey, clearStagedDocument]);

  const runSynthesis = useCallback(async () => {
    if (documents.length === 0) return;
    setIsProcessing(true);
    setProcessingStage('Synthesizing Meta-Analysis...');
    
    try {
      const summaries = documents.map(d => `Document: ${d.name}\nSummary: ${d.summary}\nSpecific Analysis (${d.agentUsed}): ${d.rawAnalysis || d.risks}`);
      const result = await synthesizeDocuments(apiKey, summaries);
      setSynthesisResult(result || "No result generated.");
    } catch (error) {
      console.error(error);
      setSynthesisResult("Error during synthesis.");
    } finally {
      setIsProcessing(false);
      setProcessingStage('');
    }
  }, [documents, apiKey]);

  const removeDocument = (id: string) => {
    setDocuments(prev => prev.filter(d => d.id !== id));
  };

  return (
    <AppContext.Provider value={{ 
        documents, isProcessing, processingStage, synthesisResult, 
        apiKey, setApiKey, isKeyRequired,
        stagedFile, stagedFilePageCount, stageDocument, clearStagedDocument, processStagedDocument,
        runSynthesis, removeDocument, getThumbnail 
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};