"use client";

import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children?: ReactNode;
};

export const Button = (props: ButtonProps) => {
  const {
    className,
    variant = 'primary',
    size = 'md',
    isLoading,
    children,
    ...rest
  } = props;

  const variants = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm',
    secondary: 'bg-slate-200 text-slate-900 hover:bg-slate-300',
    outline: 'border border-slate-300 bg-transparent hover:bg-slate-50',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
        variants[variant],
        sizes[size],
        className
      )}
      disabled={isLoading || props.disabled}
      {...rest}
    >
      {isLoading ? (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      ) : null}
      {children}
    </button>
  );
};

export const Card = ({ className, children }: { className?: string; children: React.ReactNode }) => (
  <div className={cn('bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden', className)}>
    {children}
  </div>
);

export const StatCard = ({ title, value, icon: Icon, color }: { title: string; value: string | number; icon: any; color: string }) => (
  <Card className="p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">{title}</p>
        <h3 className="text-3xl font-bold mt-1 text-slate-900">{value}</h3>
      </div>
      <div className={cn('p-3 rounded-xl', color)}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  </Card>
);
