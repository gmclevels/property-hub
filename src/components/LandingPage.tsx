import React, { useState } from 'react';
import { 
  Search, 
  Sparkles, 
  MapPin, 
  ShieldCheck, 
  Home, 
  Trees, 
  Map as MapIcon, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle,
  Building,
  ChevronRight,
  TrendingUp,
  UserCheck
} from 'lucide-react';
import { Property } from '../types';
import { useProperties } from '../context/PropertyContext';
import { PropertyCard } from './PropertyCard';
import { formatNaira, LEGAL_DISCLAIMERS } from '../utils/formatters';

interface LandingPageProps {
  onNavigateTab: (tab: string, query?: string) => void;
  onSelectProperty: (property: Property) => void;
  onOpenPostModal: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onNavigateTab,
  onSelectProperty,
  onOpenPostModal
}) => {
  const { properties } = useProperties();
  const [searchQuery, setSearchQuery] = useState('');

  const searchExamples = [
    '3 bedroom house for sale in Abuja',
    'Land for sale in Gwagwalada under ₦15 million',
    '2 bedroom apartment for rent in Lagos',
    'Shop for rent in Enugu'
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onNavigateTab('ai-search', searchQuery);
    } else {
      onNavigateTab('buy');
    }
  };

  const handleExampleClick = (example: string) => {
    setSearchQuery(example);
    onNavigateTab('ai-search', example);
  };

  // Featured verified properties
  const featuredProperties = properties
    .filter((p) => p.isFeatured || p.verificationStatus === 'VERIFIED')
    .slice(0, 6);

  return (
    <div className="space-y-16 pb-16">
      {/* 1. Hero Section with Green, Gold and White Nigerian Proptech Styling */}
      <section className="relative overflow-hidden bg-hero-green-gold text-white min-h-[580px] flex items-center border-b-4 border-amber-400">
        {/* Background Image with Scrim */}
        <div className="absolute inset-0 z-0">
          <img
            src="/src/assets/images/hero_abuja_estate_1790850408390.jpg"
            alt="Modern Nigerian Property Estate in Abuja"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-25 filter brightness-90 contrast-125 mix-blend-luminosity"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-950/80 to-transparent" />
        </div>

        {/* Ambient Gold & Green Light Spots */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 -right-24 w-96 h-96 bg-amber-400/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 flex flex-col items-center text-center space-y-6">
          {/* Trust badge with Gold & Green */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-900/80 border border-amber-400/60 text-amber-300 text-xs font-bold backdrop-blur-md shadow-sm">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>Platform-Verified Real Estate & Land Marketplace</span>
          </div>

          {/* Brand Headline with Gold Accent */}
          <div className="space-y-2 max-w-4xl">
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white font-display text-balance">
              Find It. Verify It. <span className="text-amber-400 drop-shadow-sm font-extrabold">Own It.</span>
            </h1>
            <p className="text-stone-200 text-sm sm:text-lg max-w-2xl mx-auto leading-relaxed">
              Find land, houses and commercial properties for sale or rent across Nigeria. Built on genuine transparency and factual verification audits.
            </p>
          </div>

          {/* Main Search Box: Crisp White Canvas with Green and Gold Controls */}
          <div className="w-full max-w-2xl bg-white rounded-2xl p-3 shadow-2xl border-2 border-amber-400/50 text-left">
            <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row items-center gap-2">
              <div className="relative flex-1 w-full flex items-center pl-3">
                <Search className="w-5 h-5 text-emerald-800 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="What property are you looking for?"
                  className="w-full px-3 py-3 text-sm text-stone-900 placeholder-stone-400 bg-transparent border-0 focus:outline-hidden"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-3 bg-emerald-800 hover:bg-emerald-900 text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-colors cursor-pointer shrink-0 border border-amber-400/40"
                >
                  Search Property
                </button>
                <button
                  type="button"
                  onClick={onOpenPostModal}
                  className="w-full sm:w-auto px-4 py-3 bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-300 text-xs sm:text-sm font-bold rounded-xl transition-colors cursor-pointer shrink-0"
                >
                  Post a Property
                </button>
              </div>
            </form>

            {/* Natural language examples */}
            <div className="px-3 pt-3 pb-1 border-t border-stone-100 mt-2 flex flex-wrap items-center gap-1.5 text-xs text-stone-500">
              <span className="font-semibold text-emerald-800">Examples:</span>
              {searchExamples.map((ex, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleExampleClick(ex)}
                  className="text-stone-700 hover:text-emerald-800 hover:underline cursor-pointer bg-stone-100/90 px-2 py-0.5 rounded-sm"
                >
                  “{ex}”
                </button>
              ))}
            </div>
          </div>

          {/* Founder attribution marker */}
          <div className="text-xs text-stone-300 pt-2 flex items-center gap-2">
            <span>Founder: <strong className="text-white">Mr Gerald N. Uzor</strong></span>
            <span className="text-amber-400">★</span>
            <span className="text-amber-300 font-medium">Nigerian Proptech Marketplace</span>
          </div>
        </div>
      </section>

      {/* 2. Core Feature Cards (Houses, Land, Map Search) with Green, Gold, and White Styling */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Houses */}
          <div 
            onClick={() => onNavigateTab('buy')}
            className="group bg-white p-7 rounded-2xl border-t-4 border-t-emerald-600 border-x border-b border-stone-200 hover:border-emerald-600 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200/60 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Home className="w-6 h-6 text-emerald-700" />
              </div>
              <h2 className="text-xl font-bold text-stone-900 font-display">
                Houses & Apartments
              </h2>
              <p className="text-xs text-stone-600 leading-relaxed">
                Find houses, luxury duplexes, bungalows, and flats for sale or rent with verified amenity listings and clear rental payment schedules.
              </p>
            </div>
            <div className="pt-4 mt-2 flex items-center gap-1.5 text-xs font-bold text-emerald-800 group-hover:gap-2.5 transition-all">
              <span>Browse Residential</span>
              <ChevronRight className="w-4 h-4 text-amber-500" />
            </div>
          </div>

          {/* Card 2: Land */}
          <div 
            onClick={() => onNavigateTab('land')}
            className="group bg-white p-7 rounded-2xl border-t-4 border-t-amber-500 border-x border-b border-stone-200 hover:border-amber-500 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Trees className="w-6 h-6 text-amber-600" />
              </div>
              <h2 className="text-xl font-bold text-stone-900 font-display">
                Land Marketplace
              </h2>
              <p className="text-xs text-stone-600 leading-relaxed">
                Discover residential, commercial, and agricultural land with transparent document disclosure (C of O, Gazette, Registered Survey, R of O).
              </p>
            </div>
            <div className="pt-4 mt-2 flex items-center gap-1.5 text-xs font-bold text-amber-800 group-hover:gap-2.5 transition-all">
              <span>Explore Land Parcels</span>
              <ChevronRight className="w-4 h-4 text-emerald-600" />
            </div>
          </div>

          {/* Card 3: Map Search */}
          <div 
            onClick={() => onNavigateTab('map')}
            className="group bg-white p-7 rounded-2xl border-t-4 border-t-emerald-700 border-x border-b border-stone-200 hover:border-emerald-600 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-50/70 text-emerald-900 border border-emerald-200 flex items-center justify-center group-hover:scale-105 transition-transform">
                <MapIcon className="w-6 h-6 text-emerald-700" />
              </div>
              <h2 className="text-xl font-bold text-stone-900 font-display">
                Map-Based Search
              </h2>
              <p className="text-xs text-stone-600 leading-relaxed">
                Explore listings geographically across Nigerian hubs like Abuja, Lagos, Enugu, and Port Harcourt while protecting seller privacy through approximate map positioning.
              </p>
            </div>
            <div className="pt-4 mt-2 flex items-center gap-1.5 text-xs font-bold text-emerald-800 group-hover:gap-2.5 transition-all">
              <span>Launch Map Explorer</span>
              <ChevronRight className="w-4 h-4 text-amber-500" />
            </div>
          </div>
        </div>
      </section>

      {/* 3. Featured Verified Properties Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b-2 border-emerald-800/20 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
              Curated Selection
            </span>
            <h2 className="text-2xl font-bold text-stone-900 font-display mt-0.5">
              Verified Properties for Sale & Rent
            </h2>
            <p className="text-xs text-stone-500">
              Only listings that have completed our defined compliance audit earn the Verified badge.
            </p>
          </div>

          <button
            onClick={() => onNavigateTab('buy')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-950 hover:underline cursor-pointer"
          >
            <span>View All Properties</span>
            <ArrowRight className="w-3.5 h-3.5 text-amber-600" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProperties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              onSelect={onSelectProperty}
            />
          ))}
        </div>
      </section>

      {/* 4. Anti-Scam & Verification Assurance Trust Block with Green, Gold & White Palette */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-emerald-950 via-emerald-900 to-stone-900 text-white rounded-3xl p-8 sm:p-10 border-2 border-amber-400/40 shadow-xl space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-emerald-800/80 pb-6 relative z-10">
            <div className="space-y-1 max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                The Gerald Property Hub Standard
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-white font-display">
                Real Protection Against Common Nigerian Property Hurdles
              </h3>
              <p className="text-xs text-stone-200 leading-relaxed">
                Many Nigerians struggle with fake asking prices, unverified intermediaries, sold-out listings, and dubious land documents. Our platform establishes strict verification boundaries.
              </p>
            </div>

            <button
              onClick={() => onNavigateTab('disclaimer')}
              className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-stone-950 rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer shrink-0 self-start md:self-auto"
            >
              Read Verification Protocols →
            </button>
          </div>

          {/* 3 Pillar Promises with Gold Icons and Crisp White Prose */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs relative z-10">
            <div className="space-y-2 bg-emerald-900/40 p-4 rounded-xl border border-emerald-700/50">
              <div className="font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Zero False Verification Claims</span>
              </div>
              <p className="text-stone-300 leading-relaxed">
                Never claim a property is legally verified unless actual verification has been completed. User-submitted information is always distinguished from platform-audited data.
              </p>
            </div>

            <div className="space-y-2 bg-emerald-900/40 p-4 rounded-xl border border-emerald-700/50">
              <div className="font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Explicit Rental Frequency</span>
              </div>
              <p className="text-stone-300 leading-relaxed">
                We never assume a rental price is monthly or yearly. Every listing explicitly shows the billing cycle so tenants face zero hidden surprise fees.
              </p>
            </div>

            <div className="space-y-2 bg-emerald-900/40 p-4 rounded-xl border border-emerald-700/50">
              <div className="font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Direct WhatsApp & Call Connect</span>
              </div>
              <p className="text-stone-300 leading-relaxed">
                Reach verified owners and registered agents directly on WhatsApp with pre-filled property inquiries. No invented or mock phone numbers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Footer */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 border-t border-stone-200 text-xs text-stone-500 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-base font-bold text-stone-900 font-display block">
              Gerald Property Hub
            </span>
            <span className="text-stone-400 block mt-0.5">
              “Find It. Verify It. Own It.” · Founder: Mr Gerald N. Uzor
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-stone-600">
            <button onClick={() => onNavigateTab('buy')} className="hover:text-stone-900">Buy Houses</button>
            <button onClick={() => onNavigateTab('rent')} className="hover:text-stone-900">Rent Property</button>
            <button onClick={() => onNavigateTab('land')} className="hover:text-stone-900">Land Marketplace</button>
            <button onClick={() => onNavigateTab('map')} className="hover:text-stone-900">Geographic Map</button>
            <button onClick={() => onNavigateTab('buyer-requests')} className="hover:text-stone-900">Buyer Requests</button>
            <button onClick={() => onNavigateTab('disclaimer')} className="hover:text-stone-900 font-semibold text-emerald-800">Legal & Verification</button>
          </div>
        </div>

        <div className="pt-4 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-stone-400">
          <p>© 2026 Gerald Property Hub. Built for Nigeria with ₦ (NGN) currency standards.</p>
          <p>{LEGAL_DISCLAIMERS.antiScamWarning}</p>
        </div>
      </footer>
    </div>
  );
};
