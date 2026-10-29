'use client';

import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles =
    'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variantStyles = {
    primary:
      'bg-primary text-white hover:bg-primary-dark focus:ring-primary active:scale-[0.98]',
    secondary:
      'border-2 border-primary text-primary bg-transparent hover:bg-primary/5 focus:ring-primary',
    outline:
      'border border-border text-text-primary bg-surface hover:bg-surface-tint focus:ring-primary',
    ghost:
      'text-text-muted hover:text-text-primary hover:bg-surface-tint focus:ring-primary',
  };

  const sizeStyles = {
    sm: 'text-sm px-4 py-2 min-h-[36px]',
    md: 'text-[15px] px-6 py-3 min-h-[44px]',
    lg: 'text-base px-8 py-4 min-h-[52px]',
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${
        fullWidth ? 'w-full' : ''
      } ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
