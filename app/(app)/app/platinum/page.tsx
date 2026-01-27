'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  profitPacks, 
  highTicketProducts, 
  comparisonPages,
  bestOfLists,
  seasonalCalendar,
  type ProfitPack, 
  type DayContent,
  type ComparisonPage,
} from '@/lib/platinum-data';
import Button from '@/components/ui/Button';
import Confetti from '@/components/ui/Confetti';
import AffiliateModal from '@/components/ui/AffiliateModal';
import MultiProductModal from '@/components/ui/MultiProductModal';
import SuccessModal from '@/components/ui/SuccessModal';
import MyPagesManager from '@/components/ui/MyPagesManager';

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

const ChevronIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
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

// Training videos with Vimeo embeds
const trainingVideos = [
  {
    title: 'Platinum Mastery: Your First $1,000',
    description: 'Complete walkthrough of the Platinum system - from setup to your first commission.',
    badge: 'START HERE',
    vimeoId: '1158738460',
  },
  {
    title: 'High-Ticket Promotion Secrets',
    description: 'Advanced strategies for promoting high-ticket products and maximizing commissions.',
    badge: 'ADVANCED',
    vimeoId: '1158738584',
  },
  {
    title: '30-Day Content Calendar Strategy',
    description: 'How to use your profit pack content for maximum engagement and consistent sales.',
    badge: 'STRATEGY',
    vimeoId: '1158738723',
  },
  {
    title: 'Scaling Your Platinum Business',
    description: 'Take your affiliate business to the next level with advanced scaling techniques.',
    badge: 'PRO',
    vimeoId: '1158738825',
  },
];

