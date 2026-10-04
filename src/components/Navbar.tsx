import React, { useState } from 'react';
import { 
  Building2, 
  Search, 
  MapPin, 
  Sparkles, 
  PlusCircle, 
  Heart, 
  Mail, 
  User as UserIcon, 
  ShieldCheck, 
  Menu, 
  X, 
  Layers, 
  HelpCircle,
  FileCheck2,
  AlertTriangle
} from 'lucide-react';
import { useProperties } from '../context/PropertyContext';
import { UserRole } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  openPostModal: () => void;
  openCompareModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  openPostModal,
  openCompareModal
}) => {
  const { currentUser, setCurrentUserRole, savedPropertyIds, comparedPropertyIds } = useProperties();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showRoleSelector, setShowRoleSelector] = useState(false);
  const [showWarning, setShowWarning] = useState(true);

  const roles: { role: UserRole; label: string }[] = [
    { role: 'seeker', label: 'Property Seeker' },
    { role: 'owner', label: 'Property Owner' },
    { role: 'agent', label: 'Real Estate Agent' },
    { role: 'developer', label: 'Property Developer' },
    { role: 'admin', label: 'Platform Administrator' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-xs">
      {/* Anti-Scam Notice Bar in Warm Gold with Emerald Accent */}
      {showWarning && (
        <div className="bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 border-b border-amber-500/40 px-4 py-1.5 text-xs text-stone-950 font-medium flex items-center justify-between shadow-2xs">
          <div className="max-w-7xl mx-auto flex items-center gap-2 w-full">
            <AlertTriangle className="w-3.5 h-3.5 text-emerald-900 shrink-0" />
            <span className="font-semibold tracking-tight truncate">
              Anti-Scam Notice: Never send money before independently confirming the property, seller and required documents.
            </span>
          </div>
          <button
            onClick={() => setShowWarning(false)}
            className="text-stone-800 hover:text-stone-950 text-xs px-2 shrink-0 cursor-pointer font-bold"
            title="Dismiss notice"
          >
            ✕
          </button>
        </div>
      )}

      {/* Top Bar Contract: Zone 1 (Single Text Brand), Zone 2 (4-6 Clean Text Links), Zone 3 (1-2 Actions) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setActiveTab('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-left group cursor-pointer"
          >
            <span className="text-xl font-bold tracking-tight text-stone-900 font-display flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-600 ring-2 ring-amber-400 inline-block"></span>
              Gerald Property Hub
            </span>
          </button>
        </div>

        {/* Zone 2: Clean Text Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-stone-600">
          <button
            onClick={() => setActiveTab('home')}
            className={`transition-colors hover:text-emerald-800 cursor-pointer ${
              activeTab === 'home' ? 'text-emerald-800 font-bold border-b-2 border-emerald-600 py-1' : ''
            }`}
          >
            Home
          </button>
          <button
            onClick={() => setActiveTab('buy')}
            className={`transition-colors hover:text-emerald-800 cursor-pointer ${
              activeTab === 'buy' ? 'text-emerald-800 font-bold border-b-2 border-emerald-600 py-1' : ''
            }`}
          >
            Buy
          </button>
          <button
            onClick={() => setActiveTab('rent')}
            className={`transition-colors hover:text-emerald-800 cursor-pointer ${
              activeTab === 'rent' ? 'text-emerald-800 font-bold border-b-2 border-emerald-600 py-1' : ''
            }`}
          >
            Rent
          </button>
          <button
            onClick={() => setActiveTab('land')}
            className={`transition-colors hover:text-emerald-800 cursor-pointer ${
              activeTab === 'land' ? 'text-emerald-800 font-bold border-b-2 border-emerald-600 py-1' : ''
            }`}
          >
            Land
          </button>
          <button
            onClick={() => setActiveTab('map')}
            className={`transition-colors hover:text-emerald-800 cursor-pointer ${
              activeTab === 'map' ? 'text-emerald-800 font-bold border-b-2 border-emerald-600 py-1' : ''
            }`}
          >
            Map
          </button>
          <button
            onClick={() => setActiveTab('ai-search')}
            className={`inline-flex items-center gap-1 transition-colors hover:text-emerald-900 cursor-pointer ${
              activeTab === 'ai-search' ? 'text-emerald-800 font-bold border-b-2 border-amber-500 py-1' : 'text-emerald-700 font-semibold'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            AI Search
          </button>
          <button
            onClick={() => setActiveTab('buyer-requests')}
            className={`transition-colors hover:text-emerald-800 cursor-pointer ${
              activeTab === 'buyer-requests' ? 'text-emerald-800 font-bold border-b-2 border-emerald-600 py-1' : ''
            }`}
          >
            Buyer Requests
          </button>
        </nav>

        {/* Zone 3: Actions & Role switcher */}
        <div className="flex items-center gap-3">
          {/* Compare pill if active */}
          {comparedPropertyIds.length > 0 && (
            <button
              onClick={openCompareModal}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-900 bg-amber-50 border border-amber-300 rounded-lg hover:bg-amber-100 transition-colors cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5 text-amber-600" />
              Compare ({comparedPropertyIds.length})
            </button>
          )}

          {/* Saved shortcut */}
          <button
            onClick={() => setActiveTab('saved')}
            className="p-2 text-stone-600 hover:text-emerald-800 rounded-lg hover:bg-stone-100 transition-colors relative cursor-pointer"
            title="Saved Properties"
          >
            <Heart className={`w-5 h-5 ${savedPropertyIds.length > 0 ? 'text-rose-600 fill-rose-600' : ''}`} />
            {savedPropertyIds.length > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-emerald-700 text-white rounded-full text-[10px] font-bold flex items-center justify-center ring-1 ring-amber-400">
                {savedPropertyIds.length}
              </span>
            )}
          </button>

          {/* Role selector dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowRoleSelector(!showRoleSelector)}
              className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-stone-800 bg-stone-100 border border-stone-200 hover:border-amber-400 rounded-lg transition-colors cursor-pointer"
              title="Switch user perspective for MVP review"
            >
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              <span className="capitalize">{currentUser.role}</span>
              <span className="text-[10px] text-stone-400">▼</span>
            </button>

            {showRoleSelector && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-stone-200 rounded-xl shadow-lg py-2 z-50">
                <div className="px-3 py-1.5 text-[11px] font-bold uppercase text-stone-400 tracking-wider">
                  Select User Role (Demo Mode)
                </div>
                {roles.map((r) => (
                  <button
                    key={r.role}
                    onClick={() => {
                      setCurrentUserRole(r.role);
                      setShowRoleSelector(false);
                      if (r.role === 'admin') setActiveTab('admin');
                      else if (r.role === 'owner' || r.role === 'agent' || r.role === 'developer') setActiveTab('seller-dashboard');
                      else setActiveTab('seeker-dashboard');
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-stone-50 cursor-pointer ${
                      currentUser.role === r.role ? 'text-emerald-800 font-bold bg-emerald-50/80 border-l-2 border-emerald-600' : 'text-stone-700'
                    }`}
                  >
                    <span>{r.label}</span>
                    {currentUser.role === r.role && <span className="text-amber-600 font-bold">✓</span>}
                  </button>
                ))}
                <div className="border-t border-stone-100 my-1"></div>
                <button
                  onClick={() => {
                    setShowRoleSelector(false);
                    setActiveTab('profile');
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs text-stone-600 hover:text-stone-900 hover:bg-stone-50"
                >
                  View Profile & Settings
                </button>
              </div>
            )}
          </div>

          {/* Primary Action Button: Post Property in Emerald with Gold Border Ring */}
          <button
            onClick={openPostModal}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 border border-amber-400/60 shadow-sm rounded-lg transition-all cursor-pointer whitespace-nowrap"
          >
            <PlusCircle className="w-4 h-4 text-amber-300" />
            <span>Post Property</span>
          </button>

          {/* Mobile menu hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-stone-600 hover:text-stone-900 rounded-lg hover:bg-stone-100 cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-stone-200 bg-white px-4 pt-3 pb-6 space-y-3">
          <div className="grid grid-cols-2 gap-2 text-sm font-medium">
            <button
              onClick={() => { setActiveTab('home'); setMobileMenuOpen(false); }}
              className={`p-2.5 rounded-lg text-left ${activeTab === 'home' ? 'bg-emerald-50 text-emerald-800 font-semibold' : 'text-stone-700'}`}
            >
              Home
            </button>
            <button
              onClick={() => { setActiveTab('buy'); setMobileMenuOpen(false); }}
              className={`p-2.5 rounded-lg text-left ${activeTab === 'buy' ? 'bg-emerald-50 text-emerald-800 font-semibold' : 'text-stone-700'}`}
            >
              Buy Property
            </button>
            <button
              onClick={() => { setActiveTab('rent'); setMobileMenuOpen(false); }}
              className={`p-2.5 rounded-lg text-left ${activeTab === 'rent' ? 'bg-emerald-50 text-emerald-800 font-semibold' : 'text-stone-700'}`}
            >
              Rent Property
            </button>
            <button
              onClick={() => { setActiveTab('land'); setMobileMenuOpen(false); }}
              className={`p-2.5 rounded-lg text-left ${activeTab === 'land' ? 'bg-emerald-50 text-emerald-800 font-semibold' : 'text-stone-700'}`}
            >
              Land Marketplace
            </button>
            <button
              onClick={() => { setActiveTab('map'); setMobileMenuOpen(false); }}
              className={`p-2.5 rounded-lg text-left ${activeTab === 'map' ? 'bg-emerald-50 text-emerald-800 font-semibold' : 'text-stone-700'}`}
            >
              Map Explorer
            </button>
            <button
              onClick={() => { setActiveTab('ai-search'); setMobileMenuOpen(false); }}
              className={`p-2.5 rounded-lg text-left flex items-center gap-1.5 ${activeTab === 'ai-search' ? 'bg-emerald-50 text-emerald-800 font-semibold' : 'text-emerald-700 font-medium'}`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              AI Property Finder
            </button>
            <button
              onClick={() => { setActiveTab('buyer-requests'); setMobileMenuOpen(false); }}
              className={`p-2.5 rounded-lg text-left ${activeTab === 'buyer-requests' ? 'bg-emerald-50 text-emerald-800 font-semibold' : 'text-stone-700'}`}
            >
              Buyer Requests
            </button>
            <button
              onClick={() => { setActiveTab('saved'); setMobileMenuOpen(false); }}
              className={`p-2.5 rounded-lg text-left ${activeTab === 'saved' ? 'bg-emerald-50 text-emerald-800 font-semibold' : 'text-stone-700'}`}
            >
              Saved ({savedPropertyIds.length})
            </button>
            <button
              onClick={() => { setActiveTab('enquiries'); setMobileMenuOpen(false); }}
              className={`p-2.5 rounded-lg text-left ${activeTab === 'enquiries' ? 'bg-emerald-50 text-emerald-800 font-semibold' : 'text-stone-700'}`}
            >
              My Enquiries
            </button>
            <button
              onClick={() => { setActiveTab('disclaimer'); setMobileMenuOpen(false); }}
              className={`p-2.5 rounded-lg text-left ${activeTab === 'disclaimer' ? 'bg-emerald-50 text-emerald-800 font-semibold' : 'text-stone-700'}`}
            >
              Legal & Verification
            </button>
          </div>

          <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
            <span className="text-xs text-stone-500 font-medium">Role: {currentUser.role}</span>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  if (currentUser.role === 'admin') setActiveTab('admin');
                  else if (currentUser.role === 'owner' || currentUser.role === 'agent' || currentUser.role === 'developer') setActiveTab('seller-dashboard');
                  else setActiveTab('seeker-dashboard');
                  setMobileMenuOpen(false);
                }}
                className="text-xs text-emerald-700 font-semibold hover:underline"
              >
                Dashboard →
              </button>
              <button
                onClick={() => { setActiveTab('profile'); setMobileMenuOpen(false); }}
                className="text-xs text-stone-700 font-semibold hover:underline ml-2"
              >
                Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
