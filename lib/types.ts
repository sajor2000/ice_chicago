export type ICEMeasure = 'ice_race' | 'ice_income' | 'ice_race_income';

export interface ICEMeasureInfo {
  id: ICEMeasure;
  name: string;
  shortName: string;
  description: string;
  advantaged: string;
  disadvantaged: string;
}

export interface CensusTractProperties {
  GEOID: string;
  NAME?: string;
  NAMELSAD?: string;
  ice_race: number | null;
  ice_income: number | null;
  ice_race_income: number | null;
  ice_race_quintile?: number;
  ice_income_quintile?: number;
  ice_race_income_quintile?: number;
  ice_race_reliable?: boolean;
  ice_income_reliable?: boolean;
  ice_race_income_reliable?: boolean;
  total_pop?: number;
  total_hh_count?: number;
  extreme_deprivation_race?: boolean;
  extreme_deprivation_income?: boolean;
  extreme_deprivation_race_income?: boolean;
}

export interface MapViewState {
  longitude: number;
  latitude: number;
  zoom: number;
  pitch?: number;
  bearing?: number;
}

export interface SelectedTract {
  properties: CensusTractProperties;
  coordinates: [number, number];
}