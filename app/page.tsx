'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { ICEMeasure, CensusTractProperties } from '@/lib/types';
import MetricsPanel from '@/components/panels/MetricsPanel';
import DetailsPanel from '@/components/panels/DetailsPanel';
import Legend from '@/components/ui/Legend';
import { Menu } from 'lucide-react';

// Dynamic import for the map component to avoid SSR issues
const MapContainer = dynamic(
  () => import('@/components/map/MapContainer'),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Chicago ICE Visualization...</p>
        </div>
      </div>
    )
  }
);

export default function Home() {
  const [selectedMeasure, setSelectedMeasure] = useState<ICEMeasure>('ice_race');
  const [selectedTract, setSelectedTract] = useState<CensusTractProperties | null>(null);
  const [showPriorityAreas, setShowPriorityAreas] = useState(false);
  const [showCommunityAreas, setShowCommunityAreas] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [stats, setStats] = useState({
    totalTracts: 866,
    priorityTracts: 330,
    avgValue: 0.113,
  });

  // Load summary statistics
  useEffect(() => {
    fetch('/data/ice-summary-stats.json')
      .then(res => res.json())
      .then(data => {
        if (data[selectedMeasure]) {
          setStats({
            totalTracts: data.total_tracts || 866,
            priorityTracts: data.priority_areas[selectedMeasure.replace('ice_', '')] || 0,
            avgValue: data[selectedMeasure].mean || 0,
          });
        }
      })
      .catch(console.error);
  }, [selectedMeasure]);

  return (
    <main className="relative w-full h-screen overflow-hidden bg-gray-50">
      {/* Map Container - Full Screen */}
      <MapContainer 
        selectedMeasure={selectedMeasure}
        showPriorityAreas={showPriorityAreas}
        showCommunityAreas={showCommunityAreas}
        onTractSelect={setSelectedTract}
      />
      
      {/* Mobile Menu Button */}
      <button
        onClick={() => setShowMobileMenu(!showMobileMenu)}
        className="lg:hidden absolute top-6 left-6 z-20 glass-card p-3 rounded-lg"
      >
        <Menu className="w-6 h-6 text-gray-700" />
      </button>

      {/* Metrics Panel - Left Side (Hidden on mobile unless menu open) */}
      <div className={`${showMobileMenu ? 'block' : 'hidden'} lg:block`}>
        <MetricsPanel
          selectedMeasure={selectedMeasure}
          onMeasureChange={setSelectedMeasure}
          stats={stats}
        />
      </div>

      {/* Details Panel - Right Side (Full width on mobile) */}
      <div className={`${selectedTract ? 'block' : 'hidden'}`}>
        <DetailsPanel
          tract={selectedTract}
          measure={selectedMeasure}
          onClose={() => setSelectedTract(null)}
        />
      </div>

      {/* Legend - Bottom Left (Adjusted for mobile) */}
      <div className="block">
        <Legend
          showPriorityAreas={showPriorityAreas}
          onTogglePriority={setShowPriorityAreas}
          showCommunityAreas={showCommunityAreas}
          onToggleCommunityAreas={setShowCommunityAreas}
          selectedMeasure={selectedMeasure}
        />
      </div>
    </main>
  );
}