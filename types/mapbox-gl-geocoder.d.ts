import mapboxgl from 'mapbox-gl';

declare module '@mapbox/mapbox-gl-geocoder' {
  export interface MapboxGeocoderOptions {
    accessToken: string;
    mapboxgl: typeof mapboxgl;
    [key: string]: any;
  }

  export default class MapboxGeocoder {
    constructor(options: MapboxGeocoderOptions);
    onAdd(map: any): HTMLElement;
    onRemove(): void;
  }
}
