'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import type { Page } from '@/lib/types';
import Button from '@/components/ui/Button';

// Icons
const ShareIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
  </svg>
);

const CopyIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="9" y="9" width="13" height="13" rx="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

const CheckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <polyline points="20,6 9,17 4,12" />
  </svg>
);

const LightbulbIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.9V17h8v-2.1A7 7 0 0 0 12 2z" />
  </svg>
);

const ClockIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12,6 12,12 16,14" />
  </svg>
);

const FireIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 23c-4.97 0-9-3.58-9-8 0-2.52 1.17-5.06 3.05-7.29.37-.44.75-.86 1.14-1.25l.73-.71.5.89c.63 1.11 1.4 2.07 2.27 2.86.31.28.62.53.94.76l.77.57-.45.84c-.3.55-.44 1.13-.44 1.73 0 1.1.45 2.1 1.17 2.83.72.73 1.72 1.18 2.82 1.18s2.1-.45 2.82-1.18c.72-.73 1.17-1.73 1.17-2.83 0-.6-.14-1.18-.44-1.73l-.45-.84.77-.57c.32-.23.63-.48.94-.76.87-.79 1.64-1.75 2.27-2.86l.5-.89.73.71c.39.39.77.81 1.14 1.25C19.83 9.94 21 12.48 21 15c0 4.42-4.03 8-9 8z" />
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

// Social icons
const FacebookIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const TwitterIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const WhatsappIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

const TelegramIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
  </svg>
);

const TiktokIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
  </svg>
);

const EmailIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

// Pre-written viral captions
const viralCaptions = [
  {
    name: '🔥 Curiosity Hook',
    caption: `I can't believe I didn't know about this sooner! 🤯

This completely changed my [morning routine/daily life/productivity]...

If you've been struggling with [problem], you NEED to see this 👇

{LINK}

Trust me, your future self will thank you! 💯`,
  },
  {
    name: '⭐ Social Proof',
    caption: `Everyone keeps asking me about this, so here it is! 

After seeing SO many people rave about it, I finally tried it myself...

And WOW. I get it now. 🙌

Check it out here: {LINK}

You're welcome 😉`,
  },
  {
    name: '💡 Problem/Solution',
    caption: `Raise your hand if you've ever struggled with [problem]! 🙋‍♀️

I found something that actually WORKS and I had to share it with you all.

No more [pain point]. No more [frustration].

See what I'm talking about: {LINK}

This is a game-changer, friends! 🎯`,
  },
  {
    name: '🎁 Exclusive Find',
    caption: `OKAY I don't usually post stuff like this but...

I found this hidden gem and I'm obsessed! 😍

The reviews don't lie - this thing is AMAZING.

Don't say I didn't warn you: {LINK}

You'll thank me later! 🙏`,
  },
];

