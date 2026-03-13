import React from 'react';
import { cn } from '../utils/cn';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, className }) => (
  <div className={cn(
    "backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl",
    className
  )}>
    {children}
  </div>
);
