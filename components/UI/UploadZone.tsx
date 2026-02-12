import React, { useCallback } from 'react';
import { useApp } from '../../contexts/AppContext';
import { UploadCloud } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const UploadZone: React.FC = () => {
  const { stageDocument } = useApp();
  const { colors } = useTheme();

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type === 'application/pdf') {
        stageDocument(file);
      } else {
        alert("Only PDF files are supported currently.");
      }
    }
  }, [stageDocument]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          stageDocument(e.target.files[0]);
      }
  };

  return (
    <div 
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="group relative flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl transition-all duration-300 hover:border-opacity-100 cursor-pointer"
        style={{ 
            borderColor: colors.accent,
            backgroundColor: 'rgba(255,255,255,0.05)'
        }}
    >
        <input 
            type="file" 
            accept=".pdf"
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <UploadCloud size={32} style={{ color: colors.accent }} className="mb-2 group-hover:scale-110 transition-transform" />
        <p className="text-sm font-medium" style={{ color: colors.text }}>
            Drag PDF here or click to upload
        </p>
    </div>
  );
};

export default UploadZone;