import React from 'react';
import { cn } from '../../../shared/utils/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = 'default',
  size = 'md',
  ...props
}) => {
  const variants = {
    default: 'bg-gold hover:bg-gold-light text-navy font-semibold',
    outline: 'border-2 border-gold text-gold hover:bg-gold hover:text-navy',
    ghost: 'text-gold hover:bg-gold/10',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      className={cn(
        'rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2',
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
};


