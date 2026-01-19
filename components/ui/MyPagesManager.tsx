'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  ExternalLink,
  Settings,
  Clock,
  Users,
  Flame,
  Shield,
  AlertCircle,
  Check,
  X,
  Loader2,
  ChevronDown,
  ChevronUp,
  Copy,
  Trash2,
} from 'lucide-react';

interface Page {
  id: string;
  title: string;
  public_slug: string;
  page_type: string;
  conversion_boosters: string[];
  created_at: string;
  hero_image: string | null;
}

const CONVERSION_BOOSTERS = [
  { id: 'countdown', name: 'Countdown Timer', icon: Clock, description: 'Creates urgency with a ticking clock' },
  { id: 'visitors', name: 'Live Visitors', icon: Users, description: 'Shows how many people are viewing' },
  { id: 'urgency-banner', name: 'Urgency Banner', icon: Flame, description: 'Sticky banner at top of page' },
  { id: 'trust-badges', name: 'Trust Badges', icon: Shield, description: 'Secure checkout & shipping badges' },
  { id: 'recent-sales', name: 'Recent Sales Popups', icon: AlertCircle, description: 'Shows recent purchase notifications' },
  { id: 'exit-popup', name: 'Exit Intent Popup', icon: X, description: 'Catches visitors before they leave' },
];

