'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CONVERSION_BOOSTERS = [
  { id: 'countdown', name: 'Countdown Timer', description: 'Creates urgency' },
  { id: 'visitors', name: 'Live Visitors Counter', description: 'Shows viewers' },
  { id: 'recent-sales', name: 'Recent Purchase Alerts', description: 'Displays purchases' },
  { id: 'urgency', name: 'Urgency Banner', description: 'Stock/sale alerts' },
  { id: 'trust-badges', name: 'Trust Badges', description: 'Security badges' },
  { id: 'exit-popup', name: 'Exit Intent Message', description: 'Last chance offer' },
];

interface MultiProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (data: {
    affiliateLinks?: string[];
    asin?: string;
    affiliateLink1?: string;
    boosters: string[];
  }) => void;
  title: string;
  type: 'bestof' | 'seasonal';
  productNames?: string[];
  productName?: string;
  loading?: boolean;
}

export default function MultiProductModal({
  isOpen,
  onClose,
  onGenerate,
  title,
  type,
  productNames = [],
  productName = '',
  loading = false,
}: MultiProductModalProps) {
  const [affiliateLinks, setAffiliateLinks] = useState<string[]>(
    type === 'bestof' ? new Array(productNames.length).fill('') : ['']
  );
  const [asin, setAsin] = useState('');
  const [selectedBoosters, setSelectedBoosters] = useState<string[]>([]);
  const [error, setError] = useState('');

  const toggleBooster = (boosterId: string) => {
    setSelectedBoosters(prev =>
      prev.includes(boosterId) ? prev.filter(id => id !== boosterId) : [...prev, boosterId]
    );
  };

  const updateAffiliateLink = (index: number, value: string) => {
    const newLinks = [...affiliateLinks];
    newLinks[index] = value;
    setAffiliateLinks(newLinks);
  };

  const handleGenerate = () => {
    setError('');

    if (type === 'bestof') {
      const emptyLinks = affiliateLinks.filter(link => !link.trim());
      if (emptyLinks.length > 0) {
        setError(`Please enter all ${productNames.length} affiliate links`);
        return;
      }

      const urlPattern = /^https?:\/\/.+/;
      const invalidLinks = affiliateLinks.filter(link => !urlPattern.test(link));
      if (invalidLinks.length > 0) {
        setError('All links must be valid URLs starting with http:// or https://');
        return;
      }

      onGenerate({ affiliateLinks, boosters: selectedBoosters });
    } else if (type === 'seasonal') {
      if (!asin.trim()) {
        setError('Please enter the product ASIN');
        return;
      }
      if (!affiliateLinks[0].trim()) {
        setError('Please enter your affiliate link');
        return;
      }

      const urlPattern = /^https?:\/\/.+/;
      if (!urlPattern.test(affiliateLinks[0])) {
        setError('Please enter a valid URL starting with http:// or https://');
        return;
      }

      onGenerate({ 
        asin, 
        affiliateLink1: affiliateLinks[0], 
        boosters: selectedBoosters 
      });
    }
  };

  const handleClose = () => {
    if (!loading) {
      setAffiliateLinks(type === 'bestof' ? new Array(productNames.length).fill('') : ['']);
      setAsin('');
      setSelectedBoosters([]);
      setError('');
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999]"
          />

          {/* Modal - SOLID WHITE for readability */}
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl w-full max-w-2xl my-8 shadow-2xl border-4 border-purple-600"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 rounded-t-2xl">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h2 className="text-3xl font-bold text-white mb-2">
                      🚀 Generate Profit Page
                    </h2>
                    <p className="text-white/90 text-lg">{title}</p>
                  </div>
                  <button
                    onClick={handleClose}
                    disabled={loading}
                    className="flex-shrink-0 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors disabled:opacity-50 text-white"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-8 space-y-6 max-h-[60vh] overflow-y-auto">
                {/* Best-Of: Multiple Affiliate Links */}
                {type === 'bestof' && (
                  <div className="space-y-5">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                        <span className="text-3xl">🔗</span>
                        Add Affiliate Links for All {productNames.length} Products
                      </h3>
                      <p className="text-lg text-gray-600">
                        You earn commissions on ALL products in the list!
                      </p>
                    </div>

                    {productNames.map((name, index) => (
                      <div key={index}>
                        <label className="block text-lg font-bold text-gray-800 mb-2">
                          #{index + 1} - {name}
                        </label>
                        <input
                          type="url"
                          value={affiliateLinks[index] || ''}
                          onChange={(e) => updateAffiliateLink(index, e.target.value)}
                          placeholder="https://www.amazon.com/dp/ASIN?tag=your-tag-20"
                          disabled={loading}
                          className="w-full px-5 py-4 text-lg border-3 border-gray-300 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-200 outline-none transition-all bg-gray-50 text-gray-900"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Seasonal: ASIN + Affiliate Link */}
                {type === 'seasonal' && (
                  <div className="space-y-5">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                        <span className="text-3xl">🔗</span>
                        Product Details
                      </h3>
                      <p className="text-lg text-gray-600">For: {productName}</p>
                    </div>

                    <div>
                      <label className="block text-lg font-bold text-gray-800 mb-2">
                        Product ASIN (from Amazon)
                      </label>
                      <input
                        value={asin}
                        onChange={(e) => setAsin(e.target.value)}
                        placeholder="B08N5WRWNW"
                        disabled={loading}
                        className="w-full px-5 py-4 text-lg border-3 border-gray-300 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-200 outline-none transition-all bg-gray-50 text-gray-900"
                      />
                      <p className="text-base text-gray-500 mt-2">
                        Find the ASIN in the product details section on Amazon
                      </p>
                    </div>

                    <div>
                      <label className="block text-lg font-bold text-gray-800 mb-2">
                        Your Affiliate Link
                      </label>
                      <input
                        type="url"
                        value={affiliateLinks[0]}
                        onChange={(e) => updateAffiliateLink(0, e.target.value)}
                        placeholder="https://www.amazon.com/dp/ASIN?tag=your-tag-20"
                        disabled={loading}
                        className="w-full px-5 py-4 text-lg border-3 border-gray-300 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-200 outline-none transition-all bg-gray-50 text-gray-900"
                      />
                    </div>
                  </div>
                )}

                {/* Conversion Boosters */}
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                    <span className="text-3xl">⚡</span>
                    Conversion Boosters (Optional)
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {CONVERSION_BOOSTERS.map((booster) => (
                      <button
                        key={booster.id}
                        type="button"
                        onClick={() => toggleBooster(booster.id)}
                        disabled={loading}
                        className={`text-left p-4 rounded-xl border-3 transition-all cursor-pointer ${
                          selectedBoosters.includes(booster.id)
                            ? 'border-purple-500 bg-purple-50 shadow-lg'
                            : 'border-gray-200 bg-gray-50 hover:border-purple-300'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`w-6 h-6 rounded border-2 flex items-center justify-center ${
                              selectedBoosters.includes(booster.id)
                                ? 'border-purple-500 bg-purple-500'
                                : 'border-gray-300'
                            }`}
                          >
                            {selectedBoosters.includes(booster.id) && (
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4">
                                <polyline points="20,6 9,17 4,12" />
                              </svg>
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="font-bold text-gray-900 text-base">{booster.name}</div>
                            <div className="text-sm text-gray-600">{booster.description}</div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <div className="bg-red-50 border-2 border-red-300 rounded-xl p-4">
                    <p className="text-lg text-red-700 font-bold">{error}</p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-6 bg-gray-50 rounded-b-2xl border-t-2 border-gray-200 flex gap-4">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={loading}
                  className="flex-1 py-4 px-6 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold text-xl rounded-xl transition-all disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleGenerate}
                  disabled={loading}
                  className="flex-1 py-4 px-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold text-xl rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-6 w-6 border-3 border-white border-t-transparent" />
                      Generating...
                    </>
                  ) : (
                    <>🚀 Generate Page</>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
