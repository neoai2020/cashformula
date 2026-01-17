'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import Button from '@/components/ui/Button';
import Confetti from '@/components/ui/Confetti';
import DeployModal from '@/components/ui/DeployModal';

// Icons
const CrownIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M2 20h20M4 20l2-14 4 6 2-8 2 8 4-6 2 14" />
  </svg>
);

const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8" />
    <path d="M21 21l-4.35-4.35" />
  </svg>
);

const StarIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
  </svg>
);

const FireIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 23c-4.97 0-9-3.58-9-8 0-2.52 1.17-5.06 3.05-7.29.37-.44.75-.86 1.14-1.25l.73-.71.5.89c.63 1.11 1.4 2.07 2.27 2.86.31.28.62.53.94.76l.77.57-.45.84c-.3.55-.44 1.13-.44 1.73 0 1.1.45 2.1 1.17 2.83.72.73 1.72 1.18 2.82 1.18s2.1-.45 2.82-1.18c.72-.73 1.17-1.73 1.17-2.83 0-.6-.14-1.18-.44-1.73l-.45-.84.77-.57c.32-.23.63-.48.94-.76.87-.79 1.64-1.75 2.27-2.86l.5-.89.73.71c.39.39.77.81 1.14 1.25C19.83 9.94 21 12.48 21 15c0 4.42-4.03 8-9 8z" />
  </svg>
);

const RocketIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
    <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
  </svg>
);

const EyeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const CopyIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="9" y="9" width="13" height="13" rx="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <polyline points="20,6 9,17 4,12" />
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

const PlayIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="5,3 19,12 5,21" />
  </svg>
);

const ClockIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12,6 12,12 16,14" />
  </svg>
);

// Training videos data
const trainingVideos = [
  {
    id: 1,
    title: 'How to Pick Winning Gold Pages',
    description: 'Learn how to identify the highest-converting pages in your Gold Package',
    duration: '8:24',
    thumbnail: null, // placeholder
    badge: 'ESSENTIAL',
    badgeColor: 'bg-gold-500',
  },
  {
    id: 2,
    title: 'Deploy & Customize Your Page',
    description: 'Step-by-step guide to deploying and personalizing your profit pages',
    duration: '12:15',
    thumbnail: null,
    badge: 'STEP-BY-STEP',
    badgeColor: 'bg-purple-500',
  },
  {
    id: 3,
    title: 'Maximize Your Commissions',
    description: 'Advanced strategies to drive traffic and increase your earnings',
    duration: '15:42',
    thumbnail: null,
    badge: 'ADVANCED',
    badgeColor: 'bg-cash-green',
  },
];

interface DfyProduct {
  id: string;
  niche: string;
  category: string;
  asin: string;
  keyword: string;
  public_slug: string;
  product_data: {
    title: string;
    price: string;
    rating: number;
    reviews_count: number;
  };
  generated_content: Record<string, unknown>;
  hero_image: string | null;
  price: string;
  rating: number;
  reviews_count: number;
  commission_estimate: string;
  competition_level: string;
  is_trending: boolean;
  is_new: boolean;
  social_captions: string[];
}

const CATEGORIES = [
  'All',
  'Health & Fitness',
  'Home & Kitchen',
  'Baby & Kids',
  'Beauty & Skincare',
  'Tech & Electronics',
  'Pet Supplies',
  'Outdoor & Garden',
  'Office & Productivity',
];

const CATEGORY_EMOJIS: Record<string, string> = {
  'All': '🌟',
  'Health & Fitness': '💪',
  'Home & Kitchen': '🏠',
  'Baby & Kids': '👶',
  'Beauty & Skincare': '💄',
  'Tech & Electronics': '📱',
  'Pet Supplies': '🐕',
  'Outdoor & Garden': '🌳',
  'Office & Productivity': '💼',
  'Gaming': '🎮',
  'Fashion & Accessories': '👜',
};

