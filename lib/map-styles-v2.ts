// Modern basemap styles compatible with MapLibre GL
export const standardStyle = {
  version: 8 as const,
  name: 'Standard',
  sources: {
    'carto-light': {
      type: 'raster' as const,
      tiles: [
        'https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png',
        'https://b.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png',
        'https://c.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png',
        'https://d.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png'
      ],
      tileSize: 256,
      attribution: '© <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors © <a href="https://carto.com/attributions" target="_blank">CARTO</a>'
    }
  },
  layers: [
    {
      id: 'carto-base',
      type: 'raster' as const,
      source: 'carto-light',
      minzoom: 0,
      maxzoom: 22
    }
  ],
  glyphs: 'https://fonts.openmaptiles.org/{fontstack}/{range}.pbf',
  sprite: 'https://openmaptiles.github.io/osm-bright-gl-style/sprite'
};

// Alternative vector tile style using Maptiler
export const vectorStyle = 'https://api.maptiler.com/maps/streets-v2/style.json?key=get_your_own_key';

// Stamen Toner style for high contrast
export const tonerStyle = {
  version: 8 as const,
  name: 'Toner',
  sources: {
    'stamen-toner': {
      type: 'raster' as const,
      tiles: [
        'https://tiles.stadiamaps.com/tiles/stamen_toner/{z}/{x}/{y}.png'
      ],
      tileSize: 256,
      attribution: '© <a href="https://stadiamaps.com/" target="_blank">Stadia Maps</a> © <a href="https://stamen.com" target="_blank">Stamen Design</a> © <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>'
    }
  },
  layers: [
    {
      id: 'stamen-toner-base',
      type: 'raster' as const,
      source: 'stamen-toner',
      minzoom: 0,
      maxzoom: 22
    }
  ]
};

// Positron style for clean, minimal look
export const positronStyle = {
  version: 8 as const,
  name: 'Positron',
  sources: {
    'carto-positron': {
      type: 'raster' as const,
      tiles: [
        'https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png',
        'https://b.basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png',
        'https://c.basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png',
        'https://d.basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png'
      ],
      tileSize: 256,
      attribution: '© <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors © <a href="https://carto.com/attributions" target="_blank">CARTO</a>'
    }
  },
  layers: [
    {
      id: 'carto-positron-base',
      type: 'raster' as const,
      source: 'carto-positron',
      minzoom: 0,
      maxzoom: 22
    }
  ],
  glyphs: 'https://fonts.openmaptiles.org/{fontstack}/{range}.pbf',
  sprite: 'https://openmaptiles.github.io/osm-bright-gl-style/sprite'
};