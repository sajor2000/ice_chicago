import { lightStyle } from './map-styles';

export const MAPBOX_CONFIG = {
  accessToken: process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || '',
  style: lightStyle,
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
  ],
  minZoom: 9,
  maxZoom: 16,
};

export const MAP_LAYERS = {
  censusTracts: 'census-tracts',
  communityAreas: 'community-areas',
  tractFill: 'tract-fill',
  tractOutline: 'tract-outline',
  tractHighlight: 'tract-highlight',
  communityAreaOutline: 'community-area-outline',
  communityAreaLabel: 'community-area-label',
};

export const ICE_COLOR_SCALE = {
  // Deep red to deep blue gradient
  colors: [
    '#67000d', // -1.0: Deep red (extreme deprivation)
    '#a50f15', // -0.8
    '#cb181d', // -0.6
    '#ef3b2c', // -0.4
    '#fb6a4a', // -0.2
    '#ffffff', //  0.0: White (neutral)
    '#6baed6', //  0.2
    '#3182bd', //  0.4
    '#08519c', //  0.6
    '#084594', //  0.8
    '#08306b', //  1.0: Deep blue (extreme privilege)
  ],
  breakpoints: [-1.0, -0.8, -0.6, -0.4, -0.2, 0, 0.2, 0.4, 0.6, 0.8, 1.0],
};

export const PRIORITY_THRESHOLD = -0.4;