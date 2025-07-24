'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import Map, { Source, Layer, Popup, NavigationControl } from 'react-map-gl';
import type { MapRef, MapMouseEvent } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { 
  MAPBOX_VECTOR_CONFIG, 
  VECTOR_SOURCES, 
  VECTOR_LAYERS,
  ICE_COLOR_SCALE_VECTOR,
  PRIORITY_THRESHOLD 
} from '@/lib/mapbox-config-vector';
import { ICEMeasure, MapViewState, SelectedTract, CensusTractProperties } from '@/lib/types';
import MapControls from './MapControls';
import MapPopup from './MapPopup';
import SearchBar from '../ui/SearchBar';

interface MapboxVectorMapProps {
  selectedMeasure?: ICEMeasure;
  showPriorityAreas?: boolean;
  showCommunityAreas?: boolean;
  onTractSelect?: (tract: CensusTractProperties | null) => void;
}

export default function MapboxVectorMap({ 
  selectedMeasure = 'ice_race',
  showPriorityAreas = false,
  showCommunityAreas = false,
  onTractSelect
}: MapboxVectorMapProps) {
  const mapRef = useRef<MapRef>(null);
  const [viewState, setViewState] = useState<MapViewState>(MAPBOX_VECTOR_CONFIG.defaultView);
  const [hoveredTract, setHoveredTract] = useState<SelectedTract | null>(null);
  const [selectedTract, setSelectedTract] = useState<SelectedTract | null>(null);
  const [hoveredStateId, setHoveredStateId] = useState<string | number | null>(null);

  // Handle hover using feature states for smooth performance
  const handleHover = useCallback((event: MapMouseEvent) => {
    const map = mapRef.current;
    if (!map) return;

    const feature = event.features?.[0];
    
    if (feature) {
      // Remove previous hover state
      if (hoveredStateId !== null) {
        map.setFeatureState(
          { 
            source: 'census-tracts',
            sourceLayer: VECTOR_LAYERS.censusTractSourceLayer,
            id: hoveredStateId 
          },
          { hover: false }
        );
      }

      // Set new hover state
      const featureId = feature.id;
      if (featureId !== undefined) {
        map.setFeatureState(
          { 
            source: 'census-tracts',
            sourceLayer: VECTOR_LAYERS.censusTractSourceLayer,
            id: featureId 
          },
          { hover: true }
        );
        setHoveredStateId(featureId);
      }

      // Update hover popup
      setHoveredTract({
        properties: feature.properties as CensusTractProperties,
        coordinates: [event.lngLat.lng, event.lngLat.lat],
      });
    } else {
      // Clear hover state
      if (hoveredStateId !== null) {
        map.setFeatureState(
          { 
            source: 'census-tracts',
            sourceLayer: VECTOR_LAYERS.censusTractSourceLayer,
            id: hoveredStateId 
          },
          { hover: false }
        );
        setHoveredStateId(null);
      }
      setHoveredTract(null);
    }
  }, [hoveredStateId]);

  // Handle click
  const handleClick = useCallback((event: MapMouseEvent) => {
    const feature = event.features?.[0];
    
    if (feature && feature.properties) {
      const tract = feature.properties as CensusTractProperties;
      setSelectedTract({
        properties: tract,
        coordinates: [event.lngLat.lng, event.lngLat.lat],
      });
      onTractSelect?.(tract);
    } else {
      setSelectedTract(null);
      onTractSelect?.(null);
    }
  }, [onTractSelect]);

  // Handle search result
  const handleSearchResult = useCallback((result: { center?: [number, number] }) => {
    if (result.center) {
      const [lng, lat] = result.center;
      mapRef.current?.flyTo({
        center: [lng, lat],
        zoom: 14,
        duration: 1000,
      });
    }
  }, []);

  // Update map style when measure changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const updateStyle = () => {
      // Update the paint property for the selected measure
      map.setPaintProperty(VECTOR_LAYERS.tractFill, 'fill-color', [
        'case',
        ['==', ['get', selectedMeasure], null],
        '#cccccc',
        [
          'interpolate',
          ['linear'],
          ['get', selectedMeasure],
          ...ICE_COLOR_SCALE_VECTOR.stops.flat()
        ]
      ]);
    };

    if (map.isStyleLoaded()) {
      updateStyle();
    } else {
      map.once('styledata', updateStyle);
    }
  }, [selectedMeasure]);

  return (
    <div className="relative w-full h-full">
      <Map
        ref={mapRef}
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        mapboxAccessToken={MAPBOX_VECTOR_CONFIG.accessToken}
        mapStyle={MAPBOX_VECTOR_CONFIG.style}
        interactiveLayerIds={[VECTOR_LAYERS.tractFill]}
        onMouseMove={handleHover}
        onMouseLeave={() => {
          setHoveredTract(null);
          // Clear hover state
          if (hoveredStateId !== null && mapRef.current) {
            mapRef.current.setFeatureState(
              { 
                source: 'census-tracts',
                sourceLayer: VECTOR_LAYERS.censusTractSourceLayer,
                id: hoveredStateId 
              },
              { hover: false }
            );
            setHoveredStateId(null);
          }
        }}
        onClick={handleClick}
        maxBounds={MAPBOX_VECTOR_CONFIG.maxBounds}
        minZoom={MAPBOX_VECTOR_CONFIG.minZoom}
        maxZoom={MAPBOX_VECTOR_CONFIG.maxZoom}
        cursor={hoveredTract ? 'pointer' : 'grab'}
      >
        {/* Census Tracts Vector Tile Layer */}
        <Source id="census-tracts" {...VECTOR_SOURCES.censusTracts}>
          <Layer
            id={VECTOR_LAYERS.tractFill}
            type="fill"
            source-layer={VECTOR_LAYERS.censusTractSourceLayer}
            paint={{
              'fill-color': [
                'case',
                ['==', ['get', selectedMeasure], null],
                '#cccccc',
                [
                  'interpolate',
                  ['linear'],
                  ['get', selectedMeasure],
                  ...ICE_COLOR_SCALE_VECTOR.stops.flat()
                ]
              ],
              'fill-opacity': [
                'case',
                ['boolean', ['feature-state', 'hover'], false],
                0.85,
                showPriorityAreas && ['<', ['get', selectedMeasure], PRIORITY_THRESHOLD] ? 0.8 : 0.65
              ],
            }}
          />
          <Layer
            id={VECTOR_LAYERS.tractOutline}
            type="line"
            source-layer={VECTOR_LAYERS.censusTractSourceLayer}
            paint={{
              'line-color': [
                'case',
                ['boolean', ['feature-state', 'hover'], false],
                '#1e40af',
                '#e5e7eb'
              ],
              'line-width': [
                'case',
                ['boolean', ['feature-state', 'hover'], false],
                2,
                0.5
              ],
            }}
          />
        </Source>

        {/* Community Areas Layer */}
        {showCommunityAreas && (
          <Source id="community-areas" {...VECTOR_SOURCES.communityAreas}>
            <Layer
              id={VECTOR_LAYERS.communityAreaOutline}
              type="line"
              source-layer={VECTOR_LAYERS.communityAreaSourceLayer}
              paint={{
                'line-color': '#1e293b',
                'line-width': 2,
                'line-opacity': 0.8,
                'line-dasharray': [2, 2],
              }}
            />
            <Layer
              id={VECTOR_LAYERS.communityAreaLabel}
              type="symbol"
              source-layer={VECTOR_LAYERS.communityAreaSourceLayer}
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
                'text-halo-color': 'rgba(255, 255, 255, 0.9)',
                'text-halo-width': 2,
                'text-halo-blur': 1,
              }}
              minzoom={11}
            />
          </Source>
        )}

        {/* Navigation Controls */}
        <NavigationControl position="top-right" />

        {/* Search Bar */}
        <div className="absolute top-4 left-4 z-10">
          <SearchBar onResult={handleSearchResult} />
        </div>

        {/* Custom Controls */}
        <MapControls
          map={mapRef.current}
          onResetView={() => setViewState(MAPBOX_VECTOR_CONFIG.defaultView)}
        />

        {/* Hover Popup */}
        {hoveredTract && !selectedTract && (
          <Popup
            longitude={hoveredTract.coordinates[0]}
            latitude={hoveredTract.coordinates[1]}
            closeButton={false}
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
              onTractSelect?.(null);
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
    </div>
  );
}