'use client';

import { motion } from 'framer-motion';

const PhoneMoneyIcon = () => (
  <svg width="48" height="48" viewBox="0 0 64 64" fill="none">
    <rect x="18" y="4" width="28" height="56" rx="4" stroke="currentColor" strokeWidth="2.5"/>
    <circle cx="32" cy="52" r="2" fill="currentColor"/>
    <line x1="24" y1="12" x2="40" y2="12" stroke="currentColor" strokeWidth="2"/>
    
    {/* Dollar signs floating */}
    <text x="8" y="24" fontSize="12" fill="#22c55e" fontWeight="bold">$</text>
    <text x="50" y="20" fontSize="10" fill="#22c55e" fontWeight="bold">$</text>
    <text x="6" y="40" fontSize="10" fill="#22c55e" fontWeight="bold">$</text>
    <text x="52" y="38" fontSize="12" fill="#22c55e" fontWeight="bold">$</text>
    <text x="48" y="52" fontSize="10" fill="#22c55e" fontWeight="bold">$</text>
  </svg>
);

export default function PromoCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl"
    >
      {/* Animated border glow */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cash-green via-cash-emerald to-cash-green opacity-70 animate-glow" />
      
      {/* Inner content */}
      <div className="relative m-[2px] rounded-2xl bg-gradient-to-br from-navy-900 via-[#0a1f1a] to-navy-900 p-6">
        <div className="flex items-start gap-5">
          {/* Icon */}
          <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-cash-green/20 to-cash-emerald/20 border border-cash-green/30 flex items-center justify-center text-cash-green">
            <PhoneMoneyIcon />
          </div>
          
          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className="text-2xl sm:text-3xl font-display font-bold text-gold-400 leading-tight mb-4">
              Want To Multiply Your Earnings To $1,000 – $5,000 A Day?
            </h3>
            <p className="text-gray-200 text-base sm:text-lg leading-relaxed mb-6">
              Cash Formula Is Great, but if you want to scale to truly life-changing income, you need to watch this training which shows how to make the serious big boy big girl money. And guess what? This training is free if you&apos;re a Cash Formula member. So, if you want to watch the training, just tap the yellow button below.
            </p>
            <a
              href="https://freedomescapexcelerator.com/2k-per-day"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 btn-gold"
            >
              <span>Click Here To Learn How</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
