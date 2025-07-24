'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Info, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { CensusTractProperties, ICEMeasure } from '@/lib/types';
import { ICE_MEASURES, QUINTILE_LABELS } from '@/lib/constants';

interface DetailsPanelProps {
  tract: CensusTractProperties | null;
  measure: ICEMeasure;
  onClose: () => void;
}

export default function DetailsPanel({ tract, measure, onClose }: DetailsPanelProps) {
  if (!tract) return null;

  const measureInfo = ICE_MEASURES[measure];
  const iceValue = tract[measure];
  const quintile = tract[`${measure}_quintile`];
  const isReliable = tract[`${measure}_reliable`];
  const isPriorityArea = iceValue !== null && iceValue < -0.4;

  const formatValue = (value: number | null) => {
    if (value === null) return 'No data';
    return value.toFixed(3);
  };

  const getValueColor = (value: number | null) => {
    if (value === null) return 'text-gray-500';
    if (value < -0.4) return 'text-red-600';
    if (value < 0) return 'text-orange-600';
    if (value > 0.4) return 'text-blue-600';
    if (value > 0) return 'text-sky-600';
    return 'text-gray-600';
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: 400, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 400, opacity: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="absolute top-6 right-6 left-6 lg:left-auto bottom-6 z-10 w-auto lg:w-96 overflow-hidden"
      >
        <Card className="h-full flex flex-col">
          {/* Header */}
          <div className="flex items-start justify-between pb-4 border-b border-gray-200">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Census Tract {tract.GEOID}
              </h3>
              {tract.NAMELSAD && (
                <p className="text-sm text-gray-600 mt-0.5">{tract.NAMELSAD}</p>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto custom-scrollbar py-4 space-y-6">
            {/* ICE Value Display */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                {measureInfo.name}
              </h4>
              <div className={`text-3xl font-bold ${getValueColor(iceValue)}`}>
                {formatValue(iceValue)}
              </div>
              
              {quintile && (
                <div className="mt-2 text-sm text-gray-600">
                  Quintile {quintile}: {QUINTILE_LABELS[quintile as keyof typeof QUINTILE_LABELS]}
                </div>
              )}

              {isPriorityArea && (
                <div className="mt-3 flex items-center gap-2 text-sm text-red-600">
                  <AlertCircle className="w-4 h-4" />
                  <span className="font-medium">Priority Area</span>
                </div>
              )}
            </div>

            {/* Interpretation */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Interpretation
              </h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                {iceValue !== null && iceValue < 0 ? (
                  <>This tract has a higher concentration of <span className="font-medium">{measureInfo.disadvantaged}</span> residents.</>
                ) : iceValue !== null && iceValue > 0 ? (
                  <>This tract has a higher concentration of <span className="font-medium">{measureInfo.advantaged}</span> residents.</>
                ) : (
                  <>This tract has a balanced distribution between the compared groups.</>
                )}
              </p>
            </div>

            {/* Demographics */}
            {(tract.total_pop || tract.total_hh_count) && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Demographics
                </h4>
                <div className="space-y-2">
                  {tract.total_pop && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Total Population</span>
                      <span className="font-medium">{tract.total_pop.toLocaleString()}</span>
                    </div>
                  )}
                  {tract.total_hh_count && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Total Households</span>
                      <span className="font-medium">{tract.total_hh_count.toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Data Quality */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Data Quality
              </h4>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${
                  isReliable ? 'bg-green-500' : 'bg-yellow-500'
                }`} />
                <span className="text-sm text-gray-600">
                  {isReliable ? 'Reliable estimate' : 'Use with caution'}
                </span>
              </div>
              {!isReliable && (
                <p className="text-xs text-gray-500 mt-2 flex items-start gap-1">
                  <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
                  <span>
                    This estimate has a high margin of error and should be interpreted with caution.
                  </span>
                </p>
              )}
            </div>
          </div>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}