import React from 'react';
import { cn } from '../utils/cn';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, className }) => (
  <div className={cn(
    "backdrop-blur-md bg-[var(--sentinel-card-bg)] border border-[var(--sentinel-border)] rounded-2xl transition-colors duration-300",
    className
  )}>
    {children}
  </div>
);