export default function GoldPage() {
  const [products, setProducts] = useState<DfyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'commission' | 'rating'>('newest');
  const [showConfetti, setShowConfetti] = useState(false);
  const [isFirstVisit, setIsFirstVisit] = useState(false);
  const [deployModalOpen, setDeployModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<DfyProduct | null>(null);
  const [copiedCaption, setCopiedCaption] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from('dfy_pages')
        .select('*')
        .order('created_at', { ascending: false });

      if (data && !error) {
        setProducts(data as DfyProduct[]);
      }
      setLoading(false);
    };

    fetchProducts();

    // Check if first visit for confetti
    const visited = localStorage.getItem('gold_visited');
    if (!visited) {
      setIsFirstVisit(true);
      setShowConfetti(true);
      localStorage.setItem('gold_visited', 'true');
    }
  }, [supabase]);

  // Filter and sort products
  const filteredProducts = products
    .filter(p => {
      const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
      const matchesSearch = !searchQuery || 
        p.product_data.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.keyword?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'commission') {
        const aComm = parseFloat(a.commission_estimate?.split('-')[1]?.replace(/[^0-9]/g, '') || '0');
        const bComm = parseFloat(b.commission_estimate?.split('-')[1]?.replace(/[^0-9]/g, '') || '0');
        return bComm - aComm;
      }
      if (sortBy === 'rating') {
        return (b.rating || 0) - (a.rating || 0);
      }
      return 0; // newest is default order from DB
    });

  // Get trending products
  const trendingProducts = products.filter(p => p.is_trending).slice(0, 6);

  // Calculate total value
  const totalValue = products.length * 97; // $97 per page value

  // Handle deploy
  const handleDeploy = async (affiliateLink: string) => {
    if (!selectedProduct) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Please log in first');

    const slug = `${selectedProduct.keyword?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'product'}-${Date.now().toString(36)}`;

    const { error } = await supabase
      .from('pages')
      .insert({
        user_id: user.id,
        title: selectedProduct.product_data.title,
        keyword: selectedProduct.keyword || selectedProduct.niche,
        asin: selectedProduct.asin,
        affiliate_link: affiliateLink,
        product_data: selectedProduct.product_data,
        amazon_reviews: [],
        generated_content: selectedProduct.generated_content,
        public_slug: slug,
        status: 'published',
        hero_image: selectedProduct.hero_image,
      });

    if (error) throw new Error('Failed to create page');
  };

  const copyCaption = (caption: string, index: string) => {
    navigator.clipboard.writeText(caption.replace('{LINK}', '[YOUR LINK]'));
    setCopiedCaption(index);
    setTimeout(() => setCopiedCaption(null), 2000);
  };

  // Get categories with counts
  const categoryCounts = products.reduce((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

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
        colors={['#fbbf24', '#f59e0b', '#fcd34d', '#fde68a', '#ffffff']}
      />

      {/* Deploy Modal */}
      {selectedProduct && (
        <DeployModal
          isOpen={deployModalOpen}
          onClose={() => {
            setDeployModalOpen(false);
            setSelectedProduct(null);
          }}
          product={{
            title: selectedProduct.product_data.title,
            asin: selectedProduct.asin,
            image: selectedProduct.hero_image || undefined,
            price: selectedProduct.price,
            niche: selectedProduct.niche,
            generatedContent: selectedProduct.generated_content,
            productData: selectedProduct.product_data,
          }}
          onDeploy={handleDeploy}
        />
      )}

      {/* Premium Hero Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gold-400 via-gold-500 to-gold-400 rounded-3xl opacity-70 animate-gradient-border" />
        
        <div className="relative m-[3px] glass-card rounded-3xl p-8 lg:p-10 overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gold-400/20 rounded-full blur-3xl" />
          
          <div className="relative">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="flex items-start gap-5">
                <div className="w-20 h-20 bg-gradient-to-br from-gold-400 to-gold-600 rounded-2xl flex items-center justify-center text-navy-950 shadow-2xl shadow-gold-500/40 animate-float">
                  <CrownIcon />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl sm:text-4xl font-display font-bold text-white">
                      Gold Package
                    </h1>
                    <span className="px-3 py-1 bg-gold-500/20 border border-gold-500/30 rounded-full text-gold-400 text-sm font-bold">
                      VIP ACCESS
                    </span>
                  </div>
                  <p className="text-navy-300 text-lg">
                    {products.length} Done-For-You Profit Pages Ready to Deploy
                  </p>
                </div>
              </div>
              
              {isFirstVisit && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                  className="px-5 py-3 bg-cash-green/10 border border-cash-green/20 rounded-xl text-cash-green font-bold flex items-center gap-2"
                >
                  🎉 Premium Access Unlocked!
                </motion.div>
              )}
            </div>

            {/* Value Stats */}
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 bg-navy-800/50 rounded-xl text-center">
                <p className="text-3xl font-bold text-white">{products.length}</p>
                <p className="text-sm text-navy-400">Ready Pages</p>
              </div>
              <div className="p-4 bg-navy-800/50 rounded-xl text-center">
                <p className="text-3xl font-bold text-gold-400">${totalValue.toLocaleString()}</p>
                <p className="text-sm text-navy-400">Total Value</p>
              </div>
              <div className="p-4 bg-navy-800/50 rounded-xl text-center">
                <p className="text-3xl font-bold text-cash-green">{Object.keys(categoryCounts).length}</p>
                <p className="text-sm text-navy-400">Niches</p>
              </div>
              <div className="p-4 bg-navy-800/50 rounded-xl text-center">
                <p className="text-3xl font-bold text-purple-400">∞</p>
                <p className="text-sm text-navy-400">Deployments</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Training Videos Section */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          🎬 Gold Package Training
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {trainingVideos.map((video) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: video.id * 0.1 }}
              className="glass-card rounded-2xl overflow-hidden group cursor-pointer hover:border-gold-500/30 transition-all"
            >
              {/* Video Thumbnail */}
              <div className="relative aspect-video bg-gradient-to-br from-navy-800 to-navy-900">
                {/* Placeholder gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-gold-500/10 to-purple-500/10" />
                
                {/* Play button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-gold-400 to-gold-500 flex items-center justify-center text-navy-950 shadow-lg shadow-gold-500/30 group-hover:scale-110 transition-transform">
                    <PlayIcon />
                  </div>
                </div>
                
                {/* Badge */}
                <div className={`absolute top-3 left-3 px-2 py-1 ${video.badgeColor} text-white text-xs font-bold rounded-full`}>
                  {video.badge}
                </div>
                
                {/* Duration */}
                <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/70 text-white text-xs font-medium rounded-md flex items-center gap-1">
                  <ClockIcon />
                  {video.duration}
                </div>
              </div>
              
              {/* Video Info */}
              <div className="p-4">
                <h3 className="font-semibold text-white mb-1 group-hover:text-gold-400 transition-colors">
                  {video.title}
                </h3>
                <p className="text-sm text-navy-400 line-clamp-2">
                  {video.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Trending Section */}
      {trendingProducts.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-orange-500"><FireIcon /></span>
            Trending Now
          </h2>
          <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
            {trendingProducts.map((product) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex-shrink-0 w-72 glass-card rounded-2xl overflow-hidden group"
              >
                <div className="relative aspect-square bg-white">
                  {product.hero_image ? (
                    <img
                      src={product.hero_image}
                      alt={product.product_data.title}
                      className="w-full h-full object-contain p-3"
                      style={{ maxWidth: '180px', maxHeight: '180px', margin: 'auto' }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-navy-800 text-navy-600">
                      No Image
                    </div>
                  )}
                  <div className="absolute top-2 left-2 px-2 py-1 bg-orange-500 text-white text-xs font-bold rounded-full flex items-center gap-1">
                    <FireIcon /> TRENDING
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-xs text-gold-400 font-bold mb-1">{product.niche}</p>
                  <h3 className="font-semibold text-white text-sm line-clamp-2 mb-2 group-hover:text-gold-400 transition-colors">
                    {product.product_data.title}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-cash-green font-bold">{product.commission_estimate}</span>
                    <Button
                      size="sm"
                      onClick={() => {
                        setSelectedProduct(product);
                        setDeployModalOpen(true);
                      }}
                    >
                      <RocketIcon /> Use
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="glass-card rounded-2xl p-5">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-navy-400">
              <SearchIcon />
            </div>
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-12 w-full"
            />
          </div>
          
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="input-field min-w-[200px]"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {CATEGORY_EMOJIS[cat] || '📦'} {cat} {cat !== 'All' && categoryCounts[cat] ? `(${categoryCounts[cat]})` : ''}
              </option>
            ))}
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="input-field min-w-[180px]"
          >
            <option value="newest">🆕 Newest First</option>
            <option value="commission">💰 Highest Commission</option>
            <option value="rating">⭐ Best Rated</option>
          </select>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 mt-4">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-gold-500 text-navy-950'
                  : 'bg-navy-800 text-navy-300 hover:bg-navy-700'
              }`}
            >
              {CATEGORY_EMOJIS[cat]} {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="glass-card rounded-3xl p-12 text-center">
          <div className="w-12 h-12 border-3 border-gold-400 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-navy-300 mt-4 text-lg">Loading your premium products...</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="glass-card rounded-3xl p-12 text-center">
          <p className="text-navy-300 text-lg">
            {searchQuery ? `No products found for "${searchQuery}"` : 'No products in this category yet'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="glass-card rounded-2xl overflow-hidden group"
            >
              {/* Image */}
              <div className="relative aspect-square bg-white flex items-center justify-center">
                {product.hero_image ? (
                  <img
                    src={product.hero_image}
                    alt={product.product_data.title}
                    className="object-contain p-4"
                    style={{ maxWidth: '200px', maxHeight: '200px' }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-navy-800 text-navy-500">
                    No Image
                  </div>
                )}
                
                {/* Earnings Badge - Prominent */}
                <div className="absolute bottom-2 left-2 right-2">
                  <div className="bg-gradient-to-r from-cash-green to-emerald-500 text-white px-3 py-2 rounded-xl shadow-lg shadow-cash-green/30 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">💰</span>
                      <span className="text-xs font-medium opacity-90">Earning Potential</span>
                    </div>
                    <span className="font-bold text-lg">
                      ${Math.floor((parseFloat(product.price?.replace(/[^0-9.]/g, '') || '50') * 0.06) * 20)} - ${Math.floor((parseFloat(product.price?.replace(/[^0-9.]/g, '') || '50') * 0.10) * 100)}/mo
                    </span>
                  </div>
                </div>
                
                {/* Badges */}
                <div className="absolute top-2 left-2 flex gap-1.5">
                  {product.is_trending && (
                    <span className="px-2 py-1 bg-orange-500 text-white text-xs font-bold rounded-full flex items-center gap-1">
                      <FireIcon /> HOT
                    </span>
                  )}
                  {product.is_new && (
                    <span className="px-2 py-1 bg-purple-500 text-white text-xs font-bold rounded-full">
                      NEW
                    </span>
                  )}
                </div>
                
                {/* Competition Badge */}
                <div className="absolute top-2 right-2">
                  <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                    product.competition_level === 'low' ? 'bg-cash-green/20 text-cash-green' :
                    product.competition_level === 'high' ? 'bg-red-500/20 text-red-400' :
                    'bg-gold-500/20 text-gold-400'
                  }`}>
                    {product.competition_level === 'low' ? '🟢 Low Comp' :
                     product.competition_level === 'high' ? '🔴 High Comp' :
                     '🟡 Med Comp'}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <p className="text-xs text-gold-400 font-bold uppercase tracking-wider mb-1">
                  {CATEGORY_EMOJIS[product.niche] || '📦'} {product.niche}
                </p>
                <h3 className="font-semibold text-white line-clamp-2 mb-3 group-hover:text-gold-400 transition-colors">
                  {product.product_data.title}
                </h3>

                {/* Stats Row */}
                <div className="flex items-center gap-4 mb-4 text-sm">
                  <span className="text-cash-green font-bold text-base">{product.price}</span>
                  <span className="flex items-center gap-1 text-gold-400">
                    <StarIcon />
                    <span className="font-medium">{product.rating || product.product_data.rating || '4.5'}</span>
                  </span>
                  <span className="text-navy-400">
                    {(product.reviews_count || product.product_data.reviews_count || 0).toLocaleString()} reviews
                  </span>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    onClick={() => {
                      setSelectedProduct(product);
                      setDeployModalOpen(true);
                    }}
                    className="flex-1"
                  >
                    <RocketIcon />
                    <span>Use This Page</span>
                  </Button>
                  <button
                    onClick={() => window.open(`/p/${product.public_slug}`, '_blank')}
                    className="px-4 py-2.5 rounded-xl bg-navy-800 text-navy-300 hover:bg-navy-700 hover:text-white transition-colors"
                    title="Preview"
                  >
                    <EyeIcon />
                  </button>
                </div>

                {/* Social Captions Accordion */}
                {product.social_captions && product.social_captions.length > 0 && (
                  <details className="mt-4 group/captions">
                    <summary className="flex items-center justify-between cursor-pointer text-sm text-navy-400 hover:text-white">
                      <span>📱 Copy Viral Captions</span>
                      <span className="text-xs">Click to expand</span>
                    </summary>
                    <div className="mt-3 space-y-2">
                      {product.social_captions.map((caption, idx) => (
                        <div key={idx} className="p-3 bg-navy-800/50 rounded-lg">
                          <p className="text-xs text-navy-300 line-clamp-2 mb-2">{caption}</p>
                          <button
                            onClick={() => copyCaption(caption, `${product.id}-${idx}`)}
                            className="text-xs text-gold-400 hover:text-gold-300 flex items-center gap-1"
                          >
                            {copiedCaption === `${product.id}-${idx}` ? (
                              <><CheckIcon /> Copied!</>
                            ) : (
                              <><CopyIcon /> Copy</>
                            )}
                          </button>
                        </div>
                      ))}
                    </div>
                  </details>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Social Proof Footer */}
      <div className="glass-card rounded-2xl p-6 text-center border border-gold-500/20">
        <div className="flex flex-wrap items-center justify-center gap-8">
          <div className="flex items-center gap-2">
            <span className="text-gold-400"><UsersIcon /></span>
            <span className="text-navy-300">
              <strong className="text-white">12,847</strong> Gold Members
            </span>
          </div>
          <div className="text-navy-400">•</div>
          <div className="text-navy-300">
            <strong className="text-cash-green">$2.4M+</strong> earned with Gold pages
          </div>
          <div className="text-navy-400">•</div>
          <div className="flex items-center gap-1 text-gold-400">
            <StarIcon /><StarIcon /><StarIcon /><StarIcon /><StarIcon />
            <span className="text-navy-300 ml-1">4.9/5</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
