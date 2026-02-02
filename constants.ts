import { ThemeColors } from './types';

export const THEMES: Record<string, ThemeColors> = {
  Monet: {
    name: 'Monet',
    backgroundStart: '#0f172a', // Slate 900
    backgroundEnd: '#1e293b',   // Slate 800
    accent: '#38bdf8',          // Sky 400
    text: '#f8fafc',
    glass: 'rgba(30, 41, 59, 0.4)',
    card: 'rgba(56, 189, 248, 0.15)',
    node: '#f472b6',            // Pink 400
  },
  VanGogh: {
    name: 'VanGogh',
    backgroundStart: '#0a0a2a', // Deep Blue
    backgroundEnd: '#1a1a4a',   // Lighter Blue swirl
    accent: '#fbbf24',          // Amber 400
    text: '#fffbeb',
    glass: 'rgba(10, 10, 42, 0.4)',
    card: 'rgba(251, 191, 36, 0.15)',
    node: '#fbbf24',
  },
  Dali: {
    name: 'Dali',
    backgroundStart: '#271c19', // Warm Dark Brown
    backgroundEnd: '#432818',   // Orange Brown
    accent: '#fb923c',          // Orange 400
    text: '#fff7ed',
    glass: 'rgba(67, 40, 24, 0.4)',
    card: 'rgba(251, 146, 60, 0.15)',
    node: '#a8a29e',
  },
  Hokusai: {
    name: 'Hokusai',
    backgroundStart: '#0c4a6e', // Sky 900
    backgroundEnd: '#f0f9ff',   // Sky 50 (Foam) - Gradient will handle this carefully
    accent: '#0ea5e9',          // Sky 500
    text: '#f0f9ff',
    glass: 'rgba(12, 74, 110, 0.4)',
    card: 'rgba(14, 165, 233, 0.15)',
    node: '#e0f2fe',
  }
};

export const SAMPLE_PROMPTS = {
  architect: `
    You are 'The Architect', an AI specialized in structural analysis of documents.
    Analyze the provided text.
    Return a JSON object with the following structure (do not use Markdown code blocks, just raw JSON):
    {
      "summary": "A concise 2-sentence summary of the document.",
      "keywords": ["5", "most", "important", "conceptual", "keywords"],
      "structure": "A brief outline of the main sections detected."
    }
  `,
  critic: `
    You are 'The Critic', an AI specialized in risk assessment and critical thinking.
    Review the provided text summary and structure.
    Identify 3 potential risks, logical gaps, or areas requiring further investigation.
    Format the output as a clean Markdown list.
    Be concise but insightful.
  `,
  synthesis: `
    You are the Lumina Synthesis Agent.
    Read the provided summaries of multiple documents.
    Synthesize a meta-summary connecting the ideas.
    Highlight how these documents relate to each other.
    Format as a rich Markdown report with headers.
  `
};