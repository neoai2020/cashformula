'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
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

const SparkleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22,4 12,14.01 9,11.01" />
  </svg>
);

const MapPinIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

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

// US States for social proof
const usStates = ['Texas', 'California', 'Florida', 'New York', 'Ohio', 'Georgia', 'Arizona', 'Michigan', 'North Carolina', 'Pennsylvania'];

// Names for social proof
const names = [
  'Sarah M.', 'John D.', 'Emily R.', 'Michael T.', 'Jessica K.', 'David L.', 'Amanda S.', 'Robert W.',
  'Jennifer H.', 'Chris P.', 'Lisa B.', 'Kevin M.', 'Michelle N.', 'Brian J.', 'Ashley G.', 'Jason R.'
];

// Generate random earnings between $27 and $247 - only call on client
const generateEarnings = () => `$${Math.floor(Math.random() * 220) + 27}`;

export default function DashboardPage() {
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');
  const [liveActivities, setLiveActivities] = useState<Array<{name: string; amount: string; location: string; time: string}>>([]);
  const [mounted, setMounted] = useState(false);
  const [dynamicStats, setDynamicStats] = useState({ clicks: 0, revenue: '0' });
  const supabase = createClient();

  useEffect(() => {
    setMounted(true);
    
    const fetchData = async () => {
      // Fetch pages
      const { data: pagesData } = await supabase
        .from('pages')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (pagesData) {
        setPages(pagesData as Page[]);
        // Set dynamic stats after pages load - only on client
        const totalPages = pagesData.length;
        setDynamicStats({
          clicks: Math.floor(totalPages * 127 + Math.random() * 50),
          revenue: (totalPages * 47.5 + Math.random() * 20).toFixed(0)
        });
      }
      
      // Get user info
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email) {
        // Extract first name from email or use friendly default
        const emailName = user.email.split('@')[0];
        const firstName = emailName.charAt(0).toUpperCase() + emailName.slice(1).split(/[._-]/)[0];
        setUserName(firstName);
      }
      
      setLoading(false);
    };

    fetchData();
    
    // Generate initial live activities - only on client
    const initialActivities = Array.from({ length: 3 }, () => ({
      name: names[Math.floor(Math.random() * names.length)],
      amount: generateEarnings(),
      location: usStates[Math.floor(Math.random() * usStates.length)],
      time: 'just now'
    }));
    setLiveActivities(initialActivities);

    // Update live activities periodically
    const activityInterval = setInterval(() => {
      setLiveActivities(prev => {
        const newActivity = {
          name: names[Math.floor(Math.random() * names.length)],
          amount: generateEarnings(),
          location: usStates[Math.floor(Math.random() * usStates.length)],
          time: 'just now'
        };
        // Update old times
        const updated = prev.map((a, i) => ({
          ...a,
          time: i === 0 ? '1 min ago' : `${i + 1} min ago`
        }));
        return [newActivity, ...updated.slice(0, 2)];
      });
    }, 8000);

    return () => clearInterval(activityInterval);
  }, [supabase]);

  // Calculate dynamic stats - use state for hydration safety
  const totalPages = pages.length;

  const stats = [
    {
      label: 'Your Pages',
      value: totalPages,
      subtext: totalPages > 0 ? '🎉 Great start!' : 'Create your first!',
      icon: LayersIcon,
      color: 'from-gold-400 to-gold-600',
      bg: 'bg-gold-500/10',
      border: 'border-gold-500/20',
    },
    {
      label: 'Est. Clicks',
      value: mounted ? dynamicStats.clicks.toLocaleString() : '—',
      subtext: '+12% this week',
      icon: EyeIcon,
      color: 'from-cash-green to-cash-emerald',
      bg: 'bg-cash-green/10',
      border: 'border-cash-green/20',
    },
    {
      label: 'Potential Earnings',
      value: mounted ? `$${dynamicStats.revenue}` : '—',
      subtext: 'Keep building! 💰',
      icon: MoneyIcon,
      color: 'from-purple-400 to-purple-600',
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/20',
    },
  ];

  const quickActions = [
    {
      title: '🚀 Build New Page',
      description: 'Create a profit page in just 2 minutes',
      href: '/app/build',
      color: 'from-gold-400 to-gold-600',
      iconBg: 'bg-gold-500/20',
      highlight: true,
    },
    {
      title: '📱 Share & Promote',
      description: 'Get traffic to your pages instantly',
      href: '/app/traffic',
      color: 'from-cash-green to-cash-emerald',
      iconBg: 'bg-cash-green/20',
    },
    {
      title: '👑 Gold Package',
      description: 'Done-for-you premium pages',
      href: '/app/gold',
      color: 'from-purple-400 to-purple-600',
      iconBg: 'bg-purple-500/20',
      badge: 'VIP',
    },
  ];

  // Daily checklist items
  const dailyTasks = [
    { label: 'Log in today', done: true },
    { label: 'Create a page', done: totalPages > 0 },
    { label: 'Share on social', done: false },
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
          <p className="text-navy-300 mt-2 text-lg">
            {totalPages === 0 
              ? "Let's create your first profit page today!" 
              : `You have ${totalPages} page${totalPages > 1 ? 's' : ''} working for you!`
            }
          </p>
        </div>
        <Link href="/app/build" className="btn-gold btn-large inline-flex items-center gap-2 w-fit animate-pulse-glow">
          <PlusIcon />
          <span>Create Page</span>
        </Link>
      </motion.div>

      {/* Stats Grid - Enhanced with animations */}
      <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`glass-card rounded-2xl p-6 ${stat.border} border transition-all duration-300 hover:shadow-gold/10 hover:shadow-lg group`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-navy-400 text-base mb-2">{stat.label}</p>
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
              <div className="flex items-center gap-2 mt-4 text-cash-green text-sm font-medium">
                <TrendUpIcon />
                <span>{stat.subtext}</span>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Daily Checklist - NEW */}
      <motion.div variants={item} className="glass-card rounded-2xl p-6 border border-gold-500/20">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-gold-400"><SparkleIcon /></span>
            Today&apos;s Quick Wins
          </h2>
          <span className="text-sm text-navy-400">
            {dailyTasks.filter(t => t.done).length}/{dailyTasks.length} done
          </span>
        </div>
        <div className="flex flex-wrap gap-4">
          {dailyTasks.map((task, i) => (
            <div
              key={i}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl ${
                task.done 
                  ? 'bg-cash-green/10 border border-cash-green/20' 
                  : 'bg-navy-800/50 border border-navy-700'
              }`}
            >
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                task.done ? 'bg-cash-green text-white' : 'bg-navy-700 text-navy-500'
              }`}>
                {task.done ? <CheckCircleIcon /> : <span className="text-xs">{i + 1}</span>}
              </div>
              <span className={task.done ? 'text-white' : 'text-navy-400'}>
                {task.label}
              </span>
              {task.done && <span className="text-cash-green text-sm">✓</span>}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Welcome Video Card - HERO */}
      <motion.div variants={item} className="glass-hero rounded-3xl overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-5">
          {/* Video Player */}
          <div className="relative lg:col-span-3 aspect-video lg:aspect-[16/10] bg-gradient-to-br from-navy-800/80 to-navy-900/80">
            <div className="absolute inset-0 bg-gradient-to-t from-navy-950/60 via-transparent to-navy-950/30" />
            
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <button className="w-28 h-28 rounded-full bg-gradient-to-r from-gold-400 to-gold-500 flex items-center justify-center text-navy-950 hover:scale-110 transition-all duration-300 shadow-gold-lg mb-4 mx-auto group animate-pulse-glow">
                  <PlayIcon />
                </button>
                <p className="text-white/80 text-base font-medium">Click to play video</p>
              </div>
            </div>
            
            {/* Live badge */}
            <div className="absolute top-6 left-6 px-4 py-2 bg-red-500 rounded-full text-white text-base font-bold flex items-center gap-2 shadow-lg">
              <span className="w-3 h-3 bg-white rounded-full animate-pulse" />
              MUST WATCH
            </div>
            
            {/* Duration badge */}
            <div className="absolute bottom-6 right-6 px-4 py-2 bg-black/60 backdrop-blur-sm rounded-lg text-white text-base font-medium">
              5:32
            </div>
          </div>
          
          {/* Video Info */}
          <div className="lg:col-span-2 p-8 lg:p-10 flex flex-col justify-center bg-gradient-to-br from-transparent to-gold-500/5">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold-500/20 border border-gold-500/30 rounded-full text-gold-400 text-sm font-bold uppercase tracking-wider mb-4 w-fit">
              <span className="w-2 h-2 bg-gold-400 rounded-full animate-pulse" />
              Getting Started
            </div>
            
            <h3 className="text-2xl lg:text-3xl font-display font-bold text-white mb-4 leading-tight">
              How to Make Your First <span className="text-gold-400">$100</span> Today
            </h3>
            
            <p className="text-navy-300 mb-8 text-lg leading-relaxed">
              Watch this quick training to create your first profit page and start earning commissions within 24 hours.
            </p>
            
            <div className="space-y-4">
              <Link 
                href="/app/training"
                className="btn-gold btn-large w-full sm:w-auto inline-flex items-center justify-center gap-3"
              >
                <PlayIcon />
                <span>Watch Now</span>
              </Link>
              
              <div className="flex items-center gap-6 text-base text-navy-400">
                <span className="flex items-center gap-2">
                  ⏱️ 5 min watch
                </span>
                <span className="flex items-center gap-2">
                  👀 12.5k views
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <motion.div variants={item} className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="w-3 h-3 bg-gold-400 rounded-full" />
            What Would You Like To Do?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {quickActions.map((action) => (
              <Link
                key={action.title}
                href={action.href}
                className={`glass-card glass-card-hover rounded-2xl p-6 group transition-all duration-300 relative overflow-hidden ${
                  action.highlight ? 'border-2 border-gold-500/30' : ''
                }`}
              >
                {action.badge && (
                  <span className="absolute top-3 right-3 px-2 py-1 bg-gradient-to-r from-gold-400 to-gold-500 text-navy-950 text-xs font-bold rounded-full">
                    {action.badge}
                  </span>
                )}
                <div className={`w-14 h-14 ${action.iconBg} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${action.color}`} />
                </div>
                <h3 className="font-bold text-white mb-2 text-lg group-hover:text-gold-400 transition-colors">
                  {action.title}
                </h3>
                <p className="text-navy-400 text-base">{action.description}</p>
                <div className="mt-4 flex items-center gap-2 text-gold-400 text-base opacity-0 group-hover:opacity-100 transition-opacity font-medium">
                  <span>Get started</span>
                  <ArrowRightIcon />
                </div>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Live Activity - ENHANCED */}
        <motion.div variants={item} className="space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="w-3 h-3 bg-cash-green rounded-full animate-pulse" />
            Live Sales Feed
          </h2>
          <div className="glass-card rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-cash-green font-bold">🔥 847 earning today</span>
              <span className="text-navy-400">Live</span>
            </div>
            {liveActivities.map((activity, i) => (
              <motion.div
                key={`${activity.name}-${i}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-4 p-3 bg-navy-800/30 rounded-xl"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center text-navy-950 text-lg font-bold shadow-lg">
                  {activity.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-base text-white">
                    <span className="font-bold">{activity.name}</span>{' '}
                    <span className="text-navy-400">earned</span>{' '}
                    <span className="text-cash-green font-bold">{activity.amount}</span>
                  </p>
                  <p className="text-sm text-navy-500 flex items-center gap-2">
                    <MapPinIcon />
                    {activity.location} · {activity.time}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent Pages */}
      <motion.div variants={item} className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="w-3 h-3 bg-purple-400 rounded-full" />
            Your Pages
          </h2>
          <Link href="/app/pages" className="text-base text-gold-400 hover:underline font-medium">
            View all →
          </Link>
        </div>

        {loading ? (
          <div className="glass-card rounded-2xl p-8 text-center">
            <div className="w-10 h-10 border-3 border-gold-400 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-navy-400 mt-4 text-lg">Loading your pages...</p>
          </div>
        ) : pages.length === 0 ? (
          <div className="glass-card rounded-2xl p-10 text-center border-2 border-dashed border-gold-500/30">
            <div className="w-20 h-20 bg-gold-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <LayersIcon />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">No pages yet</h3>
            <p className="text-navy-300 mb-6 text-lg">Create your first profit page and start earning today!</p>
            <Link href="/app/build" className="btn-gold btn-large inline-flex items-center gap-3">
              <PlusIcon />
              <span>Create My First Page</span>
            </Link>
            <p className="mt-4 text-sm text-navy-500">
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
                  <div className="w-12 h-12 bg-gold-500/10 rounded-xl flex items-center justify-center text-gold-400">
                    <LayersIcon />
                  </div>
                  <span className={`px-3 py-1 text-sm rounded-full font-medium ${
                    page.status === 'published'
                      ? 'bg-cash-green/10 text-cash-green border border-cash-green/20'
                      : 'bg-navy-700 text-navy-400'
                  }`}>
                    {page.status === 'published' ? '✓ Live' : page.status}
                  </span>
                </div>
                <h3 className="font-semibold text-white line-clamp-2 mb-3 text-lg group-hover:text-gold-400 transition-colors">
                  {page.title}
                </h3>
                <p className="text-base text-navy-500">
                  Created {new Date(page.created_at).toLocaleDateString()}
                </p>
              </Link>
            ))}
          </div>
        )}
      </motion.div>

      {/* Bottom Ticker - Enhanced */}
      <motion.div variants={item} className="glass-card rounded-2xl overflow-hidden">
        <div className="bg-cash-green/10 px-5 py-3 border-b border-cash-green/20">
          <span className="text-base font-bold text-cash-green uppercase tracking-wider flex items-center gap-2">
            🔥 Live Success Feed
            <span className="w-2 h-2 bg-cash-green rounded-full animate-pulse" />
          </span>
        </div>
        <div className="overflow-hidden">
          <div className="ticker-content py-4 px-5 whitespace-nowrap">
            {[...Array(2)].map((_, i) => (
              <span key={i} className="inline-flex items-center">
                {[
                  '💰 John D. from Texas just made $127',
                  '🎉 Sarah M. earned commission on Smart Watch',
                  '🚀 Mike R. made $89 on Kitchen Gadget',
                  '✨ Emma L. just got her first sale!',
                  '🎯 David K. hit $500 milestone today',
                  '💵 Lisa P. earned $156 this morning',
                  '🔥 Chris W. made $203 on Fitness Tracker',
                ].map((text, j) => (
                  <span key={j} className="mx-8 text-base text-navy-300">
                    {text}
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
