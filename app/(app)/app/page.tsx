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
      color: 'from-teal-DEFAULT to-cyan-DEFAULT',
      bg: 'bg-teal-DEFAULT/10',
      border: 'border-teal-DEFAULT/15',
    },
    {
      label: 'Est. Clicks',
      value: mounted ? dynamicStats.clicks.toLocaleString() : '—',
      subtext: '+12% this week',
      icon: EyeIcon,
      color: 'from-cyan-DEFAULT to-teal-bright',
      bg: 'bg-cyan-DEFAULT/10',
      border: 'border-cyan-DEFAULT/15',
    },
    {
      label: 'Potential Earnings',
      value: mounted ? `$${dynamicStats.revenue}` : '—',
      subtext: 'Keep building! 💰',
      icon: MoneyIcon,
      color: 'from-gold-DEFAULT to-gold-bright',
      bg: 'bg-gold-DEFAULT/10',
      border: 'border-gold-DEFAULT/15',
    },
  ];

  const quickActions = [
    {
      title: '🚀 Build New Page',
      description: 'Create a profit page in just 2 minutes',
      href: '/app/build',
      color: 'from-teal-DEFAULT to-cyan-DEFAULT',
      iconBg: 'bg-teal-DEFAULT/15',
      highlight: true,
    },
    {
      title: '📱 Share & Promote',
      description: 'Get traffic to your pages instantly',
      href: '/app/traffic',
      color: 'from-cyan-DEFAULT to-teal-bright',
      iconBg: 'bg-cyan-DEFAULT/15',
    },
    {
      title: '👑 DFY Vault',
      description: 'Done-for-you premium pages',
      href: '/app/gold',
      color: 'from-gold-DEFAULT to-gold-bright',
      iconBg: 'bg-gold-DEFAULT/15',
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
            Welcome to Your P55 Account{userName ? `, ${userName}` : ''}!
          </h1>
          <p className="text-gray-400 mt-2 text-lg">
            {totalPages === 0 
              ? "Ready to build your next profit page?" 
              : `You have ${totalPages} page${totalPages > 1 ? 's' : ''} working for you!`
            }
          </p>
        </div>
      </motion.div>

      {/* Live Social Proof Banner - Above the Fold */}
      <motion.div variants={item} className="glass-card rounded-2xl p-4 border border-teal-DEFAULT/20">
        <div className="flex items-center gap-4 overflow-hidden">
          <div className="flex items-center gap-2 shrink-0">
            <span className="w-3 h-3 bg-teal-DEFAULT rounded-full animate-pulse" />
            <span className="text-teal-DEFAULT font-bold text-base">LIVE</span>
          </div>
          <div className="flex-1 overflow-hidden">
            <div className="flex gap-6 animate-marquee">
              {liveActivities.map((activity, i) => (
                <div key={`banner-${activity.name}-${i}`} className="flex items-center gap-3 shrink-0">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-DEFAULT to-cyan-DEFAULT flex items-center justify-center text-white text-sm font-bold">
                    {activity.name[0]}
                  </div>
                  <span className="text-base">
                    <span className="font-semibold text-white">{activity.name}</span>
                    <span className="text-gray-500"> earned </span>
                    <span className="text-teal-DEFAULT font-bold">{activity.amount}</span>
                    <span className="text-gray-600"> · {activity.location}</span>
                  </span>
                </div>
              ))}
              {/* Duplicate for seamless scroll */}
              {liveActivities.map((activity, i) => (
                <div key={`banner2-${activity.name}-${i}`} className="flex items-center gap-3 shrink-0">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-DEFAULT to-cyan-DEFAULT flex items-center justify-center text-white text-sm font-bold">
                    {activity.name[0]}
                  </div>
                  <span className="text-base">
                    <span className="font-semibold text-white">{activity.name}</span>
                    <span className="text-gray-500"> earned </span>
                    <span className="text-teal-DEFAULT font-bold">{activity.amount}</span>
                    <span className="text-gray-600"> · {activity.location}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
          <span className="shrink-0 px-3 py-1 bg-teal-DEFAULT/10 text-teal-DEFAULT text-sm font-bold rounded-full">
            🔥 847 earning today
          </span>
        </div>
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
              <div className="flex items-center gap-2 mt-4 text-teal-DEFAULT text-sm font-medium">
                <TrendUpIcon />
                <span>{stat.subtext}</span>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Welcome Video Card - HERO */}
      <motion.div variants={item} className="glass-hero rounded-3xl overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-5">
          {/* Video Player */}
          <div className="relative lg:col-span-3 aspect-video lg:aspect-[16/10] bg-gradient-to-br from-navy-800/80 to-navy-900/80">
            <div className="absolute inset-0 bg-gradient-to-t from-navy-950/60 via-transparent to-navy-950/30" />
            
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <button className="w-28 h-28 rounded-full bg-gradient-to-r from-teal-DEFAULT to-cyan-DEFAULT flex items-center justify-center text-white hover:scale-105 transition-all duration-300 mb-4 mx-auto group animate-pulse-glow">
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
          
          {/* Video Info */}
          <div className="lg:col-span-2 p-8 lg:p-10 flex flex-col justify-center bg-gradient-to-br from-transparent to-teal-DEFAULT/5">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-DEFAULT/15 border border-teal-DEFAULT/25 rounded-full text-teal-DEFAULT text-sm font-bold uppercase tracking-wider mb-4 w-fit">
              <span className="w-2 h-2 bg-teal-DEFAULT rounded-full animate-pulse" />
              Getting Started
            </div>
            
            <h3 className="text-2xl lg:text-3xl font-display font-bold text-white mb-4 leading-tight">
              Watch This Video To Get Started
            </h3>
            
            <p className="text-gray-400 mb-8 text-lg leading-relaxed">
              This 5-minute video shows you exactly how to use your P55 Account
            </p>
            
            <div className="space-y-4">
              <Link 
                href="/app/training"
                className="btn-gold btn-large w-full sm:w-auto inline-flex items-center justify-center gap-3"
              >
                Click Here To Learn How
              </Link>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <motion.div variants={item} className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="w-3 h-3 bg-teal-DEFAULT rounded-full" />
            What Would You Like To Do?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {quickActions.map((action) => (
              <Link
                key={action.title}
                href={action.href}
                className={`glass-card glass-card-hover rounded-2xl p-6 group transition-all duration-300 relative overflow-hidden ${
                  action.highlight ? 'border border-teal-DEFAULT/25' : ''
                }`}
              >
                {action.badge && (
                  <span className="absolute top-3 right-3 px-2 py-1 bg-gradient-to-r from-gold-DEFAULT to-gold-bright text-black text-xs font-bold rounded-full">
                    {action.badge}
                  </span>
                )}
                <div className={`w-14 h-14 ${action.iconBg} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${action.color}`} />
                </div>
                <h3 className="font-bold text-white mb-2 text-lg group-hover:text-teal-DEFAULT transition-colors">
                  {action.title}
                </h3>
                <p className="text-gray-500 text-base">{action.description}</p>
                <div className="mt-4 flex items-center gap-2 text-teal-DEFAULT text-base opacity-0 group-hover:opacity-100 transition-opacity font-medium">
                  <span>Get started</span>
                  <ArrowRightIcon />
                </div>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* What's Happening Right Now */}
        <motion.div variants={item} className="space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            📊 What&apos;s Happening Inside P55 Right Now
          </h2>
          <div className="glass-card rounded-2xl p-5 space-y-4">
            <p className="text-gray-500 text-sm">Members are generating real results every single day through their P55 Accounts.</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-navy-800/30 rounded-xl p-4 text-center">
                <p className="text-xs text-gray-500 mb-1">📄 Articles Today</p>
                <p className="text-2xl font-bold text-teal-DEFAULT">1,291</p>
              </div>
              <div className="bg-navy-800/30 rounded-xl p-4 text-center">
                <p className="text-xs text-gray-500 mb-1">⚡ Avg Fast Cash</p>
                <p className="text-2xl font-bold text-teal-DEFAULT">3.8</p>
              </div>
              <div className="bg-navy-800/30 rounded-xl p-4 text-center">
                <p className="text-xs text-gray-500 mb-1">🎯 Clicks Tracked</p>
                <p className="text-2xl font-bold text-teal-DEFAULT">10,898</p>
              </div>
              <div className="bg-navy-800/30 rounded-xl p-4 text-center">
                <p className="text-xs text-gray-500 mb-1">👥 Active This Week</p>
                <p className="text-2xl font-bold text-teal-DEFAULT">2,990</p>
              </div>
            </div>
            <div className="bg-gradient-to-r from-teal-DEFAULT/10 to-cyan-DEFAULT/10 rounded-xl p-4 text-center border border-teal-DEFAULT/20">
              <p className="text-xs text-gray-500 mb-1">TOTAL MONEY GENERATED TODAY</p>
              <p className="text-3xl font-bold text-teal-DEFAULT">$45,070 <span className="text-lg">📈</span></p>
            </div>
            <div className="flex items-center justify-center gap-2 text-xs text-teal-DEFAULT">
              <span className="w-2 h-2 bg-teal-DEFAULT rounded-full animate-pulse" />
              LIVE
            </div>
          </div>
        </motion.div>
      </div>

      {/* Recent Pages */}
      <motion.div variants={item} className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="w-3 h-3 bg-teal-DEFAULT rounded-full" />
            Your Pages
          </h2>
          <Link href="/app/pages" className="text-base text-teal-DEFAULT hover:underline font-medium">
            View all →
          </Link>
        </div>

        {loading ? (
          <div className="glass-card rounded-2xl p-8 text-center">
            <div className="w-10 h-10 border-3 border-teal-DEFAULT border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-gray-500 mt-4 text-lg">Loading your pages...</p>
          </div>
        ) : pages.length === 0 ? (
          <div className="glass-card rounded-2xl p-10 text-center border-2 border-dashed border-teal-DEFAULT/25">
            <div className="w-20 h-20 bg-teal-DEFAULT/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
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
                  <div className="w-12 h-12 bg-teal-DEFAULT/10 rounded-xl flex items-center justify-center text-teal-DEFAULT">
                    <LayersIcon />
                  </div>
                  <span className={`px-3 py-1 text-sm rounded-full font-medium ${
                    page.status === 'published'
                      ? 'bg-teal-DEFAULT/10 text-teal-DEFAULT border border-teal-DEFAULT/20'
                      : 'bg-navy-700 text-gray-400'
                  }`}>
                    {page.status === 'published' ? '✓ Live' : page.status}
                  </span>
                </div>
                <h3 className="font-semibold text-white line-clamp-2 mb-3 text-lg group-hover:text-teal-DEFAULT transition-colors">
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
          <div className="w-14 h-14 bg-teal-DEFAULT/15 rounded-xl flex items-center justify-center text-teal-DEFAULT shrink-0">
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
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-teal-DEFAULT to-cyan-DEFAULT hover:from-teal-dark hover:to-cyan-dark text-white rounded-lg font-bold transition-all"
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
