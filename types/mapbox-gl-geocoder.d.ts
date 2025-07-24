import maplibregl from 'maplibre-gl';

declare module '@mapbox/mapbox-gl-geocoder' {
  export interface MapboxGeocoderOptions {
    accessToken: string;
    mapboxgl: typeof maplibregl;
    [key: string]: any;
  }

  export default class MapboxGeocoder {
    constructor(options: MapboxGeocoderOptions);
    onAdd(map: any): HTMLElement;
    onRemove(): void;
  }
}
