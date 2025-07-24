'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import Map from 'react-map-gl/maplibre';
import { Source, Layer, Popup, NavigationControl, MapLayerMouseEvent, LngLatBoundsLike } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { MAPBOX_CONFIG, MAP_LAYERS, ICE_COLOR_SCALE } from '@/lib/mapbox-config';
import { ICEMeasure, MapViewState, SelectedTract, CensusTractProperties } from '@/lib/types';
import { MapRef } from 'react-map-gl/maplibre';
import type { FillLayerSpecification, LineLayerSpecification } from 'react-map-gl/maplibre';
import MapControls from './MapControls';
import MapPopup from './MapPopup';
import SearchBar from '../ui/SearchBar';
import StyleSwitcher from './StyleSwitcher';

interface MapContainerProps {
  selectedMeasure?: ICEMeasure;
  showPriorityAreas?: boolean;
  showCommunityAreas?: boolean;
  onTractSelect?: (tract: CensusTractProperties | null) => void;
}

export default function MapContainer({ 
  selectedMeasure = 'ice_race',
  showPriorityAreas = false,
  showCommunityAreas = false,
  onTractSelect
}: MapContainerProps) {
  const mapRef = useRef<MapRef>(null);
  const [viewState, setViewState] = useState<MapViewState>(MAPBOX_CONFIG.defaultView);
  const [hoveredTract, setHoveredTract] = useState<SelectedTract | null>(null);
  const [selectedTract, setSelectedTract] = useState<SelectedTract | null>(null);
  const [cursor, setCursor] = useState<string>('');
  const [hoveredFeatureId, setHoveredFeatureId] = useState<string | null>(null);
  const [mapStyle, setMapStyle] = useState(MAPBOX_CONFIG.style);

  // Handle map hover
  const handleHover = useCallback((event: MapLayerMouseEvent) => {
    const map = mapRef.current?.getMap();
    if (!map) return;

    const features = event.features;
    if (features && features.length > 0) {
      const feature = features[0];
      setCursor('pointer');
      
      // Update hover state for smooth transitions
      if (hoveredFeatureId && hoveredFeatureId !== feature.properties.GEOID) {
        map.setFeatureState(
          { source: MAP_LAYERS.censusTracts, id: hoveredFeatureId },
          { hover: false }
        );
      }
      
      map.setFeatureState(
        { source: MAP_LAYERS.censusTracts, id: feature.properties.GEOID },
        { hover: true }
      );
      
      setHoveredFeatureId(feature.properties.GEOID);
      
      if (feature.properties) {
        setHoveredTract({
          properties: feature.properties as CensusTractProperties,
          coordinates: [event.lngLat.lng, event.lngLat.lat],
        });
      }
    } else {
      setCursor('');
      if (hoveredFeatureId) {
        map.setFeatureState(
          { source: MAP_LAYERS.censusTracts, id: hoveredFeatureId },
          { hover: false }
        );
        setHoveredFeatureId(null);
      }
      setHoveredTract(null);
    }
  }, [hoveredFeatureId]);

  // Handle map click
  const handleClick = useCallback((event: MapLayerMouseEvent) => {
    const features = event.features;
    if (features && features.length > 0) {
      const feature = features[0];
      if (feature.properties) {
        const tract = feature.properties as CensusTractProperties;
        setSelectedTract({
          properties: tract,
          coordinates: [event.lngLat.lng, event.lngLat.lat],
        });
        // Notify parent component
        if (onTractSelect) {
          onTractSelect(tract);
        }
      }
    }
  }, [onTractSelect]);

  // Create fill layer paint expression with smooth transitions
  const fillPaint = {
    'fill-color': [
      'case',
      ['==', ['get', selectedMeasure], null],
      '#e0e0e0',
      [
        'interpolate',
        ['linear'],
        ['get', selectedMeasure],
        ...ICE_COLOR_SCALE.breakpoints.flatMap((value, index) => [
          value,
          ICE_COLOR_SCALE.colors[index],
        ]),
      ],
    ],
    'fill-opacity': [
      'case',
      ['boolean', ['feature-state', 'hover'], false],
      0.9,
      showPriorityAreas,
      [
        'case',
        ['<', ['get', selectedMeasure], -0.4],
        0.85,
        0.3,
      ],
      0.75,
    ],
    'fill-opacity-transition': {
      duration: 200,
      delay: 0,
    },
  };

  // Create outline layer paint with enhanced effects
  const outlinePaint = {
    'line-color': [
      'case',
      ['boolean', ['feature-state', 'hover'], false],
      '#1a365d',
      '#333',
    ],
    'line-width': [
      'case',
      ['boolean', ['feature-state', 'hover'], false],
      2.5,
      0.5,
    ],
    'line-opacity': [
      'case',
      ['boolean', ['feature-state', 'hover'], false],
      1,
      0.5,
    ],
    'line-width-transition': {
      duration: 200,
      delay: 0,
    },
    'line-opacity-transition': {
      duration: 200,
      delay: 0,
    },
  };

  // Update map paint properties when measure changes with smooth transition
  useEffect(() => {
    const map = mapRef.current?.getMap();
    if (!map || !map.isStyleLoaded()) return;

    // Wait for the layer to be added
    if (!map.getLayer(MAP_LAYERS.tractFill)) return;

    // Update the paint property with a smooth transition
    map.setPaintProperty(MAP_LAYERS.tractFill, 'fill-color-transition', {
      duration: 500,
      delay: 0,
    });

    // Force update the fill color expression
    map.setPaintProperty(MAP_LAYERS.tractFill, 'fill-color', fillPaint['fill-color']);
  }, [selectedMeasure]);

  return (
    <div className="relative w-full h-full">
      <Map
        ref={mapRef}
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        mapStyle={mapStyle}
        cursor={cursor}
        interactiveLayerIds={[MAP_LAYERS.tractFill]}
        onMouseMove={handleHover}
        onMouseLeave={() => {
          setCursor('');
          setHoveredTract(null);
        }}
        onClick={handleClick}
        maxBounds={MAPBOX_CONFIG.maxBounds as LngLatBoundsLike}
        minZoom={MAPBOX_CONFIG.minZoom}
        maxZoom={MAPBOX_CONFIG.maxZoom}
      >
        {/* Census Tracts Layer */}
        <Source 
          id={MAP_LAYERS.censusTracts} 
          type="geojson" 
          data="/data/chicago-tracts-ice.geojson"
          generateId={true}
        >
          <Layer
            id={MAP_LAYERS.tractFill}
            type="fill"
            paint={fillPaint as unknown as FillLayerSpecification['paint']}
            beforeId="waterway-label"
          />
          <Layer
            id={MAP_LAYERS.tractOutline}
            type="line"
            paint={outlinePaint as unknown as LineLayerSpecification['paint']}
            beforeId="waterway-label"
          />
          {/* Selected tract highlight */}
          {selectedTract && (
            <Layer
              id={MAP_LAYERS.tractHighlight}
              type="line"
              source={MAP_LAYERS.censusTracts}
              paint={{
                'line-color': '#1e40af',
                'line-width': 3,
                'line-opacity': 1,
              }}
              filter={['==', 'GEOID', selectedTract.properties.GEOID]}
              beforeId="waterway-label"
            />
          )}
        </Source>

        {/* Community Areas Layer */}
        {showCommunityAreas && (
          <Source
            id={MAP_LAYERS.communityAreas}
            type="geojson"
            data="/data/chicago-community-areas.geojson"
          >
            <Layer
              id={MAP_LAYERS.communityAreaOutline}
              type="line"
              paint={{
                'line-color': '#1e293b',
                'line-width': 2,
                'line-opacity': 0.8,
                'line-dasharray': [2, 2],
              }}
              beforeId="waterway-label"
            />
            <Layer
              id={MAP_LAYERS.communityAreaLabel}
              type="symbol"
              layout={{
                'text-field': ['get', 'community'],
                'text-font': ['DIN Pro Medium', 'Arial Unicode MS Regular'],
                'text-size': 12,
                'text-transform': 'uppercase',
                'text-letter-spacing': 0.05,
                'text-anchor': 'center',
              }}
              paint={{
                'text-color': '#1e293b',
                'text-halo-color': '#ffffff',
                'text-halo-width': 2,
                'text-halo-blur': 1,
              }}
              minzoom={11}
            />
          </Source>
        )}

        {/* Navigation Controls */}
        <NavigationControl position="top-right" />
        
        {/* Style Switcher */}
        <StyleSwitcher onStyleChange={setMapStyle} />

        {/* Custom Controls */}
        <MapControls
          map={mapRef.current}
          onResetView={() => setViewState(MAPBOX_CONFIG.defaultView)}
        />

        {/* Hover Popup */}
        {hoveredTract && !selectedTract && (
          <Popup
            longitude={hoveredTract.coordinates[0]}
            latitude={hoveredTract.coordinates[1]}
            closeButton={false}
            className="hover-popup"
            anchor="bottom"
            offset={10}
          >
            <MapPopup
              tract={hoveredTract.properties}
              measure={selectedMeasure}
              isHover={true}
            />
          </Popup>
        )}

        {/* Selected Popup */}
        {selectedTract && (
          <Popup
            longitude={selectedTract.coordinates[0]}
            latitude={selectedTract.coordinates[1]}
            onClose={() => {
              setSelectedTract(null);
              if (onTractSelect) {
                onTractSelect(null);
              }
            }}
            anchor="bottom"
            offset={10}
          >
            <MapPopup
              tract={selectedTract.properties}
              measure={selectedMeasure}
              isHover={false}
            />
          </Popup>
        )}
      </Map>

      {/* Search Bar */}
      <SearchBar map={mapRef.current} />
    </div>
  );
}