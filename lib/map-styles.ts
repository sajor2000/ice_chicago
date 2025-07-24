export const lightStyle = {
  version: 8 as const,
  name: 'Light',
  sources: {
    'carto': {
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
      id: 'carto',
      type: 'raster' as const,
      source: 'carto',
      minzoom: 0,
      maxzoom: 22
    }
  ],
  glyphs: 'https://fonts.openmaptiles.org/{fontstack}/{range}.pbf',
  sprite: 'https://openmaptiles.github.io/osm-bright-gl-style/sprite'
};

export const darkStyle = {
  version: 8 as const,
  name: 'Dark',
  sources: {
    'carto-dark': {
      type: 'raster' as const,
      tiles: [
        'https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png',
        'https://b.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png',
        'https://c.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png',
        'https://d.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png'
      ],
      tileSize: 256,
      attribution: '© <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors © <a href="https://carto.com/attributions" target="_blank">CARTO</a>'
    }
  },
  layers: [
    {
      id: 'carto-dark',
      type: 'raster' as const,
      source: 'carto-dark',
      minzoom: 0,
      maxzoom: 22
    }
  ],
  glyphs: 'https://fonts.openmaptiles.org/{fontstack}/{range}.pbf',
  sprite: 'https://openmaptiles.github.io/osm-bright-gl-style/sprite'
};