'use client';

import { forwardRef, ButtonHTMLAttributes } from 'react';
import { motion } from 'framer-motion';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger' | 'teal' | 'rose';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', isLoading, children, disabled, style, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
      primary: 'bg-gradient-to-r from-violet-DEFAULT to-indigo-DEFAULT text-white hover:shadow-glow-lg hover:translate-y-[-1px] active:scale-[0.98]',
      secondary: 'bg-cash-green text-navy-950 hover:bg-cash-emerald hover:shadow-glow-teal',
      ghost: 'bg-transparent text-navy-300 hover:bg-navy-800 hover:text-white',
      outline: 'bg-transparent border border-violet-DEFAULT/30 text-white hover:bg-violet-DEFAULT/10 hover:border-violet-DEFAULT/50',
      danger: 'bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20',
      teal: 'bg-gradient-to-r from-teal-DEFAULT to-cash-emerald text-navy-950 hover:shadow-glow-teal hover:translate-y-[-1px] active:scale-[0.98]',
      rose: 'bg-gradient-to-r from-rose-DEFAULT to-violet-DEFAULT text-white hover:shadow-glow-rose hover:translate-y-[-1px] active:scale-[0.98]',
    };

    const sizes = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-3 text-sm',
      lg: 'px-8 py-4 text-base',
    };

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        disabled={disabled || isLoading}
        style={style}
        {...props}
      >
        {isLoading && (
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;

// Motion button variant for animated buttons
export const MotionButton = motion(Button);
