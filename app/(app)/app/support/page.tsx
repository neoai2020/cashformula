'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

// Icons
const HelpIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const MailIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

const BookIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="6,9 12,15 18,9" />
  </svg>
);

const RocketIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
    <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
  </svg>
);

const CheckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <polyline points="20,6 9,17 4,12" />
  </svg>
);

const StarIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
);

export default function SupportPage() {
  const faqs = [
    {
      q: 'How do I get started?',
      a: 'It\'s super easy! Just go to "Build Page", search for a product you want to promote, add your affiliate link, and let our AI create a beautiful profit page for you. The whole process takes about 2 minutes!',
    },
    {
      q: 'Where do I get my affiliate link?',
      a: 'Sign up for the Amazon Associates program at affiliate-program.amazon.com. Once approved (usually within 24 hours), you can create affiliate links for any Amazon product. Just copy the link and paste it when building your page!',
    },
    {
      q: 'How do I get traffic to my pages?',
      a: 'Use our "Share & Promote" feature - we have pre-written viral captions ready for you to copy and paste! Share on Facebook groups, WhatsApp, TikTok, Instagram, and more. Many members get their first clicks within hours!',
    },
    {
      q: 'When will I get paid?',
      a: 'Amazon pays commissions about 60 days after each month ends. For example, sales made in January are paid around the end of March. This is standard for all Amazon affiliates.',
    },
    {
      q: 'Can I create multiple pages?',
      a: 'Absolutely! Create as many profit pages as you want - there\'s no limit. In fact, the more pages you have, the more potential earnings. Many successful members have 10+ pages working for them!',
    },
    {
      q: 'What makes Gold/Platinum packages special?',
      a: 'Gold Package gives you done-for-you pages that are already optimized and ready to promote. Platinum Package includes our AI viral content generator that creates scroll-stopping social posts. Both are premium features included with your purchase!',
    },
  ];

  const quickWins = [
    { step: 'Create your first page', href: '/app/build' },
    { step: 'Share it on WhatsApp', href: '/app/traffic' },
    { step: 'Check your Gold pages', href: '/app/gold' },
  ];

  const successStory = {
    name: 'Linda M.',
    location: 'Ohio',
    story: 'I almost gave up after 3 days with no results. Then I watched the training again, created 5 more pages, and shared them in Facebook groups. By day 10, I made my first $47 commission. Now I\'m at $1,200/month!',
    earnings: '$1,200/mo',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Header */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-display font-bold text-white">
          Help & Success Tips 🚀
        </h1>
        <p className="text-navy-300 mt-2 text-lg">
          Everything you need to succeed with Cash Formula
        </p>
      </div>

      {/* Quick Wins Section - NEW */}
      <div className="glass-card rounded-3xl p-8 border-2 border-cash-green/20">
        <div className="flex items-start gap-5 mb-6">
          <div className="w-16 h-16 bg-cash-green/10 rounded-2xl flex items-center justify-center text-cash-green">
            <RocketIcon />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Quick Wins for Guaranteed Results
            </h2>
            <p className="text-navy-300 text-lg">
              Do these 3 things today and you&apos;ll be on your way to earning!
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {quickWins.map((item, i) => (
            <Link
              key={i}
              href={item.href}
              className="flex items-center gap-4 p-5 bg-navy-800/50 hover:bg-navy-800 rounded-2xl transition-all group"
            >
              <div className="w-10 h-10 bg-gold-500/20 rounded-xl flex items-center justify-center text-gold-400 font-bold">
                {i + 1}
              </div>
              <span className="flex-1 text-white font-medium group-hover:text-gold-400 transition-colors">
                {item.step}
              </span>
              <span className="text-navy-500 group-hover:text-gold-400 transition-colors"><ArrowRightIcon /></span>
            </Link>
          ))}
        </div>
      </div>

      {/* Success Story - Anti-refund */}
      <div className="glass-card rounded-3xl p-8 border border-gold-500/20">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          ⭐ From Stuck to Success
        </h2>
        
        <div className="flex flex-col lg:flex-row items-start gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full flex items-center justify-center text-navy-950 text-2xl font-bold shadow-lg">
              {successStory.name[0]}
            </div>
            <div>
              <p className="font-bold text-white text-lg">{successStory.name}</p>
              <p className="text-navy-400">{successStory.location}</p>
              <div className="flex items-center gap-1 text-gold-400 mt-1">
                {[1,2,3,4,5].map(i => <StarIcon key={i} />)}
              </div>
            </div>
          </div>
          
          <div className="flex-1">
            <p className="text-navy-300 text-lg italic leading-relaxed">
              &quot;{successStory.story}&quot;
            </p>
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-cash-green/10 border border-cash-green/20 rounded-lg">
              <span className="text-cash-green font-bold text-xl">{successStory.earnings}</span>
              <span className="text-cash-green/70">current earnings</span>
            </div>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t border-navy-700">
          <p className="text-navy-400 text-center">
            💡 <span className="text-white font-medium">Remember:</span> Most members who felt stuck just needed to create more pages and keep sharing. You&apos;re closer than you think!
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Links */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="w-3 h-3 bg-gold-400 rounded-full" />
            Quick Links
          </h2>

          {[
            { icon: BookIcon, title: 'Watch Training', desc: 'Learn the system', href: '/app/training' },
            { icon: HelpIcon, title: 'The System', desc: 'How it works', href: '/app/system' },
            { icon: MailIcon, title: 'Contact Support', desc: 'We\'re here to help', href: 'mailto:support@cashformula.com' },
          ].map((item, i) => {
            const Icon = item.icon;
            const isExternal = item.href.startsWith('mailto');
            const Component = isExternal ? 'a' : Link;
            return (
              <Component
                key={i}
                href={item.href}
                className="flex items-center gap-5 w-full glass-card glass-card-hover rounded-2xl p-5 transition-all group"
              >
                <div className="w-14 h-14 bg-gold-500/10 rounded-xl flex items-center justify-center text-gold-400 group-hover:scale-110 transition-transform">
                  <Icon />
                </div>
                <div>
                  <p className="font-bold text-white text-lg group-hover:text-gold-400 transition-colors">{item.title}</p>
                  <p className="text-navy-400">{item.desc}</p>
                </div>
              </Component>
            );
          })}
        </div>

        {/* FAQ */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="w-3 h-3 bg-cash-green rounded-full" />
            Frequently Asked Questions
          </h2>

          <div className="glass-card rounded-2xl divide-y divide-navy-700">
            {faqs.map((faq, i) => (
              <details key={i} className="group">
                <summary className="flex items-center justify-between p-6 cursor-pointer list-none hover:bg-navy-800/30 transition-colors">
                  <span className="font-bold text-white pr-4 text-lg">{faq.q}</span>
                  <span className="text-navy-400 group-open:rotate-180 transition-transform flex-shrink-0">
                    <ChevronDownIcon />
                  </span>
                </summary>
                <div className="px-6 pb-6 text-navy-300 text-base leading-relaxed">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </div>

      {/* Contact Card */}
      <div className="glass-card rounded-3xl p-8">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="w-20 h-20 bg-gold-500/10 rounded-2xl flex items-center justify-center text-gold-400">
            <MailIcon />
          </div>
          <div className="text-center sm:text-left">
            <h3 className="text-2xl font-bold text-white mb-2">
              Need More Help?
            </h3>
            <p className="text-navy-300 text-lg mb-4">
              Our support team is here to help you succeed. We typically respond within 24 hours.
            </p>
            <a
              href="mailto:support@cashformula.com"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-gold-400 to-gold-500 text-navy-950 font-bold text-lg px-8 py-4 rounded-xl hover:shadow-gold-lg hover:scale-[1.02] transition-all"
            >
              <MailIcon />
              <span>Contact Support</span>
            </a>
          </div>
        </div>
      </div>

      {/* Encouragement Footer */}
      <div className="text-center p-6 bg-navy-800/30 rounded-2xl">
        <p className="text-navy-300 text-lg">
          💪 <span className="text-white font-medium">You&apos;ve got this!</span> Thousands of members started exactly where you are now and are making consistent income.
          <br />
          The key is to <span className="text-gold-400">keep creating pages</span> and <span className="text-cash-green">keep sharing</span>!
        </p>
      </div>
    </motion.div>
  );
}
