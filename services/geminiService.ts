import { GoogleGenAI, Type } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Helper to ensure we don't crash if no key (handle in UI)
const checkKey = () => {
  if (!apiKey) throw new Error("API Key missing");
};

export const analyzeDocumentStructure = async (text: string) => {
  checkKey();
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

export const analyzeDocumentRisks = async (text: string) => {
  checkKey();
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

export const synthesizeDocuments = async (summaries: string[]) => {
  checkKey();
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
      config: {
        // Optional: thinking config could be added here for even deeper analysis
        // thinkingConfig: { thinkingBudget: 1024 }
      }
    });
    return response.text;
  } catch (error) {
    console.error("Synthesis Error:", error);
    return "Synthesis failed.";
  }
};