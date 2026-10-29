import React from 'react';
import { type ReportStatus, STATUS_LABELS } from '@/types';

type BadgeVariant = 'default' | 'outline' | 'warning' | 'error' | 'success' | 'secondary';
type BadgeSize = 'sm' | 'md';

interface StatusBadgeProps {
  status: ReportStatus;
  className?: string;
  children?: never;
  variant?: never;
  size?: never;
}

interface GenericBadgeProps {
  status?: never;
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  className?: string;
}

export type BadgeProps = StatusBadgeProps | GenericBadgeProps;

export function Badge(props: BadgeProps) {
  if ('status' in props && props.status) {
    const statusStyles: Record<ReportStatus, string> = {
      NEW: 'bg-neutral/10 text-neutral border-neutral/20',
      UNDER_REVIEW: 'bg-warning/10 text-warning border-warning/20',
      ACTION_TAKEN: 'bg-secondary/10 text-secondary border-secondary/20',
      CLOSED: 'bg-success/10 text-success border-success/20',
    };

    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${
          statusStyles[props.status]
        } ${props.className || ''}`}
      >
        {STATUS_LABELS[props.status]}
      </span>
    );
  }

  const { variant = 'default', size = 'md', className = '', children } = props;

  const variantStyles: Record<BadgeVariant, string> = {
    default: 'bg-primary/10 text-primary border-primary/20',
    outline: 'bg-surface text-text-secondary border-border',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    error: 'bg-error-50 text-error border-error/20',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    secondary: 'bg-surface-tint text-text-secondary border-border/60',
  };

  const sizeStyles: Record<BadgeSize, string> = {
    sm: 'px-2 py-0.5 text-[11px]',
    md: 'px-2.5 py-1 text-xs',
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </span>
  );
}
