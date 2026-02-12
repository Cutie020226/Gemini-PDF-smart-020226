import React from 'react';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { AppProvider, useApp } from './contexts/AppContext';
import Background from './components/Layout/Background';
import Sidebar from './components/Layout/Sidebar';
import SemanticNebula from './components/Visuals/SemanticNebula';
import NeuralPulse from './components/Visuals/NeuralPulse';
import HolographicCard from './components/UI/HolographicCard';
import UploadZone from './components/UI/UploadZone';
import ApiKeyModal from './components/Modals/ApiKeyModal';
import PDFPreviewModal from './components/Modals/PDFPreviewModal';
import { THEMES } from './constants';
import { Palette } from 'lucide-react';

const Layout = () => {
  const { documents, isProcessing, processingStage } = useApp();
  const { currentTheme, setTheme, colors } = useTheme();

  return (
    <div className="relative w-full h-screen flex overflow-hidden text-white">
      <Background />
      <ApiKeyModal />
      <PDFPreviewModal />
      
      {/* Loading Overlay */}
      {isProcessing && <NeuralPulse message={processingStage} />}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative z-10 p-6">
        
        {/* Header / Toolbar */}
        <header className="flex justify-between items-center mb-6">
            <div>
                <h1 className="text-3xl font-serif tracking-tight">Lumina</h1>
                <p className="text-sm opacity-60">Agentic PDF Intelligence</p>
            </div>
            
            {/* Theme Switcher */}
            <div className="flex items-center gap-2 p-2 rounded-full backdrop-blur-md bg-white/10 border border-white/10">
                <Palette size={16} className="ml-2 opacity-70" />
                {Object.keys(THEMES).map((themeName) => (
                    <button
                        key={themeName}
                        onClick={() => setTheme(themeName as any)}
                        className={`w-6 h-6 rounded-full border border-white/20 transition-transform hover:scale-110 ${currentTheme === themeName ? 'ring-2 ring-white scale-110' : ''}`}
                        style={{ 
                            background: `linear-gradient(135deg, ${THEMES[themeName].backgroundStart}, ${THEMES[themeName].backgroundEnd})` 
                        }}
                        title={themeName}
                    />
                ))}
            </div>
        </header>

        {/* Dashboard Grid */}
        <div className="flex-1 grid grid-cols-12 gap-6 min-h-0">
            
            {/* Left Col: Upload & Stats (4 cols) */}
            <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
                <HolographicCard className="flex-none">
                    <h3 className="text-lg font-semibold mb-4" style={{ color: colors.accent }}>Upload Nexus</h3>
                    <UploadZone />
                </HolographicCard>
                
                <HolographicCard className="flex-1 min-h-[200px] flex flex-col">
                    <h3 className="text-lg font-semibold mb-4" style={{ color: colors.accent }}>Knowledge Stats</h3>
                    <div className="flex-1 flex flex-col justify-center gap-4">
                        <div className="flex justify-between items-center p-3 rounded-lg bg-white/5">
                             <span>Documents</span>
                             <span className="text-2xl font-light">{documents.length}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 rounded-lg bg-white/5">
                             <span>Total Keywords</span>
                             <span className="text-2xl font-light">
                                {documents.reduce((acc, doc) => acc + doc.keywords.length, 0)}
                             </span>
                        </div>
                    </div>
                </HolographicCard>
            </div>

            {/* Middle Col: Nebula (8 cols) */}
            <div className="col-span-12 lg:col-span-8 rounded-2xl border border-white/10 backdrop-blur-sm overflow-hidden relative group"
                 style={{ backgroundColor: 'rgba(0,0,0,0.2)' }}>
                <div className="absolute top-4 left-4 z-20 pointer-events-none">
                    <h3 className="text-lg font-semibold" style={{ color: colors.accent }}>Semantic Nebula</h3>
                    <p className="text-xs opacity-60">Force-Directed Knowledge Graph</p>
                </div>
                {documents.length > 0 ? (
                    <SemanticNebula />
                ) : (
                    <div className="w-full h-full flex items-center justify-center opacity-30">
                        <p>Waiting for data constellation...</p>
                    </div>
                )}
            </div>

        </div>
      </main>

      {/* Right Sidebar: Agent Notes */}
      <aside className="w-96 relative z-10 hidden xl:block shadow-2xl">
        <Sidebar />
      </aside>

    </div>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <AppProvider>
        <Layout />
      </AppProvider>
    </ThemeProvider>
  );
};

export default App;