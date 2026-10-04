import React, { useState, useMemo } from 'react';
import { Trees, Search, RotateCcw, ShieldCheck, AlertCircle, FileCheck2, MapPin } from 'lucide-react';
import { Property, DocumentType } from '../types';
import { useProperties } from '../context/PropertyContext';
import { PropertyCard } from './PropertyCard';
import { ALL_STATE_NAMES } from '../data/nigerianLocations';
import { LEGAL_DISCLAIMERS } from '../utils/formatters';

interface LandPageProps {
  onSelectProperty: (property: Property) => void;
}

export const LandPage: React.FC<LandPageProps> = ({ onSelectProperty }) => {
  const { properties } = useProperties();

  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedPurpose, setSelectedPurpose] = useState('');
  const [selectedDocument, setSelectedDocument] = useState<DocumentType | ''>('');
  const [maxPrice, setMaxPrice] = useState<number | ''>('');
  const [sortBy, setSortBy] = useState<'newest' | 'price-asc' | 'price-desc'>('newest');

  const documentTypes: DocumentType[] = [
    'C of O',
    'Deed of Assignment',
    'Gazette',
    'Registered Survey',
    "Governor's Consent",
    'Excision',
    'Other',
    'Not specified'
  ];

  const filteredLands = useMemo(() => {
    return properties
      .filter((p) => {
        // Must be in Land category or land type
        if (p.category !== 'Land' && !p.propertyType.toLowerCase().includes('land')) return false;

        // State
        if (selectedState && p.state !== selectedState) return false;

        // Purpose
        if (selectedPurpose && p.landPurpose !== selectedPurpose) return false;

        // Document Type
        if (selectedDocument && p.documentType !== selectedDocument) return false;

        // Price
        if (maxPrice !== '' && p.price > maxPrice) return false;

        // Keyword
        if (searchKeyword.trim()) {
          const q = searchKeyword.toLowerCase();
          const matchTitle = p.title.toLowerCase().includes(q);
          const matchArea = p.area.toLowerCase().includes(q);
          const matchCity = p.city.toLowerCase().includes(q);
          const matchDoc = p.documentDetails?.toLowerCase().includes(q);
          if (!matchTitle && !matchArea && !matchCity && !matchDoc) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [properties, searchKeyword, selectedState, selectedPurpose, selectedDocument, maxPrice, sortBy]);

  const handleReset = () => {
    setSearchKeyword('');
    setSelectedState('');
    setSelectedPurpose('');
    setSelectedDocument('');
    setMaxPrice('');
    setSortBy('newest');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-emerald-700 mb-1 flex items-center gap-1.5">
            <Trees className="w-3.5 h-3.5" />
            Land Marketplace
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 font-display">
            Residential, Commercial & Agricultural Land Across Nigeria
          </h1>
          <p className="text-sm text-stone-500 mt-1 max-w-3xl">
            Acquire verified parcels, dry plots, and commercial corridors with clear land title documentation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-stone-500 font-medium">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="text-xs bg-white border border-stone-200 rounded-lg px-2.5 py-1.5 text-stone-800 focus:outline-hidden focus:ring-1 focus:ring-emerald-600"
          >
            <option value="newest">Newest Listed</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Mandatory Document Verification Notice */}
      <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-4 flex items-start gap-3 text-amber-950 text-xs">
        <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold block">Document Verification Standard</span>
          <p>{LEGAL_DISCLAIMERS.documentNotice}</p>
          <p className="text-amber-800 text-[11px]">
            Never pay for land without a physical coordinates survey check and independent land registry search at AGIS (Abuja) or the relevant State Ministry of Lands.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-xl border border-stone-200 p-4 sm:p-5 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Keyword */}
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3 pointer-events-none" />
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="Search area (e.g. Gwagwalada)..."
              className="w-full bg-stone-50 border border-stone-200 rounded-lg pl-9 pr-3 py-2 text-xs text-stone-900 placeholder-stone-400 focus:outline-hidden focus:ring-1 focus:ring-emerald-600"
            />
          </div>

          {/* State */}
          <div>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs text-stone-800 focus:outline-hidden focus:ring-1 focus:ring-emerald-600"
            >
              <option value="">All Nigerian States</option>
              {ALL_STATE_NAMES.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          {/* Purpose */}
          <div>
            <select
              value={selectedPurpose}
              onChange={(e) => setSelectedPurpose(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs text-stone-800 focus:outline-hidden focus:ring-1 focus:ring-emerald-600"
            >
              <option value="">All Land Purposes</option>
              <option value="Residential">Residential</option>
              <option value="Commercial">Commercial</option>
              <option value="Agricultural">Agricultural</option>
              <option value="Industrial">Industrial</option>
              <option value="Mixed-use">Mixed-use</option>
            </select>
          </div>

          {/* Title Document */}
          <div>
            <select
              value={selectedDocument}
              onChange={(e) => setSelectedDocument(e.target.value as any)}
              className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs text-stone-800 focus:outline-hidden focus:ring-1 focus:ring-emerald-600"
            >
              <option value="">All Document Types</option>
              {documentTypes.map((doc) => (
                <option key={doc} value={doc}>
                  {doc}
                </option>
              ))}
            </select>
          </div>

          {/* Max Price */}
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="Max Price (₦)"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : '')}
              className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs text-stone-900 tabular-nums focus:outline-hidden focus:ring-1 focus:ring-emerald-600"
            />
            <button
              onClick={handleReset}
              className="px-2.5 py-2 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer shrink-0"
              title="Reset"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="space-y-4">
        <div className="text-xs text-stone-500">
          Showing <strong className="text-stone-900">{filteredLands.length}</strong> land listings
        </div>

        {filteredLands.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLands.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                onSelect={onSelectProperty}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-stone-200 p-12 text-center space-y-3">
            <p className="text-stone-600 text-sm">No land parcels match your selected location or title filter.</p>
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-700 text-white rounded-lg text-xs font-semibold hover:bg-emerald-800 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
