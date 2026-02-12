export interface DocumentData {
  id: string;
  name: string;
  text: string;
  summary?: string;
  keywords: string[];
  risks?: string;
  analysisDate: number;
  agentUsed?: string; // Name of the agent used
  rawAnalysis?: string; // The full output
  promptUsed?: string; // To keep track of the prompt
}

export type ThemeName = 'Monet' | 'VanGogh' | 'Dali' | 'Hokusai';

export interface ThemeColors {
  name: ThemeName;
  backgroundStart: string;
  backgroundEnd: string;
  accent: string;
  text: string;
  glass: string;
  card: string;
  node: string;
}

export interface Node {
  id: string;
  group: 'document' | 'keyword';
  radius?: number;
  x?: number;
  y?: number;
}

export interface Link {
  source: string | Node;
  target: string | Node;
  value: number;
}

export interface GraphData {
  nodes: Node[];
  links: Link[];
}

export interface AgentProfile {
  id: string;
  name: string;
  role: string;
  description: string;
  systemInstruction: string;
  category: 'Visualization' | 'Analysis' | 'Creative' | 'Critique' | 'Summary';
}
