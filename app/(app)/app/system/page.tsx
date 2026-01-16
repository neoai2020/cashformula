'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

// Icons
const CashIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="2" y="6" width="20" height="12" rx="2" />
    <circle cx="12" cy="12" r="3" />
    <path d="M6 12h.01M18 12h.01" />
  </svg>
);

const TrendUpIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="23,6 13.5,15.5 8.5,10.5 1,18" />
    <polyline points="17,6 23,6 23,12" />
  </svg>
);

const ClockIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12,6 12,12 16,14" />
  </svg>
);

const TargetIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
);

const CheckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <polyline points="20,6 9,17 4,12" />
  </svg>
);

const PlayIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="5,3 19,12 5,21" />
  </svg>
);

const ShareIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
  </svg>
);

export default function SystemPage() {
  const [pagesCount, setPagesCount] = useState(5);
  const [understoodSteps, setUnderstoodSteps] = useState<number[]>([]);

  const steps = [
    {
      num: 1,
      title: 'Build a Page',
      description: 'Use our AI to create a high-converting profit page in just 2 minutes',
      icon: TargetIcon,
      action: '/app/build',
      actionText: 'Build Now',
    },
    {
      num: 2,
      title: 'Share on Social',
      description: 'Post your page link on Facebook, TikTok, WhatsApp, and more',
      icon: ShareIcon,
      action: '/app/traffic',
      actionText: 'Get Captions',
    },
    {
      num: 3,
      title: 'Earn Commissions',
      description: 'Get paid when people buy through your affiliate link',
      icon: CashIcon,
      action: null,
      actionText: '💰',
    },
  ];

  const features = [
    'No website needed',
    'No inventory required',
    'No tech skills necessary',
    'Works from anywhere',
    'Start in under 10 minutes',
    'Free traffic methods',
  ];

  const toggleUnderstood = (stepNum: number) => {
    setUnderstoodSteps(prev => 
      prev.includes(stepNum) 
        ? prev.filter(n => n !== stepNum)
        : [...prev, stepNum]
    );
  };

  // Calculate estimated earnings based on slider
  const estimatedEarnings = Math.round(pagesCount * 47 * 4); // $47 avg commission * 4 sales per page per month
  const estimatedMin = Math.round(estimatedEarnings * 0.5);
  const estimatedMax = Math.round(estimatedEarnings * 1.5);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-cash-green/10 border border-cash-green/20 rounded-full text-cash-green text-base font-bold mb-6">
          <CashIcon />
          <span>The Cash Formula System</span>
        </div>
        <h1 className="text-4xl lg:text-5xl font-display font-bold text-white mb-4">
          Make Money in <span className="text-cash-green">3 Simple Steps</span>
        </h1>
        <p className="text-navy-300 text-xl">
          A proven system to generate income with affiliate marketing - even if you&apos;ve never done this before!
        </p>
      </div>

      {/* Interactive Steps */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {steps.map((step, i) => {
          const Icon = step.icon;
          const isUnderstood = understoodSteps.includes(step.num);
          return (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 }}
              className={`glass-card rounded-3xl p-8 relative overflow-hidden transition-all ${
                isUnderstood ? 'border-2 border-cash-green/30' : ''
              }`}
            >
              <div className="absolute top-4 right-4 text-7xl font-display font-bold text-navy-800/50">
                {step.num}
              </div>
              <div className="relative">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${
                  isUnderstood 
                    ? 'bg-cash-green/20 text-cash-green' 
                    : 'bg-gold-500/10 text-gold-400'
                }`}>
                  <Icon />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">
                  {step.title}
                </h3>
                <p className="text-navy-300 text-lg mb-6">
                  {step.description}
                </p>
                
                {/* Action button */}
                {step.action && (
                  <Link 
                    href={step.action}
                    className="inline-flex items-center gap-2 px-5 py-3 bg-gold-500/10 hover:bg-gold-500/20 text-gold-400 rounded-xl font-medium transition-all mb-4"
                  >
                    <span>{step.actionText}</span>
                    <ArrowRightIcon />
                  </Link>
                )}
                
                {!step.action && (
                  <div className="text-4xl mb-4">{step.actionText}</div>
                )}
                
                {/* Understood checkbox */}
                <button
                  onClick={() => toggleUnderstood(step.num)}
                  className={`flex items-center gap-3 w-full p-3 rounded-xl transition-all ${
                    isUnderstood 
                      ? 'bg-cash-green/10 text-cash-green' 
                      : 'bg-navy-800/50 text-navy-400 hover:bg-navy-800'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                    isUnderstood ? 'bg-cash-green text-white' : 'border-2 border-navy-600'
                  }`}>
                    {isUnderstood && <CheckIcon />}
                  </div>
                  <span className="font-medium">{isUnderstood ? 'Got it!' : 'I understand'}</span>
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Progress indicator */}
      <div className="text-center">
        <p className="text-navy-400 mb-2">Your understanding progress</p>
        <div className="flex justify-center gap-2">
          {steps.map((step) => (
            <div
              key={step.num}
              className={`w-16 h-2 rounded-full transition-all ${
                understoodSteps.includes(step.num) ? 'bg-cash-green' : 'bg-navy-700'
              }`}
            />
          ))}
        </div>
        <p className="text-sm text-navy-500 mt-2">
          {understoodSteps.length === 3 ? '🎉 You got it! Ready to start!' : `${understoodSteps.length}/3 steps understood`}
        </p>
      </div>

      {/* Earnings Calculator - NEW */}
      <div className="glass-card rounded-3xl p-8 border border-gold-500/20">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">
            💰 Earnings Calculator
          </h2>
          <p className="text-navy-300">
            See your earning potential based on the number of pages you create
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <div className="flex justify-between mb-3">
              <span className="text-navy-400 text-lg">Number of pages</span>
              <span className="text-gold-400 font-bold text-2xl">{pagesCount}</span>
            </div>
            <input
              type="range"
              min="1"
              max="20"
              value={pagesCount}
              onChange={(e) => setPagesCount(parseInt(e.target.value))}
              className="w-full h-3 bg-navy-800 rounded-full appearance-none cursor-pointer accent-gold-400"
            />
            <div className="flex justify-between text-sm text-navy-500 mt-2">
              <span>1 page</span>
              <span>20 pages</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="p-5 bg-navy-800/50 rounded-2xl">
              <p className="text-sm text-navy-400 mb-1">Low Estimate</p>
              <p className="text-2xl font-bold text-white">${estimatedMin.toLocaleString()}</p>
              <p className="text-xs text-navy-500">/month</p>
            </div>
            <div className="p-5 bg-cash-green/10 rounded-2xl border border-cash-green/20">
              <p className="text-sm text-cash-green mb-1">Average</p>
              <p className="text-4xl font-bold text-cash-green">${estimatedEarnings.toLocaleString()}</p>
              <p className="text-xs text-cash-green/70">/month</p>
            </div>
            <div className="p-5 bg-navy-800/50 rounded-2xl">
              <p className="text-sm text-navy-400 mb-1">High Estimate</p>
              <p className="text-2xl font-bold text-white">${estimatedMax.toLocaleString()}</p>
              <p className="text-xs text-navy-500">/month</p>
            </div>
          </div>

          <p className="text-center text-sm text-navy-500 mt-4">
            *Based on average $47 commission and typical conversion rates. Results vary.
          </p>
        </div>
      </div>

      {/* Features */}
      <div className="glass-card rounded-3xl p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-3xl font-display font-bold text-white mb-6">
              Why This System Works
            </h2>
            <ul className="space-y-4">
              {features.map((feature, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-4"
                >
                  <div className="w-8 h-8 bg-cash-green/20 rounded-full flex items-center justify-center text-cash-green flex-shrink-0">
                    <CheckIcon />
                  </div>
                  <span className="text-white text-lg">{feature}</span>
                </motion.li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <div className="glass-card rounded-2xl p-6 border-gold-500/20 border">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gold-500/10 rounded-xl flex items-center justify-center text-gold-400">
                  <ClockIcon />
                </div>
                <div>
                  <p className="text-navy-400">Average Time to First Sale</p>
                  <p className="text-3xl font-bold text-white">24-48 Hours</p>
                </div>
              </div>
            </div>
            <div className="glass-card rounded-2xl p-6 border-cash-green/20 border">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-cash-green/10 rounded-xl flex items-center justify-center text-cash-green">
                  <TrendUpIcon />
                </div>
                <div>
                  <p className="text-navy-400">Average Commission</p>
                  <p className="text-3xl font-bold text-white">$47 - $127</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Timeline - NEW */}
      <div className="glass-card rounded-3xl p-8">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          Your Path to $1,000 💰
        </h2>
        <div className="max-w-3xl mx-auto">
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-navy-700" />
            
            {[
              { day: 'Day 1', title: 'Create your first page', icon: '📄' },
              { day: 'Day 2-3', title: 'Share on social media', icon: '📱' },
              { day: 'Day 4-7', title: 'Get your first clicks', icon: '👆' },
              { day: 'Week 1-2', title: 'First commission!', icon: '💰' },
              { day: 'Week 3-4', title: 'Scale to $500+', icon: '🚀' },
              { day: 'Month 2', title: '$1,000+ monthly', icon: '🎯' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-6 mb-6 relative">
                <div className="w-12 h-12 bg-navy-800 rounded-full flex items-center justify-center text-2xl z-10 border-2 border-navy-700">
                  {item.icon}
                </div>
                <div className="flex-1 pb-6">
                  <p className="text-gold-400 font-bold mb-1">{item.day}</p>
                  <p className="text-white text-lg">{item.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center">
        <Link
          href="/app/build"
          className="inline-flex items-center gap-4 bg-gradient-to-r from-gold-400 to-gold-500 text-navy-950 font-bold text-xl px-10 py-5 rounded-2xl hover:shadow-gold-lg hover:scale-[1.02] transition-all animate-pulse-glow"
        >
          <PlayIcon />
          <span>Start Building Your First Page</span>
          <ArrowRightIcon />
        </Link>
        <p className="mt-4 text-navy-400">
          🚀 Takes only 2 minutes to create your first profit page!
        </p>
      </div>
    </motion.div>
  );
}
