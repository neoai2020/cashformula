'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import Link from 'next/link';
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

// Animated number component with smooth counting
const AnimatedNumber = ({ value, prefix = '', suffix = '', className = '' }: { 
  value: number; 
  prefix?: string; 
  suffix?: string;
  className?: string;
}) => {
  const [displayValue, setDisplayValue] = useState(value);
  const [isIncreasing, setIsIncreasing] = useState(false);
  const prevValueRef = useRef(value);

  useEffect(() => {
    if (value !== prevValueRef.current) {
      setIsIncreasing(value > prevValueRef.current);
      
      // Animate the number change
      const diff = value - displayValue;
      const steps = 20;
      const stepValue = diff / steps;
      let current = 0;
      
      const interval = setInterval(() => {
        current++;
        if (current >= steps) {
          setDisplayValue(value);
          clearInterval(interval);
          setTimeout(() => setIsIncreasing(false), 500);
        } else {
          setDisplayValue(prev => Math.round(prev + stepValue));
        }
      }, 30);
      
      prevValueRef.current = value;
      return () => clearInterval(interval);
    }
  }, [value, displayValue]);

  return (
    <span className={`relative ${className}`}>
      <span className={`transition-all duration-300 ${isIncreasing ? 'text-green-400 scale-105' : ''}`}>
        {prefix}{displayValue.toLocaleString()}{suffix}
      </span>
      {isIncreasing && (
        <motion.span 
          initial={{ opacity: 1, y: 0 }}
          animate={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.8 }}
          className="absolute -top-1 -right-4 text-green-400 text-xs font-bold"
        >
          +
        </motion.span>
      )}
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

// Base values (what we started with)
const BASE_STATS = {
  articlesToday: 1291,
  clicksTracked: 10898,
  activeThisWeek: 2990,
  totalMoneyToday: 45070,
};

// Growth rates per hour
const GROWTH_RATES = {
  articlesToday: 45,      // ~45 articles per hour
  clicksTracked: 180,     // ~180 clicks per hour  
  activeThisWeek: 12,     // ~12 new active users per hour
  totalMoneyToday: 1850,  // ~$1850 per hour
};

export default function DashboardPage() {
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

  // Calculate stats based on time elapsed since first visit
  const calculateStats = useCallback(() => {
    if (typeof window === 'undefined') return BASE_STATS;
    
    let startDate = localStorage.getItem(STATS_START_DATE_KEY);
    if (!startDate) {
      startDate = new Date().toISOString();
      localStorage.setItem(STATS_START_DATE_KEY, startDate);
    }
    
    const hoursElapsed = (Date.now() - new Date(startDate).getTime()) / (1000 * 60 * 60);
    
    // Calculate growth with some randomization for realism
    const randomFactor = () => 0.85 + Math.random() * 0.3; // 85% to 115%
    
    return {
      articlesToday: Math.round(BASE_STATS.articlesToday + (hoursElapsed * GROWTH_RATES.articlesToday * randomFactor())),
      clicksTracked: Math.round(BASE_STATS.clicksTracked + (hoursElapsed * GROWTH_RATES.clicksTracked * randomFactor())),
      activeThisWeek: Math.round(BASE_STATS.activeThisWeek + (hoursElapsed * GROWTH_RATES.activeThisWeek * randomFactor())),
      totalMoneyToday: Math.round(BASE_STATS.totalMoneyToday + (hoursElapsed * GROWTH_RATES.totalMoneyToday * randomFactor())),
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
        const newStats = {
          articlesToday: prev.articlesToday + Math.floor(Math.random() * 4) + 1,
          clicksTracked: prev.clicksTracked + Math.floor(Math.random() * 20) + 5,
          activeThisWeek: prev.activeThisWeek + (Math.random() > 0.7 ? 1 : 0), // Only sometimes increases
          totalMoneyToday: prev.totalMoneyToday + Math.floor(Math.random() * 200) + 50,
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
      <motion.div variants={item} className="glass-hero rounded-3xl overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-5">
          {/* Video Player */}
          <div className="relative lg:col-span-3 aspect-video lg:aspect-[16/10] bg-gradient-to-br from-navy-800/80 to-navy-900/80">
            <div className="absolute inset-0 bg-gradient-to-t from-navy-950/60 via-transparent to-navy-950/30" />
            
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <button className="w-28 h-28 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 flex items-center justify-center text-white hover:scale-105 transition-all duration-300 mb-4 mx-auto group animate-pulse-glow">
                  <PlayIcon />
                </button>
                <p className="text-white/80 text-base font-medium">Click to play video</p>
              </div>
            </div>
            
            {/* Live badge */}
            <div className="absolute top-6 left-6 px-4 py-2 bg-red-500 rounded-full text-white text-base font-bold flex items-center gap-2 shadow-lg">
              <span className="w-3 h-3 bg-white rounded-full animate-pulse" />
              MUST WATCH FIRST
            </div>
            
            {/* Duration badge */}
            <div className="absolute bottom-6 right-6 px-4 py-2 bg-black/60 backdrop-blur-sm rounded-lg text-white text-base font-medium">
              5:32
            </div>
          </div>
          
          {/* LIVE Stats Panel - What's Happening Right Now */}
          <div className="lg:col-span-2 p-5 lg:p-6 flex flex-col justify-center relative overflow-hidden">
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-teal-900/40 via-navy-900/90 to-emerald-900/40" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-teal-500/10 via-transparent to-transparent" />
            
            {/* Content */}
            <div className="relative z-10">
              {/* Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="relative">
                  <span className="w-3 h-3 bg-green-400 rounded-full block animate-pulse" />
                  <span className="absolute inset-0 w-3 h-3 bg-green-400 rounded-full animate-ping opacity-75" />
                </div>
                <span className="text-green-400 font-bold text-sm uppercase tracking-wider">Live Activity</span>
              </div>
              
              <h3 className="text-white font-bold text-lg mb-1">What&apos;s Happening Right Now</h3>
              <p className="text-gray-400 text-xs mb-4">Real results from Cash Formula members</p>
              
              {/* Live Stats Grid - Redesigned */}
              <div className="grid grid-cols-2 gap-2 mb-3">
                {/* Articles Today */}
                <div className="group relative bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-sm rounded-xl p-3 border border-white/10 hover:border-teal-500/30 transition-all">
                  <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative">
                    <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">📄 Articles</p>
                    <p className="text-xl font-bold text-white tabular-nums">
                      {mounted ? <AnimatedNumber value={liveStats.articlesToday} /> : '—'}
                    </p>
                  </div>
                </div>
                
                {/* Clicks Tracked */}
                <div className="group relative bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-sm rounded-xl p-3 border border-white/10 hover:border-teal-500/30 transition-all">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative">
                    <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">🎯 Clicks</p>
                    <p className="text-xl font-bold text-white tabular-nums">
                      {mounted ? <AnimatedNumber value={liveStats.clicksTracked} /> : '—'}
                    </p>
                  </div>
                </div>
                
                {/* Active Users */}
                <div className="group relative bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-sm rounded-xl p-3 border border-white/10 hover:border-teal-500/30 transition-all">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative">
                    <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">👥 Active</p>
                    <p className="text-xl font-bold text-white tabular-nums">
                      {mounted ? <AnimatedNumber value={liveStats.activeThisWeek} /> : '—'}
                    </p>
                  </div>
                </div>
                
                {/* Mini Total */}
                <div className="group relative bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-sm rounded-xl p-3 border border-white/10 hover:border-gold-500/30 transition-all">
                  <div className="absolute inset-0 bg-gradient-to-br from-gold-500/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative">
                    <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">💵 Today</p>
                    <p className="text-xl font-bold text-gold-400 tabular-nums">
                      {mounted ? <AnimatedNumber value={liveStats.totalMoneyToday} prefix="$" /> : '—'}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Total Money Generated - Featured */}
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-teal-500 via-emerald-500 to-green-500 rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity" />
                <div className="relative bg-gradient-to-r from-teal-900/80 to-emerald-900/80 backdrop-blur-sm rounded-xl p-4 border border-teal-500/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-teal-300/70 uppercase tracking-wider mb-1">Total Generated Today</p>
                      <p className="text-2xl font-bold text-white tabular-nums">
                        {mounted ? <AnimatedNumber value={liveStats.totalMoneyToday} prefix="$" /> : '—'}
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-500/20 to-emerald-500/20 flex items-center justify-center border border-teal-500/30">
                      <span className="text-2xl">📈</span>
                    </div>
                  </div>
                  
                  {/* Activity indicator */}
                  <div className="mt-3 flex items-center gap-2">
                    <div className="flex -space-x-1">
                      {[...Array(4)].map((_, i) => (
                        <div key={i} className="w-5 h-5 rounded-full bg-gradient-to-br from-gray-600 to-gray-700 border-2 border-navy-900 flex items-center justify-center text-[8px]">
                          👤
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-teal-300/70">
                      <span className="text-white font-medium">{mounted ? (liveStats.activeThisWeek % 100 + 20) : '—'}</span> members earning right now
                    </p>
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
