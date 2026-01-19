'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ConversionBooster {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
}

interface AffiliateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (data: {
    affiliateLink1: string;
    affiliateLink2?: string;
    boosters: string[];
  }) => void;
  title: string;
  productName1: string;
  productName2?: string;
  type: 'single' | 'comparison';
  loading?: boolean;
}

const CONVERSION_BOOSTERS: ConversionBooster[] = [
  {
    id: 'countdown',
    name: 'Countdown Timer',
    description: 'Creates urgency with a price expiration timer',
    enabled: false,
  },
  {
    id: 'visitors',
    name: 'Live Visitors Counter',
    description: 'Shows how many people are viewing right now',
    enabled: false,
  },
  {
    id: 'recent-sales',
    name: 'Recent Purchase Alerts',
    description: 'Displays recent customer purchases',
    enabled: false,
  },
  {
    id: 'urgency',
    name: 'Urgency Banner',
    description: 'Eye-catching stock/sale alerts',
    enabled: false,
  },
  {
    id: 'trust-badges',
    name: 'Trust Badges',
    description: 'Verified purchase & security badges',
    enabled: false,
  },
  {
    id: 'exit-popup',
    name: 'Exit Intent Message',
    description: 'Last chance offer when leaving',
    enabled: false,
  },
];

export default function AffiliateModal({
  isOpen,
  onClose,
  onGenerate,
  title,
  productName1,
  productName2,
  type,
  loading = false,
}: AffiliateModalProps) {
  const [affiliateLink1, setAffiliateLink1] = useState('');
  const [affiliateLink2, setAffiliateLink2] = useState('');
  const [selectedBoosters, setSelectedBoosters] = useState<string[]>([]);
  const [error, setError] = useState('');

  const toggleBooster = (boosterId: string) => {
    setSelectedBoosters(prev =>
      prev.includes(boosterId)
        ? prev.filter(id => id !== boosterId)
        : [...prev, boosterId]
    );
  };

  const handleGenerate = () => {
    setError('');

    if (!affiliateLink1.trim()) {
      setError(`Please enter your affiliate link for ${productName1}`);
      return;
    }

    if (type === 'comparison' && !affiliateLink2.trim()) {
      setError(`Please enter your affiliate link for ${productName2}`);
      return;
    }

    const urlPattern = /^https?:\/\/.+/;
    if (!urlPattern.test(affiliateLink1)) {
      setError('Please enter a valid URL starting with http:// or https://');
      return;
    }

    if (type === 'comparison' && !urlPattern.test(affiliateLink2)) {
      setError('Please enter a valid URL for the second product');
      return;
    }

    onGenerate({
      affiliateLink1,
      affiliateLink2: type === 'comparison' ? affiliateLink2 : undefined,
      boosters: selectedBoosters,
    });
  };

  const handleClose = () => {
    if (!loading) {
      setAffiliateLink1('');
      setAffiliateLink2('');
      setSelectedBoosters([]);
      setError('');
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop - darker for better contrast */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999]"
          />

          {/* Modal - SOLID WHITE BACKGROUND for readability */}
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
                    aria-label="Close"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Content - White background with dark text */}
              <div className="p-8 space-y-8 max-h-[60vh] overflow-y-auto">
                {/* Affiliate Links Section */}
                <div className="space-y-5">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                      <span className="text-3xl">🔗</span>
                      Add Your Affiliate Links
                    </h3>
                    <p className="text-lg text-gray-600">
                      Add your Amazon affiliate links to earn commissions when people buy
                    </p>
                  </div>

                  {/* Product 1 Link */}
                  <div>
                    <label className="block text-lg font-bold text-gray-800 mb-3">
                      {productName1} Affiliate Link
                    </label>
                    <input
                      type="url"
                      value={affiliateLink1}
                      onChange={(e) => setAffiliateLink1(e.target.value)}
                      placeholder="https://www.amazon.com/dp/ASIN?tag=your-tag-20"
                      disabled={loading}
                      className="w-full px-5 py-4 text-lg border-3 border-gray-300 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-200 outline-none transition-all bg-gray-50 text-gray-900 placeholder-gray-400"
                    />
                  </div>

                  {/* Product 2 Link (for comparisons) */}
                  {type === 'comparison' && productName2 && (
                    <div>
                      <label className="block text-lg font-bold text-gray-800 mb-3">
                        {productName2} Affiliate Link
                      </label>
                      <input
                        type="url"
                        value={affiliateLink2}
                        onChange={(e) => setAffiliateLink2(e.target.value)}
                        placeholder="https://www.amazon.com/dp/ASIN?tag=your-tag-20"
                        disabled={loading}
                        className="w-full px-5 py-4 text-lg border-3 border-gray-300 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-200 outline-none transition-all bg-gray-50 text-gray-900 placeholder-gray-400"
                      />
                    </div>
                  )}

                  {/* Helper Text */}
                  <div className="bg-green-50 border-2 border-green-300 rounded-xl p-5">
                    <p className="text-base font-bold text-green-800 mb-3">
                      💡 HOW TO GET YOUR AFFILIATE LINK:
                    </p>
                    <ol className="text-base text-green-700 space-y-2 list-decimal list-inside">
                      <li>Go to Amazon Associates and search for the product</li>
                      <li>Click &quot;Get Link&quot; and copy the text link</li>
                      <li>Paste it above</li>
                    </ol>
                  </div>
                </div>

                {/* Conversion Boosters Section */}
                <div className="space-y-5">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                      <span className="text-3xl">⚡</span>
                      Conversion Boosters (Optional)
                    </h3>
                    <p className="text-lg text-gray-600">
                      Add these elements to increase your page&apos;s conversion rate
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {CONVERSION_BOOSTERS.map((booster) => (
                      <button
                        key={booster.id}
                        type="button"
                        onClick={() => toggleBooster(booster.id)}
                        disabled={loading}
                        className={`text-left p-5 rounded-xl border-3 transition-all cursor-pointer ${
                          selectedBoosters.includes(booster.id)
                            ? 'border-purple-500 bg-purple-50 shadow-lg'
                            : 'border-gray-200 bg-gray-50 hover:border-purple-300 hover:bg-purple-50/50'
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        <div className="flex items-start gap-4">
                          {/* Checkbox */}
                          <div
                            className={`flex-shrink-0 w-7 h-7 rounded-lg border-3 flex items-center justify-center transition-all ${
                              selectedBoosters.includes(booster.id)
                                ? 'border-purple-500 bg-purple-500'
                                : 'border-gray-300 bg-white'
                            }`}
                          >
                            {selectedBoosters.includes(booster.id) && (
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4">
                                <polyline points="20,6 9,17 4,12" />
                              </svg>
                            )}
                          </div>

                          {/* Content */}
                          <div className="flex-1">
                            <div className="font-bold text-gray-900 text-lg mb-1">
                              {booster.name}
                            </div>
                            <div className="text-base text-gray-600">
                              {booster.description}
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 border-2 border-red-300 rounded-xl p-5">
                    <p className="text-lg text-red-700 font-bold">{error}</p>
                  </div>
                )}
              </div>

              {/* Footer - Actions */}
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
                    <>
                      <span className="text-2xl">🚀</span>
                      Generate Page
                    </>
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
