'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Confetti from '@/components/ui/Confetti';

// Icons
const PlayIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="5,3 19,12 5,21" />
  </svg>
);

const RocketIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
    <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
    <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
    <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
  </svg>
);

const CheckIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <polyline points="20,6 9,17 4,12" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
);

const StarIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
  </svg>
);

const UsersIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

export default function TrainingPage() {
  const [watchedSections, setWatchedSections] = useState<number[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);

  const benefits = [
    'Proven step-by-step system to earn $1,000-$5,000/day',
    'Works even if you have zero experience',
    'No website, inventory, or tech skills needed',
    'Free for Cash Formula members',
    'Live case studies showing real results',
    'Bonus: Private community access included',
  ];

  const videoSections = [
    { id: 1, title: 'Introduction & Overview', duration: '2:15' },
    { id: 2, title: 'The 3-Step System Explained', duration: '4:30' },
    { id: 3, title: 'Creating Your First Page', duration: '6:45' },
    { id: 4, title: 'Traffic Strategies That Work', duration: '8:20' },
    { id: 5, title: 'Scaling to $5K/Day', duration: '5:10' },
  ];

  const toggleWatched = (sectionId: number) => {
    const newWatched = watchedSections.includes(sectionId)
      ? watchedSections.filter(id => id !== sectionId)
      : [...watchedSections, sectionId];
    
    setWatchedSections(newWatched);
    
    // Show confetti when all sections are watched
    if (newWatched.length === videoSections.length && !watchedSections.includes(sectionId)) {
      setShowConfetti(true);
    }
  };

  const allWatched = watchedSections.length === videoSections.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Confetti for completion */}
      <Confetti isActive={showConfetti} onComplete={() => setShowConfetti(false)} />

      {/* Hero Section */}
      <div className="relative glass-card rounded-3xl p-8 lg:p-12 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-cash-green/10 rounded-full blur-3xl" />
        
        <div className="relative max-w-3xl">
          <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-gold-500/10 border border-gold-500/20 rounded-full text-gold-400 text-base font-bold mb-6 w-fit">
            <span className="w-6 h-6"><RocketIcon /></span>
            <span>Exclusive Training</span>
          </div>
          
          <h1 className="text-3xl lg:text-5xl font-display font-bold text-white mb-4 leading-tight">
            Learn to Earn <span className="gold-text">$1,000-$5,000</span> Per Day
          </h1>
          
          <p className="text-navy-300 text-xl mb-8 leading-relaxed">
            Cash Formula is amazing, but this training takes you to the next level. 
            Learn the exact blueprint successful affiliates use to generate life-changing income.
          </p>
          
          <ul className="space-y-4 mb-8">
            {benefits.map((benefit, i) => (
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
                <span className="text-white text-lg">{benefit}</span>
              </motion.li>
            ))}
          </ul>
          
          <a
            href="https://freedomescapexcelerator.com/2k-per-day"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-4 bg-gradient-to-r from-gold-400 to-gold-500 text-navy-950 font-bold text-xl px-10 py-5 rounded-2xl hover:shadow-gold-lg hover:scale-[1.02] transition-all animate-pulse-glow"
          >
            <PlayIcon />
            <span>Watch Free Training Now</span>
            <ArrowRightIcon />
          </a>
        </div>
      </div>

      {/* Video Player Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Video */}
        <div className="lg:col-span-2 glass-card rounded-3xl overflow-hidden">
          <div className="aspect-video bg-navy-800 flex items-center justify-center relative group cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 to-transparent" />
            <a
              href="https://freedomescapexcelerator.com/2k-per-day"
              target="_blank"
              rel="noopener noreferrer"
              className="relative z-10 text-center"
            >
              <div className="w-24 h-24 bg-gold-400 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-gold-lg animate-pulse-glow">
                <PlayIcon />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                Free Training Video
              </h3>
              <p className="text-navy-300 text-lg">
                Click to watch the full system walkthrough
              </p>
            </a>
          </div>

          {/* Social proof bar */}
          <div className="p-5 border-t border-navy-700 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 text-gold-400">
                {[1,2,3,4,5].map(i => <StarIcon key={i} />)}
              </div>
              <span className="text-navy-300">4.9/5 rating</span>
            </div>
            <div className="flex items-center gap-2 text-navy-400">
              <UsersIcon />
              <span><strong className="text-white">12,847</strong> members watched</span>
            </div>
          </div>
        </div>

        {/* Video Sections Checklist */}
        <div className="glass-card rounded-2xl p-6">
          <h3 className="font-bold text-white mb-4 text-lg flex items-center gap-2">
            📋 Training Sections
          </h3>
          
          <div className="space-y-3">
            {videoSections.map((section) => {
              const isWatched = watchedSections.includes(section.id);
              return (
                <button
                  key={section.id}
                  onClick={() => toggleWatched(section.id)}
                  className={`w-full flex items-center gap-3 p-4 rounded-xl transition-all text-left ${
                    isWatched 
                      ? 'bg-cash-green/10 border border-cash-green/20' 
                      : 'bg-navy-800/50 border border-navy-700 hover:border-navy-600'
                  }`}
                >
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    isWatched ? 'bg-cash-green text-white' : 'border-2 border-navy-600'
                  }`}>
                    {isWatched && <CheckIcon />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-medium truncate ${isWatched ? 'text-white' : 'text-navy-300'}`}>
                      {section.title}
                    </p>
                  </div>
                  <span className={`text-sm ${isWatched ? 'text-cash-green' : 'text-navy-500'}`}>
                    {section.duration}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Progress */}
          <div className="mt-6 pt-4 border-t border-navy-700">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-navy-400">Progress</span>
              <span className={allWatched ? 'text-cash-green font-bold' : 'text-white'}>
                {watchedSections.length}/{videoSections.length}
              </span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-bar-fill"
                style={{ width: `${(watchedSections.length / videoSections.length) * 100}%` }}
              />
            </div>
            {allWatched && (
              <p className="text-cash-green font-bold mt-3 text-center">
                🎉 Training Complete! You&apos;re ready!
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Testimonials - Enhanced */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { name: 'Michael R.', location: 'Texas', amount: '$2,847', period: 'first week', quote: 'Made my first $2K week using this system!' },
          { name: 'Sarah T.', location: 'California', amount: '$4,129', period: 'monthly', quote: 'Finally hit consistent 4-figure days.' },
          { name: 'James K.', location: 'Florida', amount: '$1,856', period: 'first month', quote: 'Quit my job after just 60 days!' },
        ].map((testimonial, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card rounded-2xl p-6"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full flex items-center justify-center text-navy-950 text-xl font-bold shadow-lg">
                {testimonial.name[0]}
              </div>
              <div>
                <p className="font-bold text-white text-lg">{testimonial.name}</p>
                <p className="text-sm text-navy-400">{testimonial.location}</p>
              </div>
            </div>
            
            <div className="mb-4 p-3 bg-cash-green/10 rounded-xl">
              <p className="text-cash-green text-2xl font-bold">{testimonial.amount}</p>
              <p className="text-sm text-cash-green/70">{testimonial.period}</p>
            </div>
            
            <p className="text-navy-300 italic text-lg">&quot;{testimonial.quote}&quot;</p>
            
            <div className="flex items-center gap-1 mt-4 text-gold-400">
              {[1,2,3,4,5].map(i => <StarIcon key={i} />)}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Action CTA */}
      {allWatched && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-8 text-center border-2 border-cash-green/30"
        >
          <h3 className="text-2xl font-bold text-white mb-3">
            🎓 You&apos;ve Completed the Training!
          </h3>
          <p className="text-navy-300 text-lg mb-6">
            Now it&apos;s time to put what you learned into action. Create your first profit page!
          </p>
          <Link href="/app/build">
            <button className="btn-gold btn-large inline-flex items-center gap-3">
              <span>Create Your First Page</span>
              <ArrowRightIcon />
            </button>
          </Link>
        </motion.div>
      )}
    </motion.div>
  );
}
