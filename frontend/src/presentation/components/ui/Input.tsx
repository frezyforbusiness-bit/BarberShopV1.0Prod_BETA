import React from 'react';
import { cn } from '../../../shared/utils/cn';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input: React.FC<InputProps> = ({ className, ...props }) => {
  return (
    <input
      className={cn(
        'w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600',
        'bg-white dark:bg-navy text-gray-900 dark:text-cream',
        'focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent',
        className,
      )}
      {...props}
    />
  );
};

