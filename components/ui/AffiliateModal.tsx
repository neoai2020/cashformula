'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from './Button';
import Input from './Input';

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
  productName2?: string; // Optional for single product pages
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

const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

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

    // Validation
    if (!affiliateLink1.trim()) {
      setError(`Please enter your affiliate link for ${productName1}`);
      return;
    }

    if (type === 'comparison' && !affiliateLink2.trim()) {
      setError(`Please enter your affiliate link for ${productName2}`);
      return;
    }

    // Validate URL format (basic)
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
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-deep-space-black/80 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="glass-card rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto pointer-events-auto border border-purple-primary/30"
            >
              {/* Header */}
              <div className="sticky top-0 glass-card border-b border-purple-primary/20 p-6 flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">
                    Generate Profit Page
                  </h2>
                  <p className="text-purple-primary/70 text-sm">{title}</p>
                </div>
                <button
                  onClick={handleClose}
                  disabled={loading}
                  className="p-2 hover:bg-purple-primary/10 rounded-lg transition-colors disabled:opacity-50"
                >
                  <CloseIcon />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Affiliate Links Section */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                      <span className="text-2xl">🔗</span>
                      Add Your Affiliate Links
                    </h3>
                    <p className="text-sm text-purple-primary/60">
                      Add your Amazon affiliate links to earn commissions when people buy
                    </p>
                  </div>

                  {/* Product 1 Link */}
                  <div>
                    <label className="block text-sm font-bold text-purple-primary mb-2">
                      {productName1} Affiliate Link
                    </label>
                    <Input
                      value={affiliateLink1}
                      onChange={(e) => setAffiliateLink1(e.target.value)}
                      placeholder="https://www.amazon.com/dp/ASIN?tag=your-tag-20"
                      disabled={loading}
                      className="w-full"
                    />
                  </div>

                  {/* Product 2 Link (for comparisons) */}
                  {type === 'comparison' && productName2 && (
                    <div>
                      <label className="block text-sm font-bold text-purple-primary mb-2">
                        {productName2} Affiliate Link
                      </label>
                      <Input
                        value={affiliateLink2}
                        onChange={(e) => setAffiliateLink2(e.target.value)}
                        placeholder="https://www.amazon.com/dp/ASIN?tag=your-tag-20"
                        disabled={loading}
                        className="w-full"
                      />
                    </div>
                  )}

                  {/* Helper Text */}
                  <div className="bg-teal-primary/10 border border-teal-primary/30 rounded-lg p-4">
                    <p className="text-xs text-teal-primary/90 font-bold mb-1">
                      💡 HOW TO GET YOUR AFFILIATE LINK:
                    </p>
                    <ol className="text-xs text-purple-primary/70 space-y-1 list-decimal list-inside">
                      <li>Go to Amazon Associates and search for the product</li>
                      <li>Click &quot;Get Link&quot; and copy the text link</li>
                      <li>Paste it above</li>
                      <li>Your tag will automatically be included in the link</li>
                    </ol>
                  </div>
                </div>

                {/* Conversion Boosters Section */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                      <span className="text-2xl">⚡</span>
                      Conversion Boosters (Optional)
                    </h3>
                    <p className="text-sm text-purple-primary/60">
                      Add these elements to increase your page&apos;s conversion rate
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {CONVERSION_BOOSTERS.map((booster) => (
                      <button
                        key={booster.id}
                        onClick={() => toggleBooster(booster.id)}
                        disabled={loading}
                        className={`text-left p-4 rounded-lg border-2 transition-all ${
                          selectedBoosters.includes(booster.id)
                            ? 'border-purple-primary bg-purple-primary/10'
                            : 'border-purple-primary/20 bg-purple-primary/5 hover:border-purple-primary/40'
                        } disabled:opacity-50`}
                      >
                        <div className="flex items-start gap-3">
                          {/* Checkbox */}
                          <div
                            className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                              selectedBoosters.includes(booster.id)
                                ? 'border-purple-primary bg-purple-primary'
                                : 'border-purple-primary/40'
                            }`}
                          >
                            {selectedBoosters.includes(booster.id) && (
                              <svg
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="white"
                                strokeWidth="3"
                              >
                                <polyline points="20,6 9,17 4,12" />
                              </svg>
                            )}
                          </div>

                          {/* Content */}
                          <div className="flex-1">
                            <div className="font-bold text-white text-sm mb-1">
                              {booster.name}
                            </div>
                            <div className="text-xs text-purple-primary/60">
                              {booster.description}
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="bg-purple-primary/10 border border-purple-primary/30 rounded-lg p-4">
                    <p className="text-xs text-purple-primary/90">
                      <span className="font-bold">Selected: {selectedBoosters.length}/6 boosters.</span>
                      {' '}These will be automatically added to your profit page to help increase conversions.
                    </p>
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="bg-rose-primary/10 border border-rose-primary/30 rounded-lg p-4">
                    <p className="text-sm text-rose-primary font-bold">{error}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={handleClose}
                    disabled={loading}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleGenerate}
                    disabled={loading}
                    className="flex-1"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <span className="text-xl">🚀</span>
                        Generate Page
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
