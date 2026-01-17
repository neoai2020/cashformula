'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import Logo from '@/components/ui/Logo';

const CheckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <polyline points="20,6 9,17 4,12" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
);

const BuildIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M12 2L2 7l10 5 10-5-10-5z" />
    <path d="M2 17l10 5 10-5" />
    <path d="M2 12l10 5 10-5" />
  </svg>
);

const ShareIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
  </svg>
);

const CashIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="2" y="6" width="20" height="12" rx="2" />
    <circle cx="12" cy="12" r="3" />
    <path d="M6 12h.01M18 12h.01" />
  </svg>
);

export default function LandingPage() {
  const features = [
    'AI-powered page generation',
    'Premium review templates',
    'Social media integration',
    'No coding required',
    'Works with Amazon affiliate',
    'Unlimited pages',
  ];

  const steps = [
    { icon: BuildIcon, title: 'Build', desc: 'Create AI-powered profit pages in minutes', color: 'violet' },
    { icon: ShareIcon, title: 'Share', desc: 'Post on social media with one click', color: 'teal' },
    { icon: CashIcon, title: 'Earn', desc: 'Get commissions when people buy', color: 'rose' },
  ];

  const stepColors = {
    violet: { bg: 'bg-violet-DEFAULT/10', text: 'text-violet-DEFAULT' },
    teal: { bg: 'bg-teal-DEFAULT/10', text: 'text-teal-DEFAULT' },
    rose: { bg: 'bg-rose-DEFAULT/10', text: 'text-rose-DEFAULT' },
  };

  return (
    <div className="min-h-screen bg-navy-950">
      <div className="absolute inset-0 bg-mesh-gradient" />
      
      {/* Nav */}
      <nav className="relative z-10 border-b border-violet-DEFAULT/8">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/">
            <Logo size="sm" />
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-navy-300 hover:text-violet-DEFAULT transition-colors">
              Sign In
            </Link>
            <Link
              href="/signup"
              className="bg-gradient-to-r from-violet-DEFAULT to-indigo-DEFAULT text-white font-semibold px-5 py-2.5 rounded-xl transition-all hover:shadow-glow hover:translate-y-[-1px]"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-20 pb-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-violet-DEFAULT/10 border border-violet-DEFAULT/20 rounded-full text-violet-DEFAULT text-sm font-medium mb-8"
          >
            <span className="w-2 h-2 bg-cash-green rounded-full animate-pulse" />
            <span>Join 10,000+ affiliates earning daily</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-white mb-6 leading-tight"
          >
            Turn Any Product Into a{' '}
            <span className="gradient-text">Profit Machine</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-navy-300 mb-10 max-w-2xl mx-auto"
          >
            AI-powered profit pages that convert. Build high-converting review pages 
            in minutes, share on social media, and earn affiliate commissions.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              href="/signup"
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-violet-DEFAULT to-indigo-DEFAULT text-white font-bold text-lg px-8 py-4 rounded-xl transition-all hover:shadow-glow-lg hover:translate-y-[-1px]"
            >
              <span>Start Building Now</span>
              <ArrowRightIcon />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 bg-navy-800/50 border border-violet-DEFAULT/20 text-white font-semibold text-lg px-8 py-4 rounded-xl hover:bg-violet-DEFAULT/10 hover:border-violet-DEFAULT/30 transition-all"
            >
              Sign In
            </Link>
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section className="relative py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-display font-bold text-white mb-4">
              How It Works
            </h2>
            <p className="text-navy-400 max-w-xl mx-auto">
              Three simple steps to start earning with affiliate marketing
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, i) => {
              const Icon = step.icon;
              const colors = stepColors[step.color as keyof typeof stepColors];
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="glass-card glass-card-hover rounded-2xl p-8 text-center"
                >
                  <div 
                    className={`w-16 h-16 ${colors.bg} rounded-2xl flex items-center justify-center mx-auto mb-6 ${colors.text}`}
                  >
                    <Icon />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">{step.title}</h3>
                  <p className="text-navy-400">{step.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="glass-card rounded-2xl p-8 lg:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-display font-bold text-white mb-6">
                  Everything You Need to Succeed
                </h2>
                <ul className="space-y-4">
                  {features.map((feature, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      viewport={{ once: true }}
                      className="flex items-center gap-3"
                    >
                      <div 
                        className="w-6 h-6 bg-cash-green/20 rounded-full flex items-center justify-center text-cash-green flex-shrink-0"
                      >
                        <CheckIcon />
                      </div>
                      <span className="text-white">{feature}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
              <div className="relative">
                <div 
                  className="aspect-square bg-navy-800/50 rounded-2xl flex items-center justify-center border border-violet-DEFAULT/15"
                >
                  <div className="text-center">
                    <div className="text-6xl font-display font-bold gradient-text-teal mb-2">
                      $4,832
                    </div>
                    <p className="text-navy-400">Avg. monthly earnings</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-display font-bold text-white mb-6">
            Ready to Start Earning?
          </h2>
          <p className="text-navy-400 mb-8">
            Join thousands of affiliates using Cash Formula to build profitable review pages.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-DEFAULT via-indigo-DEFAULT to-teal-DEFAULT text-white font-bold text-lg px-10 py-5 rounded-xl transition-all hover:shadow-glow-lg hover:translate-y-[-1px]"
          >
            <span>Create Free Account</span>
            <ArrowRightIcon />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-violet-DEFAULT/8 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <Logo size="sm" showText={false} />
          <p className="text-navy-500 text-sm">
            © {new Date().getFullYear()} Cash Formula. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
