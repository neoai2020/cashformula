'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star,
  Check,
  ChevronDown,
  ChevronUp,
  ShoppingCart,
  Shield,
  Truck,
  Clock,
  Users,
  ArrowRight,
  Flame,
  Crown,
  Award,
  Trophy,
  Medal,
  Zap,
  Gift,
  X,
} from 'lucide-react';

interface BestOfPublicPage {
  id: string;
  title: string;
  affiliate_link: string;
  product_data: any;
  generated_content: any;
  hero_image: string | null;
  conversion_boosters?: string[];
}

interface BestOfPageTemplateProps {
  page: BestOfPublicPage;
}

export default function BestOfPageTemplate({ page }: BestOfPageTemplateProps) {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 47, seconds: 33 });
  const [viewerCount, setViewerCount] = useState(187);

  const { product_data, generated_content, conversion_boosters } = page;
  const products = product_data?.products || [];
  const category = product_data?.category || 'Products';
  const intro = generated_content?.intro || '';
  const subtitle = generated_content?.subtitle || '';
  const sections = generated_content?.sections || [];
  const faq = generated_content?.faq || [];
  const conclusion = generated_content?.conclusion || '';

  // Check conversion boosters
  const boosters = conversion_boosters || [];
  
  // Enable all boosters by default if ANY booster was selected (for better UX)
  const anyBoosterSelected = boosters.length > 0;
  const hasCountdown = anyBoosterSelected || boosters.includes('countdown');
  const hasVisitors = anyBoosterSelected || boosters.includes('visitors');
  const hasUrgencyBanner = anyBoosterSelected || boosters.includes('urgency-banner');
  const hasTrustBadges = anyBoosterSelected || boosters.includes('trust-badges');
  const hasRecentSales = anyBoosterSelected || boosters.includes('recent-sales');
  const hasExitPopup = anyBoosterSelected || boosters.includes('exit-popup');
  
  // Recent Sales popup state
  const [showRecentSale, setShowRecentSale] = useState(false);
  const [recentSaleName, setRecentSaleName] = useState('');
  const [recentSaleProduct, setRecentSaleProduct] = useState('');
  
  // Exit Intent popup state  
  const [showExitPopup, setShowExitPopup] = useState(false);
  const [exitPopupShown, setExitPopupShown] = useState(false);

  // Countdown timer
  useEffect(() => {
    if (!hasCountdown) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 23, minutes: 59, seconds: 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [hasCountdown]);

  // Viewer count fluctuation
  useEffect(() => {
    const interval = setInterval(() => {
      setViewerCount(prev => Math.max(150, prev + Math.floor(Math.random() * 7) - 3));
    }, 4000);
    return () => clearInterval(interval);
  }, []);
  
  // Recent Sales popup
  useEffect(() => {
    if (!hasRecentSales) return;
    
    const names = ['Sarah M.', 'John D.', 'Emily R.', 'Michael T.', 'Jessica L.', 'David K.', 'Amanda S.', 'Chris B.'];
    const productNames = products.map((p: any) => p.name).filter(Boolean);
    
    const showSale = () => {
      const randomName = names[Math.floor(Math.random() * names.length)];
      const randomProduct = productNames[Math.floor(Math.random() * productNames.length)] || 'a top-rated product';
      setRecentSaleName(randomName);
      setRecentSaleProduct(randomProduct);
      setShowRecentSale(true);
      
      setTimeout(() => setShowRecentSale(false), 4000);
    };
    
    const firstTimeout = setTimeout(showSale, 5000);
    const interval = setInterval(showSale, 15000 + Math.random() * 15000);
    
    return () => {
      clearTimeout(firstTimeout);
      clearInterval(interval);
    };
  }, [hasRecentSales, products]);
  
  // Exit Intent popup
  useEffect(() => {
    if (!hasExitPopup || exitPopupShown) return;
    
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !exitPopupShown) {
        setShowExitPopup(true);
        setExitPopupShown(true);
      }
    };
    
    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, [hasExitPopup, exitPopupShown]);

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="w-8 h-8 text-yellow-400" />;
    if (rank === 2) return <Medal className="w-8 h-8 text-gray-300" />;
    if (rank === 3) return <Medal className="w-8 h-8 text-orange-400" />;
    return <Award className="w-6 h-6 text-purple-400" />;
  };

  const getRankBg = (rank: number) => {
    if (rank === 1) return 'from-yellow-900/40 to-yellow-800/20 border-yellow-500/50';
    if (rank === 2) return 'from-gray-700/40 to-gray-600/20 border-gray-400/50';
    if (rank === 3) return 'from-orange-900/40 to-orange-800/20 border-orange-500/50';
    return 'from-purple-900/30 to-purple-800/10 border-purple-500/30';
  };

  // Get top product for CTA
  const topProduct = products[0];

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Standalone Countdown Timer - Sticky at top */}
      {hasCountdown && !hasUrgencyBanner && (
        <motion.div
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          className="bg-gradient-to-r from-red-600 via-orange-500 to-red-600 text-white py-4 sticky top-0 z-50"
        >
          <div className="max-w-4xl mx-auto flex flex-col items-center gap-2">
            <div className="flex items-center gap-2">
              <Flame className="w-6 h-6 animate-pulse" />
              <span className="font-bold text-lg">⚡ DEAL ENDS SOON!</span>
              <Flame className="w-6 h-6 animate-pulse" />
            </div>
            <div className="flex items-center gap-3 bg-black/30 px-6 py-2 rounded-full">
              <Clock className="w-5 h-5" />
              <span className="font-mono text-2xl font-bold tracking-wider">
                {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
              </span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Recent Sales Popup */}
      <AnimatePresence>
        {showRecentSale && hasRecentSales && (
          <motion.div
            initial={{ x: -400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -400, opacity: 0 }}
            className="fixed bottom-4 left-4 z-50 bg-white rounded-xl shadow-2xl p-4 max-w-sm border-l-4 border-emerald-500"
          >
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                <ShoppingCart className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-gray-900 font-semibold">
                  {recentSaleName} just purchased!
                </p>
                <p className="text-gray-600 text-sm">{recentSaleProduct}</p>
                <p className="text-emerald-600 text-xs mt-1">A few seconds ago</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Exit Intent Popup */}
      <AnimatePresence>
        {showExitPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
            onClick={() => setShowExitPopup(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 max-w-md w-full border border-orange-500/50 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowExitPopup(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Gift className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Wait! Don&apos;t Leave Yet! 🎁
                </h3>
                <p className="text-gray-300 mb-6">
                  You&apos;re about to miss our top picks! Check out the best deals before prices change.
                </p>
                {topProduct && (
                  <a
                    href={topProduct.affiliateLink || page.affiliate_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full block bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold py-3 px-6 rounded-xl hover:scale-105 transition-transform mb-3"
                  >
                    Check Our #1 Pick →
                  </a>
                )}
                <button
                  onClick={() => setShowExitPopup(false)}
                  className="text-gray-400 hover:text-white text-sm"
                >
                  No thanks, I&apos;ll pass
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Urgency Banner */}
      {hasUrgencyBanner && (
        <motion.div
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          className="bg-gradient-to-r from-red-600 via-orange-500 to-red-600 text-white py-3 px-4 sticky top-0 z-50"
        >
          <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-center gap-4 text-sm md:text-base font-medium">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 animate-pulse" />
              <span>LIMITED TIME PRICES - Don&apos;t Miss Out!</span>
            </div>
            {hasCountdown && (
              <div className="flex items-center gap-2 bg-black/20 px-4 py-1 rounded-full">
                <Clock className="w-4 h-4" />
                <span className="font-mono">
                  {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
                </span>
              </div>
            )}
            {hasVisitors && (
              <div className="flex items-center gap-2 bg-black/20 px-4 py-1 rounded-full">
                <Users className="w-4 h-4" />
                <span>{viewerCount}+ people reading this!</span>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Hero Section */}
      <section className="relative py-12 lg:py-20 bg-gradient-to-b from-purple-900/20 via-[#0a0a0f] to-[#0a0a0f]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600/30 to-pink-600/30 border border-purple-500/50 rounded-full px-6 py-2 mb-6"
          >
            <Trophy className="w-5 h-5 text-yellow-400" />
            <span className="text-purple-300 font-medium">{subtitle}</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
          >
            {page.title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
          >
            {intro}
          </motion.p>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap justify-center gap-8 mt-10"
          >
            <div className="text-center">
              <p className="text-3xl font-bold text-white">{products.length}</p>
              <p className="text-gray-400">Products Reviewed</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-white">50+</p>
              <p className="text-gray-400">Hours Research</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-white">10,000+</p>
              <p className="text-gray-400">Reviews Analyzed</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Products List */}
      <section className="py-12 lg:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-8">
          {products.map((product: any, index: number) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`relative bg-gradient-to-br ${getRankBg(index + 1)} backdrop-blur-xl border rounded-3xl overflow-hidden`}
            >
              {/* Rank Badge */}
              <div className="absolute top-4 left-4 z-10">
                <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                  index === 0 ? 'bg-yellow-500/20 text-yellow-300' :
                  index === 1 ? 'bg-gray-400/20 text-gray-300' :
                  index === 2 ? 'bg-orange-500/20 text-orange-300' :
                  'bg-purple-500/20 text-purple-300'
                }`}>
                  {getRankIcon(index + 1)}
                  <span className="font-bold">{product.badge || `#${index + 1}`}</span>
                </div>
              </div>

              <div className="p-6 md:p-8">
                <div className="grid md:grid-cols-3 gap-6 items-center">
                  {/* Product Image */}
                  <div className="md:col-span-1">
                    <div className="relative w-full aspect-square max-w-xs mx-auto bg-white rounded-2xl overflow-hidden">
                      {product.image ? (
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-contain p-4"
                          unoptimized
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100">
                          <ShoppingCart className="w-16 h-16 text-gray-300" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="md:col-span-2 space-y-4">
                    <h3 className="text-2xl md:text-3xl font-bold text-white">
                      {product.name}
                    </h3>

                    {/* Rating & Price */}
                    <div className="flex flex-wrap items-center gap-4">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-5 h-5 ${
                              star <= Math.round(product.rating)
                                ? 'text-yellow-400 fill-yellow-400'
                                : 'text-gray-600'
                            }`}
                          />
                        ))}
                        <span className="text-yellow-400 font-semibold ml-2">{product.rating}/5</span>
                      </div>
                      <span className="text-2xl font-bold text-emerald-400">{product.price}</span>
                    </div>

                    {/* Review Summary */}
                    {product.reviewSummary && (
                      <p className="text-gray-300">{product.reviewSummary}</p>
                    )}

                    {/* Pros */}
                    {product.pros && product.pros.length > 0 && (
                      <div className="space-y-2">
                        {product.pros.slice(0, 4).map((pro: string, idx: number) => (
                          <div key={idx} className="flex items-center gap-2 text-gray-300">
                            <Check className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                            <span>{pro}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* CTA Button */}
                    <div className="pt-4">
                      <a
                        href={product.affiliateLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`group inline-flex items-center justify-center gap-3 text-white font-bold rounded-xl shadow-2xl transition-all duration-300 px-8 py-4 text-lg ${
                          index === 0
                            ? 'bg-gradient-to-r from-yellow-500 via-orange-500 to-yellow-500 shadow-yellow-500/30 hover:shadow-yellow-500/50'
                            : 'bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 shadow-purple-500/30 hover:shadow-purple-500/50'
                        } hover:scale-[1.02] active:scale-[0.98]`}
                      >
                        <ShoppingCart className="w-5 h-5" />
                        <span>Check Price on Amazon</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Sections */}
      {sections.length > 0 && (
        <section className="py-12 lg:py-16 bg-[#0d0d12]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-12">
            {sections.map((section: any, idx: number) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
                  {section.title}
                </h2>
                <div className="prose prose-invert prose-lg max-w-none">
                  <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                    {section.content}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* FAQ Section */}
      {faq.length > 0 && (
        <section className="py-12 lg:py-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {faq.map((item: any, idx: number) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-gradient-to-br from-gray-900/60 to-gray-800/40 backdrop-blur-xl border border-gray-700/50 rounded-xl overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                    className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-800/30 transition-colors"
                  >
                    <span className="text-white font-semibold pr-8">{item.question}</span>
                    {expandedFaq === idx ? (
                      <ChevronUp className="w-5 h-5 text-purple-400 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-purple-400 flex-shrink-0" />
                    )}
                  </button>
                  <AnimatePresence>
                    {expandedFaq === idx && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-6">
                          <p className="text-gray-300 leading-relaxed">{item.answer}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Conclusion */}
      {conclusion && (
        <section className="py-12 lg:py-16 bg-gradient-to-br from-purple-900/20 to-pink-900/10">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <Zap className="w-12 h-12 text-purple-400 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Final Thoughts
            </h2>
            <p className="text-lg text-gray-300 leading-relaxed mb-8">
              {conclusion}
            </p>
            {products[0] && (
              <a
                href={products[0].affiliateLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-yellow-500 via-orange-500 to-yellow-500 text-white font-bold rounded-xl shadow-2xl shadow-yellow-500/30 hover:shadow-yellow-500/50 transition-all duration-300 px-10 py-5 text-xl hover:scale-[1.02] active:scale-[0.98]"
              >
                <Trophy className="w-6 h-6" />
                <span>See Our #1 Pick</span>
                <ArrowRight className="w-6 h-6" />
              </a>
            )}
          </div>
        </section>
      )}

      {/* Trust Badges */}
      {hasTrustBadges && (
        <section className="py-8 border-t border-gray-800">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="flex flex-wrap justify-center gap-8 text-gray-400">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-emerald-400" />
                <span>Secure Checkout</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-blue-400" />
                <span>Fast Prime Shipping</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-purple-400" />
                <span>Expert Reviewed</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-[#050508] border-t border-gray-800 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-gray-500 text-sm mb-4">
            © {new Date().getFullYear()} Product Review. All rights reserved.
          </p>
          <p className="text-gray-600 text-xs">
            Disclaimer: As an Amazon Associate, we earn from qualifying purchases. 
            Product prices and availability are accurate as of the date/time indicated and are subject to change.
          </p>
        </div>
      </footer>
    </div>
  );
}
