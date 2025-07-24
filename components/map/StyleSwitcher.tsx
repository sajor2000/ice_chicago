'use client';

import { useState } from 'react';
import { Map } from 'lucide-react';
import { standardStyle, positronStyle, tonerStyle } from '@/lib/map-styles-v2';

interface StyleSwitcherProps {
  onStyleChange: (style: any) => void;
}

const styles = [
  { id: 'standard', name: 'Standard', style: standardStyle },
  { id: 'positron', name: 'Light', style: positronStyle },
  { id: 'toner', name: 'High Contrast', style: tonerStyle },
];

export default function StyleSwitcher({ onStyleChange }: StyleSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState('standard');

  const handleStyleChange = (styleId: string) => {
    const style = styles.find(s => s.id === styleId);
    if (style) {
      setSelectedStyle(styleId);
      onStyleChange(style.style);
      setIsOpen(false);
    }
  };

  return (
    <div className="absolute top-20 right-2 z-10">
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="glass-card p-2 rounded-lg hover:bg-white/95 transition-all"
          title="Change map style"
        >
          <Map className="w-5 h-5 text-gray-700" />
        </button>
        
        {isOpen && (
          <div className="absolute top-full right-0 mt-2 glass-card rounded-lg p-2 min-w-[150px]">
            {styles.map((style) => (
              <button
                key={style.id}
                onClick={() => handleStyleChange(style.id)}
                className={`
                  w-full text-left px-3 py-2 rounded text-sm
                  ${selectedStyle === style.id 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'hover:bg-gray-50 text-gray-700'
                  }
                  transition-colors
                `}
              >
                {style.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}