export default function PlatinumPage() {
  const router = useRouter();
  const [selectedPack, setSelectedPack] = useState<ProfitPack | null>(null);
  const [expandedPack, setExpandedPack] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isFirstVisit, setIsFirstVisit] = useState(false);
  const [activeTab, setActiveTab] = useState<'packs' | 'products' | 'comparisons' | 'bestof' | 'calendar' | 'boosters' | 'mypages'>('packs');
  const [visiblePosts, setVisiblePosts] = useState<number>(6);
  const [expandedProduct, setExpandedProduct] = useState<string | null>(null);
  const [copiedCaption, setCopiedCaption] = useState<string | null>(null);
  const [selectedHighTicket, setSelectedHighTicket] = useState<any | null>(null);
  const [showHighTicketModal, setShowHighTicketModal] = useState(false);
  
  // Modal states
  const [showAffiliateModal, setShowAffiliateModal] = useState(false);
  const [showMultiProductModal, setShowMultiProductModal] = useState(false);
  const [selectedComparison, setSelectedComparison] = useState<ComparisonPage | null>(null);
  const [selectedBestOf, setSelectedBestOf] = useState<any | null>(null);
  const [selectedSeasonal, setSelectedSeasonal] = useState<{month: string; productIndex: number; productName: string} | null>(null);
  const [generating, setGenerating] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [createdPageUrl, setCreatedPageUrl] = useState('');
  const [modalType, setModalType] = useState<'comparison' | 'bestof' | 'seasonal'>('comparison');

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCaption(id);
    setTimeout(() => setCopiedCaption(null), 2000);
  };

  useEffect(() => {
    const visited = localStorage.getItem('platinum_visited');
    if (!visited) {
      setIsFirstVisit(true);
      setShowConfetti(true);
      localStorage.setItem('platinum_visited', 'true');
    }
  }, []);


  const copyPostWithHashtags = (post: DayContent, packId: string) => {
    const fullText = `${post.caption}\n\n${post.hashtags}`;
    navigator.clipboard.writeText(fullText);
    setCopiedId(`${packId}-${post.day}`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const loadMorePosts = () => {
    setVisiblePosts(prev => Math.min(prev + 6, 30));
  };

  const handleOpenComparisonModal = (comparison: ComparisonPage) => {
    setSelectedComparison(comparison);
    setModalType('comparison');
    setShowAffiliateModal(true);
  };

  const handleOpenBestOfModal = (list: any) => {
    setSelectedBestOf(list);
    setModalType('bestof');
    setShowMultiProductModal(true);
  };

  const handleOpenSeasonalModal = (month: string, productIndex: number) => {
    const seasonal = seasonalCalendar.find(s => s.month === month);
    if (seasonal) {
      setSelectedSeasonal({ 
        month, 
        productIndex,
        productName: seasonal.topProducts[productIndex]
      });
      setModalType('seasonal');
      setShowMultiProductModal(true);
    }
  };

  const handleOpenHighTicketModal = (product: any) => {
    setSelectedHighTicket(product);
    setShowHighTicketModal(true);
  };

  const handleGenerateHighTicket = async (affiliateLink: string, boosters: string[]) => {
    if (!selectedHighTicket) return;
    
    setGenerating(true);
    try {
      const response = await fetch('/api/generate/highticket', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: selectedHighTicket.id,
          affiliateLink,
          boosters,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to generate page');
      }

      setCreatedPageUrl(result.page.url);
      setShowHighTicketModal(false);
      setShowSuccessModal(true);
      setShowConfetti(true);
    } catch (error) {
      console.error('Generate high-ticket page error:', error);
      alert(error instanceof Error ? error.message : 'Failed to generate page');
    } finally {
      setGenerating(false);
    }
  };

  const handleGenerate = async (data: {
    affiliateLink1?: string;
    affiliateLink2?: string;
    boosters: string[];
    affiliateLinks?: string[]; // For best-of lists
    asin?: string; // For seasonal products
  }) => {
    setGenerating(true);

    try {
      if (modalType === 'comparison' && selectedComparison) {
        const response = await fetch('/api/generate/comparison', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            comparisonId: selectedComparison.id,
            affiliateLink1: data.affiliateLink1,
            affiliateLink2: data.affiliateLink2,
            boosters: data.boosters,
          }),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || 'Failed to generate page');
        }

        setCreatedPageUrl(result.page.url);
        setShowAffiliateModal(false);
        setShowSuccessModal(true);
        setShowConfetti(true);
      } else if (modalType === 'bestof' && selectedBestOf) {
        const response = await fetch('/api/generate/bestof', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            listId: selectedBestOf.id,
            affiliateLinks: data.affiliateLinks,
            boosters: data.boosters,
          }),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || 'Failed to generate page');
        }

        setCreatedPageUrl(result.page.url);
        setShowMultiProductModal(false);
        setShowSuccessModal(true);
        setShowConfetti(true);
      } else if (modalType === 'seasonal' && selectedSeasonal) {
        const response = await fetch('/api/generate/seasonal', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            month: selectedSeasonal.month,
            productIndex: selectedSeasonal.productIndex,
            asin: data.asin,
            affiliateLink: data.affiliateLink1,
            boosters: data.boosters,
          }),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || 'Failed to generate page');
        }

        setCreatedPageUrl(result.page.url);
        setShowMultiProductModal(false);
        setShowSuccessModal(true);
        setShowConfetti(true);
      }
    } catch (error) {
      console.error('Generate page error:', error);
      alert(error instanceof Error ? error.message : 'Failed to generate page');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 pb-20"
    >
      {/* Confetti */}
      <Confetti
        isActive={showConfetti}
        onComplete={() => setShowConfetti(false)}
        colors={['#a855f7', '#9333ea', '#c084fc', '#d8b4fe', '#ffffff']}
      />

      {/* Premium Hero Header */}
      <div className="relative overflow-hidden rounded-3xl">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-primary via-pink-primary to-purple-primary opacity-20 animate-gradient-border" />
        
        <div className="relative glass-hero p-8 lg:p-12">
          {/* Decorative blurs */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-primary/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-primary/10 rounded-full blur-3xl" />
          
          <div className="relative">
            <div className="text-center max-w-4xl mx-auto">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-primary to-pink-primary rounded-full mb-6 shadow-glow-purple"
              >
                <BoltIcon />
                <span className="text-white font-bold text-lg">PLATINUM PACKAGE</span>
                <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-bold text-white">
                  VIP ACCESS
                </span>
              </motion.div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-4 leading-tight">
                Your Complete{' '}
                <span className="bg-gradient-to-r from-purple-primary to-pink-primary bg-clip-text text-transparent">
                  Affiliate Profit System
                </span>
              </h1>
              
              <p className="text-xl text-purple-primary/80 mb-6 max-w-2xl mx-auto">
                150+ ready-to-use assets • Zero writing required • Just copy, paste, and earn
              </p>
              
              {/* User Guide CTA */}
              <motion.a
                href="/PLATINUM_GUIDE.md"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-teal-primary to-emerald-primary text-deep-space-black rounded-xl font-bold text-lg shadow-glow-teal transition-all hover:shadow-glow-teal-lg mb-8"
              >
                <span className="text-2xl">📖</span>
                <div className="text-left">
                  <div className="text-sm opacity-80">NEW USER? START HERE</div>
                  <div>Complete User Guide</div>
                </div>
              </motion.a>

              {/* Feature Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {[
                  { icon: '📦', label: '4 Profit Packs', color: 'from-purple-primary to-purple-primary/50' },
                  { icon: '🔥', label: '8 High-Ticket', color: 'from-pink-primary to-pink-primary/50' },
                  { icon: '⚔️', label: '4 Battles', color: 'from-teal-primary to-teal-primary/50' },
                  { icon: '🏆', label: '2 Best-Of', color: 'from-emerald-primary to-emerald-primary/50' },
                  { icon: '📅', label: '12-Mo Calendar', color: 'from-rose-primary to-rose-primary/50' },
                  { icon: '⚡', label: '6 Boosters', color: 'from-purple-primary to-pink-primary' },
                ].map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className={`glass-card p-4 rounded-xl border border-white/10 bg-gradient-to-br ${stat.color}`}
                  >
                    <div className="text-3xl mb-1">{stat.icon}</div>
                    <div className="text-white font-bold text-sm">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Training Videos */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <span className="text-purple-primary"><BoltIcon /></span>
          Platinum Training Vault
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {trainingVideos.map((video, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card rounded-2xl overflow-hidden hover:shadow-glow-purple transition-all"
            >
              {/* Video Embed */}
              <div className="relative aspect-video bg-navy-800">
                <iframe
                  src={`https://player.vimeo.com/video/${video.vimeoId}?badge=0&autopause=0&player_id=0&app_id=58479`}
                  className="absolute inset-0 w-full h-full"
                  frameBorder="0"
                  allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
                  allowFullScreen
                  title={video.title}
                />
                
                {/* Badge */}
                <div className="absolute top-3 left-3 px-3 py-1 bg-gradient-to-r from-purple-primary to-pink-primary text-white text-xs font-bold rounded-full z-10 pointer-events-none">
                  {video.badge}
                </div>
              </div>
              
              <div className="p-5">
                <h3 className="font-bold text-white text-lg mb-2">
                  {video.title}
                </h3>
                <p className="text-sm text-purple-primary/70">{video.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Feature Navigation - Redesigned */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <SparklesIcon />
          Choose Your Feature
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Feature 1 */}
          <motion.button
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab('packs')}
            className={`group relative overflow-hidden rounded-2xl p-6 text-left transition-all ${
              activeTab === 'packs'
                ? 'bg-gradient-to-br from-purple-primary to-purple-primary/50 shadow-glow-purple ring-2 ring-purple-primary'
                : 'glass-card hover:shadow-glow-purple/50'
            }`}
          >
            <div className="relative z-10">
              <div className="text-4xl mb-3">📦</div>
              <h3 className="text-xl font-bold text-white mb-2">30-Day Profit Packs</h3>
              <p className="text-sm text-purple-primary/80 mb-3">
                120 ready-to-post social media captions with images for 4 niches
              </p>
              <div className="flex items-center gap-2 text-xs">
                <span className="px-2 py-1 bg-white/10 rounded-full text-white font-bold">4 Packs</span>
                <span className="px-2 py-1 bg-white/10 rounded-full text-white font-bold">120 Posts</span>
              </div>
            </div>
            {activeTab === 'packs' && (
              <motion.div
                layoutId="activeIndicator"
                className="absolute inset-0 bg-gradient-to-br from-purple-primary/20 to-transparent"
              />
            )}
          </motion.button>

          {/* Feature 2 */}
          <motion.button
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab('products')}
            className={`group relative overflow-hidden rounded-2xl p-6 text-left transition-all ${
              activeTab === 'products'
                ? 'bg-gradient-to-br from-pink-primary to-pink-primary/50 shadow-glow-pink ring-2 ring-pink-primary'
                : 'glass-card hover:shadow-glow-pink/50'
            }`}
          >
            <div className="relative z-10">
              <div className="text-4xl mb-3">🔥</div>
              <h3 className="text-xl font-bold text-white mb-2">High-Ticket Products</h3>
              <p className="text-sm text-purple-primary/80 mb-3">
                8 pre-built profit pages for $300-$1,500 products with social captions
              </p>
              <div className="flex items-center gap-2 text-xs">
                <span className="px-2 py-1 bg-white/10 rounded-full text-white font-bold">8 Products</span>
                <span className="px-2 py-1 bg-white/10 rounded-full text-white font-bold">$30-75/sale</span>
              </div>
            </div>
            {activeTab === 'products' && (
              <motion.div
                layoutId="activeIndicator"
                className="absolute inset-0 bg-gradient-to-br from-pink-primary/20 to-transparent"
              />
            )}
          </motion.button>

          {/* Feature 3 */}
          <motion.button
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab('comparisons')}
            className={`group relative overflow-hidden rounded-2xl p-6 text-left transition-all ${
              activeTab === 'comparisons'
                ? 'bg-gradient-to-br from-teal-primary to-teal-primary/50 shadow-glow-teal ring-2 ring-teal-primary'
                : 'glass-card hover:shadow-glow-teal/50'
            }`}
          >
            <div className="relative z-10">
              <div className="text-4xl mb-3">⚔️</div>
              <h3 className="text-xl font-bold text-white mb-2">Comparison Battles</h3>
              <p className="text-sm text-purple-primary/80 mb-3">
                4 head-to-head product comparison pages with clear winner recommendations
              </p>
              <div className="flex items-center gap-2 text-xs">
                <span className="px-2 py-1 bg-white/10 rounded-full text-white font-bold">4 Battles</span>
                <span className="px-2 py-1 bg-white/10 rounded-full text-white font-bold">Earn on Both</span>
              </div>
            </div>
            {activeTab === 'comparisons' && (
              <motion.div
                layoutId="activeIndicator"
                className="absolute inset-0 bg-gradient-to-br from-teal-primary/20 to-transparent"
              />
            )}
          </motion.button>

          {/* Feature 4 */}
          <motion.button
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab('bestof')}
            className={`group relative overflow-hidden rounded-2xl p-6 text-left transition-all ${
              activeTab === 'bestof'
                ? 'bg-gradient-to-br from-emerald-primary to-emerald-primary/50 shadow-glow-emerald ring-2 ring-emerald-primary'
                : 'glass-card hover:shadow-glow-emerald/50'
            }`}
          >
            <div className="relative z-10">
              <div className="text-4xl mb-3">🏆</div>
              <h3 className="text-xl font-bold text-white mb-2">Best Of Lists</h3>
              <p className="text-sm text-purple-primary/80 mb-3">
                2 ranked &quot;Top 5&quot; product lists with detailed reviews and reasoning
              </p>
              <div className="flex items-center gap-2 text-xs">
                <span className="px-2 py-1 bg-white/10 rounded-full text-white font-bold">2 Lists</span>
                <span className="px-2 py-1 bg-white/10 rounded-full text-white font-bold">10 Products</span>
              </div>
            </div>
            {activeTab === 'bestof' && (
              <motion.div
                layoutId="activeIndicator"
                className="absolute inset-0 bg-gradient-to-br from-emerald-primary/20 to-transparent"
              />
            )}
          </motion.button>

          {/* Feature 5 */}
          <motion.button
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab('calendar')}
            className={`group relative overflow-hidden rounded-2xl p-6 text-left transition-all ${
              activeTab === 'calendar'
                ? 'bg-gradient-to-br from-rose-primary to-rose-primary/50 shadow-glow-rose ring-2 ring-rose-primary'
                : 'glass-card hover:shadow-glow-rose/50'
            }`}
          >
            <div className="relative z-10">
              <div className="text-4xl mb-3">📅</div>
              <h3 className="text-xl font-bold text-white mb-2">Seasonal Calendar</h3>
              <p className="text-sm text-purple-primary/80 mb-3">
                12-month promotion roadmap - always know what to promote and when
              </p>
              <div className="flex items-center gap-2 text-xs">
                <span className="px-2 py-1 bg-white/10 rounded-full text-white font-bold">12 Months</span>
                <span className="px-2 py-1 bg-white/10 rounded-full text-white font-bold">Peak Seasons</span>
              </div>
            </div>
            {activeTab === 'calendar' && (
              <motion.div
                layoutId="activeIndicator"
                className="absolute inset-0 bg-gradient-to-br from-rose-primary/20 to-transparent"
              />
            )}
          </motion.button>

          {/* Feature 6 */}
          <motion.button
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab('boosters')}
            className={`group relative overflow-hidden rounded-2xl p-6 text-left transition-all ${
              activeTab === 'boosters'
                ? 'bg-gradient-to-br from-purple-primary via-pink-primary to-purple-primary shadow-glow-purple ring-2 ring-purple-primary'
                : 'glass-card hover:shadow-glow-purple/50'
            }`}
          >
            <div className="relative z-10">
              <div className="text-4xl mb-3">⚡</div>
              <h3 className="text-xl font-bold text-white mb-2">Conversion Boosters</h3>
              <p className="text-sm text-purple-primary/80 mb-3">
                6 psychology-driven elements to add to any page for higher conversions
              </p>
              <div className="flex items-center gap-2 text-xs">
                <span className="px-2 py-1 bg-white/10 rounded-full text-white font-bold">6 Boosters</span>
                <span className="px-2 py-1 bg-white/10 rounded-full text-white font-bold">Copy-Paste</span>
              </div>
            </div>
            {activeTab === 'boosters' && (
              <motion.div
                layoutId="activeIndicator"
                className="absolute inset-0 bg-gradient-to-br from-purple-primary/20 via-pink-primary/20 to-transparent"
              />
            )}
          </motion.button>

          {/* Feature 7 - My Pages */}
          <motion.button
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab('mypages')}
            className={`group relative overflow-hidden rounded-2xl p-6 text-left transition-all ${
              activeTab === 'mypages'
                ? 'bg-gradient-to-br from-emerald-500 via-teal-500 to-emerald-600 shadow-glow-purple ring-2 ring-emerald-400'
                : 'glass-card hover:shadow-glow-purple/50'
            }`}
          >
            <div className="relative z-10">
              <div className="text-4xl mb-3">📊</div>
              <h3 className="text-xl font-bold text-white mb-2">My Generated Pages</h3>
              <p className="text-sm text-emerald-primary/80 mb-3">
                View and manage all your profit pages. Edit conversion boosters anytime!
              </p>
              <div className="flex items-center gap-2 text-xs">
                <span className="px-2 py-1 bg-white/10 rounded-full text-white font-bold">Edit Boosters</span>
                <span className="px-2 py-1 bg-white/10 rounded-full text-white font-bold">Manage Pages</span>
              </div>
            </div>
            {activeTab === 'mypages' && (
              <motion.div
                layoutId="activeIndicator"
                className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 via-teal-500/20 to-transparent"
              />
            )}
          </motion.button>
        </div>
      </div>

      {/* Content Area */}
      <AnimatePresence mode="wait">
        {/* 30-Day Profit Packs */}
        {activeTab === 'packs' && (
          <motion.div
            key="packs"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Intro Card */}
            <div className="glass-card p-6 border border-purple-primary/20 rounded-2xl">
              <div className="flex items-start gap-4">
                <div className="text-5xl">📦</div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-white mb-2">30-Day Viral Post Packs</h3>
                  <p className="text-purple-primary/80 leading-relaxed mb-4">
                    Copy-paste ready posts with hashtags for each niche. These are 200-400 word posts designed to provide real value while naturally promoting products. Each post comes with a matching Unsplash image.
                  </p>
                  <div className="bg-purple-primary/10 p-4 rounded-lg border border-purple-primary/20">
                    <p className="text-sm text-purple-primary/90 font-bold mb-2">💡 HOW TO USE:</p>
                    <ol className="text-sm text-purple-primary/70 space-y-1 list-decimal list-inside">
                      <li>Choose a niche pack below that matches your audience</li>
                      <li>Click &quot;View All 30 Days&quot; to see every post</li>
                      <li>Click &quot;Copy Post&quot; on any post you like</li>
                      <li>Paste to Facebook, Instagram, or TikTok</li>
                      <li>Add your affiliate link in comments or bio</li>
                      <li>Post 1 per day for consistent results</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>

            {/* Profit Pack Cards - Clean Grid Layout */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {profitPacks.map((pack, idx) => (
                <motion.div
                  key={pack.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  onClick={() => {
                    setSelectedPack(pack);
                    setExpandedPack(pack.id);
                    setVisiblePosts(6);
                  }}
                  className="glass-card rounded-xl p-5 border border-purple-primary/20 hover:border-purple-primary/50 hover:shadow-glow-purple transition-all cursor-pointer group"
                >
                  {/* Emoji Icon */}
                  <div className="text-5xl mb-3 group-hover:scale-110 transition-transform">
                    {pack.emoji}
                  </div>
                  
                  {/* Pack Name */}
                  <h3 className="text-lg font-bold text-white mb-1">{pack.name}</h3>
                  <p className="text-xs text-purple-primary/60 mb-3">{pack.niche}</p>
                  
                  {/* Stats Row */}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-purple-primary font-bold">{pack.value}</span>
                    <span className="text-emerald-primary font-bold text-xs">{pack.commission}</span>
                  </div>
                  
                  {/* View indicator */}
                  <div className="mt-3 text-center text-xs text-purple-primary/60 group-hover:text-purple-primary transition-colors">
                    Click to view 30 days →
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Expanded Pack View - WITH IMAGES AND EXPAND */}
            {selectedPack && expandedPack && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-navy-900 rounded-2xl border border-white/10 overflow-hidden"
              >
                {/* Header */}
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="text-5xl">{selectedPack.emoji}</span>
                      <div>
                        <h3 className="text-2xl font-bold text-white">{selectedPack.name}</h3>
                        <p className="text-white/80">30 Days of Content • Copy & Paste Ready</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedPack(null);
                        setExpandedPack(null);
                      }}
                      className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white font-bold rounded-lg transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>

                {/* Content Grid */}
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedPack.posts.slice(0, visiblePosts).map((post) => {
                      const isExpanded = expandedProduct === `post-${post.day}`;
                      return (
                        <div
                          key={post.day}
                          className="bg-white/5 border border-white/10 rounded-xl overflow-hidden transition-all"
                        >
                          {/* Image */}
                          {post.imageUrl && (
                            <div className="relative h-48 bg-gray-800">
                              <img
                                src={post.imageUrl}
                                alt={post.imageDescription || `Day ${post.day}`}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  // Hide broken images
                                  (e.target as HTMLImageElement).style.display = 'none';
                                }}
                              />
                              {/* Day Badge Overlay */}
                              <div className="absolute top-3 left-3 px-3 py-1.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg">
                                <span className="text-white font-bold">Day {post.day}</span>
                              </div>
                            </div>
                          )}
                          
                          {/* No image fallback */}
                          {!post.imageUrl && (
                            <div className="h-20 bg-gradient-to-r from-purple-600/20 to-pink-600/20 flex items-center justify-center">
                              <span className="text-3xl font-bold text-white">Day {post.day}</span>
                            </div>
                          )}

                          {/* Content */}
                          <div className="p-4">
                            {/* Caption - Expandable */}
                            <div className={`text-white text-base leading-relaxed mb-3 ${!isExpanded ? 'line-clamp-3' : ''}`}>
                              {post.caption}
                            </div>
                            
                            {/* Hashtags */}
                            <div className={`text-purple-400 text-sm mb-4 ${!isExpanded ? 'line-clamp-1' : ''}`}>
                              {post.hashtags}
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2">
                              {/* Expand/Collapse Button */}
                              <button
                                onClick={() => setExpandedProduct(isExpanded ? null : `post-${post.day}`)}
                                className="flex-1 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg transition-colors text-sm"
                              >
                                {isExpanded ? '📖 Show Less' : '📖 Read Full Post'}
                              </button>
                              
                              {/* Copy Button */}
                              <button
                                onClick={() => copyPostWithHashtags(post, selectedPack.id)}
                                className={`flex-1 px-4 py-2.5 rounded-lg font-bold text-sm transition-all ${
                                  copiedId === `${selectedPack.id}-${post.day}`
                                    ? 'bg-green-500 text-white'
                                    : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:scale-[1.02]'
                                }`}
                              >
                                {copiedId === `${selectedPack.id}-${post.day}` ? '✓ Copied!' : '📋 Copy'}
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Load More */}
                  {visiblePosts < selectedPack.posts.length && (
                    <div className="mt-6 text-center">
                      <button
                        onClick={loadMorePosts}
                        className="px-8 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold rounded-xl transition-all"
                      >
                        Load More Days ({selectedPack.posts.length - visiblePosts} remaining)
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
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
            {/* Intro Card */}
            <div className="glass-card p-6 border border-pink-primary/20 rounded-2xl">
              <div className="flex items-start gap-4">
                <div className="text-5xl">🔥</div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-white mb-2">High-Ticket Product Pages</h3>
                  <p className="text-purple-primary/80 leading-relaxed mb-4">
                    8 pre-researched Amazon products priced $300-$2,500+. Higher prices = higher commissions ($30-$125 per sale)! Click &quot;Generate Profit Page&quot; to create your own shareable page.
                  </p>
                  <div className="bg-pink-primary/10 p-4 rounded-lg border border-pink-primary/20">
                    <p className="text-sm text-pink-primary/90 font-bold mb-2">💡 HOW TO USE:</p>
                    <ol className="text-sm text-purple-primary/70 space-y-1 list-decimal list-inside">
                      <li>Click &quot;Generate Profit Page&quot; on any product</li>
                      <li>Add your Amazon affiliate link in the popup</li>
                      <li>Select conversion boosters (optional)</li>
                      <li>Click generate and get your shareable page!</li>
                      <li>Share on social media to earn commissions</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Grid - Improved Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {highTicketProducts.map((product) => {
                const amazonUrl = `https://www.amazon.com/dp/${product.asin}`;
                
                return (
                  <div
                    key={product.id}
                    className="glass-card rounded-2xl overflow-hidden border border-white/10 hover:border-pink-primary/50 transition-all hover:shadow-glow-pink group"
                  >
                    {/* Product Image - Clean Dark Background */}
                    <div className="relative h-52 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center overflow-hidden">
                      {product.isHot && (
                        <div className="absolute top-3 left-3 px-3 py-1.5 bg-gradient-to-r from-red-500 to-orange-500 rounded-full text-white text-xs font-bold shadow-lg flex items-center gap-1.5 z-10">
                          🔥 HOT SELLER
                        </div>
                      )}
                      <img
                        src={product.imageUrl}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.objectFit = 'contain';
                          (e.target as HTMLImageElement).style.padding = '1rem';
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Product+Image';
                        }}
                      />
                      {/* Subtle gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-navy-900/60 via-transparent to-transparent pointer-events-none" />
                    </div>

                    {/* Product Info */}
                    <div className="p-6">
                      {/* Category & Rating */}
                      <div className="flex items-center justify-between mb-3">
                        <span className="px-3 py-1 bg-pink-primary/20 text-pink-primary rounded-full text-xs font-bold border border-pink-primary/30">
                          {product.category}
                        </span>
                        <div className="flex items-center gap-1.5 text-emerald-primary">
                          <StarIcon />
                          <span className="font-bold">{product.rating}</span>
                          <span className="text-purple-primary/60 text-sm">({(product.reviews || 0).toLocaleString()})</span>
                        </div>
                      </div>
                      
                      {/* Title */}
                      <h3 className="font-bold text-white text-xl mb-4 line-clamp-2">
                        {product.title}
                      </h3>

                      {/* Price & Commission Box */}
                      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-primary/10 to-teal-primary/5 rounded-xl border border-emerald-primary/30 mb-5">
                        <div>
                          <p className="text-xs text-purple-primary/60 mb-1">Price</p>
                          <p className="text-2xl font-bold text-white">{product.price}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-emerald-primary mb-1">Your Commission</p>
                          <p className="text-2xl font-bold text-emerald-primary">{product.commission}</p>
                        </div>
                      </div>

                      {/* CTA Button - GENERATE PAGE */}
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedHighTicket(product);
                          setShowHighTicketModal(true);
                        }}
                        className="w-full mb-3 py-4 px-6 bg-gradient-to-r from-pink-primary to-purple-primary text-white font-bold text-lg rounded-xl shadow-lg shadow-pink-primary/30 hover:shadow-pink-primary/50 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 cursor-pointer"
                      >
                        <span className="text-2xl">🚀</span>
                        Generate Profit Page
                      </button>

                      {/* Secondary Link - View on Amazon */}
                      <a
                        href={amazonUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full py-3 px-6 bg-purple-primary/10 border-2 border-purple-primary/40 text-purple-primary font-bold rounded-xl hover:bg-purple-primary/20 hover:border-purple-primary transition-all text-center cursor-pointer"
                      >
                        <span className="inline-flex items-center justify-center gap-2">
                          <ExternalLinkIcon />
                          View on Amazon
                        </span>
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Commission Calculator */}
            <div className="glass-card rounded-2xl p-6 border border-emerald-primary/20 bg-gradient-to-br from-emerald-primary/5 to-transparent">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <TrendUpIcon />
                Potential Earnings Calculator
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-deep-space-black/50 rounded-xl p-5 text-center border border-purple-primary/20">
                  <p className="text-purple-primary/60 text-sm mb-1">1 Sale/Week</p>
                  <p className="text-4xl font-bold text-white mb-1">$360-1,000</p>
                  <p className="text-emerald-primary text-sm font-bold">/month</p>
                </div>
                <div className="bg-deep-space-black/50 rounded-xl p-5 text-center border-2 border-emerald-primary/40">
                  <p className="text-purple-primary/60 text-sm mb-1">3 Sales/Week</p>
                  <p className="text-4xl font-bold text-emerald-primary mb-1">$1,080-3,000</p>
                  <p className="text-emerald-primary text-sm font-bold">/month</p>
                </div>
                <div className="bg-deep-space-black/50 rounded-xl p-5 text-center border border-purple-primary/20">
                  <p className="text-purple-primary/60 text-sm mb-1">1 Sale/Day</p>
                  <p className="text-4xl font-bold text-white mb-1">$1,350-7,500</p>
                  <p className="text-emerald-primary text-sm font-bold">/month</p>
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
            <div className="glass-card p-6 border border-teal-primary/20 rounded-2xl">
              <div className="flex items-start gap-4">
                <div className="text-5xl">⚔️</div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-white mb-2">Product Comparison Profit Pages</h3>
                  <p className="text-purple-primary/80 leading-relaxed mb-4">
                    Generate complete comparison pages that help your audience make buying decisions. Each comparison is a full 1500-2000 word article comparing two products head-to-head. You earn commissions on BOTH products!
                  </p>
                  <div className="bg-teal-primary/10 p-4 rounded-lg border border-teal-primary/20">
                    <p className="text-sm text-teal-primary/90 font-bold mb-2">💡 HOW TO USE:</p>
                    <ol className="text-sm text-purple-primary/70 space-y-1 list-decimal list-inside">
                      <li>Choose a comparison below</li>
                      <li>Click &quot;Generate Page&quot;</li>
                      <li>Add your affiliate links for BOTH products</li>
                      <li>Select conversion boosters (optional)</li>
                      <li>Click generate and share your page!</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>

            {/* Comparison Pages */}
            {comparisonPages.map((comparison, idx) => (
              <motion.div
                key={comparison.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="glass-card p-6 rounded-2xl border border-teal-primary/20 hover:shadow-glow-teal transition-all"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <h4 className="text-2xl font-bold text-white mb-2">{comparison.title}</h4>
                    <p className="text-purple-primary/60 text-sm">{comparison.category} • Full comparison article</p>
                  </div>
                  <div className="px-4 py-2 bg-teal-primary/10 rounded-lg border border-teal-primary/30">
                    <p className="text-xs text-teal-primary/70 font-bold">Word Count</p>
                    <p className="text-lg font-bold text-teal-primary">1,800+</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  {/* Product 1 - Clean Image Layout */}
                  <div className={`relative overflow-hidden rounded-xl border-2 ${
                    comparison.winner === 1
                      ? 'border-emerald-primary/60'
                      : 'border-purple-primary/20'
                  } group`}>
                    {comparison.winner === 1 && (
                      <div className="absolute top-3 right-3 px-3 py-1 bg-emerald-primary rounded-full text-xs font-bold text-deep-space-black z-10">
                        👑 WINNER
                      </div>
                    )}
                    {/* Dark gradient background for product image */}
                    <div className="relative h-44 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center overflow-hidden">
                      <img 
                        src={comparison.product1.image} 
                        alt={comparison.product1.name} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.objectFit = 'contain';
                          (e.target as HTMLImageElement).style.padding = '1rem';
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x200?text=Product';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-navy-900/60 via-transparent to-transparent pointer-events-none" />
                    </div>
                    {/* Info section */}
                    <div className={`p-4 ${comparison.winner === 1 ? 'bg-emerald-primary/10' : 'bg-purple-primary/5'}`}>
                      <h5 className="font-bold text-white text-center text-sm mb-2">{comparison.product1.name}</h5>
                      <div className="flex items-center justify-center gap-3">
                        <span className="text-lg font-bold text-purple-primary">{comparison.product1.price}</span>
                        <div className="flex items-center gap-1 text-emerald-primary text-sm">
                          <StarIcon />
                          <span>{comparison.product1.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Product 2 - Clean Image Layout */}
                  <div className={`relative overflow-hidden rounded-xl border-2 ${
                    comparison.winner === 2
                      ? 'border-emerald-primary/60'
                      : 'border-purple-primary/20'
                  } group`}>
                    {comparison.winner === 2 && (
                      <div className="absolute top-3 right-3 px-3 py-1 bg-emerald-primary rounded-full text-xs font-bold text-deep-space-black z-10">
                        👑 WINNER
                      </div>
                    )}
                    {/* Dark gradient background for product image */}
                    <div className="relative h-44 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center overflow-hidden">
                      <img 
                        src={comparison.product2.image} 
                        alt={comparison.product2.name} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.objectFit = 'contain';
                          (e.target as HTMLImageElement).style.padding = '1rem';
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x200?text=Product';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-navy-900/60 via-transparent to-transparent pointer-events-none" />
                    </div>
                    {/* Info section */}
                    <div className={`p-4 ${comparison.winner === 2 ? 'bg-emerald-primary/10' : 'bg-purple-primary/5'}`}>
                      <h5 className="font-bold text-white text-center text-sm mb-2">{comparison.product2.name}</h5>
                      <div className="flex items-center justify-center gap-3">
                        <span className="text-lg font-bold text-purple-primary">{comparison.product2.price}</span>
                        <div className="flex items-center gap-1 text-emerald-primary text-sm">
                          <StarIcon />
                          <span>{comparison.product2.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* What's Included */}
                <div className="bg-purple-primary/10 p-4 rounded-lg border border-purple-primary/20 mb-6">
                  <p className="text-sm font-bold text-purple-primary mb-3">📄 What&apos;s Included in This Comparison:</p>
                  <div className="grid md:grid-cols-2 gap-2 text-sm text-purple-primary/70">
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-primary">✓</span>
                      <span>Detailed comparison table</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-primary">✓</span>
                      <span>6 in-depth sections</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-primary">✓</span>
                      <span>Pros & cons for each</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-primary">✓</span>
                      <span>FAQ section</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-primary">✓</span>
                      <span>Final verdict & recommendations</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-primary">✓</span>
                      <span>Social media captions</span>
                    </div>
                  </div>
                </div>

                <Button
                  variant="primary"
                  onClick={() => handleOpenComparisonModal(comparison)}
                  className="w-full"
                >
                  <span className="text-xl">🚀</span>
                  Generate Comparison Page
                </Button>
              </motion.div>
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
            <div className="glass-card p-6 border border-emerald-primary/20 rounded-2xl">
              <div className="flex items-start gap-4">
                <div className="text-5xl">🏆</div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-white mb-2">Best Of Lists - Ranked Product Pages</h3>
                  <p className="text-purple-primary/80 leading-relaxed mb-4">
                    Generate complete &quot;Top 5&quot; style ranked product pages. These lists get MASSIVE engagement because they provide quick value and help people find the &quot;best&quot; option fast. Each product is ranked with clear reasoning and you earn commissions on ALL products!
                  </p>
                  <div className="bg-emerald-primary/10 p-4 rounded-lg border border-emerald-primary/20">
                    <p className="text-sm text-emerald-primary/90 font-bold mb-2">💡 HOW TO USE:</p>
                    <ol className="text-sm text-purple-primary/70 space-y-1 list-decimal list-inside">
                      <li>Choose a list below (Air Fryers or Fitness Trackers)</li>
                      <li>Click &quot;Generate Best-Of Page&quot;</li>
                      <li>Add your affiliate links for ALL 5 products</li>
                      <li>Select conversion boosters (optional)</li>
                      <li>Share with: &quot;I tested 15 products - here are the top 5 →&quot;</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>

            {/* Best Of Lists */}
            {bestOfLists.map((list) => (
              <div key={list.id} className="glass-card p-6 rounded-2xl border border-emerald-primary/20">
                <h4 className="text-2xl font-bold text-white mb-2">{list.title}</h4>
                <p className="text-purple-primary/60 text-sm mb-6">{list.subtitle}</p>

                <div className="bg-purple-primary/10 p-5 rounded-xl border border-purple-primary/20 mb-6">
                  <p className="text-white leading-relaxed">{list.intro}</p>
                </div>

                {/* Products */}
                <div className="space-y-4 mb-6">
                  {list.products.map((product) => (
                    <div key={product.rank} className="bg-gradient-to-r from-purple-primary/5 to-transparent border border-purple-primary/20 rounded-xl overflow-hidden group">
                      <div className="flex items-stretch">
                        {/* Product Image - Left Side */}
                        <div className="relative w-36 h-auto shrink-0 bg-gradient-to-br from-slate-800 to-slate-900 overflow-hidden">
                          <img 
                            src={product.image} 
                            alt={product.title} 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.objectFit = 'contain';
                              (e.target as HTMLImageElement).style.padding = '0.5rem';
                              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150x150?text=Product';
                            }}
                          />
                          {/* Rank Badge Overlay */}
                          <div className={`absolute top-2 left-2 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-lg ${
                            product.rank === 1 ? 'bg-gradient-to-br from-emerald-primary to-teal-primary text-deep-space-black' :
                            product.rank === 2 ? 'bg-gradient-to-br from-purple-primary to-pink-primary text-white' :
                            'bg-purple-primary/80 text-white'
                          }`}>
                            #{product.rank}
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-navy-900/30 pointer-events-none" />
                        </div>

                        {/* Content - Right Side */}
                        <div className="flex-1 p-5">
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
                      </div>
                    </div>
                  ))}
                </div>

                <Button
                  variant="primary"
                  onClick={() => handleOpenBestOfModal(list)}
                  className="w-full"
                >
                  <span className="text-xl">🚀</span>
                  Generate Best-Of Page
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
            <div className="glass-card p-6 border border-rose-primary/20 rounded-2xl">
              <div className="flex items-start gap-4">
                <div className="text-5xl">📅</div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-white mb-2">12-Month Seasonal Promotion Calendar</h3>
                  <p className="text-purple-primary/80 leading-relaxed mb-4">
                    Generate profit pages for seasonal products that sell best each month. Each month has specific products that perform better due to seasons, holidays, and shopping patterns. Create timely pages and you&apos;ll always know exactly what to promote!
                  </p>
                  <div className="bg-rose-primary/10 p-4 rounded-lg border border-rose-primary/20">
                    <p className="text-sm text-rose-primary/90 font-bold mb-2">💡 HOW TO USE:</p>
                    <ol className="text-sm text-purple-primary/70 space-y-1 list-decimal list-inside">
                      <li>Check what month it is and see that month&apos;s top products</li>
                      <li>Click &quot;Generate Page&quot; on any product</li>
                      <li>Add the product ASIN and your affiliate link</li>
                      <li>Select conversion boosters (optional)</li>
                      <li>Share with seasonal angle: &quot;Perfect for [season]!&quot;</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {seasonalCalendar.map((month) => (
                <div key={month.month} className="glass-card p-6 rounded-2xl border border-rose-primary/20 hover:shadow-glow-rose transition-all">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-4xl">{month.emoji}</span>
                    <div>
                      <h4 className="text-xl font-bold text-white">{month.month}</h4>
                      <p className="text-sm text-purple-primary/60">{month.season}</p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-rose-primary/10 to-pink-primary/5 p-4 rounded-lg border border-rose-primary/20 mb-4">
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
                      <div className="space-y-2">
                        {month.topProducts.map((product, idx) => (
                          <div key={idx} className="flex items-center justify-between bg-purple-primary/5 p-3 rounded-lg border border-purple-primary/10">
                            <span className="text-sm text-white">{product}</span>
                            <button
                              onClick={() => handleOpenSeasonalModal(month.month, idx)}
                              className="px-3 py-1 bg-gradient-to-r from-rose-primary to-pink-primary text-white text-xs font-bold rounded-lg hover:scale-105 transition-transform"
                            >
                              Generate Page
                            </button>
                          </div>
                        ))}
                      </div>
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
            <div className="glass-card p-6 border border-purple-primary/20 rounded-2xl bg-gradient-to-br from-purple-primary/5 via-pink-primary/5 to-transparent">
              <div className="flex items-start gap-4">
                <div className="text-5xl">⚡</div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-white mb-2">Conversion Boosters - Add These To Your Pages!</h3>
                  <p className="text-purple-primary/80 leading-relaxed mb-4">
                    These are powerful psychological triggers you can add to ANY of your profit pages to increase conversions. These create urgency, build trust, and encourage visitors to click your affiliate links. Copy and paste these into your pages for instant results.
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
              <div className="glass-card p-6 rounded-2xl border border-rose-primary/20 hover:shadow-glow-rose transition-all">
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
                  Add a countdown timer to create urgency. People are more likely to buy when they feel time is running out. Place this near your call-to-action buttons.
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
              <div className="glass-card p-6 rounded-2xl border border-emerald-primary/20 hover:shadow-glow-emerald transition-all">
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
                  Show how many people are viewing the page right now. This creates social proof and FOMO (fear of missing out). Place at the top of your pages.
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
              <div className="glass-card p-6 rounded-2xl border border-purple-primary/20 hover:shadow-glow-purple transition-all">
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
                  Show recent purchases to build trust. When people see others buying, they&apos;re more likely to buy too. Add these throughout your page.
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
              <div className="glass-card p-6 rounded-2xl border border-pink-primary/20 hover:shadow-glow-pink transition-all">
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
                  Eye-catching banners that communicate scarcity and urgency. Place these at the very top of pages or near buy buttons for maximum impact.
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
              <div className="glass-card p-6 rounded-2xl border border-teal-primary/20 hover:shadow-glow-teal transition-all">
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
                  Add these trust indicators to reduce buyer hesitation. People want reassurance before clicking affiliate links. Place near buttons or at page bottom.
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
              <div className="glass-card p-6 rounded-2xl border border-purple-primary/20 hover:shadow-glow-purple transition-all">
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
                  A message to show when someone is about to leave your page without clicking. This gives you one last chance to convert them. Use this sparingly but effectively.
                </p>

                <div className="bg-purple-primary/10 p-4 rounded-lg border border-purple-primary/20 mb-4">
                  <p className="text-xs text-purple-primary/70 font-mono mb-2">Example Message:</p>
                  <p className="text-white text-sm font-bold mb-2">
                    ⏸️ Wait! Before you go...
                  </p>
                  <p className="text-purple-primary/90 text-xs">
                    This product is currently 35% off and selling out FAST. Amazon prices change hourly. If you leave now, you might miss this deal. Check the current price →
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
              <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <SparklesIcon />
                How to Combine Boosters for Maximum Effect
              </h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-deep-space-black/50 p-5 rounded-lg border border-emerald-primary/20">
                  <p className="text-emerald-primary font-bold text-sm mb-3">✅ DO THIS:</p>
                  <ul className="text-sm text-purple-primary/80 space-y-2">
                    <li>• Use 2-3 boosters per page max</li>
                    <li>• Place countdown timers near buttons</li>
                    <li>• Add visitor counter at the top</li>
                    <li>• Use trust badges near call-to-action</li>
                    <li>• Test different combinations</li>
                  </ul>
                </div>
                <div className="bg-deep-space-black/50 p-5 rounded-lg border border-rose-primary/20">
                  <p className="text-rose-primary font-bold text-sm mb-3">❌ DON&apos;T DO THIS:</p>
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

        {/* My Generated Pages */}
        {activeTab === 'mypages' && (
          <motion.div
            key="mypages"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Intro Card */}
            <div className="glass-card p-6 border border-emerald-500/20 rounded-2xl bg-gradient-to-br from-emerald-500/5 via-teal-500/5 to-transparent">
              <div className="flex items-start gap-4">
                <div className="text-5xl">📊</div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-white mb-2">Your Generated Profit Pages</h3>
                  <p className="text-emerald-400/80 leading-relaxed mb-4">
                    Here are all the profit pages you&apos;ve created. You can view each page, copy the URL to share, and most importantly - <strong>edit the conversion boosters</strong> on any existing page without having to recreate it!
                  </p>
                  <div className="bg-emerald-500/10 p-4 rounded-lg border border-emerald-500/20">
                    <p className="text-sm text-emerald-400/90 font-bold mb-2">💡 QUICK TIP:</p>
                    <ul className="text-sm text-emerald-400/70 space-y-1 list-disc list-inside">
                      <li>Click on any page to expand and see booster options</li>
                      <li>Click &quot;Enable All&quot; to turn on all conversion boosters at once</li>
                      <li>Changes are saved instantly - just refresh your page to see them!</li>
                      <li>Copy the page URL to share with your audience</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* My Pages Manager Component */}
            <MyPagesManager />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modals */}
      <AffiliateModal
        isOpen={showAffiliateModal}
        onClose={() => {
          setShowAffiliateModal(false);
          setSelectedComparison(null);
        }}
        onGenerate={handleGenerate}
        title={selectedComparison?.title || ''}
        productName1={selectedComparison?.product1.name || ''}
        productName2={selectedComparison?.product2.name}
        type="comparison"
        loading={generating}
      />

      <MultiProductModal
        isOpen={showMultiProductModal}
        onClose={() => {
          setShowMultiProductModal(false);
          setSelectedBestOf(null);
          setSelectedSeasonal(null);
        }}
        onGenerate={handleGenerate}
        title={modalType === 'bestof' ? selectedBestOf?.title || '' : selectedSeasonal?.productName || ''}
        type={modalType as 'bestof' | 'seasonal'}
        productNames={modalType === 'bestof' ? selectedBestOf?.products.map((p: any) => p.title) || [] : []}
        productName={modalType === 'seasonal' ? selectedSeasonal?.productName || '' : ''}
        loading={generating}
      />

      {/* High-Ticket Product Modal - WHITE BACKGROUND for readability */}
      <AnimatePresence>
        {showHighTicketModal && selectedHighTicket && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !generating && setShowHighTicketModal(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999]"
            />
            <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 overflow-y-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-3xl w-full max-w-2xl my-8 shadow-2xl border-4 border-purple-600"
              >
                {/* Header - Purple gradient */}
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 rounded-t-2xl">
                  <div className="flex items-start gap-4">
                    <img
                      src={selectedHighTicket.imageUrl}
                      alt={selectedHighTicket.title}
                      className="w-24 h-24 object-contain bg-white rounded-xl p-2"
                    />
                    <div className="flex-1 min-w-0">
                      <h2 className="text-3xl font-bold text-white mb-2">
                        🚀 Generate Profit Page
                      </h2>
                      <p className="text-white/90 text-lg line-clamp-2">
                        {selectedHighTicket.title}
                      </p>
                      <div className="flex items-center gap-4 mt-3">
                        <span className="text-white text-xl font-bold">{selectedHighTicket.price}</span>
                        <span className="bg-green-500 text-white px-3 py-1 rounded-full font-bold">+{selectedHighTicket.commission}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => !generating && setShowHighTicketModal(false)}
                      disabled={generating}
                      className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white disabled:opacity-50"
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Form - White background */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    const affiliateLink = formData.get('affiliateLink') as string;
                    const boosters = Array.from(formData.getAll('boosters')) as string[];
                    if (affiliateLink) {
                      handleGenerateHighTicket(affiliateLink, boosters);
                    }
                  }}
                  className="p-8 space-y-6"
                >
                  {/* Affiliate Link Input */}
                  <div>
                    <label className="block text-xl font-bold text-gray-900 mb-3">
                      🔗 Your Amazon Affiliate Link
                    </label>
                    <input
                      name="affiliateLink"
                      type="url"
                      required
                      placeholder={`https://www.amazon.com/dp/${selectedHighTicket.asin}?tag=YOUR-TAG`}
                      className="w-full px-5 py-4 text-lg border-3 border-gray-300 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-200 outline-none bg-gray-50 text-gray-900 placeholder-gray-400"
                      disabled={generating}
                    />
                    <p className="text-base text-gray-600 mt-2">
                      Replace YOUR-TAG with your Amazon Associates tag
                    </p>
                  </div>

                  {/* Conversion Boosters */}
                  <div>
                    <label className="block text-xl font-bold text-gray-900 mb-4">
                      ⚡ Conversion Boosters (Optional)
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { id: 'countdown', label: '⏰ Countdown Timer' },
                        { id: 'visitors', label: '👥 Live Visitors' },
                        { id: 'recent-sales', label: '💰 Recent Sales' },
                        { id: 'urgency-banner', label: '🔥 Urgency Banner' },
                        { id: 'trust-badges', label: '✅ Trust Badges' },
                        { id: 'exit-popup', label: '🚪 Exit Intent' },
                      ].map((booster) => (
                        <label
                          key={booster.id}
                          className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border-2 border-gray-200 cursor-pointer hover:bg-purple-50 hover:border-purple-300 transition-colors"
                        >
                          <input
                            type="checkbox"
                            name="boosters"
                            value={booster.id}
                            disabled={generating}
                            className="w-6 h-6 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                          />
                          <span className="text-lg font-medium text-gray-800">{booster.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="pt-4 flex gap-4">
                    <button
                      type="button"
                      onClick={() => !generating && setShowHighTicketModal(false)}
                      disabled={generating}
                      className="flex-1 py-4 px-6 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold text-xl rounded-xl transition-all disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={generating}
                      className="flex-1 py-4 px-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold text-xl rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                    >
                      {generating ? (
                        <>
                          <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Generating...
                        </>
                      ) : (
                        <>🚀 Generate Page</>
                      )}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Comparison Page Generated!"
        message="Your comparison page is ready and published. Share it to start earning commissions on BOTH products!"
        primaryAction={{
          label: 'View Page',
          onClick: () => router.push(createdPageUrl),
        }}
      />
    </motion.div>
  );
}
