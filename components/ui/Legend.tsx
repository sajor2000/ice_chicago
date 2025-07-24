'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Card } from './Card';
import { ICE_COLOR_SCALE } from '@/lib/mapbox-config';
import { AlertCircle, Map, BarChart2 } from 'lucide-react';
import { ICEMeasure } from '@/lib/types';

interface LegendProps {
  showPriorityAreas: boolean;
  onTogglePriority: (show: boolean) => void;
  showCommunityAreas: boolean;
  onToggleCommunityAreas: (show: boolean) => void;
  selectedMeasure: ICEMeasure;
}

export default function Legend({ 
  showPriorityAreas, 
  onTogglePriority,
  showCommunityAreas,
  onToggleCommunityAreas,
  selectedMeasure
}: LegendProps) {
  const [showDistribution, setShowDistribution] = useState(false);
  const [distribution, setDistribution] = useState<number[]>([]);

  // Load distribution data
  useEffect(() => {
    // Simulate distribution data - in real app, calculate from actual data
    const bins = 20;
    const data = Array.from({ length: bins }, (_, i) => {
      const x = (i / bins) * 2 - 1; // -1 to 1
      // Create a somewhat normal distribution
      return Math.exp(-Math.pow(x * 2, 2)) * 100 + Math.random() * 20;
    });
    setDistribution(data);
  }, [selectedMeasure]);
  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
      className="absolute bottom-6 left-6 right-6 lg:right-auto z-10 max-w-xs"
    >
      <Card className="p-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-900">ICE Values</h3>
            <button
              onClick={() => setShowDistribution(!showDistribution)}
              className="p-1 rounded hover:bg-gray-100 transition-colors"
              title="Toggle distribution"
            >
              <BarChart2 className="w-4 h-4 text-gray-600" />
            </button>
          </div>
          
          {/* Color scale */}
          <div className="flex items-center gap-1">
            <span className="text-xs text-gray-600 mr-2">-1.0</span>
            <div className="flex h-6 flex-1 rounded overflow-hidden">
              {ICE_COLOR_SCALE.colors.map((color, i) => (
                <div
                  key={i}
                  className="flex-1"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <span className="text-xs text-gray-600 ml-2">+1.0</span>
          </div>
          
          <div className="flex justify-between text-xs text-gray-600">
            <span>Extreme Deprivation</span>
            <span>Extreme Privilege</span>
          </div>

          {/* Distribution histogram */}
          <AnimatePresence>
            {showDistribution && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="pt-2"
              >
              <div className="h-16 flex items-end gap-0.5">
                {distribution.map((value, i) => (
                  <div
                    key={i}
                    className="flex-1 transition-all duration-300"
                    style={{
                      height: `${value}%`,
                      backgroundColor: ICE_COLOR_SCALE.colors[Math.floor((i / distribution.length) * ICE_COLOR_SCALE.colors.length)],
                      opacity: 0.8,
                    }}
                  />
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-1 text-center">
                Distribution of census tracts
              </p>
            </motion.div>
          )}
          </AnimatePresence>

          {/* Priority areas toggle */}
          <div className="pt-3 border-t border-gray-200">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={showPriorityAreas}
                onChange={(e) => onTogglePriority(e.target.checked)}
                className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500"
              />
              <span className="text-sm text-gray-700 group-hover:text-gray-900 flex items-center gap-1">
                <AlertCircle className="w-3 h-3 text-red-500" />
                Highlight priority areas
              </span>
            </label>
            <p className="text-xs text-gray-500 mt-1 ml-6">
              Areas with ICE &lt; -0.4
            </p>
          </div>

          {/* Community areas toggle */}
          <div className="pt-3 border-t border-gray-200">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={showCommunityAreas}
                onChange={(e) => onToggleCommunityAreas(e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700 group-hover:text-gray-900 flex items-center gap-1">
                <Map className="w-3 h-3 text-blue-500" />
                Show community areas
              </span>
            </label>
            <p className="text-xs text-gray-500 mt-1 ml-6">
              Display neighborhood boundaries
            </p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}