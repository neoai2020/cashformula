'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star,
  Check,
  X,
  ChevronDown,
  ChevronUp,
  ShoppingCart,
  Shield,
  Truck,
  Clock,
  Users,
  Zap,
  ArrowRight,
  Flame,
  Crown,
  Award,
} from 'lucide-react';

interface ComparisonPublicPage {
  id: string;
  title: string;
  affiliate_link: string;
  product_data: any;
  generated_content: any;
  hero_image: string | null;
  conversion_boosters?: string[];
}

interface ComparisonPageTemplateProps {
  page: ComparisonPublicPage;
}

export default function ComparisonPageTemplate({ page }: ComparisonPageTemplateProps) {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 47, seconds: 33 });
  const [viewerCount, setViewerCount] = useState(143);

  const { product_data, generated_content, affiliate_link, conversion_boosters } = page;

  // Extract conversion boosters
  const boosters = conversion_boosters || [];
  const hasCountdown = boosters.includes('countdown');
  const hasVisitors = boosters.includes('visitors');
  const hasUrgencyBanner = boosters.includes('urgency-banner');
  const hasTrustBadges = boosters.includes('trust-badges');

  // Extract comparison data
  const comparisonData = product_data as any;
  const product1 = comparisonData?.product1;
  const product2 = comparisonData?.product2;
  const winner = comparisonData?.winner || 1;

  // Extract generated content
  const overview = generated_content?.overview || '';
  const comparisonTable = generated_content?.comparisonTable || [];
  const sections = generated_content?.sections || [];
  const product1Details = generated_content?.product1Details;
  const product2Details = generated_content?.product2Details;
  const finalVerdict = generated_content?.finalVerdict || generated_content?.verdict || '';
  const faq = generated_content?.faq || [];

  // Countdown timer
  useEffect(() => {
    if (!hasCountdown && !hasUrgencyBanner) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 23, minutes: 59, seconds: 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [hasCountdown, hasUrgencyBanner]);

  // Viewer count fluctuation
  useEffect(() => {
    if (!hasVisitors) return;
    const interval = setInterval(() => {
      setViewerCount(prev => Math.max(100, prev + Math.floor(Math.random() * 5) - 2));
    }, 3000);
    return () => clearInterval(interval);
  }, [hasVisitors]);

  // Get affiliate links (stored as comma-separated)
  const affiliateLinks = affiliate_link?.split(',') || [];
  const link1 = product1?.affiliateLink || affiliateLinks[0] || affiliate_link;
  const link2 = product2?.affiliateLink || affiliateLinks[1] || affiliate_link;

  const ProductCTA = ({ 
    link, 
    productName, 
    isWinner 
  }: { 
    link: string; 
    productName: string;
    isWinner: boolean;
  }) => (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className={`group inline-flex items-center justify-center gap-3 text-white font-bold rounded-xl shadow-2xl transition-all duration-300 px-8 py-4 text-lg w-full ${
        isWinner
          ? 'bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-500 shadow-emerald-500/30 hover:shadow-emerald-500/50'
          : 'bg-gradient-to-r from-orange-500 via-orange-600 to-red-500 shadow-orange-500/30 hover:shadow-orange-500/50'
      } hover:scale-[1.02] active:scale-[0.98]`}
    >
      <ShoppingCart className="w-5 h-5" />
      <span>Check {productName} on Amazon</span>
      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
    </a>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
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
              <span>LIMITED TIME PRICES!</span>
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
                <span>{viewerCount}+ viewing now</span>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Hero Section with Both Products */}
      <div className="relative bg-gradient-to-b from-purple-900/20 via-[#0a0a0f] to-[#0a0a0f] pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
          {/* Live Viewers Badge - Only if enabled */}
          {hasVisitors && (
            <div className="flex justify-center mb-8">
              <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-xl border border-purple-500/30 rounded-full px-6 py-3 flex items-center gap-2">
                <div className="relative">
                  <Users className="w-4 h-4 text-purple-400" />
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                </div>
                <span className="text-purple-300 text-sm font-medium">
                  {viewerCount} people viewing this comparison
                </span>
              </div>
            </div>
          )}

          {/* Title */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white text-center mb-8 leading-tight"
          >
            {page.title}
          </motion.h1>

          {/* Overview */}
          {overview && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="max-w-4xl mx-auto mb-12"
            >
              <p className="text-lg text-gray-300 leading-relaxed text-center">
                {overview}
              </p>
            </motion.div>
          )}

          {/* Side-by-Side Product Cards */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Product 1 */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className={`relative bg-gradient-to-br ${
                winner === 1 ? 'from-emerald-900/40 to-teal-900/20 border-emerald-500/50' : 'from-gray-900/40 to-gray-800/20 border-gray-700/50'
              } backdrop-blur-xl border rounded-2xl p-8`}
            >
              {winner === 1 && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-2 rounded-full font-bold text-sm flex items-center gap-2 shadow-lg">
                  <Crown className="w-4 h-4" />
                  OUR TOP PICK
                </div>
              )}
              
              <div className="flex flex-col items-center mb-6">
                <div className="w-48 h-48 relative mb-4 bg-white rounded-xl overflow-hidden">
                  {product1?.image ? (
                    <Image
                      src={product1.image}
                      alt={product1?.name || 'Product 1'}
                      fill
                      className="object-contain p-4"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ShoppingCart className="w-16 h-16 text-gray-300" />
                    </div>
                  )}
                </div>
                <h3 className="text-2xl font-bold text-white text-center mb-2">
                  {product1?.name || 'Product 1'}
                </h3>
                <div className="flex items-center gap-4">
                  <span className="text-3xl font-bold text-emerald-400">{product1?.price || '$0'}</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="text-white font-semibold">{product1?.rating || '4.5'}</span>
                  </div>
                </div>
                <p className="text-gray-400 text-sm mt-1">{(product1?.reviews || 10000).toLocaleString()} reviews</p>
              </div>

              {/* Pros */}
              {(product1Details?.pros || product1?.pros) && (
                <div className="mb-6">
                  <h4 className="text-emerald-400 font-semibold mb-3 flex items-center gap-2">
                    <Check className="w-5 h-5" /> What We Love
                  </h4>
                  <ul className="space-y-2">
                    {(product1Details?.pros || product1?.pros)?.slice(0, 4).map((pro: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2 text-gray-300 text-sm">
                        <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span>{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <ProductCTA 
                link={link1} 
                productName={product1?.name || 'Product 1'}
                isWinner={winner === 1}
              />
            </motion.div>

            {/* Product 2 */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className={`relative bg-gradient-to-br ${
                winner === 2 ? 'from-emerald-900/40 to-teal-900/20 border-emerald-500/50' : 'from-gray-900/40 to-gray-800/20 border-gray-700/50'
              } backdrop-blur-xl border rounded-2xl p-8`}
            >
              {winner === 2 && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-2 rounded-full font-bold text-sm flex items-center gap-2 shadow-lg">
                  <Crown className="w-4 h-4" />
                  OUR TOP PICK
                </div>
              )}
              
              <div className="flex flex-col items-center mb-6">
                <div className="w-48 h-48 relative mb-4 bg-white rounded-xl overflow-hidden">
                  {product2?.image ? (
                    <Image
                      src={product2.image}
                      alt={product2?.name || 'Product 2'}
                      fill
                      className="object-contain p-4"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ShoppingCart className="w-16 h-16 text-gray-300" />
                    </div>
                  )}
                </div>
                <h3 className="text-2xl font-bold text-white text-center mb-2">
                  {product2?.name || 'Product 2'}
                </h3>
                <div className="flex items-center gap-4">
                  <span className="text-3xl font-bold text-emerald-400">{product2?.price || '$0'}</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="text-white font-semibold">{product2?.rating || '4.5'}</span>
                  </div>
                </div>
                <p className="text-gray-400 text-sm mt-1">{(product2?.reviews || 8000).toLocaleString()} reviews</p>
              </div>

              {/* Pros */}
              {(product2Details?.pros || product2?.pros) && (
                <div className="mb-6">
                  <h4 className="text-emerald-400 font-semibold mb-3 flex items-center gap-2">
                    <Check className="w-5 h-5" /> What We Love
                  </h4>
                  <ul className="space-y-2">
                    {(product2Details?.pros || product2?.pros)?.slice(0, 4).map((pro: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2 text-gray-300 text-sm">
                        <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span>{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <ProductCTA 
                link={link2} 
                productName={product2?.name || 'Product 2'}
                isWinner={winner === 2}
              />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Comparison Table */}
      {comparisonTable.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center">
              Quick Comparison
            </h2>
            <div className="bg-gradient-to-br from-gray-900/60 to-gray-800/40 backdrop-blur-xl border border-gray-700/50 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700/50">
                      <th className="text-left p-6 text-gray-400 font-semibold">Feature</th>
                      <th className="text-center p-6 text-purple-400 font-semibold">{product1?.name}</th>
                      <th className="text-center p-6 text-purple-400 font-semibold">{product2?.name}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonTable.map((row: any, idx: number) => (
                      <tr key={idx} className="border-b border-gray-700/30 hover:bg-gray-800/30 transition-colors">
                        <td className="p-6 text-white font-medium">{row.feature}</td>
                        <td className={`p-6 text-center ${row.winner === 1 ? 'text-emerald-400 font-semibold' : 'text-gray-300'}`}>
                          {row.product1}
                        </td>
                        <td className={`p-6 text-center ${row.winner === 2 ? 'text-emerald-400 font-semibold' : 'text-gray-300'}`}>
                          {row.product2}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        </section>
      )}

      {/* Detailed Sections */}
      {sections.length > 0 && (
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {sections.map((section: any, idx: number) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-12"
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
        </section>
      )}

      {/* Pros & Cons Breakdown */}
      {(product1Details || product2Details) && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-gradient-to-br from-gray-900/30 to-transparent">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">
            Detailed Pros & Cons
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Product 1 Details */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-gray-900/60 to-gray-800/40 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-8"
            >
              <h3 className="text-2xl font-bold text-white mb-6">{product1?.name}</h3>
              
              {product1Details?.pros && (
                <div className="mb-6">
                  <h4 className="text-emerald-400 font-semibold mb-3 flex items-center gap-2">
                    <Check className="w-5 h-5" /> Pros
                  </h4>
                  <ul className="space-y-2">
                    {product1Details.pros.map((pro: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2 text-gray-300">
                        <Check className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span>{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {product1Details?.cons && (
                <div className="mb-6">
                  <h4 className="text-red-400 font-semibold mb-3 flex items-center gap-2">
                    <X className="w-5 h-5" /> Cons
                  </h4>
                  <ul className="space-y-2">
                    {product1Details.cons.map((con: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2 text-gray-300">
                        <X className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                        <span>{con}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {product1Details?.bestFor && (
                <div className="bg-emerald-900/20 border border-emerald-500/30 rounded-xl p-4 mb-6">
                  <p className="text-emerald-400 font-semibold mb-2">✓ Best For:</p>
                  <p className="text-gray-300 text-sm">{product1Details.bestFor}</p>
                </div>
              )}

              <ProductCTA link={link1} productName={product1?.name || ''} isWinner={winner === 1} />
            </motion.div>

            {/* Product 2 Details */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-gray-900/60 to-gray-800/40 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-8"
            >
              <h3 className="text-2xl font-bold text-white mb-6">{product2?.name}</h3>
              
              {product2Details?.pros && (
                <div className="mb-6">
                  <h4 className="text-emerald-400 font-semibold mb-3 flex items-center gap-2">
                    <Check className="w-5 h-5" /> Pros
                  </h4>
                  <ul className="space-y-2">
                    {product2Details.pros.map((pro: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2 text-gray-300">
                        <Check className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span>{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {product2Details?.cons && (
                <div className="mb-6">
                  <h4 className="text-red-400 font-semibold mb-3 flex items-center gap-2">
                    <X className="w-5 h-5" /> Cons
                  </h4>
                  <ul className="space-y-2">
                    {product2Details.cons.map((con: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2 text-gray-300">
                        <X className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                        <span>{con}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {product2Details?.bestFor && (
                <div className="bg-emerald-900/20 border border-emerald-500/30 rounded-xl p-4 mb-6">
                  <p className="text-emerald-400 font-semibold mb-2">✓ Best For:</p>
                  <p className="text-gray-300 text-sm">{product2Details.bestFor}</p>
                </div>
              )}

              <ProductCTA link={link2} productName={product2?.name || ''} isWinner={winner === 2} />
            </motion.div>
          </div>
        </section>
      )}

      {/* Final Verdict */}
      {finalVerdict && (
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-purple-900/40 to-pink-900/20 backdrop-blur-xl border border-purple-500/50 rounded-2xl p-8"
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <Award className="w-10 h-10 text-purple-400" />
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                Final Verdict
              </h2>
            </div>
            <div className="prose prose-invert prose-lg max-w-none text-center">
              <p className="text-gray-300 leading-relaxed">
                {finalVerdict}
              </p>
            </div>
          </motion.div>
        </section>
      )}

      {/* FAQ */}
      {faq.length > 0 && (
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
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
        </section>
      )}

      {/* Final CTA Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-orange-600/20 to-red-600/20 backdrop-blur-xl border border-orange-500/30 rounded-2xl p-12 text-center"
        >
          <Zap className="w-12 h-12 text-orange-400 mx-auto mb-4" />
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Make Your Choice?
          </h2>
          <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
            Both products are excellent choices. Click below to check current prices and availability on Amazon.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <ProductCTA link={link1} productName={product1?.name || 'Product 1'} isWinner={winner === 1} />
            <ProductCTA link={link2} productName={product2?.name || 'Product 2'} isWinner={winner === 2} />
          </div>
        </motion.div>
      </section>

      {/* Trust Badges */}
      {hasTrustBadges && (
        <section className="py-8 border-t border-gray-800">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="flex flex-wrap justify-center gap-8 text-gray-400">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-emerald-400" />
                <span>Secure Amazon Checkout</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-blue-400" />
                <span>Fast Prime Shipping</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-purple-400" />
                <span>Trusted Reviews</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-[#050508] border-t border-gray-800 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-gray-500 text-sm mb-4">
            © {new Date().getFullYear()} Product Comparison. All rights reserved.
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
