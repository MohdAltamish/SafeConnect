'use client';

import React from 'react';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  labels: string[];
}

/**
 * Progress indicator for the multi-step report form per Design.md §7.
 */
export function StepIndicator({ currentStep, totalSteps, labels }: StepIndicatorProps) {
  return (
    <div className="w-full mb-8">
      {/* Progress bar */}
      <div className="flex items-center gap-1 mb-3">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <div
            key={index}
            className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
              index < currentStep
                ? 'bg-primary'
                : index === currentStep
                ? 'bg-primary/50'
                : 'bg-border'
            }`}
          />
        ))}
      </div>
      {/* Step label */}
      <p className="text-xs text-text-muted">
        Step {currentStep + 1} of {totalSteps}
        {labels[currentStep] && (
          <span className="text-text-primary font-medium"> — {labels[currentStep]}</span>
        )}
      </p>
    </div>
  );
}
