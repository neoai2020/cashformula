'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from './Confetti';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  message?: string;
  earnings?: string;
  primaryAction?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  variant?: 'default' | 'gold' | 'platinum';
}

const CheckIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
    <polyline points="20,6 9,17 4,12" />
  </svg>
);

const SparkleIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
  </svg>
);

export default function SuccessModal({
  isOpen,
  onClose,
  title = '🎉 SUCCESS!',
  subtitle,
  message = "You did it! Keep up the great work!",
  earnings,
  primaryAction,
  secondaryAction,
  variant = 'default',
}: SuccessModalProps) {
  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const gradientClass = {
    default: 'from-cash-green to-cash-emerald',
    gold: 'from-gold-400 to-gold-600',
    platinum: 'from-purple-400 to-purple-600',
  }[variant];

  const bgGlowClass = {
    default: 'shadow-cash-green/30',
    gold: 'shadow-gold-400/30',
    platinum: 'shadow-purple-400/30',
  }[variant];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Confetti */}
          <Confetti isActive={isOpen} />

          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-navy-950/90 backdrop-blur-sm z-[90]"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="fixed inset-0 flex items-center justify-center z-[95] p-4"
          >
            <div className={`relative w-full max-w-md rounded-3xl overflow-hidden shadow-2xl ${bgGlowClass}`}>
              {/* Animated border */}
              <div className={`absolute inset-0 bg-gradient-to-r ${gradientClass} opacity-80`} />
              
              {/* Content */}
              <div className="relative m-[3px] rounded-3xl bg-gradient-to-b from-navy-800 to-navy-900 p-8 text-center">
                {/* Close Button - Top Right */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 z-10 w-10 h-10 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-red-500/50 transition-all hover:scale-110 active:scale-95"
                  aria-label="Close"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>

                {/* Floating sparkles */}
                <div className="absolute top-4 left-4 text-gold-400 animate-pulse opacity-60">
                  <SparkleIcon />
                </div>
                <div className="absolute top-16 right-8 text-gold-400 animate-pulse opacity-40 scale-75">
                  <SparkleIcon />
                </div>
                <div className="absolute bottom-12 left-8 text-gold-400 animate-pulse opacity-50 scale-50">
                  <SparkleIcon />
                </div>

                {/* Success Icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
                  className={`w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br ${gradientClass} flex items-center justify-center text-white shadow-lg ${bgGlowClass}`}
                >
                  <CheckIcon />
                </motion.div>

                {/* Title */}
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-3xl font-display font-bold text-white mb-2"
                >
                  {title}
                </motion.h2>

                {/* Subtitle */}
                {subtitle && (
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                    className={`text-xl font-semibold bg-gradient-to-r ${gradientClass} bg-clip-text text-transparent mb-4`}
                  >
                    {subtitle}
                  </motion.p>
                )}

                {/* Message */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-navy-300 text-lg mb-6"
                >
                  {message}
                </motion.p>

                {/* Earnings Display */}
                {earnings && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                    className="bg-navy-800/50 rounded-2xl p-5 mb-6 border border-navy-700"
                  >
                    <p className="text-sm text-navy-400 mb-1">Potential Earnings</p>
                    <p className="text-3xl font-bold text-cash-green">{earnings}</p>
                    <p className="text-xs text-navy-500 mt-1">Based on average member results</p>
                  </motion.div>
                )}

                {/* Actions */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="space-y-3"
                >
                  {primaryAction && (
                    <button
                      onClick={primaryAction.onClick}
                      className={`w-full py-4 px-6 rounded-xl font-bold text-lg bg-gradient-to-r ${gradientClass} text-navy-950 hover:shadow-lg hover:scale-[1.02] transition-all`}
                    >
                      {primaryAction.label}
                    </button>
                  )}
                  {secondaryAction && (
                    <button
                      onClick={secondaryAction.onClick}
                      className="w-full py-3 px-6 rounded-xl font-medium text-navy-300 hover:text-white hover:bg-navy-800 transition-all border border-navy-700"
                    >
                      {secondaryAction.label}
                    </button>
                  )}
                  {!primaryAction && !secondaryAction && (
                    <button
                      onClick={onClose}
                      className={`w-full py-4 px-6 rounded-xl font-bold text-lg bg-gradient-to-r ${gradientClass} text-navy-950 hover:shadow-lg hover:scale-[1.02] transition-all`}
                    >
                      Keep Going! 🚀
                    </button>
                  )}
                </motion.div>

                {/* Social proof footer */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="mt-6 text-sm text-navy-500"
                >
                  🔥 Join 12,847+ members making money daily
                </motion.p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
