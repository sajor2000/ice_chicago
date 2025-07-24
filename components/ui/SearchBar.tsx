'use client';

import { useEffect, useRef } from 'react';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import { MAPBOX_CONFIG } from '@/lib/mapbox-config';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import mapboxgl from 'mapbox-gl';

import { MapRef } from 'react-map-gl/mapbox';

interface SearchBarProps {
  map: MapRef | null;
}

export default function SearchBar({ map }: SearchBarProps) {
  const geocoderContainerRef = useRef<HTMLDivElement>(null);
  const geocoderRef = useRef<MapboxGeocoder | null>(null);

  useEffect(() => {
    if (!map || !geocoderContainerRef.current) return;

    // Create geocoder instance
    const geocoder = new MapboxGeocoder({
      accessToken: MAPBOX_CONFIG.accessToken,
      mapboxgl: mapboxgl,
      placeholder: 'Search for an address in Chicago...',
      bbox: [-87.9401, 41.6445, -87.5241, 42.0230], // Chicago bounds
      proximity: {
        longitude: -87.6298,
        latitude: 41.8781
      },
      marker: false,
      flyTo: {
        padding: 50,
        duration: 1000,
        zoom: 14,
      },
    });

    geocoderRef.current = geocoder;

    // Add to container
    geocoderContainerRef.current.appendChild(geocoder.onAdd(map));

    // Style the geocoder
    const geocoderEl = geocoderContainerRef.current.querySelector('.mapboxgl-ctrl-geocoder');
    if (geocoderEl) {
      geocoderEl.classList.add('!shadow-none', '!min-width-0', '!w-full');
    }

    return () => {
      if (geocoderRef.current) {
        geocoderRef.current.onRemove();
      }
    };
  }, [map]);

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.3, ease: 'easeOut' }}
      className="absolute top-20 lg:top-6 left-1/2 -translate-x-1/2 z-10 w-full max-w-md px-6"
    >
      <div className="glass-card rounded-lg p-1 flex items-center gap-2">
        <Search className="w-5 h-5 text-gray-400 ml-3" />
        <div ref={geocoderContainerRef} className="flex-1" />
      </div>
    </motion.div>
  );
}