'use client';

import { forwardRef, ButtonHTMLAttributes } from 'react';
import { motion } from 'framer-motion';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', isLoading, children, disabled, style, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-navy-950';

    const variants = {
      primary: 'bg-gradient-to-r from-violet-DEFAULT to-indigo-DEFAULT text-white hover:from-violet-dark hover:to-indigo-dark focus:ring-violet-DEFAULT active:scale-[0.98] shadow-lg shadow-violet-DEFAULT/25 hover:shadow-xl hover:shadow-violet-DEFAULT/30',
      secondary: 'bg-gradient-to-r from-teal-DEFAULT to-cash-emerald text-navy-950 font-bold hover:from-teal-dark hover:to-cash-green focus:ring-teal-DEFAULT active:scale-[0.98] shadow-lg shadow-teal-DEFAULT/25',
      ghost: 'bg-white/5 text-white hover:bg-white/10 focus:ring-white/50 border border-white/10 hover:border-white/20',
      outline: 'bg-transparent border-2 border-violet-DEFAULT text-violet-DEFAULT hover:bg-violet-DEFAULT hover:text-white focus:ring-violet-DEFAULT active:scale-[0.98]',
      danger: 'bg-gradient-to-r from-red-500 to-rose-500 text-white hover:from-red-600 hover:to-rose-600 focus:ring-red-500 active:scale-[0.98] shadow-lg shadow-red-500/25',
    };

    const sizes = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-3 text-base',
      lg: 'px-8 py-4 text-lg',
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
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
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
