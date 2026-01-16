'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Confetti from '@/components/ui/Confetti';

// Icons
const SearchIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8" />
    <path d="M21 21l-4.35-4.35" />
  </svg>
);

const ArrowLeftIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M19 12H5M12 19l-7-7 7-7"/>
  </svg>
);

const ArrowRightIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
);

const CheckCircleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22,4 12,14.01 9,11.01" />
  </svg>
);

const ExternalLinkIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15,3 21,3 21,9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

const StarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
  </svg>
);

const PackageIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M16.5 9.4l-9-5.19M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <polyline points="3.27,6.96 12,12.01 20.73,6.96" />
    <line x1="12" y1="22.08" x2="12" y2="12" />
  </svg>
);

const SparklesIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 3l1.912 5.813a2 2 0 0 0 1.275 1.275L21 12l-5.813 1.912a2 2 0 0 0-1.275 1.275L12 21l-1.912-5.813a2 2 0 0 0-1.275-1.275L3 12l5.813-1.912a2 2 0 0 0 1.275-1.275L12 3z" />
  </svg>
);

const BrainIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-2zM14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-2z" />
  </svg>
);

const FireIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 23c-4.97 0-9-3.58-9-8 0-2.52 1.17-5.06 3.05-7.29.37-.44.75-.86 1.14-1.25l.73-.71.5.89c.63 1.11 1.4 2.07 2.27 2.86.31.28.62.53.94.76l.77.57-.45.84c-.3.55-.44 1.13-.44 1.73 0 1.1.45 2.1 1.17 2.83.72.73 1.72 1.18 2.82 1.18s2.1-.45 2.82-1.18c.72-.73 1.17-1.73 1.17-2.83 0-.6-.14-1.18-.44-1.73l-.45-.84.77-.57c.32-.23.63-.48.94-.76.87-.79 1.64-1.75 2.27-2.86l.5-.89.73.71c.39.39.77.81 1.14 1.25C19.83 9.94 21 12.48 21 15c0 4.42-4.03 8-9 8z" />
  </svg>
);

const ShareIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
  </svg>
);

const EyeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

interface Product {
  asin: string;
  title: string;
  image?: string;
  price?: string;
  rating?: number;
  reviews_count?: number;
  link?: string;
}

type Step = 'search' | 'select' | 'affiliate' | 'generate' | 'complete';

// AI Generation messages
const aiMessages = [
  { emoji: '🤖', text: 'AI analyzing product data...' },
  { emoji: '📊', text: 'Researching market trends...' },
  { emoji: '✍️', text: 'Writing compelling copy...' },
  { emoji: '🎨', text: 'Designing your profit page...' },
  { emoji: '💰', text: 'Calculating earning potential...' },
  { emoji: '🔥', text: 'Adding persuasive elements...' },
  { emoji: '⭐', text: 'Optimizing for conversions...' },
  { emoji: '🚀', text: 'Almost ready to make money!' },
];