export default function TrafficPage() {
  const [pages, setPages] = useState<Page[]>([]);
  const [selectedPage, setSelectedPage] = useState<Page | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [selectedCaption, setSelectedCaption] = useState(0);
  const [shareCount, setShareCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchPages = async () => {
      const { data } = await supabase
        .from('pages')
        .select('*')
        .order('created_at', { ascending: false });

      if (data && data.length > 0) {
        setPages(data as Page[]);
        setSelectedPage(data[0] as Page);
      }
      setLoading(false);
    };

    fetchPages();
    
    // Load share count from localStorage
    const savedCount = localStorage.getItem('share_count');
    if (savedCount) setShareCount(parseInt(savedCount));
  }, [supabase]);

  const pageUrl = selectedPage
    ? `${typeof window !== 'undefined' ? window.location.origin : ''}/p/${selectedPage.public_slug}`
    : '';

  const currentCaption = viralCaptions[selectedCaption].caption.replace('{LINK}', pageUrl);

  const encodedPageUrl = encodeURIComponent(pageUrl);
  const encodedCaption = encodeURIComponent(currentCaption);

  const socialPlatforms = [
    { name: 'Facebook', icon: FacebookIcon, color: 'bg-[#1877F2]', url: `https://www.facebook.com/sharer/sharer.php?u=${encodedPageUrl}&quote=${encodedCaption}` },
    { name: 'WhatsApp', icon: WhatsappIcon, color: 'bg-[#25D366]', url: `https://api.whatsapp.com/send?text=${encodedCaption}` },
    { name: 'Twitter', icon: TwitterIcon, color: 'bg-black', url: `https://twitter.com/intent/tweet?text=${encodedCaption}` },
    { name: 'Telegram', icon: TelegramIcon, color: 'bg-[#0088cc]', url: `https://t.me/share/url?url=${encodedPageUrl}&text=${encodedCaption}` },
    { name: 'TikTok', icon: TiktokIcon, color: 'bg-black', copyOnly: true },
    { name: 'Email', icon: EmailIcon, color: 'bg-navy-600', url: `mailto:?subject=${encodeURIComponent('Check this out!')}&body=${encodedCaption}` },
  ];

  const copyText = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const trackShare = () => {
    const newCount = shareCount + 1;
    setShareCount(newCount);
    localStorage.setItem('share_count', newCount.toString());
  };

  const handleShare = (platform: typeof socialPlatforms[0]) => {
    trackShare();
    if (platform.copyOnly) {
      copyText(currentCaption, 'caption');
    } else if (platform.url) {
      window.open(platform.url, '_blank', 'width=600,height=400');
    }
  };

  // Get current hour for "best time" feature
  const currentHour = new Date().getHours();
  const isPeakTime = (currentHour >= 9 && currentHour <= 11) || (currentHour >= 19 && currentHour <= 21);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-3 border-gold-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (pages.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-3xl p-12 text-center border-2 border-dashed border-cash-green/30"
      >
        <div className="w-24 h-24 bg-cash-green/10 rounded-3xl flex items-center justify-center mx-auto mb-6 text-cash-green">
          <ShareIcon />
        </div>
        <h2 className="text-2xl font-bold text-white mb-3">Create a Page First!</h2>
        <p className="text-navy-300 mb-8 text-lg max-w-md mx-auto">
          Build a profit page first, then come back here to share it everywhere and start earning!
        </p>
        <a href="/app/build">
          <Button className="btn-large">Create Your First Page</Button>
        </a>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-white">
            Share & Earn 📱
          </h1>
          <p className="text-navy-300 mt-2 text-lg">
            Copy viral captions and share to start making money!
          </p>
        </div>
        
        {/* Share counter */}
        {shareCount > 0 && (
          <div className="px-5 py-3 bg-cash-green/10 border border-cash-green/20 rounded-xl text-cash-green font-bold flex items-center gap-2">
            <span className="text-2xl">🎉</span>
            <span>You&apos;ve shared {shareCount} times!</span>
          </div>
        )}
      </div>

      {/* Best Time Alert */}
      <div className={`p-5 rounded-2xl flex items-center gap-4 ${
        isPeakTime 
          ? 'bg-cash-green/10 border border-cash-green/20' 
          : 'bg-navy-800/50 border border-navy-700'
      }`}>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
          isPeakTime ? 'bg-cash-green/20 text-cash-green' : 'bg-navy-700 text-navy-400'
        }`}>
          <ClockIcon />
        </div>
        <div>
          <p className={`font-bold ${isPeakTime ? 'text-cash-green' : 'text-white'}`}>
            {isPeakTime ? '🔥 PEAK TIME! Post NOW for best results!' : 'Best posting times: 9-11 AM & 7-9 PM'}
          </p>
          <p className="text-sm text-navy-400">
            {isPeakTime ? 'Maximum engagement happening right now!' : 'Come back during peak hours for maximum reach'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Page Selector */}
          <div className="glass-card rounded-2xl p-6">
            <label className="block text-lg font-bold text-white mb-3">
              Select Your Page
            </label>
            <select
              value={selectedPage?.id || ''}
              onChange={(e) => {
                const page = pages.find(p => p.id === e.target.value);
                if (page) setSelectedPage(page);
              }}
              className="input-field text-lg py-4"
            >
              {pages.map((page) => (
                <option key={page.id} value={page.id}>
                  {page.title}
                </option>
              ))}
            </select>
          </div>

          {/* Link Copy */}
          <div className="glass-card rounded-2xl p-6">
            <h3 className="font-bold text-white mb-4 text-lg">Your Page Link</h3>
            <div className="flex gap-3">
              <div className="flex-1 p-4 bg-navy-800 rounded-xl border border-navy-700">
                <p className="text-gold-400 font-mono text-base truncate">{pageUrl}</p>
              </div>
              <Button onClick={() => copyText(pageUrl, 'link')} className="px-6">
                {copied === 'link' ? <CheckIcon /> : <CopyIcon />}
                <span>{copied === 'link' ? 'Copied!' : 'Copy'}</span>
              </Button>
            </div>
          </div>

          {/* Viral Captions - NEW */}
          <div className="glass-card rounded-2xl p-6">
            <h3 className="font-bold text-white mb-4 text-lg flex items-center gap-2">
              <span className="text-gold-400"><FireIcon /></span>
              Viral Caption Templates
            </h3>
            
            {/* Caption selector */}
            <div className="flex flex-wrap gap-2 mb-4">
              {viralCaptions.map((cap, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedCaption(i)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    selectedCaption === i
                      ? 'bg-gold-500 text-navy-950'
                      : 'bg-navy-800 text-navy-300 hover:bg-navy-700'
                  }`}
                >
                  {cap.name}
                </button>
              ))}
            </div>

            {/* Caption preview */}
            <div className="p-5 bg-navy-800/50 rounded-xl border border-navy-700 mb-4">
              <p className="text-white whitespace-pre-wrap leading-relaxed">{currentCaption}</p>
            </div>

            <Button 
              onClick={() => copyText(currentCaption, 'caption')} 
              className="w-full btn-large"
            >
              {copied === 'caption' ? <CheckIcon /> : <CopyIcon />}
              <span>{copied === 'caption' ? 'Copied! Now paste it!' : 'Copy This Caption'}</span>
            </Button>
          </div>

          {/* Social Platforms */}
          <div className="glass-card rounded-2xl p-6">
            <h3 className="font-bold text-white mb-4 text-lg">Quick Share</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {socialPlatforms.map((platform) => (
                <button
                  key={platform.name}
                  onClick={() => handleShare(platform)}
                  className={`flex items-center gap-3 p-4 rounded-xl ${platform.color} text-white hover:opacity-90 hover:scale-[1.02] transition-all`}
                >
                  <platform.icon />
                  <span className="font-medium">{platform.name}</span>
                </button>
              ))}
            </div>
            <p className="text-sm text-navy-400 mt-4 text-center">
              💡 Pro tip: Caption is already copied! Just click a platform and paste.
            </p>
          </div>
        </div>

        {/* Pro Tips Sidebar */}
        <div className="space-y-6">
          {/* Social Proof */}
          <div className="glass-card rounded-2xl p-6 border border-cash-green/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-cash-green/10 rounded-xl flex items-center justify-center text-cash-green">
                <UsersIcon />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">1,247</p>
                <p className="text-sm text-navy-400">Pages shared today</p>
              </div>
            </div>
            <div className="pt-4 border-t border-navy-700">
              <p className="text-sm text-navy-400">
                🏆 Top performer made <span className="text-cash-green font-bold">$847</span> this week from shares!
              </p>
            </div>
          </div>

          {/* Pro Tips */}
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gold-500/10 rounded-xl flex items-center justify-center text-gold-400">
                <LightbulbIcon />
              </div>
              <h3 className="font-bold text-white text-lg">Pro Tips</h3>
            </div>
            <ul className="space-y-4 text-base text-navy-300">
              <li className="flex gap-3">
                <span className="text-gold-400 flex-shrink-0">✓</span>
                <span>Post in Facebook groups related to your product</span>
              </li>
              <li className="flex gap-3">
                <span className="text-gold-400 flex-shrink-0">✓</span>
                <span>Share during peak hours (9-11 AM, 7-9 PM)</span>
              </li>
              <li className="flex gap-3">
                <span className="text-gold-400 flex-shrink-0">✓</span>
                <span>Reply to comments to boost engagement</span>
              </li>
              <li className="flex gap-3">
                <span className="text-gold-400 flex-shrink-0">✓</span>
                <span>Add your own story to make it personal</span>
              </li>
              <li className="flex gap-3">
                <span className="text-gold-400 flex-shrink-0">✓</span>
                <span>Share to WhatsApp groups for instant clicks</span>
              </li>
            </ul>
          </div>

          {/* Quick Stats */}
          <div className="glass-card rounded-2xl p-6">
            <h3 className="font-bold text-white mb-4 text-lg">What Works Best</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-navy-400">Best Platform</span>
                <span className="text-white font-medium">Facebook Groups</span>
              </div>
              <div className="flex justify-between">
                <span className="text-navy-400">Avg. Click Rate</span>
                <span className="text-cash-green font-bold">3.2%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-navy-400">Best Time</span>
                <span className="text-white font-medium">7-9 PM EST</span>
              </div>
              <div className="flex justify-between">
                <span className="text-navy-400">Viral Factor</span>
                <span className="text-gold-400 font-medium">Personal stories</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
