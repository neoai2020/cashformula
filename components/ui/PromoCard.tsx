'use client';

import { motion } from 'framer-motion';

const PhoneMoneyIcon = () => (
  <svg width="56" height="56" viewBox="0 0 64 64" fill="none">
    <rect x="18" y="8" width="24" height="48" rx="3" stroke="currentColor" strokeWidth="2"/>
    <line x1="24" y1="14" x2="38" y2="14" stroke="currentColor" strokeWidth="1.5"/>
    
    {/* Dollar signs floating */}
    <text x="6" y="28" fontSize="14" fill="#facc15" fontWeight="bold">$</text>
    <text x="50" y="24" fontSize="12" fill="#facc15" fontWeight="bold">$</text>
    <text x="4" y="46" fontSize="12" fill="#facc15" fontWeight="bold">$</text>
    <text x="52" y="42" fontSize="14" fill="#facc15" fontWeight="bold">$</text>
  </svg>
);

export default function PromoCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 p-5"
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="flex-shrink-0 text-white/90">
          <PhoneMoneyIcon />
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg sm:text-xl font-bold text-white leading-snug mb-2">
            Want To Multiply Your Earnings To $1,000 - $5,000 A Day?
          </h3>
          <p className="text-white/80 text-sm leading-relaxed mb-4">
            Cash Formula Is Great, but if you want to scale to truly life-changing income, you need to watch this training which shows how to make the serious big boy big girl money. And guess what? This training is free if you&apos;re a Cash Formula member. So, if you want to watch the training, just tap the yellow button below.
          </p>
          <a
            href="https://freedomescapexcelerator.com/2k-per-day"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-semibold px-5 py-2.5 rounded-lg transition-colors text-sm"
          >
            <span>Click Here To Learn How</span>
          </a>
        </div>
      </div>
    </motion.div>
  );
}