export default function BuildPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [affiliateLink, setAffiliateLink] = useState('');
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');
  const [createdSlug, setCreatedSlug] = useState('');
  
  // AI generation animation state
  const [aiProgress, setAiProgress] = useState(0);
  const [currentAiMessage, setCurrentAiMessage] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

  // AI message rotation during generation
  useEffect(() => {
    if (generating) {
      const messageInterval = setInterval(() => {
        setCurrentAiMessage((prev) => (prev + 1) % aiMessages.length);
      }, 1500);
      
      const progressInterval = setInterval(() => {
        setAiProgress((prev) => {
          if (prev >= 95) return prev;
          return prev + Math.random() * 8 + 2;
        });
      }, 500);

      return () => {
        clearInterval(messageInterval);
        clearInterval(progressInterval);
      };
    } else {
      setAiProgress(0);
      setCurrentAiMessage(0);
    }
  }, [generating]);

  // Search products
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError('');
    setProducts([]);

    try {
      const res = await fetch(`/api/amazon/search?query=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to search');
      }

      if (data.products && data.products.length > 0) {
        setProducts(data.products);
        setStep('select');
      } else {
        setError('No products found. Try a different search term.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  // Select product
  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setError('');
    setStep('affiliate');
  };

  // Submit affiliate link
  const handleAffiliateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!affiliateLink.trim()) {
      setError('Please enter your affiliate link');
      return;
    }
    setError('');
    setStep('generate');
  };

  // Go back function that clears errors
  const goBack = (targetStep: Step) => {
    setError('');
    setStep(targetStep);
  };

  // Generate page
  const handleGenerate = async () => {
    if (!selectedProduct) return;

    setGenerating(true);
    setAiProgress(0);
    setError('');

    try {
      // Add intentional delay for dramatic effect (minimum 8 seconds)
      const startTime = Date.now();
      
      const res = await fetch('/api/generate/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          keyword: searchQuery,
          asin: selectedProduct.asin,
          productData: {
            title: selectedProduct.title,
            price: selectedProduct.price,
            rating: selectedProduct.rating,
            reviews_count: selectedProduct.reviews_count,
          },
          affiliateLink,
        }),
      });

      const data = await res.json();
      
      // Ensure minimum 8 seconds for the animation
      const elapsed = Date.now() - startTime;
      if (elapsed < 8000) {
        await new Promise(resolve => setTimeout(resolve, 8000 - elapsed));
      }
      
      // Final progress push
      setAiProgress(100);
      await new Promise(resolve => setTimeout(resolve, 500));

      if (!res.ok) {
        throw new Error(data.error || 'Generation failed');
      }

      setCreatedSlug(data.page.public_slug);
      setShowConfetti(true);
      setStep('complete');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate page');
    } finally {
      setGenerating(false);
    }
  };

  const steps = [
    { id: 'search', label: 'Search', emoji: '🔍' },
    { id: 'select', label: 'Select', emoji: '🎯' },
    { id: 'affiliate', label: 'Link', emoji: '🔗' },
    { id: 'generate', label: 'Magic', emoji: '✨' },
  ];

  const currentStepIndex = steps.findIndex(s => s.id === step);
  
  // Calculate estimated earnings
  const estimatedEarnings = selectedProduct?.price 
    ? `$${(parseFloat(selectedProduct.price.replace(/[^0-9.]/g, '')) * 0.04 * 10).toFixed(0)} - $${(parseFloat(selectedProduct.price.replace(/[^0-9.]/g, '')) * 0.1 * 50).toFixed(0)}`
    : '$47 - $470';

  return (
    <div className="max-w-4xl mx-auto">
      {/* Confetti */}
      <Confetti isActive={showConfetti} onComplete={() => setShowConfetti(false)} />
      
      {/* Progress Steps - Enhanced with emojis */}
      <div className="mb-10">
        <div className="flex items-center justify-between relative">
          {/* Progress Line */}
          <div className="absolute top-6 left-0 right-0 h-1 bg-navy-700 rounded-full" />
          <div 
            className="absolute top-6 left-0 h-1 bg-gradient-to-r from-gold-400 to-gold-500 rounded-full transition-all duration-500"
            style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
          />
          
          {steps.map((s, i) => (
            <div key={s.id} className="relative z-10 flex flex-col items-center">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl transition-all duration-300 ${
                i < currentStepIndex
                  ? 'bg-gold-400 text-navy-950 shadow-lg shadow-gold-400/30'
                  : i === currentStepIndex
                  ? 'bg-gradient-to-br from-gold-400 to-gold-500 text-navy-950 shadow-xl shadow-gold-400/40 animate-pulse-glow'
                  : 'bg-navy-800 text-navy-500 border-2 border-navy-700'
              }`}>
                {i < currentStepIndex ? <CheckCircleIcon /> : s.emoji}
              </div>
              <span className={`mt-3 text-sm font-semibold ${
                i <= currentStepIndex ? 'text-white' : 'text-navy-500'
              }`}>
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Encouraging message based on step */}
      <AnimatePresence mode="wait">
        {step !== 'complete' && (
          <motion.div
            key={step}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-center mb-6"
          >
            <p className="text-navy-300 text-lg">
              {step === 'search' && "🎯 Let's find a profitable product for you!"}
              {step === 'select' && "💰 Great search! Pick a winner from these options."}
              {step === 'affiliate' && "🔗 Almost there! Add your link to start earning."}
              {step === 'generate' && "✨ Ready for magic? Your AI profit page awaits!"}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Display */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-base"
        >
          {error}
        </motion.div>
      )}

      {/* Step Content */}
      <AnimatePresence mode="wait">
        {/* Step 1: Search */}
        {step === 'search' && (
          <motion.div
            key="search"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="glass-card rounded-3xl p-8 lg:p-10"
          >
            <div className="text-center mb-10">
              <div className="w-20 h-20 bg-gold-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6 text-gold-400 animate-float">
                <SearchIcon />
              </div>
              <h2 className="text-3xl font-display font-bold text-white mb-3">
                Find Your Profit Product
              </h2>
              <p className="text-navy-300 text-lg">
                Search for any product you want to promote and earn commissions
              </p>
            </div>

            <form onSubmit={handleSearch} className="space-y-6">
              <Input
                placeholder="e.g., wireless earbuds, air fryer, yoga mat..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="text-lg py-4"
              />
              
              {/* Quick suggestions */}
              <div className="flex flex-wrap gap-2">
                <span className="text-sm text-navy-400">🔥 Hot right now:</span>
                {['Air Fryer', 'Ring Light', 'Yoga Mat', 'Wireless Earbuds'].map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => setSearchQuery(term)}
                    className="px-3 py-1.5 text-sm bg-navy-800 hover:bg-navy-700 text-navy-300 hover:text-white rounded-lg transition-all"
                  >
                    {term}
                  </button>
                ))}
              </div>

              <Button
                type="submit"
                className="w-full btn-large"
                isLoading={loading}
                disabled={!searchQuery.trim()}
              >
                <SearchIcon />
                <span>Search Products</span>
              </Button>
            </form>

            {/* Social proof */}
            <div className="mt-8 pt-6 border-t border-navy-700 text-center">
              <p className="text-sm text-navy-400">
                🎉 <span className="text-white font-medium">2,847 pages</span> created today by members like you
              </p>
            </div>
          </motion.div>
        )}

        {/* Step 2: Select Product */}
        {step === 'select' && (
          <motion.div
            key="select"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-display font-bold text-white">
                  Pick Your Winner! 🏆
                </h2>
                <p className="text-navy-300 mt-1">
                  {products.length} products found for &quot;{searchQuery}&quot;
                </p>
              </div>
              <Button variant="ghost" onClick={() => goBack('search')} className="text-base">
                <ArrowLeftIcon />
                <span>Back</span>
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {products.map((product, i) => (
                <motion.button
                  key={product.asin}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => handleSelectProduct(product)}
                  className="glass-card glass-card-hover rounded-2xl p-6 text-left transition-all duration-300 group relative overflow-hidden"
                >
                  {/* Popular badge on first few */}
                  {i < 2 && (
                    <div className="absolute top-3 right-3 px-2 py-1 bg-cash-green/20 border border-cash-green/30 rounded-lg text-xs font-bold text-cash-green flex items-center gap-1">
                      <FireIcon />
                      HOT
                    </div>
                  )}
                  
                  <div className="flex gap-5">
                    <div className="w-24 h-24 bg-white rounded-xl overflow-hidden flex-shrink-0 shadow-lg">
                      {product.image ? (
                        <Image
                          src={product.image}
                          alt={product.title}
                          width={96}
                          height={96}
                          className="w-full h-full object-contain p-2"
                          unoptimized
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-navy-800 text-navy-600">
                          <PackageIcon />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-white line-clamp-2 group-hover:text-gold-400 transition-colors text-base">
                        {product.title}
                      </h3>
                      <div className="flex items-center gap-3 mt-3">
                        {product.price && (
                          <span className="text-cash-green font-bold text-lg">{product.price}</span>
                        )}
                        {product.rating && (
                          <span className="flex items-center gap-1 text-gold-400">
                            <StarIcon />
                            <span className="font-medium">{product.rating}</span>
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-navy-400 mt-2">
                        💰 Est. commission: ${((parseFloat(product.price?.replace(/[^0-9.]/g, '') || '50') * 0.06)).toFixed(0)}/sale
                      </p>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Step 3: Affiliate Link */}
        {step === 'affiliate' && selectedProduct && (
          <motion.div
            key="affiliate"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="glass-card rounded-3xl p-8 lg:p-10"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-display font-bold text-white">
                Add Your Affiliate Link 🔗
              </h2>
              <Button variant="ghost" onClick={() => goBack('select')}>
                <ArrowLeftIcon />
                <span>Back</span>
              </Button>
            </div>

            {/* Selected product preview */}
            <div className="flex items-start gap-5 p-5 bg-navy-800/50 rounded-2xl mb-8 border border-navy-700">
              <div className="w-20 h-20 bg-white rounded-xl overflow-hidden flex-shrink-0 shadow-lg">
                {selectedProduct.image ? (
                  <Image
                    src={selectedProduct.image}
                    alt={selectedProduct.title}
                    width={80}
                    height={80}
                    className="w-full h-full object-contain p-2"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-navy-800 text-navy-600">
                    <PackageIcon />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-cash-green font-medium mb-1">✓ Great choice!</p>
                <h3 className="font-semibold text-white line-clamp-2 text-lg">
                  {selectedProduct.title}
                </h3>
                <div className="flex items-center gap-3 mt-2">
                  {selectedProduct.price && (
                    <span className="text-cash-green font-bold">{selectedProduct.price}</span>
                  )}
                  {selectedProduct.asin && (
                    <a
                      href={`https://www.amazon.com/dp/${selectedProduct.asin}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm text-gold-400 hover:underline"
                    >
                      <span>View on Amazon</span>
                      <ExternalLinkIcon />
                    </a>
                  )}
                </div>
              </div>
            </div>

            <form onSubmit={handleAffiliateSubmit} className="space-y-6">
              <div>
                <label className="block text-base font-medium text-white mb-2">
                  Your Affiliate Link
                </label>
                <Input
                  placeholder="https://your-affiliate-link.com/product"
                  value={affiliateLink}
                  onChange={(e) => setAffiliateLink(e.target.value)}
                  className="text-lg py-4"
                />
                <p className="text-sm text-navy-400 mt-2">
                  💡 Paste your Amazon affiliate link for this product
                </p>
              </div>
              
              <Button type="submit" className="w-full btn-large" disabled={!affiliateLink.trim()}>
                <span>Continue to Magic</span>
                <ArrowRightIcon />
              </Button>
            </form>
          </motion.div>
        )}

        {/* Step 4: Generate - DRAMATICALLY REDESIGNED */}
        {step === 'generate' && selectedProduct && (
          <motion.div
            key="generate"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="glass-card rounded-3xl p-8 lg:p-10"
          >
            {!generating ? (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-display font-bold text-white">
                    Ready for AI Magic? ✨
                  </h2>
                  <Button variant="ghost" onClick={() => goBack('affiliate')}>
                    <ArrowLeftIcon />
                    <span>Back</span>
                  </Button>
                </div>

                <div className="text-center py-8">
                  <div className="w-28 h-28 bg-gradient-to-br from-gold-400/20 to-gold-600/20 rounded-3xl flex items-center justify-center mx-auto mb-8 text-gold-400 border border-gold-500/30 animate-pulse-glow">
                    <SparklesIcon />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-3">
                    Your Profit Page is One Click Away!
                  </h3>
                  <p className="text-navy-300 mb-8 max-w-lg mx-auto text-lg">
                    Our advanced AI will create a stunning, high-converting review page for your product in seconds.
                  </p>

                  {/* Earnings potential preview */}
                  <div className="bg-navy-800/50 rounded-2xl p-6 mb-8 border border-cash-green/20 max-w-md mx-auto">
                    <p className="text-sm text-navy-400 mb-2">Estimated Earnings Potential</p>
                    <p className="text-4xl font-bold text-cash-green mb-2">{estimatedEarnings}</p>
                    <p className="text-xs text-navy-500">Based on average member results</p>
                  </div>

                  <Button
                    onClick={handleGenerate}
                    className="btn-large px-12 animate-scale-pulse"
                  >
                    <SparklesIcon />
                    <span>Create My Profit Page</span>
                  </Button>
                </div>
              </>
            ) : (
              /* AI GENERATION ANIMATION */
              <div className="text-center py-12">
                {/* Animated AI Brain */}
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="w-32 h-32 bg-gradient-to-br from-gold-400 to-gold-600 rounded-3xl flex items-center justify-center mx-auto mb-8 text-navy-950 shadow-2xl shadow-gold-500/40"
                >
                  <BrainIcon />
                </motion.div>

                <h3 className="text-2xl font-bold text-white mb-6">
                  AI is Creating Your Page...
                </h3>

                {/* Progress bar */}
                <div className="max-w-md mx-auto mb-6">
                  <div className="progress-bar h-4 rounded-full">
                    <motion.div 
                      className="progress-bar-fill-gold h-full rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${aiProgress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                  <p className="text-right text-gold-400 font-bold mt-2">{Math.round(aiProgress)}%</p>
                </div>

                {/* Rotating AI messages */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentAiMessage}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="flex items-center justify-center gap-3 text-lg"
                  >
                    <span className="text-2xl">{aiMessages[currentAiMessage].emoji}</span>
                    <span className="text-navy-300">{aiMessages[currentAiMessage].text}</span>
                  </motion.div>
                </AnimatePresence>

                {/* Floating particles */}
                <div className="flex justify-center gap-4 mt-8">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      animate={{ 
                        y: [-10, 10, -10],
                        opacity: [0.3, 1, 0.3]
                      }}
                      transition={{ 
                        duration: 1.5, 
                        repeat: Infinity,
                        delay: i * 0.3
                      }}
                      className="w-3 h-3 bg-gold-400 rounded-full"
                    />
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Step 5: Complete - CELEBRATION! */}
        {step === 'complete' && (
          <motion.div
            key="complete"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative"
          >
            {/* Glowing border */}
            <div className="absolute inset-0 bg-gradient-to-r from-cash-green via-cash-emerald to-cash-green rounded-3xl opacity-60 animate-pulse" />
            
            <div className="relative m-[3px] glass-card rounded-3xl p-8 lg:p-12 text-center">
              {/* Success icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.2 }}
                className="w-28 h-28 bg-gradient-to-br from-cash-green to-cash-emerald rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-cash-green/40"
              >
                <CheckCircleIcon />
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-4xl font-display font-bold text-white mb-3"
              >
                🎉 YOUR PAGE IS LIVE!
              </motion.h2>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-xl text-navy-300 mb-8"
              >
                Congratulations! Your profit page is ready to make money!
              </motion.p>

              {/* Earnings potential */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="bg-navy-800/50 rounded-2xl p-6 mb-8 border border-cash-green/20 max-w-md mx-auto"
              >
                <p className="text-sm text-navy-400 mb-2">💰 This page could earn you</p>
                <p className="text-4xl font-bold text-cash-green mb-2">{estimatedEarnings}</p>
                <p className="text-xs text-navy-500">Share it now to start earning!</p>
              </motion.div>

              {/* URL Preview */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="p-5 bg-navy-800/50 rounded-2xl mb-8 border border-navy-700 max-w-lg mx-auto"
              >
                <p className="text-sm text-navy-400 mb-2">Your page URL:</p>
                <p className="text-gold-400 font-mono text-base break-all">
                  {typeof window !== 'undefined' ? window.location.origin : ''}/p/{createdSlug}
                </p>
              </motion.div>

              {/* Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="flex flex-col sm:flex-row gap-4 justify-center mb-8"
              >
                <Button
                  onClick={() => window.open(`/p/${createdSlug}`, '_blank')}
                  className="btn-large"
                >
                  <EyeIcon />
                  <span>View My Page</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => router.push('/app/traffic')}
                  className="btn-large"
                >
                  <ShareIcon />
                  <span>Share & Earn</span>
                </Button>
              </motion.div>

              {/* Quick share buttons */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="pt-6 border-t border-navy-700"
              >
                <p className="text-sm text-navy-400 mb-4">Quick share:</p>
                <div className="flex justify-center gap-3 flex-wrap">
                  {[
                    { name: 'Facebook', color: 'bg-[#1877F2]', url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`${typeof window !== 'undefined' ? window.location.origin : ''}/p/${createdSlug}`)}` },
                    { name: 'WhatsApp', color: 'bg-[#25D366]', url: `https://api.whatsapp.com/send?text=${encodeURIComponent(`Check this out! ${typeof window !== 'undefined' ? window.location.origin : ''}/p/${createdSlug}`)}` },
                    { name: 'Twitter', color: 'bg-black', url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(`${typeof window !== 'undefined' ? window.location.origin : ''}/p/${createdSlug}`)}` },
                  ].map((platform) => (
                    <a
                      key={platform.name}
                      href={platform.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${platform.color} text-white px-5 py-2.5 rounded-xl font-medium hover:opacity-90 transition-opacity`}
                    >
                      {platform.name}
                    </a>
                  ))}
                </div>
              </motion.div>

              {/* Social proof */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="mt-8 text-sm text-navy-500"
              >
                🔥 Join 12,847+ members making money with their profit pages
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
