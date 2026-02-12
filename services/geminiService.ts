import { GoogleGenAI, Type } from "@google/genai";
import { AgentProfile } from '../types';

// Helper to check key
const validateKey = (key: string) => {
  if (!key) throw new Error("API Key missing. Please provide a valid Gemini API Key.");
  return key;
};

export const runAgentAnalysis = async (apiKey: string, text: string, agent: AgentProfile) => {
  const validKey = validateKey(apiKey);
  // Create instance right before call with latest key
  const ai = new GoogleGenAI({ apiKey: validKey });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `
        TEXT TO ANALYZE:
        ${text.substring(0, 30000)} ... [Truncated]

        INSTRUCTIONS:
        ${agent.systemInstruction}
        
        Provide the output in standard Markdown format.
      `,
      config: {
          // If the agent is "Architect" (vis_1 equivalent logic), we might want JSON, 
          // but for general agent flexibility, we stick to Markdown unless specified.
          // For this specific app, we treat the 'Default Architect' logic separately in the context.
          // This function is for the 31 custom agents.
      }
    });

    return response.text;
  } catch (error) {
    console.error(`Agent ${agent.name} Error:`, error);
    return `Agent failed to analyze: ${(error as Error).message}`;
  }
};

export const analyzeDocumentStructure = async (apiKey: string, text: string) => {
  const validKey = validateKey(apiKey);
  const ai = new GoogleGenAI({ apiKey: validKey });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `
        ${text.substring(0, 30000)} ... [Truncated for efficiency if too long]
        
        You are 'The Architect'. 
        Analyze the text above. 
        Extract a brief summary (max 30 words), and 5-7 distinct, high-level keywords/concepts.
        
        Return JSON.
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            keywords: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          }
        }
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Architect Error:", error);
    return { summary: "Analysis failed.", keywords: [] };
  }
};

export const analyzeDocumentRisks = async (apiKey: string, text: string) => {
  const validKey = validateKey(apiKey);
  const ai = new GoogleGenAI({ apiKey: validKey });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `
        ${text.substring(0, 30000)}
        
        You are 'The Critic'.
        Identify top 3 critical risks, missing information, or logical flaws in this text.
        Return a short Markdown string.
      `,
    });
    return response.text;
  } catch (error) {
    console.error("Critic Error:", error);
    return "Could not generate critique.";
  }
};

export const synthesizeDocuments = async (apiKey: string, summaries: string[]) => {
  const validKey = validateKey(apiKey);
  const ai = new GoogleGenAI({ apiKey: validKey });

  try {
    const joined = summaries.join("\n\n---\n\n");
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview', // Using Pro for reasoning
      contents: `
        Here are summaries of several documents:
        
        ${joined}
        
        Synthesize a cohesive "Executive Briefing" connecting these documents. 
        Identify common themes and contradictions.
        Format with clear Markdown headers.
      `,
    });
    return response.text;
  } catch (error) {
    console.error("Synthesis Error:", error);
    return "Synthesis failed.";
  }
};