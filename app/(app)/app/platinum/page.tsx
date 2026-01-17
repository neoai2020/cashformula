'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  profitPacks, 
  highTicketProducts, 
  comparisonPages,
  bestOfLists,
  seasonalCalendar,
  type ProfitPack, 
  type DayContent 
} from '@/lib/platinum-data';
import Button from '@/components/ui/Button';
import Confetti from '@/components/ui/Confetti';
import VideoPlaceholder from '@/components/ui/VideoPlaceholder';

// Icons
const BoltIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="13,2 3,14 12,14 11,22 21,10 12,10" />
  </svg>
);

const SparklesIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 3l1.912 5.813a2 2 0 0 0 1.275 1.275L21 12l-5.813 1.912a2 2 0 0 0-1.275 1.275L12 21l-1.912-5.813a2 2 0 0 0-1.275-1.275L3 12l5.813-1.912a2 2 0 0 0 1.275-1.275L12 3z" />
  </svg>
);

const CopyIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="9" y="9" width="13" height="13" rx="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

const CheckIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <polyline points="20,6 9,17 4,12" />
  </svg>
);

const FireIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 23c-4.97 0-9-3.58-9-8 0-2.52 1.17-5.06 3.05-7.29.37-.44.75-.86 1.14-1.25l.73-.71.5.89c.63 1.11 1.4 2.07 2.27 2.86.31.28.62.53.94.76l.77.57-.45.84c-.3.55-.44 1.13-.44 1.73 0 1.1.45 2.1 1.17 2.83.72.73 1.72 1.18 2.82 1.18s2.1-.45 2.82-1.18c.72-.73 1.17-1.73 1.17-2.83 0-.6-.14-1.18-.44-1.73l-.45-.84.77-.57c.32-.23.63-.48.94-.76.87-.79 1.64-1.75 2.27-2.86l.5-.89.73.71c.39.39.77.81 1.14 1.25C19.83 9.94 21 12.48 21 15c0 4.42-4.03 8-9 8z" />
  </svg>
);

const TrendUpIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="23,6 13.5,15.5 8.5,10.5 1,18" />
    <polyline points="17,6 23,6 23,12" />
  </svg>
);

const StarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
  </svg>
);

const ExternalLinkIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15,3 21,3 21,9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="6,9 12,15 18,9" />
  </svg>
);

const PackageIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M16.5 9.4l-9-5.19M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <polyline points="3.27,6.96 12,12.01 20.73,6.96" />
    <line x1="12" y1="22.08" x2="12" y2="12" />
  </svg>
);

const CalendarIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

// Training videos placeholder data
const trainingVideos = [
  {
    title: 'Platinum Mastery: Your First $1,000',
    description: 'Complete walkthrough of the Platinum system - from setup to your first commission.',
    duration: '24:15',
    badge: 'START HERE',
    thumbnail: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=800&h=450&fit=crop',
    videoUrl: '#',
  },
  {
    title: 'High-Ticket Promotion Secrets',
    description: 'Advanced strategies for promoting high-ticket products and maximizing commissions.',
    duration: '18:42',
    badge: 'ADVANCED',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=450&fit=crop',
    videoUrl: '#',
  },
  {
    title: '30-Day Content Calendar Strategy',
    description: 'How to use your profit pack content for maximum engagement and consistent sales.',
    duration: '15:30',
    badge: 'STRATEGY',
    thumbnail: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=450&fit=crop',
    videoUrl: '#',
  },
];

