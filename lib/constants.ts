import { ICEMeasureInfo } from './types';

export const ICE_MEASURES: Record<string, ICEMeasureInfo> = {
  ice_race: {
    id: 'ice_race',
    name: 'Racial Segregation',
    shortName: 'Race',
    description: 'Concentration of White non-Hispanic vs Black non-Hispanic populations',
    advantaged: 'White non-Hispanic',
    disadvantaged: 'Black non-Hispanic',
  },
  ice_income: {
    id: 'ice_income',
    name: 'Economic Segregation',
    shortName: 'Income',
    description: 'Concentration of high-income vs low-income households',
    advantaged: 'Households ≥$100,000',
    disadvantaged: 'Households <$25,000',
  },
  ice_race_income: {
    id: 'ice_race_income',
    name: 'Racialized Economic Segregation',
    shortName: 'Race + Income',
    description: 'Combined racial and economic segregation',
    advantaged: 'White non-Hispanic ≥$100k',
    disadvantaged: 'Black non-Hispanic <$25k',
  },
};

export const QUINTILE_LABELS = {
  1: 'Most Deprived',
  2: 'Deprived',
  3: 'Middle',
  4: 'Privileged',
  5: 'Most Privileged',
};

export const RELIABILITY_LABELS = {
  reliable: 'Reliable estimate',
  flagged: 'Use with caution',
  unreliable: 'Unreliable estimate',
};