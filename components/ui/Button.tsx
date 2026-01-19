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
    const baseStyles = 'relative inline-flex items-center justify-center gap-3 font-bold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none overflow-hidden';

    const variants = {
      primary: `
        bg-gradient-to-r from-gold-DEFAULT to-gold-bright text-black rounded-2xl
        shadow-[0_4px_20px_rgba(234,179,8,0.4),0_0_40px_rgba(234,179,8,0.15),inset_0_1px_0_rgba(255,255,255,0.3)]
        hover:shadow-[0_8px_32px_rgba(234,179,8,0.5),0_0_60px_rgba(234,179,8,0.25),inset_0_1px_0_rgba(255,255,255,0.4)]
        hover:-translate-y-0.5
        active:scale-95
        focus:ring-4 focus:ring-gold-DEFAULT/30
        before:absolute before:inset-0 before:bg-gradient-to-r before:from-gold-bright before:to-gold-light before:opacity-0 before:transition-opacity hover:before:opacity-100
      `,
      secondary: `
        bg-gradient-to-r from-teal-DEFAULT to-cyan-DEFAULT text-white rounded-2xl
        shadow-[0_4px_20px_rgba(16,185,129,0.4),inset_0_1px_0_rgba(255,255,255,0.2)]
        hover:shadow-[0_8px_32px_rgba(16,185,129,0.5)]
        hover:-translate-y-0.5
        active:scale-95
        focus:ring-4 focus:ring-teal-DEFAULT/30
      `,
      ghost: `
        bg-white/5 text-white rounded-2xl border border-white/10
        hover:bg-white/10 hover:border-white/20
        active:scale-95
        focus:ring-4 focus:ring-white/20
      `,
      outline: `
        bg-teal-DEFAULT/5 text-teal-DEFAULT rounded-2xl border-2 border-teal-DEFAULT/40
        shadow-[0_0_20px_rgba(16,185,129,0.1)]
        hover:bg-teal-DEFAULT/15 hover:border-teal-DEFAULT hover:shadow-[0_0_30px_rgba(16,185,129,0.3)]
        hover:-translate-y-0.5
        active:scale-95
        focus:ring-4 focus:ring-teal-DEFAULT/20
      `,
      danger: `
        bg-gradient-to-r from-red-500 to-rose-DEFAULT text-white rounded-2xl
        shadow-[0_4px_20px_rgba(220,38,38,0.4)]
        hover:shadow-[0_8px_32px_rgba(220,38,38,0.5)]
        hover:-translate-y-0.5
        active:scale-95
        focus:ring-4 focus:ring-red-500/30
      `,
    };

    const sizes = {
      sm: 'px-6 py-3 text-sm',
      md: 'px-8 py-4 text-base',
      lg: 'px-10 py-5 text-lg',
    };

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        disabled={disabled || isLoading}
        style={style}
        {...props}
      >
        <span className="relative z-10 flex items-center gap-3">
          {isLoading && (
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          )}
          {children}
        </span>
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;

// Motion button variant for animated buttons
export const MotionButton = motion(Button);