export default function PlatinumPage() {
  const [selectedPack, setSelectedPack] = useState<ProfitPack | null>(null);
  const [expandedPack, setExpandedPack] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isFirstVisit, setIsFirstVisit] = useState(false);
  const [activeTab, setActiveTab] = useState<'packs' | 'products' | 'comparisons' | 'bestof' | 'calendar' | 'boosters'>('packs');
  const [visiblePosts, setVisiblePosts] = useState<number>(6);

  useEffect(() => {
    const visited = localStorage.getItem('platinum_visited');
    if (!visited) {
      setIsFirstVisit(true);
      setShowConfetti(true);
      localStorage.setItem('platinum_visited', 'true');
    }
  }, []);

  const copyToClipboard = (text: string, id: string) => {
    const fullText = text;
    navigator.clipboard.writeText(fullText);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const copyPostWithHashtags = (post: DayContent, packId: string) => {
    const fullText = `${post.caption}\n\n${post.hashtags}`;
    navigator.clipboard.writeText(fullText);
    setCopiedId(`${packId}-${post.day}`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const loadMorePosts = () => {
    setVisiblePosts(prev => Math.min(prev + 6, 30));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Confetti */}
      <Confetti
        isActive={showConfetti}
        onComplete={() => setShowConfetti(false)}
        colors={['#a855f7', '#9333ea', '#c084fc', '#d8b4fe', '#ffffff']}
      />

      {/* Premium Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-purple-500 to-purple-400 rounded-3xl opacity-70 animate-gradient-border" />

        <div className="relative m-[3px] glass-card rounded-3xl p-8 lg:p-10 overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-400/10 rounded-full blur-3xl" />

          <div className="relative">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="flex items-start gap-5">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-purple-500/40 animate-float">
                  <BoltIcon />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl sm:text-4xl font-display font-bold text-white">
                      Platinum Package
                    </h1>
                    <span className="px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-full text-purple-400 text-sm font-bold">
                      VIP ACCESS
                    </span>
                  </div>
                  <p className="text-navy-300 text-lg">
                    120+ ready-to-post content pieces & high-ticket products
                  </p>
                  
                  {/* Help Guide Link */}
                  <div className="mt-3">
                    <a 
                      href="/PLATINUM_GUIDE.md" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-teal-primary/10 hover:bg-teal-primary/20 border border-teal-primary/30 hover:border-teal-primary/50 rounded-lg text-teal-primary text-sm font-bold transition-all"
                    >
                      <span className="text-lg">📖</span>
                      <span>Complete User Guide - Read This First!</span>
                    </a>
                  </div>
                </div>
              </div>

              {isFirstVisit && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                  className="px-5 py-3 bg-purple-500/10 border border-purple-500/20 rounded-xl text-purple-400 font-bold flex items-center gap-2"
                >
                  <SparklesIcon />
                  Platinum Unlocked!
                </motion.div>
              )}
            </div>

            {/* Stats bar */}
            <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 text-sm">
              <div className="flex items-center gap-2 text-purple-400">
                <PackageIcon />
                <span className="font-bold">4 Profit Packs</span>
              </div>
              <div className="flex items-center gap-2 text-cash-green">
                <CalendarIcon />
                <span className="font-bold">120 Posts</span>
              </div>
              <div className="flex items-center gap-2 text-gold-400">
                <FireIcon />
                <span className="font-bold">8 High-Ticket</span>
              </div>
              <div className="flex items-center gap-2 text-pink-primary">
                <span className="text-lg">⚔️</span>
                <span className="font-bold">4 Battles</span>
              </div>
              <div className="flex items-center gap-2 text-teal-primary">
                <span className="text-lg">🏆</span>
                <span className="font-bold">2 Best-Of</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-primary">
                <span className="text-lg">⚡</span>
                <span className="font-bold">6 Boosters</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Training Videos */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <span className="text-purple-400"><BoltIcon /></span>
          Platinum Training Vault
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {trainingVideos.map((video, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card rounded-2xl overflow-hidden group"
            >
              <VideoPlaceholder
                thumbnail={video.thumbnail}
                title={video.title}
                duration={video.duration}
                badge={video.badge}
                videoUrl={video.videoUrl}
                accentColor="purple"
              />
              <div className="p-4">
                <h3 className="font-semibold text-white text-lg mb-1 group-hover:text-purple-400 transition-colors">
                  {video.title}
                </h3>
                <p className="text-sm text-navy-400">{video.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="glass-card p-2">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
          <button
            onClick={() => setActiveTab('packs')}
            className={`px-4 py-3 rounded-lg font-bold text-sm transition-all ${
              activeTab === 'packs'
                ? 'bg-gradient-to-r from-purple-primary to-pink-primary text-white shadow-glow-purple'
                : 'text-purple-primary/60 hover:text-purple-primary hover:bg-purple-primary/5'
            }`}
          >
            📦 Profit Packs
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-3 rounded-lg font-bold text-sm transition-all ${
              activeTab === 'products'
                ? 'bg-gradient-to-r from-purple-primary to-pink-primary text-white shadow-glow-purple'
                : 'text-purple-primary/60 hover:text-purple-primary hover:bg-purple-primary/5'
            }`}
          >
            🔥 High-Ticket
          </button>
          <button
            onClick={() => setActiveTab('comparisons')}
            className={`px-4 py-3 rounded-lg font-bold text-sm transition-all ${
              activeTab === 'comparisons'
                ? 'bg-gradient-to-r from-purple-primary to-pink-primary text-white shadow-glow-purple'
                : 'text-purple-primary/60 hover:text-purple-primary hover:bg-purple-primary/5'
            }`}
          >
            ⚔️ Battles
          </button>
          <button
            onClick={() => setActiveTab('bestof')}
            className={`px-4 py-3 rounded-lg font-bold text-sm transition-all ${
              activeTab === 'bestof'
                ? 'bg-gradient-to-r from-purple-primary to-pink-primary text-white shadow-glow-purple'
                : 'text-purple-primary/60 hover:text-purple-primary hover:bg-purple-primary/5'
            }`}
          >
            🏆 Best Of
          </button>
          <button
            onClick={() => setActiveTab('calendar')}
            className={`px-4 py-3 rounded-lg font-bold text-sm transition-all ${
              activeTab === 'calendar'
                ? 'bg-gradient-to-r from-purple-primary to-pink-primary text-white shadow-glow-purple'
                : 'text-purple-primary/60 hover:text-purple-primary hover:bg-purple-primary/5'
            }`}
          >
            📅 Calendar
          </button>
          <button
            onClick={() => setActiveTab('boosters')}
            className={`px-4 py-3 rounded-lg font-bold text-sm transition-all ${
              activeTab === 'boosters'
                ? 'bg-gradient-to-r from-purple-primary to-pink-primary text-white shadow-glow-purple'
                : 'text-purple-primary/60 hover:text-purple-primary hover:bg-purple-primary/5'
            }`}
          >
            ⚡ Boosters
          </button>
        </div>
      </div>

      {/* 30-Day Profit Packs */}
      <AnimatePresence mode="wait">
        {activeTab === 'packs' && (
          <motion.div
            key="packs"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <span className="text-purple-400"><SparklesIcon /></span>
                  30-Day Viral Post Packs
                </h2>
                <p className="text-navy-400 mt-1">
                  Copy-paste ready posts with hashtags for each niche
                </p>
              </div>
            </div>

            {/* Pack Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {profitPacks.map((pack, i) => (
                <motion.div
                  key={pack.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={`glass-card rounded-2xl overflow-hidden border-2 ${
                    expandedPack === pack.id ? 'border-purple-500' : 'border-transparent'
                  } transition-all`}
                >
                  {/* Pack Header */}
                  <div
                    className={`p-6 cursor-pointer ${pack.bgColor}`}
                    onClick={() => {
                      setExpandedPack(expandedPack === pack.id ? null : pack.id);
                      setSelectedPack(pack);
                      setVisiblePosts(6);
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${pack.color} flex items-center justify-center text-3xl shadow-lg`}>
                          {pack.emoji}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white">{pack.name}</h3>
                          <p className="text-navy-400">{pack.niche}</p>
                        </div>
                      </div>
                      <motion.div
                        animate={{ rotate: expandedPack === pack.id ? 180 : 0 }}
                        className="text-navy-400"
                      >
                        <ChevronDownIcon />
                      </motion.div>
                    </div>

                    <div className="mt-4 flex items-center gap-4 text-sm">
                      <span className="px-3 py-1 bg-navy-800/50 rounded-full text-purple-400 font-bold">
                        30 Posts
                      </span>
                      <span className="px-3 py-1 bg-navy-800/50 rounded-full text-cash-green font-bold">
                        {pack.commission}
                      </span>
                      <span className="px-3 py-1 bg-gold-500/20 rounded-full text-gold-400 font-bold">
                        Value: {pack.value}
                      </span>
                    </div>
                  </div>

                  {/* Expanded Content */}
                  <AnimatePresence>
                    {expandedPack === pack.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="p-6 border-t border-navy-700 space-y-4">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="font-bold text-white">All 30 Posts</h4>
                            <Button
                              variant="ghost"
                              onClick={() => {
                                const allPosts = pack.posts.map(p => `--- Day ${p.day} ---\n\n${p.caption}\n\n${p.hashtags}`).join('\n\n\n');
                                copyToClipboard(allPosts, `${pack.id}-all`);
                              }}
                            >
                              {copiedId === `${pack.id}-all` ? <CheckIcon /> : <CopyIcon />}
                              <span>{copiedId === `${pack.id}-all` ? 'Copied All!' : 'Copy All 30'}</span>
                            </Button>
                          </div>

                          {/* Posts Grid */}
                          <div className="space-y-4 max-h-[800px] overflow-y-auto pr-2">
                            {pack.posts.slice(0, visiblePosts).map((post) => (
                              <div
                                key={post.day}
                                className="bg-navy-800/50 rounded-xl overflow-hidden border border-navy-700 hover:border-purple-500/30 transition-all"
                              >
                                {/* Post Image */}
                                {post.imageUrl && (
                                  <div className="aspect-video relative overflow-hidden">
                                    <img
                                      src={post.imageUrl}
                                      alt={post.imageDescription || `Day ${post.day} post`}
                                      className="w-full h-full object-cover"
                                    />
                                    <div className="absolute top-3 left-3">
                                      <span className={`px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${pack.color} text-white shadow-lg`}>
                                        Day {post.day}
                                      </span>
                                    </div>
                                  </div>
                                )}
                                
                                <div className="p-4">
                                  {!post.imageUrl && (
                                    <div className="flex items-center justify-between mb-3">
                                      <span className={`px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${pack.color} text-white`}>
                                        Day {post.day}
                                      </span>
                                    </div>
                                  )}

                                  <div className="flex items-start justify-between gap-2 mb-3">
                                    <p className="text-white text-sm whitespace-pre-wrap leading-relaxed flex-1" style={{ maxHeight: '200px', overflow: 'hidden' }}>
                                      {post.caption.length > 500 ? post.caption.substring(0, 500) + '...' : post.caption}
                                    </p>
                                    <button
                                      onClick={() => copyPostWithHashtags(post, pack.id)}
                                      className="text-purple-400 hover:text-purple-300 flex items-center gap-1 text-sm font-medium shrink-0"
                                    >
                                      {copiedId === `${pack.id}-${post.day}` ? (
                                        <>
                                          <CheckIcon />
                                          <span>Copied!</span>
                                        </>
                                      ) : (
                                        <>
                                          <CopyIcon />
                                          <span>Copy</span>
                                        </>
                                      )}
                                    </button>
                                  </div>

                                  <p className="text-purple-400/70 text-xs break-words">
                                    {post.hashtags}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>

                          {visiblePosts < 30 && (
                            <Button
                              variant="ghost"
                              onClick={loadMorePosts}
                              className="w-full"
                            >
                              Load More Posts ({30 - visiblePosts} remaining)
                            </Button>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* High-Ticket Products */}
        {activeTab === 'products' && (
          <motion.div
            key="products"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span className="text-gold-400"><FireIcon /></span>
                High-Ticket Products
              </h2>
              <p className="text-navy-400 mt-1">
                Premium products with $45-$250 commissions per sale
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {highTicketProducts.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="glass-card rounded-2xl p-5 space-y-4 border border-navy-700 hover:border-gold-500/30 transition-all group"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <span className="px-2 py-1 bg-navy-800 rounded-lg text-navy-400 text-xs">
                      {product.category}
                    </span>
                    {product.isHot && (
                      <span className="px-2 py-1 bg-orange-500/20 rounded-lg text-orange-400 text-xs font-bold flex items-center gap-1">
                        <FireIcon /> HOT
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="font-semibold text-white text-sm leading-tight group-hover:text-gold-400 transition-colors line-clamp-2">
                    {product.title}
                  </h3>

                  {/* Rating */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={i < Math.floor(product.rating) ? 'text-gold-400' : 'text-navy-600'}
                        >
                          <StarIcon />
                        </span>
                      ))}
                    </div>
                    <span className="text-navy-400 text-xs">
                      {product.rating} ({product.reviews.toLocaleString()})
                    </span>
                  </div>

                  {/* Bullet Points */}
                  <ul className="space-y-1">
                    {product.bulletPoints.slice(0, 2).map((point, j) => (
                      <li key={j} className="text-navy-400 text-xs flex items-start gap-2">
                        <span className="text-cash-green mt-0.5">✓</span>
                        <span className="line-clamp-1">{point}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Price & Commission */}
                  <div className="pt-3 border-t border-navy-700">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-bold">{product.price}</span>
                      <span className="text-cash-green font-bold text-sm">
                        +{product.commission}
                      </span>
                    </div>
                    <a
                      href={`https://www.amazon.com/dp/${product.asin}?tag=YOUR_TAG`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-2 bg-gold-500 hover:bg-gold-400 text-navy-950 rounded-lg font-bold text-sm transition-colors"
                    >
                      <span>View on Amazon</span>
                      <ExternalLinkIcon />
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Commission Calculator */}
            <div className="glass-card rounded-2xl p-6 border border-gold-500/20">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <TrendUpIcon />
                Potential Earnings Calculator
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-navy-800/50 rounded-xl p-4 text-center">
                  <p className="text-navy-400 text-sm mb-1">1 Sale/Week</p>
                  <p className="text-3xl font-bold text-white">$360-1,000</p>
                  <p className="text-cash-green text-sm">/month</p>
                </div>
                <div className="bg-navy-800/50 rounded-xl p-4 text-center border-2 border-gold-500/30">
                  <p className="text-navy-400 text-sm mb-1">3 Sales/Week</p>
                  <p className="text-3xl font-bold text-gold-400">$1,080-3,000</p>
                  <p className="text-cash-green text-sm">/month</p>
                </div>
                <div className="bg-navy-800/50 rounded-xl p-4 text-center">
                  <p className="text-navy-400 text-sm mb-1">1 Sale/Day</p>
                  <p className="text-3xl font-bold text-white">$1,350-7,500</p>
                  <p className="text-cash-green text-sm">/month</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Comparison Battle Pages */}
        {activeTab === 'comparisons' && (
          <motion.div
            key="comparisons"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Intro Card */}
            <div className="glass-card p-6 border border-purple-primary/20 rounded-2xl">
              <div className="flex items-start gap-4">
                <div className="text-4xl">⚔️</div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">Product Comparison Battle Pages</h3>
                  <p className="text-purple-primary/80 leading-relaxed mb-3">
                    These are ready-to-use comparison pages that help your audience make buying decisions. 
                    People LOVE comparisons because it saves them hours of research. Each page compares 
                    two popular products head-to-head with a clear winner recommendation.
                  </p>
                  <div className="bg-purple-primary/10 p-4 rounded-lg border border-purple-primary/20">
                    <p className="text-sm text-purple-primary/90 font-bold mb-2">💡 HOW TO USE:</p>
                    <ol className="text-sm text-purple-primary/70 space-y-1 list-decimal list-inside">
                      <li>Click &quot;Copy Comparison&quot; to get the full content</li>
                      <li>Create a new page using the Build Page feature</li>
                      <li>Paste the content and add your affiliate links</li>
                      <li>Share on social media with: &quot;Can&apos;t decide? I tested both →&quot;</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>

            {/* Comparison Pages */}
            {comparisonPages.map((comparison) => (
              <div key={comparison.id} className="glass-card p-6 rounded-2xl border border-purple-primary/20">
                <h4 className="text-xl font-bold text-white mb-4">{comparison.title}</h4>
                
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  {/* Product 1 */}
                  <div className={`bg-gradient-to-br ${comparison.winner === 1 ? 'from-emerald-primary/20 to-teal-primary/10 border-2 border-emerald-primary/40' : 'from-purple-primary/5 to-transparent border border-purple-primary/20'} rounded-xl p-5`}>
                    {comparison.winner === 1 && (
                      <div className="inline-block bg-emerald-primary px-3 py-1 rounded-full text-xs font-bold text-deep-space-black mb-3">
                        👑 WINNER
                      </div>
                    )}
                    <img src={comparison.product1.image} alt={comparison.product1.name} className="w-32 h-32 object-contain mx-auto mb-4 rounded-lg" />
                    <h5 className="font-bold text-white text-lg mb-2">{comparison.product1.name}</h5>
                    <div className="flex items-center gap-4 mb-3">
                      <span className="text-2xl font-bold text-purple-primary">{comparison.product1.price}</span>
                      <div className="flex items-center gap-1 text-emerald-primary text-sm">
                        <StarIcon />
                        <span>{comparison.product1.rating}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {comparison.product1.pros.map((pro, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-sm">
                          <span className="text-emerald-primary mt-0.5">✓</span>
                          <span className="text-purple-primary/80">{pro}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Product 2 */}
                  <div className={`bg-gradient-to-br ${comparison.winner === 2 ? 'from-emerald-primary/20 to-teal-primary/10 border-2 border-emerald-primary/40' : 'from-purple-primary/5 to-transparent border border-purple-primary/20'} rounded-xl p-5`}>
                    {comparison.winner === 2 && (
                      <div className="inline-block bg-emerald-primary px-3 py-1 rounded-full text-xs font-bold text-deep-space-black mb-3">
                        👑 WINNER
                      </div>
                    )}
                    <img src={comparison.product2.image} alt={comparison.product2.name} className="w-32 h-32 object-contain mx-auto mb-4 rounded-lg" />
                    <h5 className="font-bold text-white text-lg mb-2">{comparison.product2.name}</h5>
                    <div className="flex items-center gap-4 mb-3">
                      <span className="text-2xl font-bold text-purple-primary">{comparison.product2.price}</span>
                      <div className="flex items-center gap-1 text-emerald-primary text-sm">
                        <StarIcon />
                        <span>{comparison.product2.rating}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {comparison.product2.pros.map((pro, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-sm">
                          <span className="text-emerald-primary mt-0.5">✓</span>
                          <span className="text-purple-primary/80">{pro}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Verdict */}
                <div className="bg-purple-primary/10 p-5 rounded-xl border border-purple-primary/20 mb-4">
                  <p className="text-sm font-bold text-purple-primary mb-2">🏆 THE VERDICT:</p>
                  <p className="text-white leading-relaxed mb-4">{comparison.verdict}</p>
                  
                  <div className="grid md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <p className="text-xs font-bold text-emerald-primary mb-2">✅ Choose {comparison.product1.name} if:</p>
                      <p className="text-sm text-purple-primary/70">{comparison.whenToChoose1}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-teal-primary mb-2">✅ Choose {comparison.product2.name} if:</p>
                      <p className="text-sm text-purple-primary/70">{comparison.whenToChoose2}</p>
                    </div>
                  </div>
                </div>

                <Button
                  variant="primary"
                  onClick={() => {
                    const content = `${comparison.title}\n\n=== ${comparison.product1.name} ===\nPrice: ${comparison.product1.price}\nPros:\n${comparison.product1.pros.map(p => `- ${p}`).join('\n')}\n\n=== ${comparison.product2.name} ===\nPrice: ${comparison.product2.price}\nPros:\n${comparison.product2.pros.map(p => `- ${p}`).join('\n')}\n\nVERDICT:\n${comparison.verdict}\n\nChoose ${comparison.product1.name} if: ${comparison.whenToChoose1}\n\nChoose ${comparison.product2.name} if: ${comparison.whenToChoose2}`;
                    navigator.clipboard.writeText(content);
                    setCopiedId(comparison.id);
                    setTimeout(() => setCopiedId(null), 2000);
                  }}
                  className="w-full"
                >
                  {copiedId === comparison.id ? (
                    <>
                      <CheckIcon /> Copied!
                    </>
                  ) : (
                    <>
                      <CopyIcon /> Copy Full Comparison
                    </>
                  )}
                </Button>
              </div>
            ))}
          </motion.div>
        )}

        {/* Best Of Lists */}
        {activeTab === 'bestof' && (
          <motion.div
            key="bestof"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Intro Card */}
            <div className="glass-card p-6 border border-purple-primary/20 rounded-2xl">
              <div className="flex items-start gap-4">
                <div className="text-4xl">🏆</div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">Best Of Lists - Ranked Product Pages</h3>
                  <p className="text-purple-primary/80 leading-relaxed mb-3">
                    These are curated &quot;Top 5&quot; style lists that rank the best products in each category. 
                    List posts get MASSIVE engagement because they provide quick value and satisfy people&apos;s 
                    desire for the &quot;best&quot; option. Each product is ranked with clear reasoning.
                  </p>
                  <div className="bg-purple-primary/10 p-4 rounded-lg border border-purple-primary/20">
                    <p className="text-sm text-purple-primary/90 font-bold mb-2">💡 HOW TO USE:</p>
                    <ol className="text-sm text-purple-primary/70 space-y-1 list-decimal list-inside">
                      <li>Review the full list below - each product has a rank and reasoning</li>
                      <li>Copy the entire list content with one click</li>
                      <li>Create a page and add your affiliate links for each product</li>
                      <li>Share with: &quot;I tested 15 air fryers - here are the top 5 →&quot;</li>
                      <li>Tip: People love clicking on #1 ranked items!</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>

            {/* Best Of Lists */}
            {bestOfLists.map((list) => (
              <div key={list.id} className="glass-card p-6 rounded-2xl border border-purple-primary/20">
                <h4 className="text-2xl font-bold text-white mb-2">{list.title}</h4>
                <p className="text-purple-primary/60 text-sm mb-6">{list.subtitle}</p>

                <div className="bg-purple-primary/10 p-5 rounded-xl border border-purple-primary/20 mb-6">
                  <p className="text-white leading-relaxed">{list.intro}</p>
                </div>

                {/* Products */}
                <div className="space-y-4 mb-6">
                  {list.products.map((product) => (
                    <div key={product.rank} className="bg-gradient-to-r from-purple-primary/5 to-transparent border border-purple-primary/20 rounded-xl p-5">
                      <div className="flex items-start gap-4">
                        {/* Rank Badge */}
                        <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl ${
                          product.rank === 1 ? 'bg-gradient-to-br from-emerald-primary to-teal-primary text-deep-space-black' :
                          product.rank === 2 ? 'bg-gradient-to-br from-purple-primary to-pink-primary text-white' :
                          'bg-purple-primary/20 text-purple-primary'
                        }`}>
                          #{product.rank}
                        </div>

                        <div className="flex-1">
                          {/* Badge */}
                          {product.badge && (
                            <div className="inline-block bg-pink-primary px-3 py-1 rounded-full text-xs font-bold text-white mb-2">
                              {product.badge}
                            </div>
                          )}

                          {/* Product Info */}
                          <h5 className="text-lg font-bold text-white mb-2">{product.title}</h5>
                          <div className="flex items-center gap-4 mb-3">
                            <span className="text-xl font-bold text-purple-primary">{product.price}</span>
                            <div className="flex items-center gap-1 text-emerald-primary text-sm">
                              <StarIcon />
                              <span>{product.rating}</span>
                            </div>
                          </div>

                          {/* Why */}
                          <p className="text-purple-primary/90 text-sm font-medium mb-3 italic">
                            &quot;{product.why}&quot;
                          </p>

                          {/* Pros */}
                          <div className="grid md:grid-cols-2 gap-2">
                            {product.pros.map((pro, idx) => (
                              <div key={idx} className="flex items-start gap-2 text-sm">
                                <span className="text-emerald-primary mt-0.5">✓</span>
                                <span className="text-purple-primary/70">{pro}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Product Image */}
                        <img src={product.image} alt={product.title} className="w-24 h-24 object-contain rounded-lg" />
                      </div>
                    </div>
                  ))}
                </div>

                <Button
                  variant="primary"
                  onClick={() => {
                    const content = `${list.title}\n${list.subtitle}\n\n${list.intro}\n\n${list.products.map(p => `#${p.rank} - ${p.title}${p.badge ? ` [${p.badge}]` : ''}\nPrice: ${p.price} | Rating: ${p.rating}★\n\nWhy: ${p.why}\n\nKey Features:\n${p.pros.map(pr => `✓ ${pr}`).join('\n')}`).join('\n\n---\n\n')}`;
                    navigator.clipboard.writeText(content);
                    setCopiedId(list.id);
                    setTimeout(() => setCopiedId(null), 2000);
                  }}
                  className="w-full"
                >
                  {copiedId === list.id ? (
                    <>
                      <CheckIcon /> Copied!
                    </>
                  ) : (
                    <>
                      <CopyIcon /> Copy Complete List
                    </>
                  )}
                </Button>
              </div>
            ))}
          </motion.div>
        )}

        {/* Seasonal Calendar */}
        {activeTab === 'calendar' && (
          <motion.div
            key="calendar"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Intro Card */}
            <div className="glass-card p-6 border border-purple-primary/20 rounded-2xl">
              <div className="flex items-start gap-4">
                <div className="text-4xl">📅</div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">12-Month Seasonal Promotion Calendar</h3>
                  <p className="text-purple-primary/80 leading-relaxed mb-3">
                    This is your year-round roadmap for what to promote and when. Each month has specific 
                    products that sell better due to seasons, holidays, and shopping patterns. Follow this 
                    calendar and you&apos;ll always know exactly what to focus on.
                  </p>
                  <div className="bg-purple-primary/10 p-4 rounded-lg border border-purple-primary/20">
                    <p className="text-sm text-purple-primary/90 font-bold mb-2">💡 HOW TO USE:</p>
                    <ol className="text-sm text-purple-primary/70 space-y-1 list-decimal list-inside">
                      <li>Check what month it is and read that month&apos;s strategy</li>
                      <li>See which products sell best during that time</li>
                      <li>Use the post ideas to create timely, relevant content</li>
                      <li>Follow the pro tips to maximize your earnings</li>
                      <li>Plan ahead - start promoting 2-3 weeks BEFORE each season</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {seasonalCalendar.map((month) => (
                <div key={month.month} className="glass-card p-6 rounded-2xl border border-purple-primary/20">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-4xl">{month.emoji}</span>
                    <div>
                      <h4 className="text-xl font-bold text-white">{month.month}</h4>
                      <p className="text-sm text-purple-primary/60">{month.season}</p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-purple-primary/10 to-pink-primary/5 p-4 rounded-lg border border-purple-primary/20 mb-4">
                    <p className="text-white font-bold text-sm mb-1">🎯 Theme:</p>
                    <p className="text-purple-primary/90">{month.theme}</p>
                  </div>

                  <div className="space-y-4">
                    {/* Top Products */}
                    <div>
                      <p className="text-sm font-bold text-emerald-primary mb-2 flex items-center gap-2">
                        <PackageIcon />
                        Top Products to Promote:
                      </p>
                      <ul className="space-y-1">
                        {month.topProducts.map((product, idx) => (
                          <li key={idx} className="text-sm text-purple-primary/70 flex items-start gap-2">
                            <span className="text-emerald-primary mt-0.5">→</span>
                            <span>{product}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Post Ideas */}
                    <div>
                      <p className="text-sm font-bold text-pink-primary mb-2">💡 Content Post Ideas:</p>
                      <ul className="space-y-1">
                        {month.postIdeas.map((idea, idx) => (
                          <li key={idx} className="text-sm text-purple-primary/70 flex items-start gap-2">
                            <span className="text-pink-primary mt-0.5">•</span>
                            <span>{idea}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Tips */}
                    <div className="bg-purple-primary/5 p-3 rounded-lg border border-purple-primary/10">
                      <p className="text-xs font-bold text-teal-primary mb-2">📈 PRO TIPS:</p>
                      <ul className="space-y-1">
                        {month.tips.map((tip, idx) => (
                          <li key={idx} className="text-xs text-purple-primary/70 flex items-start gap-2">
                            <span className="text-teal-primary mt-0.5">✓</span>
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Conversion Boosters */}
        {activeTab === 'boosters' && (
          <motion.div
            key="boosters"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Intro Card */}
            <div className="glass-card p-6 border border-purple-primary/20 rounded-2xl">
              <div className="flex items-start gap-4">
                <div className="text-4xl">⚡</div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">Conversion Boosters - Add These To Your Pages!</h3>
                  <p className="text-purple-primary/80 leading-relaxed mb-3">
                    These are powerful psychological triggers you can add to ANY of your profit pages to 
                    increase conversions. These create urgency, build trust, and encourage visitors to 
                    click your affiliate links. Copy and paste these into your pages for instant results.
                  </p>
                  <div className="bg-purple-primary/10 p-4 rounded-lg border border-purple-primary/20">
                    <p className="text-sm text-purple-primary/90 font-bold mb-2">💡 HOW TO USE:</p>
                    <ol className="text-sm text-purple-primary/70 space-y-1 list-decimal list-inside">
                      <li>Choose 2-3 boosters that fit your page&apos;s style</li>
                      <li>Copy the text/code provided</li>
                      <li>Add them to your profit pages strategically</li>
                      <li>Place countdown timers near buy buttons</li>
                      <li>Add social proof near the top of pages</li>
                      <li>Use exit popups to catch people before they leave</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>

            {/* Booster Cards */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Countdown Timer */}
              <div className="glass-card p-6 rounded-2xl border border-purple-primary/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-rose-primary to-pink-primary flex items-center justify-center text-2xl">
                    ⏰
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white">Countdown Timer</h4>
                    <p className="text-xs text-purple-primary/60">Creates urgency</p>
                  </div>
                </div>

                <p className="text-sm text-purple-primary/80 mb-4">
                  Add a countdown timer to create urgency. People are more likely to buy when they feel 
                  time is running out. Place this near your call-to-action buttons.
                </p>

                <div className="bg-purple-primary/10 p-4 rounded-lg border border-purple-primary/20 mb-4">
                  <p className="text-xs text-purple-primary/70 font-mono mb-2">Example Text:</p>
                  <p className="text-white text-sm font-bold">
                    ⏰ Special Price Expires in: 2h 47m 13s
                  </p>
                  <p className="text-rose-primary text-xs mt-2">
                    Amazon prices change frequently. Lock in this price now!
                  </p>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const text = '⏰ Special Price Expires in: [TIME]\nAmazon prices change frequently. Lock in this price now!';
                    navigator.clipboard.writeText(text);
                    setCopiedId('booster-countdown');
                    setTimeout(() => setCopiedId(null), 2000);
                  }}
                  className="w-full"
                >
                  {copiedId === 'booster-countdown' ? '✓ Copied!' : '📋 Copy Timer Text'}
                </Button>
              </div>

              {/* Live Visitors */}
              <div className="glass-card p-6 rounded-2xl border border-purple-primary/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-primary to-teal-primary flex items-center justify-center text-2xl">
                    👥
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white">Live Visitors Counter</h4>
                    <p className="text-xs text-purple-primary/60">Social proof</p>
                  </div>
                </div>

                <p className="text-sm text-purple-primary/80 mb-4">
                  Show how many people are viewing the page right now. This creates social proof and 
                  FOMO (fear of missing out). Place at the top of your pages.
                </p>

                <div className="bg-purple-primary/10 p-4 rounded-lg border border-purple-primary/20 mb-4">
                  <p className="text-xs text-purple-primary/70 font-mono mb-2">Example Text:</p>
                  <p className="text-white text-sm">
                    <span className="inline-flex items-center gap-2">
                      <span className="w-2 h-2 bg-emerald-primary rounded-full animate-pulse"></span>
                      <span className="font-bold">127 people</span> are viewing this right now
                    </span>
                  </p>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const text = '🟢 [NUMBER] people are viewing this product right now';
                    navigator.clipboard.writeText(text);
                    setCopiedId('booster-visitors');
                    setTimeout(() => setCopiedId(null), 2000);
                  }}
                  className="w-full"
                >
                  {copiedId === 'booster-visitors' ? '✓ Copied!' : '📋 Copy Visitor Text'}
                </Button>
              </div>

              {/* Recent Sales */}
              <div className="glass-card p-6 rounded-2xl border border-purple-primary/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-primary to-pink-primary flex items-center justify-center text-2xl">
                    🔥
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white">Recent Purchase Alerts</h4>
                    <p className="text-xs text-purple-primary/60">Trust builder</p>
                  </div>
                </div>

                <p className="text-sm text-purple-primary/80 mb-4">
                  Show recent purchases to build trust. When people see others buying, they&apos;re more 
                  likely to buy too. Add these throughout your page.
                </p>

                <div className="bg-purple-primary/10 p-4 rounded-lg border border-purple-primary/20 mb-4 space-y-2">
                  <p className="text-xs text-purple-primary/70 font-mono mb-2">Example Alerts:</p>
                  <p className="text-white text-xs">
                    ✓ Sarah from Texas purchased this 5 minutes ago
                  </p>
                  <p className="text-white text-xs">
                    ✓ Mike from California purchased this 12 minutes ago
                  </p>
                  <p className="text-white text-xs">
                    ✓ Jennifer from Florida purchased this 18 minutes ago
                  </p>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const text = '✓ [NAME] from [STATE] purchased this [TIME] ago\n✓ [NAME] from [STATE] purchased this [TIME] ago\n✓ [NAME] from [STATE] purchased this [TIME] ago';
                    navigator.clipboard.writeText(text);
                    setCopiedId('booster-sales');
                    setTimeout(() => setCopiedId(null), 2000);
                  }}
                  className="w-full"
                >
                  {copiedId === 'booster-sales' ? '✓ Copied!' : '📋 Copy Sales Alerts'}
                </Button>
              </div>

              {/* Urgency Banner */}
              <div className="glass-card p-6 rounded-2xl border border-purple-primary/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-primary to-rose-primary flex items-center justify-center text-2xl">
                    🚨
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white">Urgency Banners</h4>
                    <p className="text-xs text-purple-primary/60">Action trigger</p>
                  </div>
                </div>

                <p className="text-sm text-purple-primary/80 mb-4">
                  Eye-catching banners that communicate scarcity and urgency. Place these at the very 
                  top of pages or near buy buttons for maximum impact.
                </p>

                <div className="bg-purple-primary/10 p-4 rounded-lg border border-purple-primary/20 mb-4 space-y-3">
                  <p className="text-xs text-purple-primary/70 font-mono mb-2">Example Banners:</p>
                  <div className="bg-rose-primary/20 border-l-4 border-rose-primary p-3 rounded">
                    <p className="text-white text-xs font-bold">
                      🚨 ONLY 3 LEFT IN STOCK - Order now before it&apos;s gone!
                    </p>
                  </div>
                  <div className="bg-emerald-primary/20 border-l-4 border-emerald-primary p-3 rounded">
                    <p className="text-white text-xs font-bold">
                      ✅ IN STOCK - Ships within 24 hours with Prime
                    </p>
                  </div>
                  <div className="bg-pink-primary/20 border-l-4 border-pink-primary p-3 rounded">
                    <p className="text-white text-xs font-bold">
                      💰 PRICE DROP ALERT - 35% off for limited time only
                    </p>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const text = '🚨 ONLY [NUMBER] LEFT IN STOCK - Order now!\n✅ IN STOCK - Ships within 24 hours\n💰 PRICE DROP ALERT - [PERCENT]% off limited time';
                    navigator.clipboard.writeText(text);
                    setCopiedId('booster-urgency');
                    setTimeout(() => setCopiedId(null), 2000);
                  }}
                  className="w-full"
                >
                  {copiedId === 'booster-urgency' ? '✓ Copied!' : '📋 Copy Banners'}
                </Button>
              </div>

              {/* Trust Badges */}
              <div className="glass-card p-6 rounded-2xl border border-purple-primary/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-primary to-emerald-primary flex items-center justify-center text-2xl">
                    🛡️
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white">Trust Badges</h4>
                    <p className="text-xs text-purple-primary/60">Credibility boost</p>
                  </div>
                </div>

                <p className="text-sm text-purple-primary/80 mb-4">
                  Add these trust indicators to reduce buyer hesitation. People want reassurance before 
                  clicking affiliate links. Place near buttons or at page bottom.
                </p>

                <div className="bg-purple-primary/10 p-4 rounded-lg border border-purple-primary/20 mb-4">
                  <p className="text-xs text-purple-primary/70 font-mono mb-3">Example Badges:</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-emerald-primary/20 text-emerald-primary text-xs font-bold rounded-full border border-emerald-primary/40">
                      ✓ Verified Purchase
                    </span>
                    <span className="px-3 py-1 bg-teal-primary/20 text-teal-primary text-xs font-bold rounded-full border border-teal-primary/40">
                      🔒 Secure Checkout
                    </span>
                    <span className="px-3 py-1 bg-purple-primary/20 text-purple-primary text-xs font-bold rounded-full border border-purple-primary/40">
                      ⚡ Fast Shipping
                    </span>
                    <span className="px-3 py-1 bg-pink-primary/20 text-pink-primary text-xs font-bold rounded-full border border-pink-primary/40">
                      ↩️ Easy Returns
                    </span>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const text = '✓ Verified Purchase | 🔒 Secure Checkout | ⚡ Fast Shipping | ↩️ Easy Returns';
                    navigator.clipboard.writeText(text);
                    setCopiedId('booster-trust');
                    setTimeout(() => setCopiedId(null), 2000);
                  }}
                  className="w-full"
                >
                  {copiedId === 'booster-trust' ? '✓ Copied!' : '📋 Copy Trust Badges'}
                </Button>
              </div>

              {/* Exit Intent Popup */}
              <div className="glass-card p-6 rounded-2xl border border-purple-primary/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-primary to-purple-primary flex items-center justify-center text-2xl">
                    🎯
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white">Exit Intent Message</h4>
                    <p className="text-xs text-purple-primary/60">Last chance offer</p>
                  </div>
                </div>

                <p className="text-sm text-purple-primary/80 mb-4">
                  A message to show when someone is about to leave your page without clicking. This 
                  gives you one last chance to convert them. Use this sparingly but effectively.
                </p>

                <div className="bg-purple-primary/10 p-4 rounded-lg border border-purple-primary/20 mb-4">
                  <p className="text-xs text-purple-primary/70 font-mono mb-2">Example Message:</p>
                  <p className="text-white text-sm font-bold mb-2">
                    ⏸️ Wait! Before you go...
                  </p>
                  <p className="text-purple-primary/90 text-xs">
                    This product is currently 35% off and selling out FAST. Amazon prices change hourly. 
                    If you leave now, you might miss this deal. Check the current price →
                  </p>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const text = '⏸️ Wait! Before you go...\n\nThis product is currently on sale and selling out FAST. Amazon prices change hourly. If you leave now, you might miss this deal.\n\nCheck the current price →';
                    navigator.clipboard.writeText(text);
                    setCopiedId('booster-exit');
                    setTimeout(() => setCopiedId(null), 2000);
                  }}
                  className="w-full"
                >
                  {copiedId === 'booster-exit' ? '✓ Copied!' : '📋 Copy Exit Message'}
                </Button>
              </div>
            </div>

            {/* Integration Tips */}
            <div className="glass-card p-6 rounded-2xl border border-emerald-primary/20 bg-gradient-to-br from-emerald-primary/5 to-transparent">
              <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <SparklesIcon />
                How to Combine Boosters for Maximum Effect
              </h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-deep-space-black/50 p-4 rounded-lg">
                  <p className="text-emerald-primary font-bold text-sm mb-2">✅ DO THIS:</p>
                  <ul className="text-sm text-purple-primary/80 space-y-2">
                    <li>• Use 2-3 boosters per page max</li>
                    <li>• Place countdown timers near buttons</li>
                    <li>• Add visitor counter at the top</li>
                    <li>• Use trust badges near call-to-action</li>
                    <li>• Test different combinations</li>
                  </ul>
                </div>
                <div className="bg-deep-space-black/50 p-4 rounded-lg">
                  <p className="text-rose-primary font-bold text-sm mb-2">❌ DON&apos;T DO THIS:</p>
                  <ul className="text-sm text-purple-primary/80 space-y-2">
                    <li>• Don&apos;t use all boosters at once</li>
                    <li>• Don&apos;t make fake numbers</li>
                    <li>• Don&apos;t be too aggressive</li>
                    <li>• Don&apos;t overdo urgency</li>
                    <li>• Don&apos;t ignore mobile layout</li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pro Tips Section */}
      <div className="glass-card rounded-2xl p-6 border border-purple-500/20">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <SparklesIcon />
          Pro Tips for Maximum Results
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-navy-800/30 rounded-xl p-4">
            <h4 className="font-bold text-purple-400 mb-2">📅 Content Strategy</h4>
            <p className="text-navy-300 text-sm">
              Post consistently at the same time each day. The algorithm favors regular posting schedules. Use all 30 days, then repeat with slight variations.
            </p>
          </div>
          <div className="bg-navy-800/30 rounded-xl p-4">
            <h4 className="font-bold text-gold-400 mb-2">🔥 High-Ticket Focus</h4>
            <p className="text-navy-300 text-sm">
              Promote 1-2 high-ticket products at a time. Create dedicated content around them. One $200 commission beats 20 small sales.
            </p>
          </div>
          <div className="bg-navy-800/30 rounded-xl p-4">
            <h4 className="font-bold text-cash-green mb-2">💡 Engagement Hack</h4>
            <p className="text-navy-300 text-sm">
              End every post with a question. Reply to EVERY comment within the first hour. This signals engagement to the algorithm.
            </p>
          </div>
          <div className="bg-navy-800/30 rounded-xl p-4">
            <h4 className="font-bold text-orange-400 mb-2">🎯 Platform Strategy</h4>
            <p className="text-navy-300 text-sm">
              Repurpose each post across multiple platforms. What works on Instagram can work on Facebook, Pinterest, and Twitter with minor tweaks.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
