'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import type { Page } from '@/lib/types';

// Icons
const TrendUpIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="23,6 13.5,15.5 8.5,10.5 1,18" />
    <polyline points="17,6 23,6 23,12" />
  </svg>
);

const MoneyIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="2" y="6" width="20" height="12" rx="2" />
    <circle cx="12" cy="12" r="3" />
    <path d="M6 12h.01M18 12h.01" />
  </svg>
);

const LayersIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="12,2 2,7 12,12 22,7" />
    <polyline points="2,17 12,22 22,17" />
    <polyline points="2,12 12,17 22,12" />
  </svg>
);

const EyeIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
);

const PlayIcon = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="5,3 19,12 5,21" />
  </svg>
);

const PlusIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

// Animated number component with impressive effects
const AnimatedNumber = ({ value, prefix = '', suffix = '', className = '', color = 'text-white' }: { 
  value: number; 
  prefix?: string; 
  suffix?: string;
  className?: string;
  color?: string;
}) => {
  const [displayValue, setDisplayValue] = useState(value);
  const [isIncreasing, setIsIncreasing] = useState(false);
  const [incrementAmount, setIncrementAmount] = useState(0);
  const prevValueRef = useRef(value);

  useEffect(() => {
    if (value !== prevValueRef.current) {
      const diff = value - prevValueRef.current;
      setIncrementAmount(diff);
      setIsIncreasing(true);
      
      // Smooth counting animation
      const startValue = displayValue;
      const endValue = value;
      const duration = 800;
      const startTime = performance.now();
      
      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth deceleration
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentValue = Math.round(startValue + (endValue - startValue) * easeOut);
        
        setDisplayValue(currentValue);
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setTimeout(() => setIsIncreasing(false), 1000);
        }
      };
      
      requestAnimationFrame(animate);
      prevValueRef.current = value;
    }
  }, [value, displayValue]);

  return (
    <span className={`relative inline-block ${className}`}>
      {/* Glow effect on increment */}
      <AnimatePresence>
        {isIncreasing && (
          <motion.span
            initial={{ opacity: 0.8, scale: 1 }}
            animate={{ opacity: 0, scale: 1.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 bg-green-400/30 rounded-lg blur-xl"
          />
        )}
      </AnimatePresence>
      
      {/* Main number */}
      <motion.span 
        className={`relative z-10 tabular-nums ${color}`}
        animate={isIncreasing ? { 
          scale: [1, 1.08, 1],
          textShadow: ['0 0 0px transparent', '0 0 20px rgba(74, 222, 128, 0.8)', '0 0 0px transparent']
        } : {}}
        transition={{ duration: 0.5 }}
      >
        {prefix}{displayValue.toLocaleString()}{suffix}
      </motion.span>
      
      {/* Floating increment badge */}
      <AnimatePresence>
        {isIncreasing && incrementAmount > 0 && (
          <motion.span 
            initial={{ opacity: 0, y: 10, x: '-50%', scale: 0.5 }}
            animate={{ opacity: 1, y: -25, x: '-50%', scale: 1 }}
            exit={{ opacity: 0, y: -40, scale: 0.8 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="absolute -top-2 left-1/2 px-2 py-0.5 bg-green-500 text-white text-xs font-bold rounded-full shadow-lg shadow-green-500/50 whitespace-nowrap"
          >
            +{incrementAmount.toLocaleString()}
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
};

const stagger = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

// Constants for persistent stats
const STATS_STORAGE_KEY = 'cf_live_stats';
const STATS_START_DATE_KEY = 'cf_stats_start';
const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

// Base values (reset to these every 24 hours)
const BASE_STATS = {
  articlesToday: 1291,
  clicksTracked: 10898,
  activeThisWeek: 2990,
  totalMoneyToday: 45070,
};

// Max values (caps to keep numbers realistic)
const MAX_STATS = {
  articlesToday: 3500,
  clicksTracked: 25000,
  activeThisWeek: 4500,
  totalMoneyToday: 95000,
};

// Growth rates per hour
const GROWTH_RATES = {
  articlesToday: 45,      // ~45 articles per hour
  clicksTracked: 180,     // ~180 clicks per hour  
  activeThisWeek: 12,     // ~12 new active users per hour
  totalMoneyToday: 1850,  // ~$1850 per hour
};

const BUILD_STAMP = 'dash-2026-01-26-remove-members-strip';

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const showBuildStamp = searchParams.get('debug') === '1';
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');
  const [mounted, setMounted] = useState(false);
  const [dynamicStats, setDynamicStats] = useState({ clicks: 0, revenue: '0' });
  
  // Live stats with persistence
  const [liveStats, setLiveStats] = useState({
    articlesToday: BASE_STATS.articlesToday,
    clicksTracked: BASE_STATS.clicksTracked,
    activeThisWeek: BASE_STATS.activeThisWeek,
    totalMoneyToday: BASE_STATS.totalMoneyToday,
  });
  
  const supabase = createClient();

  // Calculate stats based on time elapsed since last reset (resets every 24 hours)
  const calculateStats = useCallback(() => {
    if (typeof window === 'undefined') return BASE_STATS;
    
    let startDate = localStorage.getItem(STATS_START_DATE_KEY);
    const now = Date.now();
    
    // Check if we need to reset (no start date, or 24 hours have passed)
    if (!startDate || (now - new Date(startDate).getTime()) >= TWENTY_FOUR_HOURS) {
      startDate = new Date().toISOString();
      localStorage.setItem(STATS_START_DATE_KEY, startDate);
      // Clear saved stats on reset
      localStorage.removeItem(STATS_STORAGE_KEY);
    }
    
    const hoursElapsed = (now - new Date(startDate).getTime()) / (1000 * 60 * 60);
    
    // Calculate growth with some randomization for realism
    const randomFactor = () => 0.85 + Math.random() * 0.3; // 85% to 115%
    
    // Calculate stats but cap at max values
    return {
      articlesToday: Math.min(MAX_STATS.articlesToday, Math.round(BASE_STATS.articlesToday + (hoursElapsed * GROWTH_RATES.articlesToday * randomFactor()))),
      clicksTracked: Math.min(MAX_STATS.clicksTracked, Math.round(BASE_STATS.clicksTracked + (hoursElapsed * GROWTH_RATES.clicksTracked * randomFactor()))),
      activeThisWeek: Math.min(MAX_STATS.activeThisWeek, Math.round(BASE_STATS.activeThisWeek + (hoursElapsed * GROWTH_RATES.activeThisWeek * randomFactor()))),
      totalMoneyToday: Math.min(MAX_STATS.totalMoneyToday, Math.round(BASE_STATS.totalMoneyToday + (hoursElapsed * GROWTH_RATES.totalMoneyToday * randomFactor()))),
    };
  }, []);

  useEffect(() => {
    setMounted(true);
    
    // Initialize stats from localStorage or calculate
    const savedStats = localStorage.getItem(STATS_STORAGE_KEY);
    if (savedStats) {
      try {
        const parsed = JSON.parse(savedStats);
        // Ensure stats never go down - take max of saved and calculated
        const calculated = calculateStats();
        setLiveStats({
          articlesToday: Math.max(parsed.articlesToday || 0, calculated.articlesToday),
          clicksTracked: Math.max(parsed.clicksTracked || 0, calculated.clicksTracked),
          activeThisWeek: Math.max(parsed.activeThisWeek || 0, calculated.activeThisWeek),
          totalMoneyToday: Math.max(parsed.totalMoneyToday || 0, calculated.totalMoneyToday),
        });
      } catch {
        setLiveStats(calculateStats());
      }
    } else {
      setLiveStats(calculateStats());
    }
    
    const fetchData = async () => {
      // Fetch pages
      const { data: pagesData } = await supabase
        .from('pages')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (pagesData) {
        setPages(pagesData as Page[]);
        const totalPages = pagesData.length;
        setDynamicStats({
          clicks: Math.floor(totalPages * 127 + Math.random() * 50),
          revenue: (totalPages * 47.5 + Math.random() * 20).toFixed(0)
        });
      }
      
      // Get user info
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email) {
        const emailName = user.email.split('@')[0];
        const firstName = emailName.charAt(0).toUpperCase() + emailName.slice(1).split(/[._-]/)[0];
        setUserName(firstName);
      }
      
      setLoading(false);
    };

    fetchData();
    
    // Live stats update interval - realistic random intervals between 3-8 seconds
    const runUpdate = () => {
      setLiveStats(prev => {
        // Cap values at MAX_STATS to keep numbers realistic
        const newStats = {
          articlesToday: Math.min(MAX_STATS.articlesToday, prev.articlesToday + Math.floor(Math.random() * 4) + 1),
          clicksTracked: Math.min(MAX_STATS.clicksTracked, prev.clicksTracked + Math.floor(Math.random() * 20) + 5),
          activeThisWeek: Math.min(MAX_STATS.activeThisWeek, prev.activeThisWeek + (Math.random() > 0.7 ? 1 : 0)),
          totalMoneyToday: Math.min(MAX_STATS.totalMoneyToday, prev.totalMoneyToday + Math.floor(Math.random() * 200) + 50),
        };
        
        // Save to localStorage
        localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(newStats));
        
        return newStats;
      });
    };

    // Variable interval for more realistic feel
    let timeoutId: NodeJS.Timeout;
    const scheduleNextUpdate = () => {
      const delay = 3000 + Math.random() * 5000; // 3-8 seconds
      timeoutId = setTimeout(() => {
        runUpdate();
        scheduleNextUpdate();
      }, delay);
    };
    
    scheduleNextUpdate();

    return () => clearTimeout(timeoutId);
  }, [supabase, calculateStats]);

  const totalPages = pages.length;

  const stats = [
    {
      label: 'Your Pages',
      value: totalPages,
      subtext: totalPages > 0 ? '🎉 Great start!' : 'Create your first!',
      icon: LayersIcon,
      color: 'from-teal-500 to-cyan-500',
      bg: 'bg-teal-500/10',
      border: 'border-teal-500/15',
    },
    {
      label: 'Est. Clicks',
      value: mounted ? dynamicStats.clicks.toLocaleString() : '—',
      subtext: '+12% this week',
      icon: EyeIcon,
      color: 'from-cyan-500 to-teal-bright',
      bg: 'bg-cyan-500/10',
      border: 'border-cyan-500/15',
    },
    {
      label: 'Potential Earnings',
      value: mounted ? `$${dynamicStats.revenue}` : '—',
      subtext: 'Keep building! 💰',
      icon: MoneyIcon,
      color: 'from-gold-500 to-gold-bright',
      bg: 'bg-gold-500/10',
      border: 'border-gold-500/15',
    },
  ];

  const quickActions = [
    {
      title: '🚀 Build New Page',
      description: 'Create a profit page in just 2 minutes',
      href: '/app/build',
      color: 'from-teal-500 to-cyan-500',
      iconBg: 'bg-teal-500/15',
      highlight: true,
    },
    {
      title: '📱 Share & Promote',
      description: 'Get traffic to your pages instantly',
      href: '/app/traffic',
      color: 'from-cyan-500 to-teal-bright',
      iconBg: 'bg-cyan-500/15',
    },
    {
      title: '👑 Gold Package',
      description: 'Done-for-you premium pages',
      href: '/app/gold',
      color: 'from-gold-500 to-gold-bright',
      iconBg: 'bg-gold-500/15',
      badge: 'VIP',
    },
  ];

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      {/* Personalized Header */}
      <motion.div variants={item} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-white">
            Welcome{userName ? `, ${userName}` : ''}! 👋
          </h1>
          <p className="text-gray-400 mt-2 text-lg">
            {totalPages === 0 
              ? "Ready to build your next profit page?" 
              : `You have ${totalPages} page${totalPages > 1 ? 's' : ''} working for you!`
            }
          </p>
        </div>
      </motion.div>
      
      {showBuildStamp && (
        <motion.div variants={item} className="text-xs text-gray-500">
          Build: <span className="font-mono text-gray-400">{BUILD_STAMP}</span>
        </motion.div>
      )}

      {/* Stats Grid */}
      <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`glass-card rounded-2xl p-6 ${stat.border} border transition-all duration-300 hover:shadow-glow-teal/10 hover:shadow-lg group`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-500 text-base mb-2">{stat.label}</p>
                  <p className={`text-4xl font-display font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                    {stat.value}
                  </p>
                </div>
                <div className={`w-14 h-14 ${stat.bg} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <div className={`bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                    <Icon />
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-4 text-teal-500 text-sm font-medium">
                <TrendUpIcon />
                <span>{stat.subtext}</span>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Welcome Video Card with LIVE STATS next to it */}
      <motion.div variants={item} className="flex flex-col lg:flex-row justify-center items-stretch gap-6 lg:gap-8">
        {/* Video Player Card */}
        <div className="w-full lg:w-[40%] glass-hero rounded-3xl overflow-hidden">
          <div className="relative aspect-video bg-gradient-to-br from-navy-800/80 to-navy-900/80">
            <iframe
              src="https://player.vimeo.com/video/1158728161?badge=0&autopause=0&player_id=0&app_id=58479"
              className="absolute inset-0 w-full h-full"
              frameBorder="0"
              allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
              allowFullScreen
              title="Welcome to Cash Formula"
            />
            
            {/* Live badge */}
            <div className="absolute top-4 left-4 px-3 py-1.5 bg-red-500 rounded-full text-white text-sm font-bold flex items-center gap-2 shadow-lg z-10 pointer-events-none">
              <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
              MUST WATCH FIRST
            </div>
          </div>
        </div>
        
        {/* LIVE Stats Panel - What's Happening Right Now */}
        <div className="w-full lg:w-[40%] glass-hero rounded-3xl p-5 lg:p-6 flex flex-col justify-center relative overflow-hidden">
            {/* Animated gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/60 via-teal-900/80 to-cyan-900/60" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-green-400/20 via-transparent to-transparent" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-cyan-400/10 via-transparent to-transparent" />
            
            {/* Animated particles effect */}
            <div className="absolute inset-0 overflow-hidden">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-green-400/40 rounded-full"
                  initial={{ 
                    x: Math.random() * 100 + '%', 
                    y: '100%',
                    opacity: 0 
                  }}
                  animate={{ 
                    y: '-20%',
                    opacity: [0, 1, 0]
                  }}
                  transition={{
                    duration: 3 + Math.random() * 2,
                    repeat: Infinity,
                    delay: i * 0.8,
                    ease: 'linear'
                  }}
                />
              ))}
            </div>
            
            {/* Content */}
            <div className="relative z-10">
              {/* Header with pulsing indicator */}
              <div className="flex items-center gap-2 mb-4">
                <div className="relative flex items-center justify-center">
                  <span className="w-3 h-3 bg-green-400 rounded-full block" />
                  <span className="absolute w-3 h-3 bg-green-400 rounded-full animate-ping" />
                </div>
                <span className="text-green-400 font-bold text-sm uppercase tracking-wider">Live Activity</span>
              </div>
              
              {/* Main Stats - Compact Grid */}
              <div className="space-y-3">
                {/* Stats Grid - 2x2 */}
                <div className="grid grid-cols-2 gap-2">
                  {/* Articles Created */}
                  <div className="bg-black/30 backdrop-blur-sm rounded-xl p-3 border border-cyan-400/20">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-sm">📄</span>
                      <span className="text-cyan-300 text-xs font-medium">Articles</span>
                    </div>
                    <div className="text-xl font-bold">
                      {mounted ? <AnimatedNumber value={liveStats.articlesToday} color="text-cyan-400" /> : '—'}
                    </div>
                  </div>
                  
                  {/* Clicks Tracked */}
                  <div className="bg-black/30 backdrop-blur-sm rounded-xl p-3 border border-purple-400/20">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-sm">🎯</span>
                      <span className="text-purple-300 text-xs font-medium">Clicks</span>
                    </div>
                    <div className="text-xl font-bold">
                      {mounted ? <AnimatedNumber value={liveStats.clicksTracked} color="text-purple-400" /> : '—'}
                    </div>
                  </div>
                  
                  {/* Active Members */}
                  <div className="bg-black/30 backdrop-blur-sm rounded-xl p-3 border border-blue-400/20">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-sm">👥</span>
                      <span className="text-blue-300 text-xs font-medium">Active</span>
                    </div>
                    <div className="text-xl font-bold">
                      {mounted ? <AnimatedNumber value={liveStats.activeThisWeek} color="text-blue-400" /> : '—'}
                    </div>
                  </div>
                  
                  {/* Today's Earnings */}
                  <div className="bg-black/30 backdrop-blur-sm rounded-xl p-3 border border-amber-400/20">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-sm">💰</span>
                      <span className="text-amber-300 text-xs font-medium">Earned</span>
                    </div>
                    <div className="text-xl font-bold">
                      {mounted ? <AnimatedNumber value={liveStats.totalMoneyToday} prefix="$" color="text-amber-400" /> : '—'}
                    </div>
                  </div>
                </div>
                
                {/* Featured Total - The Big Number */}
                <div className="relative group">
                  <motion.div 
                    className="absolute -inset-0.5 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 rounded-xl opacity-40 blur-md"
                    animate={{ opacity: [0.3, 0.5, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <div className="relative bg-gradient-to-r from-green-900/90 to-emerald-900/90 backdrop-blur-sm rounded-xl p-4 border border-green-400/30">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-300/80 text-xs font-medium uppercase tracking-wider mb-1">💵 Total Today</p>
                        <div className="text-2xl sm:text-3xl font-bold">
                          {mounted ? <AnimatedNumber value={liveStats.totalMoneyToday} prefix="$" color="text-green-400" /> : '—'}
                        </div>
                      </div>
                      <motion.div 
                        className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-400/30 to-emerald-500/20 flex items-center justify-center border border-green-400/30"
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <span className="text-2xl">📈</span>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={item} className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <span className="w-3 h-3 bg-teal-500 rounded-full" />
          What Would You Like To Do?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.title}
              href={action.href}
              className={`glass-card glass-card-hover rounded-2xl p-6 group transition-all duration-300 relative overflow-hidden ${
                action.highlight ? 'border border-teal-500/25' : ''
              }`}
            >
              {action.badge && (
                <span className="absolute top-3 right-3 px-2 py-1 bg-gradient-to-r from-gold-500 to-gold-bright text-black text-xs font-bold rounded-full">
                  {action.badge}
                </span>
              )}
              <div className={`w-14 h-14 ${action.iconBg} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${action.color}`} />
              </div>
              <h3 className="font-bold text-white mb-2 text-lg group-hover:text-teal-500 transition-colors">
                {action.title}
              </h3>
              <p className="text-gray-500 text-base">{action.description}</p>
              <div className="mt-4 flex items-center gap-2 text-teal-500 text-base opacity-0 group-hover:opacity-100 transition-opacity font-medium">
                <span>Get started</span>
                <ArrowRightIcon />
              </div>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* Recent Pages */}
      <motion.div variants={item} className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="w-3 h-3 bg-teal-500 rounded-full" />
            Your Pages
          </h2>
          <Link href="/app/pages" className="text-base text-teal-500 hover:underline font-medium">
            View all →
          </Link>
        </div>

        {loading ? (
          <div className="glass-card rounded-2xl p-8 text-center">
            <div className="w-10 h-10 border-3 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-gray-500 mt-4 text-lg">Loading your pages...</p>
          </div>
        ) : pages.length === 0 ? (
          <div className="glass-card rounded-2xl p-10 text-center border-2 border-dashed border-teal-500/25">
            <div className="w-20 h-20 bg-teal-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <LayersIcon />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">No pages yet</h3>
            <p className="text-gray-400 mb-6 text-lg">Create your first profit page and start earning today!</p>
            <Link href="/app/build" className="btn-gold btn-large inline-flex items-center gap-3">
              <PlusIcon />
              <span>Create My First Page</span>
            </Link>
            <p className="mt-4 text-sm text-gray-600">
              🚀 Takes only 2 minutes!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {pages.slice(0, 6).map((page) => (
              <Link
                key={page.id}
                href={`/p/${page.public_slug}`}
                target="_blank"
                className="glass-card glass-card-hover rounded-2xl p-6 group transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-teal-500/10 rounded-xl flex items-center justify-center text-teal-500">
                    <LayersIcon />
                  </div>
                  <span className={`px-3 py-1 text-sm rounded-full font-medium ${
                    page.status === 'published'
                      ? 'bg-teal-500/10 text-teal-500 border border-teal-500/20'
                      : 'bg-navy-700 text-gray-400'
                  }`}>
                    {page.status === 'published' ? '✓ Live' : page.status}
                  </span>
                </div>
                <h3 className="font-semibold text-white line-clamp-2 mb-3 text-lg group-hover:text-teal-500 transition-colors">
                  {page.title}
                </h3>
                <p className="text-base text-gray-600">
                  Created {new Date(page.created_at).toLocaleDateString()}
                </p>
              </Link>
            ))}
          </div>
        )}
      </motion.div>

      {/* Support Card */}
      <motion.div variants={item} className="glass-card rounded-2xl p-6">
        <div className="flex items-start gap-5">
          <div className="w-14 h-14 bg-teal-500/15 rounded-xl flex items-center justify-center text-teal-500 shrink-0">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-white mb-1">Need More Help?</h3>
            <p className="text-gray-400 mb-4">
              Our support team is here to help you succeed. We typically respond within 24 hours.
            </p>
            <a
              href="https://cashformula.zendesk.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-dark hover:to-cyan-dark text-white rounded-lg font-bold transition-all"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
              Contact Support
            </a>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
