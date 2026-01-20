'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Logo from '@/components/ui/Logo';

// Custom icons for unique look
const DashboardIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="7" height="9" rx="1" />
    <rect x="14" y="3" width="7" height="5" rx="1" />
    <rect x="14" y="12" width="7" height="9" rx="1" />
    <rect x="3" y="16" width="7" height="5" rx="1" />
  </svg>
);

const BuildIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 2L2 7l10 5 10-5-10-5z" />
    <path d="M2 17l10 5 10-5" />
    <path d="M2 12l10 5 10-5" />
  </svg>
);

const PagesIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14,2 14,8 20,8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
  </svg>
);

const ShareIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
  </svg>
);

const CashIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="2" y="6" width="20" height="12" rx="2" />
    <circle cx="12" cy="12" r="3" />
    <path d="M6 12h.01M18 12h.01" />
  </svg>
);

const VideoIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="5,3 19,12 5,21" />
  </svg>
);

const GoldIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
  </svg>
);

const BoltIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="13,2 3,14 12,14 11,22 21,10 12,10" />
  </svg>
);

const SettingsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="3" />
    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
  </svg>
);

const LogoutIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16,17 21,12 16,7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const MenuIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const navItems = [
  { name: 'Dashboard', href: '/app', icon: DashboardIcon },
  { name: 'Build Page', href: '/app/build', icon: BuildIcon },
  { name: 'Your Pages', href: '/app/pages', icon: PagesIcon },
  { name: 'Share & Promote', href: '/app/traffic', icon: ShareIcon },
  { name: 'New System To Make $1,000 To $5,000 Per Day', href: '/app/system', icon: CashIcon, highlight: true },
  { name: 'Training Videos', href: '/app/training', icon: VideoIcon },
  { name: 'Support', href: '/app/support', icon: SettingsIcon },
];

