'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function SystemPage() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-[80vh] flex flex-col items-center justify-center px-4"
    >
      {/* Main Content Container */}
      <div className="max-w-4xl w-full text-center space-y-8">
        
        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-2xl md:text-3xl lg:text-4xl font-display font-bold text-white leading-snug"
        >
          Watch The Bonus Training That Took Me To Earning{' '}
          <span className="text-teal-500">$1,000-5,000 Per Day</span>...
        </motion.h1>

        {/* Video Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="relative w-full max-w-3xl mx-auto"
        >
          {/* Video Placeholder - Replace with actual video embed later */}
          <div 
            className="relative bg-white rounded-lg overflow-hidden shadow-2xl"
            style={{ aspectRatio: '16/9' }}
          >
            {/* Placeholder content - will be replaced with video embed */}
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
              {!isPlaying ? (
                <button
                  onClick={() => setIsPlaying(true)}
                  className="group relative"
                >
                  {/* Play button */}
                  <div className="w-20 h-20 md:w-24 md:h-24 bg-red-600 rounded-full flex items-center justify-center shadow-lg group-hover:bg-red-700 transition-all group-hover:scale-110">
                    <svg 
                      width="40" 
                      height="40" 
                      viewBox="0 0 24 24" 
                      fill="white"
                      className="ml-1"
                    >
                      <polygon points="5,3 19,12 5,21" />
                    </svg>
                  </div>
                </button>
              ) : (
                <div className="text-gray-500 text-lg">
                  {/* Video will be embedded here */}
                  <p className="text-center px-8">
                    Video placeholder - embed your video here
                  </p>
                </div>
              )}
            </div>

            {/* Progress bar placeholder at bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gray-300">
              <div className="h-full bg-red-600 w-1/6"></div>
            </div>
          </div>
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <button
            onClick={() => {
              // Can link to next step or show content
              window.location.href = '/app/build';
            }}
            className="w-full max-w-2xl mx-auto block bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-gray-900 font-bold text-xl md:text-2xl py-5 md:py-6 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            Click Here To Continue &gt;&gt;
          </button>
        </motion.div>

      </div>
    </motion.div>
  );
}
