'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
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
} from 'lucide-react';
import type { Page } from '@/lib/types';

interface ComparisonPageTemplateProps {
  page: Page;
}

export default function ComparisonPageTemplate({ page }: ComparisonPageTemplateProps) {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [viewerCount, setViewerCount] = useState(143);

  const { product_data, generated_content, affiliate_link, hero_image } = page;

  // Extract comparison-specific data
  const product1 = product_data?.product1;
  const product2 = product_data?.product2;
  const winner = product_data?.winner || 1;
  const comparisonTable = generated_content?.comparisonTable || [];
  const sections = generated_content?.sections || [];
  const product1Details = generated_content?.product1Details;
  const product2Details = generated_content?.product2Details;
  const finalVerdict = generated_content?.finalVerdict || '';
  const faq = generated_content?.faq || [];

  // Viewer count fluctuation
  useEffect(() => {
    const interval = setInterval(() => {
      setViewerCount(prev => prev + Math.floor(Math.random() * 5) - 2);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

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
      className={`group inline-flex items-center justify-center gap-3 text-white font-bold rounded-xl shadow-2xl transition-all duration-300 px-8 py-4 text-lg ${
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
      {/* Hero Section with Both Products */}
      <div className="relative bg-gradient-to-b from-purple-900/20 via-[#0a0a0f] to-[#0a0a0f] pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
          {/* Live Viewers Badge */}
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

          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white text-center mb-8 leading-tight">
            {page.title}
          </h1>

          {/* Overview */}
          <div className="max-w-4xl mx-auto mb-12">
            <p className="text-lg text-gray-300 leading-relaxed">
              {generated_content?.overview}
            </p>
          </div>

          {/* Side-by-Side Product Cards */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Product 1 */}
            <div className={`relative bg-gradient-to-br ${
              winner === 1 ? 'from-emerald-900/40 to-teal-900/20' : 'from-gray-900/40 to-gray-800/20'
            } backdrop-blur-xl border ${
              winner === 1 ? 'border-emerald-500/50' : 'border-gray-700/50'
            } rounded-2xl p-8`}>
              {winner === 1 && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-2 rounded-full font-bold text-sm flex items-center gap-2 shadow-lg">
                  <Crown className="w-4 h-4" />
                  WINNER
                </div>
              )}
              
              <div className="flex flex-col items-center mb-6">
                <div className="w-48 h-48 relative mb-4">
                  <Image
                    src={product1?.image || ''}
                    alt={product1?.name || ''}
                    fill
                    className="object-contain"
                    unoptimized
                  />
                </div>
                <h3 className="text-2xl font-bold text-white text-center mb-2">
                  {product1?.name}
                </h3>
                <div className="flex items-center gap-4">
                  <span className="text-3xl font-bold text-emerald-400">{product1?.price}</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="text-white font-semibold">{product1?.rating}</span>
                  </div>
                </div>
                <p className="text-gray-400 text-sm mt-1">{product1?.reviews?.toLocaleString()} reviews</p>
              </div>

              <ProductCTA 
                link={product1?.affiliateLink || affiliate_link} 
                productName={product1?.name || ''}
                isWinner={winner === 1}
              />
            </div>

            {/* Product 2 */}
            <div className={`relative bg-gradient-to-br ${
              winner === 2 ? 'from-emerald-900/40 to-teal-900/20' : 'from-gray-900/40 to-gray-800/20'
            } backdrop-blur-xl border ${
              winner === 2 ? 'border-emerald-500/50' : 'border-gray-700/50'
            } rounded-2xl p-8`}>
              {winner === 2 && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-2 rounded-full font-bold text-sm flex items-center gap-2 shadow-lg">
                  <Crown className="w-4 h-4" />
                  WINNER
                </div>
              )}
              
              <div className="flex flex-col items-center mb-6">
                <div className="w-48 h-48 relative mb-4">
                  <Image
                    src={product2?.image || ''}
                    alt={product2?.name || ''}
                    fill
                    className="object-contain"
                    unoptimized
                  />
                </div>
                <h3 className="text-2xl font-bold text-white text-center mb-2">
                  {product2?.name}
                </h3>
                <div className="flex items-center gap-4">
                  <span className="text-3xl font-bold text-emerald-400">{product2?.price}</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="text-white font-semibold">{product2?.rating}</span>
                  </div>
                </div>
                <p className="text-gray-400 text-sm mt-1">{product2?.reviews?.toLocaleString()} reviews</p>
              </div>

              <ProductCTA 
                link={product2?.affiliateLink || affiliate_link} 
                productName={product2?.name || ''}
                isWinner={winner === 2}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Table */}
      {comparisonTable.length > 0 && (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
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
        </div>
      )}

      {/* Detailed Sections */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {sections.map((section: any, idx: number) => (
          <div key={idx} className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
              {section.title}
            </h2>
            <div className="prose prose-invert prose-lg max-w-none">
              <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                {section.content}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Pros & Cons */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-gradient-to-br from-gray-900/30 to-transparent">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">
          Pros & Cons Breakdown
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          {/* Product 1 */}
          <div className="bg-gradient-to-br from-gray-900/60 to-gray-800/40 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-6">{product1?.name}</h3>
            
            <div className="mb-6">
              <h4 className="text-emerald-400 font-semibold mb-3 flex items-center gap-2">
                <Check className="w-5 h-5" />
                Pros
              </h4>
              <ul className="space-y-2">
                {product1Details?.pros?.map((pro: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2 text-gray-300">
                    <Check className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>{pro}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mb-6">
              <h4 className="text-red-400 font-semibold mb-3 flex items-center gap-2">
                <X className="w-5 h-5" />
                Cons
              </h4>
              <ul className="space-y-2">
                {product1Details?.cons?.map((con: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2 text-gray-300">
                    <X className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <span>{con}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-emerald-900/20 border border-emerald-500/30 rounded-xl p-4 mb-6">
              <p className="text-emerald-400 font-semibold mb-2">Best For:</p>
              <p className="text-gray-300 text-sm">{product1Details?.bestFor}</p>
            </div>

            <ProductCTA 
              link={product1?.affiliateLink || affiliate_link} 
              productName={product1?.name || ''}
              isWinner={winner === 1}
            />
          </div>

          {/* Product 2 */}
          <div className="bg-gradient-to-br from-gray-900/60 to-gray-800/40 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-6">{product2?.name}</h3>
            
            <div className="mb-6">
              <h4 className="text-emerald-400 font-semibold mb-3 flex items-center gap-2">
                <Check className="w-5 h-5" />
                Pros
              </h4>
              <ul className="space-y-2">
                {product2Details?.pros?.map((pro: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2 text-gray-300">
                    <Check className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>{pro}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mb-6">
              <h4 className="text-red-400 font-semibold mb-3 flex items-center gap-2">
                <X className="w-5 h-5" />
                Cons
              </h4>
              <ul className="space-y-2">
                {product2Details?.cons?.map((con: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2 text-gray-300">
                    <X className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <span>{con}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-emerald-900/20 border border-emerald-500/30 rounded-xl p-4 mb-6">
              <p className="text-emerald-400 font-semibold mb-2">Best For:</p>
              <p className="text-gray-300 text-sm">{product2Details?.bestFor}</p>
            </div>

            <ProductCTA 
              link={product2?.affiliateLink || affiliate_link} 
              productName={product2?.name || ''}
              isWinner={winner === 2}
            />
          </div>
        </div>
      </div>

      {/* Final Verdict */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/20 backdrop-blur-xl border border-purple-500/50 rounded-2xl p-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 text-center">
            Final Verdict
          </h2>
          <div className="prose prose-invert prose-lg max-w-none">
            <p className="text-gray-300 leading-relaxed whitespace-pre-line">
              {finalVerdict}
            </p>
          </div>
        </div>
      </div>

      {/* FAQ */}
      {faq.length > 0 && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faq.map((item: any, idx: number) => (
              <div
                key={idx}
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
                {expandedFaq === idx && (
                  <div className="px-6 pb-6">
                    <p className="text-gray-300 leading-relaxed">{item.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Final CTA Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-r from-orange-600/20 to-red-600/20 backdrop-blur-xl border border-orange-500/30 rounded-2xl p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Make Your Choice?
          </h2>
          <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
            Both products are excellent choices. Click below to check current prices and availability on Amazon.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <ProductCTA 
              link={product1?.affiliateLink || affiliate_link} 
              productName={product1?.name || ''}
              isWinner={winner === 1}
            />
            <ProductCTA 
              link={product2?.affiliateLink || affiliate_link} 
              productName={product2?.name || ''}
              isWinner={winner === 2}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
