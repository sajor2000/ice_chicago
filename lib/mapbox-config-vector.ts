// Mapbox configuration for vector tiles
export const MAPBOX_VECTOR_CONFIG = {
  accessToken: process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || '',
  style: 'mapbox://styles/mapbox/light-v11', // Using Mapbox's light style
  defaultView: {
    longitude: -87.6298,
    latitude: 41.8781,
    zoom: 10.5,
    pitch: 0,
    bearing: 0,
  },
  bounds: {
    southwest: [-87.9401, 41.6445],
    northeast: [-87.5241, 42.0230],
  },
  maxBounds: [
    [-88.2, 41.4], // Southwest
    [-87.3, 42.2], // Northeast
  ] as [[number, number], [number, number]],
  minZoom: 9,
  maxZoom: 16,
};

// Vector tile sources - Update these with your actual tileset IDs from Mapbox Studio
export const VECTOR_SOURCES = {
  censusTracts: {
    type: 'vector' as const,
    url: 'mapbox://sajor2000.chicago-census-tracts-ice', // Replace with your tileset ID
  },
  communityAreas: {
    type: 'vector' as const,
    url: 'mapbox://sajor2000.chicago-community-areas-ice', // Replace with your tileset ID
  },
};

// Layer names from the vector tiles
export const VECTOR_LAYERS = {
  // Source layer names (from the tileset)
  censusTractSourceLayer: 'census-tracts',
  communityAreaSourceLayer: 'community-areas',
  
  // Map layer IDs (for styling)
  tractFill: 'tract-fill',
  tractOutline: 'tract-outline',
  tractHighlight: 'tract-highlight',
  communityAreaOutline: 'community-area-outline',
  communityAreaLabel: 'community-area-label',
};

// ICE color scale for choropleth
export const ICE_COLOR_SCALE_VECTOR = {
  property: 'ice_race', // Will be dynamically changed
  type: 'interval' as const,
  stops: [
    [-1.0, '#67000d'], // Deep red (extreme deprivation)
    [-0.8, '#a50f15'],
    [-0.6, '#cb181d'],
    [-0.4, '#ef3b2c'],
    [-0.2, '#fb6a4a'],
    [0, '#ffffff'],     // White (neutral)
    [0.2, '#6baed6'],
    [0.4, '#3182bd'],
    [0.6, '#08519c'],
    [0.8, '#084594'],
    [1.0, '#08306b'],   // Deep blue (extreme privilege)
  ],
};

// Priority area threshold
export const PRIORITY_THRESHOLD = -0.4;