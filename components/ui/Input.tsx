'use client';

import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
}

export function Input({
  label,
  error,
  helperText,
  id,
  className = '',
  ...props
}: InputProps) {
  const inputId = id || label.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={inputId}
        className="text-sm font-medium text-text-primary"
      >
        {label}
      </label>
      <input
        id={inputId}
        className={`w-full px-4 py-3 bg-[#F4F4F4] rounded-lg text-text-primary text-[15px]
          border border-transparent
          focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none
          placeholder:text-text-muted/60
          transition-all duration-200
          min-h-[44px]
          ${error ? 'border-danger focus:border-danger focus:ring-danger/20' : ''}
          ${className}`}
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
        {...props}
      />
      {error && (
        <p id={`${inputId}-error`} className="text-sm text-danger" role="alert">
          {error}
        </p>
      )}
      {helperText && !error && (
        <p id={`${inputId}-helper`} className="text-xs text-text-muted">
          {helperText}
        </p>
      )}
    </div>
  );
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  helperText?: string;
}

export function Textarea({
  label,
  error,
  helperText,
  id,
  className = '',
  ...props
}: TextareaProps) {
  const inputId = id || label.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={inputId}
        className="text-sm font-medium text-text-primary"
      >
        {label}
      </label>
      <textarea
        id={inputId}
        className={`w-full px-4 py-3 bg-[#F4F4F4] rounded-lg text-text-primary text-[15px]
          border border-transparent
          focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none
          placeholder:text-text-muted/60
          transition-all duration-200
          resize-y min-h-[120px]
          ${error ? 'border-danger focus:border-danger focus:ring-danger/20' : ''}
          ${className}`}
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
        {...props}
      />
      {error && (
        <p id={`${inputId}-error`} className="text-sm text-danger" role="alert">
          {error}
        </p>
      )}
      {helperText && !error && (
        <p id={`${inputId}-helper`} className="text-xs text-text-muted">
          {helperText}
        </p>
      )}
    </div>
  );
}
