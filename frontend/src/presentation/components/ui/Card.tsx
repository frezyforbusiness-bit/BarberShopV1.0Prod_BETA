import React from 'react';
import { cn } from '../../../shared/utils/cn';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className }) => {
  return (
    <div
      className={cn(
        'rounded-lg border border-gray-200 dark:border-gray-700',
        'bg-white dark:bg-navy-light p-6 shadow-sm',
        className,
      )}
    >
      {children}
    </div>
  );
};