const premiumItems = [
  { name: 'Gold Package', href: '/app/gold', icon: GoldIcon, badge: '⭐ PREMIUM', isPremium: true, color: 'gold' },
  { name: 'Platinum Package', href: '/app/platinum', icon: BoltIcon, badge: '💎 VIP', isPremium: true, color: 'purple' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const isActive = (href: string) => {
    if (href === '/app') return pathname === '/app';
    return pathname.startsWith(href);
  };

  const NavLink = ({ item }: { item: typeof navItems[0] & { badge?: string; highlight?: boolean; isPremium?: boolean; color?: string } }) => {
    const active = isActive(item.href);
    const Icon = item.icon;

    // Special styling for premium items
    if (item.isPremium) {
      const isGold = item.color === 'gold';
      return (
        <Link
          href={item.href}
          onClick={() => setIsMobileOpen(false)}
          className={`group relative flex items-center gap-3 px-4 py-4 rounded-xl transition-all duration-200 overflow-hidden ${
            active
              ? isGold 
                ? 'bg-gradient-to-r from-yellow-500/30 to-amber-500/20 border-2 border-yellow-500/50' 
                : 'bg-gradient-to-r from-purple-500/30 to-pink-500/20 border-2 border-purple-500/50'
              : isGold
                ? 'bg-gradient-to-r from-yellow-500/10 to-amber-500/5 border-2 border-yellow-500/30 hover:border-yellow-500/50 hover:from-yellow-500/20'
                : 'bg-gradient-to-r from-purple-500/10 to-pink-500/5 border-2 border-purple-500/30 hover:border-purple-500/50 hover:from-purple-500/20'
          }`}
        >
          {/* Glow effect */}
          <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity ${
            isGold ? 'bg-yellow-500/10' : 'bg-purple-500/10'
          }`} />
          
          {/* Icon */}
          <div className={`relative z-10 ${
            isGold ? 'text-yellow-400' : 'text-purple-400'
          }`}>
            <Icon />
          </div>
          
          {/* Text */}
          <span className={`relative z-10 flex-1 text-base font-bold leading-tight ${
            isGold ? 'text-yellow-300' : 'text-purple-300'
          }`}>{item.name}</span>
          
          {/* Badge */}
          {item.badge && (
            <span className={`relative z-10 px-2.5 py-1 text-xs font-bold rounded-full ${
              isGold 
                ? 'bg-yellow-500/30 text-yellow-200 border border-yellow-500/50' 
                : 'bg-purple-500/30 text-purple-200 border border-purple-500/50'
            }`}>
              {item.badge}
            </span>
          )}
        </Link>
      );
    }

    // Regular nav items
    return (
      <Link
        href={item.href}
        onClick={() => setIsMobileOpen(false)}
        className={`group relative flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 overflow-hidden ${
          active
            ? 'text-teal-500'
            : item.highlight
            ? 'text-teal-500/70 hover:text-teal-500'
            : 'text-gray-400 hover:text-white'
        }`}
      >
        {/* Background - subtle on active */}
        <div className={`absolute inset-0 transition-all duration-200 rounded-xl ${
          active 
            ? 'bg-teal-500/10' 
            : 'bg-transparent group-hover:bg-white/5'
        }`} />
        
        {/* Left accent bar - teal on active */}
        <div className={`absolute left-0 top-2 bottom-2 w-[3px] rounded-full transition-all duration-200 ${
          active 
            ? 'bg-teal-500 opacity-100' 
            : 'bg-teal-500 opacity-0 group-hover:opacity-30'
        }`} />
        
        {/* Icon with color */}
        <div className={`relative z-10 transition-colors duration-200 ${
          active 
            ? 'text-teal-500' 
            : 'group-hover:text-teal-500/70'
        }`}>
          <Icon />
        </div>
        
        {/* Text */}
        <span className="relative z-10 flex-1 text-base font-medium leading-tight">{item.name}</span>
        
        {/* Badge */}
        {item.badge && (
          <span className="relative z-10 px-2.5 py-1 text-xs font-bold bg-teal-500/20 text-teal-500 rounded-full uppercase">
            {item.badge}
          </span>
        )}
      </Link>
    );
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden p-2.5 rounded-xl bg-navy-800/90 border border-white/10 backdrop-blur-sm text-white"
      >
        {isMobileOpen ? <CloseIcon /> : <MenuIcon />}
      </button>

      {/* Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-40 h-screen w-72 transform transition-transform duration-300 lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col glass-panel border-r border-white/5">
          {/* Logo */}
          <div className="p-5">
            <Link href="/app">
              <Logo size="sm" />
            </Link>
          </div>

          {/* Menu label */}
          <div className="px-6 py-2">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Menu</span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto px-3 pb-4">
            {/* Main navigation */}
            <ul className="space-y-1">
              {navItems.slice(0, 5).map((item) => (
                <li key={item.href}>
                  <NavLink item={item} />
                </li>
              ))}
            </ul>

            {/* Premium Features - HIGHLIGHTED */}
            <div className="px-4 py-3 mt-6">
              <span className="text-xs font-bold text-yellow-400 uppercase tracking-wider flex items-center gap-2">
                ⭐ Premium Features
              </span>
            </div>

            <ul className="space-y-2">
              {premiumItems.map((item) => (
                <li key={item.href}>
                  <NavLink item={item} />
                </li>
              ))}
            </ul>

            {/* Resources */}
            <div className="my-4 mx-4 border-t border-white/5" />
            <ul className="space-y-1">
              {navItems.slice(5).map((item) => (
                <li key={item.href}>
                  <NavLink item={item} />
                </li>
              ))}
            </ul>
          </nav>

          {/* Sign out */}
          <div className="p-4 border-t border-white/5">
            <button
              onClick={handleSignOut}
              className="group relative flex items-center gap-3 w-full px-4 py-3.5 rounded-xl text-gray-400 hover:text-rose-500 transition-colors duration-200 overflow-hidden"
            >
              <div className="absolute inset-0 bg-transparent group-hover:bg-rose-500/10 rounded-xl transition-all duration-200" />
              <div className="relative z-10 group-hover:text-rose-500 transition-colors duration-200">
                <LogoutIcon />
              </div>
              <span className="relative z-10 text-base font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
