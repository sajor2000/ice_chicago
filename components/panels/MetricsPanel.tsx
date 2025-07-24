'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { ICEMeasure } from '@/lib/types';
import { ICE_MEASURES } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface MetricsPanelProps {
  selectedMeasure: ICEMeasure;
  onMeasureChange: (measure: ICEMeasure) => void;
  stats?: {
    totalTracts: number;
    priorityTracts: number;
    avgValue: number;
  };
}

export default function MetricsPanel({ 
  selectedMeasure, 
  onMeasureChange,
  stats 
}: MetricsPanelProps) {
  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="absolute top-6 left-6 lg:top-6 lg:left-6 right-6 lg:right-auto z-10 w-auto lg:w-80 max-w-full lg:max-w-none"
    >
      <Card>
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-1">
              Chicago ICE Analysis
            </h2>
            <p className="text-sm text-gray-600">
              Index of Concentration at the Extremes
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-medium text-gray-700 uppercase tracking-wider">
              Select Measure
            </p>
            {Object.values(ICE_MEASURES).map((measure) => (
              <button
                key={measure.id}
                onClick={() => onMeasureChange(measure.id)}
                className={cn(
                  "w-full text-left p-3 rounded-lg transition-all duration-200",
                  "hover:bg-gray-50 group",
                  selectedMeasure === measure.id
                    ? "bg-blue-50 border-2 border-blue-500"
                    : "border-2 border-transparent"
                )}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className={cn(
                      "font-medium transition-colors",
                      selectedMeasure === measure.id
                        ? "text-blue-900"
                        : "text-gray-900 group-hover:text-blue-700"
                    )}>
                      {measure.shortName}
                    </h3>
                    <p className="text-xs text-gray-600 mt-0.5">
                      {measure.description}
                    </p>
                  </div>
                  {selectedMeasure === measure.id && (
                    <motion.div
                      layoutId="selected-indicator"
                      className="w-2 h-2 bg-blue-500 rounded-full mt-1.5"
                    />
                  )}
                </div>
              </button>
            ))}
          </div>

          {stats && (
            <div className="pt-4 border-t border-gray-200 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total census tracts</span>
                <span className="font-medium text-gray-900">{stats.totalTracts}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Priority areas</span>
                <span className="font-medium text-red-600">{stats.priorityTracts}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Average ICE value</span>
                <span className="font-medium text-gray-900">
                  {stats.avgValue.toFixed(3)}
                </span>
              </div>
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}