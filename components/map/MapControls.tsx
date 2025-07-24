'use client';

import { Home, Maximize2, Layers, Download, Camera } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapRef } from 'react-map-gl/maplibre';

interface MapControlsProps {
  map: MapRef | null;
  onResetView: () => void;
}

export default function MapControls({ map, onResetView }: MapControlsProps) {
  const [showLayers, setShowLayers] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);

  const handleFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen();
    }
  };

  const handleExportImage = () => {
    if (!map) return;
    
    const mapInstance = map.getMap();
    const canvas = mapInstance.getCanvas();
    const link = document.createElement('a');
    link.download = `chicago-ice-map-${new Date().toISOString().split('T')[0]}.png`;
    link.href = canvas.toDataURL();
    link.click();
    setShowExportMenu(false);
  };

  const handleExportData = async () => {
    // Download the summary statistics as JSON
    const response = await fetch('/data/ice-summary-stats.json');
    const data = await response.json();
    
    // Create a formatted JSON string
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'chicago-ice-summary-stats.json';
    link.click();
    
    window.URL.revokeObjectURL(url);
    setShowExportMenu(false);
  };

  return (
    <div className="absolute bottom-8 right-4 flex flex-col gap-2">
      {/* Reset View */}
      <button
        onClick={onResetView}
        className="glass-card p-3 rounded-lg hover:bg-white/95 transition-smooth group"
        title="Reset view"
      >
        <Home className="w-5 h-5 text-gray-700 group-hover:text-blue-600" />
      </button>

      {/* Fullscreen */}
      <button
        onClick={handleFullscreen}
        className="glass-card p-3 rounded-lg hover:bg-white/95 transition-smooth group"
        title="Toggle fullscreen"
      >
        <Maximize2 className="w-5 h-5 text-gray-700 group-hover:text-blue-600" />
      </button>

      {/* Layer Toggle */}
      <button
        onClick={() => setShowLayers(!showLayers)}
        className="glass-card p-3 rounded-lg hover:bg-white/95 transition-smooth group"
        title="Toggle layers"
      >
        <Layers className="w-5 h-5 text-gray-700 group-hover:text-blue-600" />
      </button>

      {/* Export Menu */}
      <div className="relative">
        <button
          onClick={() => setShowExportMenu(!showExportMenu)}
          className="glass-card p-3 rounded-lg hover:bg-white/95 transition-smooth group"
          title="Export options"
        >
          <Download className="w-5 h-5 text-gray-700 group-hover:text-blue-600" />
        </button>
        
        <AnimatePresence>
          {showExportMenu && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, x: 10 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95, x: 10 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-0 right-14 glass-card rounded-lg p-2 min-w-[160px]"
            >
              <button
                onClick={handleExportImage}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
              >
                <Camera className="w-4 h-4" />
                Export as Image
              </button>
              <button
                onClick={handleExportData}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
              >
                <Download className="w-4 h-4" />
                Download Data
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}