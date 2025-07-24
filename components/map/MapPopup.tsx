'use client';

import { CensusTractProperties, ICEMeasure } from '@/lib/types';
import { ICE_MEASURES } from '@/lib/constants';

interface MapPopupProps {
  tract: CensusTractProperties;
  measure: ICEMeasure;
  isHover: boolean;
}

export default function MapPopup({ tract, measure, isHover }: MapPopupProps) {
  const iceValue = tract[measure];
  const measureInfo = ICE_MEASURES[measure];
  
  const formatValue = (value: number | null) => {
    if (value === null) return 'No data';
    return value.toFixed(3);
  };

  const getValueColor = (value: number | null) => {
    if (value === null) return 'text-gray-500';
    if (value < -0.4) return 'text-red-600 font-semibold';
    if (value < 0) return 'text-orange-600';
    if (value > 0.4) return 'text-blue-600 font-semibold';
    if (value > 0) return 'text-sky-600';
    return 'text-gray-600';
  };

  if (isHover) {
    return (
      <div className="p-3 min-w-[200px]">
        <div className="text-sm font-medium text-gray-900">
          Census Tract {tract.GEOID}
        </div>
        <div className={`text-lg ${getValueColor(iceValue)}`}>
          {formatValue(iceValue)}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 min-w-[280px] max-w-[320px]">
      <div className="border-b border-gray-200 pb-3 mb-3">
        <h3 className="text-base font-semibold text-gray-900">
          Census Tract {tract.GEOID}
        </h3>
        {tract.NAME && (
          <p className="text-sm text-gray-600 mt-1">{tract.NAME}</p>
        )}
      </div>

      <div className="space-y-3">
        {/* Current Measure */}
        <div>
          <div className="text-sm font-medium text-gray-700">
            {measureInfo.name}
          </div>
          <div className={`text-2xl font-bold ${getValueColor(iceValue)}`}>
            {formatValue(iceValue)}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {iceValue !== null && iceValue < 0 
              ? `More ${measureInfo.disadvantaged}`
              : iceValue !== null && iceValue > 0
              ? `More ${measureInfo.advantaged}`
              : 'Neutral'
            }
          </div>
        </div>

        {/* Population Info */}
        {tract.total_pop && (
          <div className="pt-2 border-t border-gray-100">
            <div className="text-sm text-gray-600">
              Population: {tract.total_pop.toLocaleString()}
            </div>
          </div>
        )}

        {/* Data Reliability */}
        {tract[`${measure}_reliable`] !== undefined && (
          <div className="flex items-center gap-2 text-xs">
            <div className={`w-2 h-2 rounded-full ${
              tract[`${measure}_reliable`] ? 'bg-green-500' : 'bg-yellow-500'
            }`} />
            <span className="text-gray-600">
              {tract[`${measure}_reliable`] ? 'Reliable estimate' : 'Use with caution'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}