export default function MyPagesManager() {
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedPage, setExpandedPage] = useState<string | null>(null);
  const [saving, setSaving] = useState<string | null>(null);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  // Fetch user's pages
  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/pages/update');
      const data = await response.json();
      
      if (data.success) {
        setPages(data.pages);
      } else {
        setError(data.error || 'Failed to load pages');
      }
    } catch (err) {
      setError('Failed to load pages');
    } finally {
      setLoading(false);
    }
  };

  const toggleBooster = async (pageId: string, boosterId: string) => {
    const page = pages.find(p => p.id === pageId);
    if (!page) return;

    const currentBoosters = page.conversion_boosters || [];
    const newBoosters = currentBoosters.includes(boosterId)
      ? currentBoosters.filter(b => b !== boosterId)
      : [...currentBoosters, boosterId];

    // Optimistic update
    setPages(prev => prev.map(p => 
      p.id === pageId ? { ...p, conversion_boosters: newBoosters } : p
    ));

    setSaving(pageId);

    try {
      const response = await fetch('/api/pages/update', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pageId, conversion_boosters: newBoosters }),
      });

      const data = await response.json();
      
      if (!data.success) {
        // Revert on error
        setPages(prev => prev.map(p => 
          p.id === pageId ? { ...p, conversion_boosters: currentBoosters } : p
        ));
        setError(data.error || 'Failed to update');
      }
    } catch (err) {
      // Revert on error
      setPages(prev => prev.map(p => 
        p.id === pageId ? { ...p, conversion_boosters: currentBoosters } : p
      ));
      setError('Failed to update boosters');
    } finally {
      setSaving(null);
    }
  };

  const enableAllBoosters = async (pageId: string) => {
    const allBoosterIds = CONVERSION_BOOSTERS.map(b => b.id);
    
    setPages(prev => prev.map(p => 
      p.id === pageId ? { ...p, conversion_boosters: allBoosterIds } : p
    ));

    setSaving(pageId);

    try {
      const response = await fetch('/api/pages/update', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pageId, conversion_boosters: allBoosterIds }),
      });

      const data = await response.json();
      if (!data.success) {
        fetchPages(); // Refresh on error
      }
    } catch {
      fetchPages();
    } finally {
      setSaving(null);
    }
  };

  const copyPageUrl = (slug: string) => {
    const url = `${window.location.origin}/p/${slug}`;
    navigator.clipboard.writeText(url);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2000);
  };

  const getPageTypeLabel = (type: string) => {
    switch (type) {
      case 'comparison': return '⚔️ Comparison';
      case 'bestof': return '🏆 Best-Of List';
      case 'seasonal': return '📅 Seasonal';
      default: return '📄 Product Review';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
        <span className="ml-3 text-gray-400">Loading your pages...</span>
      </div>
    );
  }

  if (pages.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">No Pages Yet</h3>
        <p className="text-gray-400">
          Generate your first profit page using the features above, then manage it here!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-rose-400" />
          <span className="text-rose-300">{error}</span>
          <button onClick={() => setError('')} className="ml-auto text-rose-400 hover:text-rose-300">
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {pages.map((page) => (
        <motion.div
          key={page.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-gray-900/60 to-gray-800/40 border border-gray-700/50 rounded-2xl overflow-hidden"
        >
          {/* Page Header */}
          <div 
            className="p-5 flex items-center gap-4 cursor-pointer hover:bg-gray-800/30 transition-colors"
            onClick={() => setExpandedPage(expandedPage === page.id ? null : page.id)}
          >
            {/* Page Image/Icon */}
            <div className="w-16 h-16 rounded-xl bg-gray-800 flex-shrink-0 overflow-hidden">
              {page.hero_image ? (
                <img src={page.hero_image} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <FileText className="w-8 h-8 text-gray-600" />
                </div>
              )}
            </div>

            {/* Page Info */}
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-white truncate">{page.title}</h3>
              <div className="flex items-center gap-3 text-sm text-gray-400 mt-1">
                <span>{getPageTypeLabel(page.page_type)}</span>
                <span>•</span>
                <span>{new Date(page.created_at).toLocaleDateString()}</span>
                <span>•</span>
                <span className={page.conversion_boosters?.length > 0 ? 'text-emerald-400' : 'text-gray-500'}>
                  {page.conversion_boosters?.length || 0} boosters active
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => { e.stopPropagation(); copyPageUrl(page.public_slug); }}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                title="Copy page URL"
              >
                {copiedSlug === page.public_slug ? (
                  <Check className="w-5 h-5 text-emerald-400" />
                ) : (
                  <Copy className="w-5 h-5" />
                )}
              </button>
              <a
                href={`/p/${page.public_slug}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                title="View page"
              >
                <ExternalLink className="w-5 h-5" />
              </a>
              {expandedPage === page.id ? (
                <ChevronUp className="w-5 h-5 text-purple-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </div>
          </div>

          {/* Expanded Content */}
          <AnimatePresence>
            {expandedPage === page.id && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="p-5 pt-0 border-t border-gray-700/50">
                  {/* Enable All Button */}
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-white flex items-center gap-2">
                      <Settings className="w-5 h-5 text-purple-400" />
                      Conversion Boosters
                    </h4>
                    <button
                      onClick={() => enableAllBoosters(page.id)}
                      disabled={saving === page.id}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
                    >
                      {saving === page.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        'Enable All'
                      )}
                    </button>
                  </div>

                  {/* Boosters Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {CONVERSION_BOOSTERS.map((booster) => {
                      const isActive = page.conversion_boosters?.includes(booster.id);
                      const Icon = booster.icon;
                      
                      return (
                        <button
                          key={booster.id}
                          onClick={() => toggleBooster(page.id, booster.id)}
                          disabled={saving === page.id}
                          className={`p-4 rounded-xl border-2 text-left transition-all ${
                            isActive
                              ? 'border-emerald-500/50 bg-emerald-500/10'
                              : 'border-gray-700 bg-gray-800/30 hover:border-gray-600'
                          } disabled:opacity-50`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`p-2 rounded-lg ${isActive ? 'bg-emerald-500/20' : 'bg-gray-700'}`}>
                              <Icon className={`w-5 h-5 ${isActive ? 'text-emerald-400' : 'text-gray-400'}`} />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className={`font-medium ${isActive ? 'text-white' : 'text-gray-300'}`}>
                                  {booster.name}
                                </span>
                                {isActive && <Check className="w-4 h-4 text-emerald-400" />}
                              </div>
                              <p className="text-xs text-gray-500 mt-1">{booster.description}</p>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Page URL */}
                  <div className="mt-4 p-3 bg-gray-800/50 rounded-lg flex items-center gap-3">
                    <span className="text-gray-500 text-sm">Page URL:</span>
                    <code className="text-purple-400 text-sm flex-1 truncate">
                      {typeof window !== 'undefined' ? window.location.origin : ''}/p/{page.public_slug}
                    </code>
                    <button
                      onClick={() => copyPageUrl(page.public_slug)}
                      className="text-gray-400 hover:text-white"
                    >
                      {copiedSlug === page.public_slug ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  );
}
