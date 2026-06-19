'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { useState, useEffect } from 'react';
import type { SellerProfile } from '@/lib/types';
import { SellerProfileForm } from './SellerProfileForm';
import {  getCreditsHistory } from '@/services/creditsService';
import type { UsageHistoryEntry } from '@/services/creditsService';

const navItems = [
  // { href: '/', label: 'Template Analyzer', icon: '📋' },
  { href: '/autofill', label: 'AI Cataloging', icon: '🤖' },
  { href: '/trends', label: 'Market Trends', icon: '📈' },
  // { href: '/forecast', label: 'Demand Forecast', icon: '🔮' },
  // { href: '/planner', label: 'Catalog Planner', icon: '🗂️' },
];

const SELLER_PROFILE_KEY = 'myntra_seller_profile';

interface SidebarProps {
  profile?: SellerProfile | null;
  onProfileChange?: (p: SellerProfile) => void;
}

export function Sidebar({ profile: externalProfile, onProfileChange }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, userId, credits, refreshCredits } = useAuth();
  const [showSettings, setShowSettings] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
 
  
  const [profile, setProfile] = useState<SellerProfile | null>(externalProfile || null);

  useEffect(() => {
    if (!externalProfile) {
      const savedProfile = localStorage.getItem(SELLER_PROFILE_KEY);
      if (savedProfile) {
        try {
          setProfile(JSON.parse(savedProfile));
        } catch (e) {
          console.error('Failed to load profile', e);
        }
      }
    }
  }, [externalProfile]);

  const handleLogout = () => {
    logout();
    localStorage.clear()
    router.push('/login');
  };

  return (
    <aside className="w-64 border-r border-myntra-border bg-white flex flex-col z-10">
      <div className="p-6 border-b border-myntra-border">
        <h1 className="text-xl font-bold text-myntra-pink">Zynarix</h1>
        <p className="text-xs text-myntra-gray mt-1 font-medium italic">AI-powered seller operations.</p>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-4 mb-2">Main Menu</p>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive
                ? 'bg-pink-50 text-myntra-pink'
                : 'text-myntra-gray hover:bg-myntra-light hover:text-myntra-dark'
                }`}
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}

        <div className="pt-6">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="w-full flex items-center justify-between px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-widest hover:text-myntra-pink transition-colors"
          >
            Settings
            <span>{showSettings ? '−' : '+'}</span>
          </button>

          {showSettings && (
            <div className="px-4 py-3 space-y-4 animate-in fade-in slide-in-from-top-1">
              {/* Credits Section */}
              <div className="space-y-2 bg-pink-50 p-3 rounded-lg border border-pink-200">
                <p className="text-[10px] font-bold text-myntra-gray uppercase">Credit Balance</p>
                <p className="text-xl font-bold text-myntra-pink">{credits != null ? credits.toLocaleString() : '...'}</p>
                <p className="text-[10px] text-myntra-gray">credits remaining</p>
                
              </div>

              {/* Usage History */}
             

              {/* Seller Profile */}
              {profile && onProfileChange && (
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-myntra-gray uppercase">Seller Profile</label>
                  <button
                    onClick={() => {
                      // We can use a modal or just the form inline
                    }}
                    className="w-full text-left text-[11px] p-2 rounded bg-gray-50 border border-myntra-border text-myntra-dark hover:bg-pink-50 transition-colors"
                  >
                    {profile.brandName || 'Configure Profile'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>

      <div className="border-t border-myntra-border p-4 space-y-3">
        {user && (
          <>
            <div className="px-4 py-2 rounded-lg bg-pink-50">
              <p className="text-xs font-medium text-myntra-gray">Logged in as</p>
              <p className="text-sm font-semibold text-myntra-dark truncate">{user.first_name} {user.last_name}</p>
            </div>
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 text-sm font-medium text-myntra-pink hover:bg-pink-50 rounded-lg transition"
            >
              Log Out
            </button>
          </>
        )}
      </div>
    </aside>
  );
}
