'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from './Button';
import Input from './Input';
import Confetti from './Confetti';

interface DeployModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    title: string;
    asin: string;
    image?: string;
    price?: string;
    niche?: string;
    generatedContent?: Record<string, unknown>;
    productData?: Record<string, unknown>;
  };
  onDeploy: (affiliateLink: string) => Promise<string>; // Returns the page slug
}

const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const RocketIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
    <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22,4 12,14.01 9,11.01" />
  </svg>
);

export default function DeployModal({ isOpen, onClose, product, onDeploy }: DeployModalProps) {
  const [affiliateLink, setAffiliateLink] = useState('');
  const [deploying, setDeploying] = useState(false);
  const [deployed, setDeployed] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [error, setError] = useState('');
  const [createdPageSlug, setCreatedPageSlug] = useState('');

  const handleDeploy = async () => {
    if (!affiliateLink.trim()) {
      setError('Please enter your affiliate link');
      return;
    }

    setError('');
    setDeploying(true);

    try {
      const slug = await onDeploy(affiliateLink);
      setCreatedPageSlug(slug);
      setDeployed(true);
      setShowConfetti(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to deploy');
    } finally {
      setDeploying(false);
    }
  };

  const handleClose = () => {
    setAffiliateLink('');
    setDeployed(false);
    setShowConfetti(false);
    setError('');
    setCreatedPageSlug('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <Confetti isActive={showConfetti} onComplete={() => setShowConfetti(false)} />

          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-navy-950/90 backdrop-blur-sm z-[90]"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 flex items-center justify-center z-[95] p-4"
          >
            <div className="w-full max-w-lg bg-gradient-to-b from-navy-800 to-navy-900 rounded-3xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="p-6 border-b border-navy-700 flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">
                  {deployed ? '🎉 Page Deployed!' : '🚀 Deploy This Page'}
                </h2>
                <button
                  onClick={handleClose}
                  className="p-2 text-navy-400 hover:text-white transition-colors rounded-lg hover:bg-navy-700"
                >
                  <CloseIcon />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                {!deployed ? (
                  <>
                    {/* Product Preview */}
                    <div className="flex items-center gap-4 p-4 bg-navy-800/50 rounded-xl mb-6">
                      {product.image && (
                        <img
                          src={product.image}
                          alt={product.title}
                          className="w-20 h-20 object-contain bg-white rounded-lg"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gold-400 font-bold uppercase mb-1">
                          {product.niche}
                        </p>
                        <h3 className="font-semibold text-white line-clamp-2">
                          {product.title}
                        </h3>
                        {product.price && (
                          <p className="text-cash-green font-bold mt-1">{product.price}</p>
                        )}
                      </div>
                    </div>

                    {/* Affiliate Link Input */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-white mb-2">
                          Your Amazon Affiliate Link
                        </label>
                        <Input
                          placeholder="https://amzn.to/your-affiliate-link"
                          value={affiliateLink}
                          onChange={(e) => setAffiliateLink(e.target.value)}
                          className="text-base"
                        />
                        <p className="text-xs text-navy-400 mt-2">
                          💡 Get your affiliate link from Amazon Associates for this product (ASIN: {product.asin})
                        </p>
                      </div>

                      {error && (
                        <p className="text-red-400 text-sm">{error}</p>
                      )}

                      <Button
                        onClick={handleDeploy}
                        isLoading={deploying}
                        disabled={deploying}
                        className="w-full btn-large"
                      >
                        <RocketIcon />
                        <span>Deploy to My Pages</span>
                      </Button>
                    </div>

                    {/* What happens */}
                    <div className="mt-6 p-4 bg-cash-green/10 border border-cash-green/20 rounded-xl">
                      <p className="text-sm text-cash-green font-medium mb-2">What happens next:</p>
                      <ul className="text-sm text-navy-300 space-y-1">
                        <li>✓ Page is copied to your account</li>
                        <li>✓ Your affiliate link is added</li>
                        <li>✓ Ready to share immediately!</li>
                      </ul>
                    </div>
                  </>
                ) : (
                  /* Success State */
                  <div className="text-center py-6">
                    <div className="w-24 h-24 bg-cash-green/20 rounded-full flex items-center justify-center mx-auto mb-6 text-cash-green">
                      <CheckCircleIcon />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">
                      Your Page is Ready!
                    </h3>
                    <p className="text-navy-300 mb-6">
                      The page has been added to your account. Start sharing it now to earn commissions!
                    </p>
                    <div className="flex gap-3">
                      <Button
                        onClick={() => window.open(`/p/${createdPageSlug}`, '_blank')}
                        className="flex-1"
                      >
                        👁️ View Page
                      </Button>
                      <Button
                        onClick={() => window.location.href = '/app/traffic'}
                        variant="outline"
                        className="flex-1"
                      >
                        Share Now
                      </Button>
                    </div>
                    <button
                      onClick={handleClose}
                      className="mt-4 text-sm text-navy-400 hover:text-white transition-colors"
                    >
                      ← Back to Gold Package
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
