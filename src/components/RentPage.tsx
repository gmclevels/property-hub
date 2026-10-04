import React, { useState, useMemo } from 'react';
import { Search, RotateCcw, Filter, Check, ShieldCheck, Zap, Droplet } from 'lucide-react';
import { Property, RentalFrequency } from '../types';
import { useProperties } from '../context/PropertyContext';
import { PropertyCard } from './PropertyCard';
import { ALL_STATE_NAMES } from '../data/nigerianLocations';

interface RentPageProps {
  onSelectProperty: (property: Property) => void;
}

export const RentPage: React.FC<RentPageProps> = ({ onSelectProperty }) => {
  const { properties } = useProperties();

  // Filters State
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [rentalFrequency, setRentalFrequency] = useState<RentalFrequency | 'all'>('all');
  const [maxRent, setMaxRent] = useState<number | ''>('');
  const [minBeds, setMinBeds] = useState<number | ''>('');
  const [filterSecurity, setFilterSecurity] = useState(false);
  const [filterWater, setFilterWater] = useState(false);
  const [filterPower, setFilterPower] = useState(false);
  const [filterParking, setFilterParking] = useState(false);
  const [sortBy, setSortBy] = useState<'newest' | 'price-asc' | 'price-desc'>('newest');

  const rentalTypes = [
    'All Types',
    'Apartment',
    'Flat',
    'Self-contained',
    'Room and parlour',
    'Studio apartment',
    'Duplex',
    'Bungalow',
    'Shop',
    'Office'
  ];

  const filteredProperties = useMemo(() => {
    return properties
      .filter((p) => {
        // Must be rental
        if (p.transactionType !== 'rent') return false;

        // Rental frequency (monthly vs yearly - strictly respected)
        if (rentalFrequency !== 'all' && p.rentalFrequency !== rentalFrequency) {
          return false;
        }

        // State
        if (selectedState && p.state !== selectedState) return false;

        // Type
        if (selectedType && selectedType !== 'All Types') {
          if (!p.propertyType.toLowerCase().includes(selectedType.toLowerCase())) return false;
        }

        // Max rent
        if (maxRent !== '' && p.price > maxRent) return false;

        // Bedrooms
        if (minBeds !== '' && (p.bedrooms === undefined || p.bedrooms < minBeds)) return false;

        // Amenity toggles
        if (filterSecurity) {
          const hasSec = p.features.some((f) => f.toLowerCase().includes('security') || f.toLowerCase().includes('cctv'));
          if (!hasSec) return false;
        }
        if (filterWater) {
          const hasWater = p.features.some((f) => f.toLowerCase().includes('water') || f.toLowerCase().includes('borehole'));
          if (!hasWater) return false;
        }
        if (filterPower) {
          const hasPower = p.features.some((f) => f.toLowerCase().includes('power') || f.toLowerCase().includes('generator') || f.toLowerCase().includes('inverter') || f.toLowerCase().includes('transformer'));
          if (!hasPower) return false;
        }
        if (filterParking) {
          const hasPark = p.features.some((f) => f.toLowerCase().includes('parking'));
          if (!hasPark) return false;
        }

        // Keyword
        if (searchKeyword.trim()) {
          const q = searchKeyword.toLowerCase();
          const matchTitle = p.title.toLowerCase().includes(q);
          const matchArea = p.area.toLowerCase().includes(q);
          const matchCity = p.city.toLowerCase().includes(q);
          if (!matchTitle && !matchArea && !matchCity) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [
    properties,
    searchKeyword,
    selectedState,
    selectedType,
    rentalFrequency,
    maxRent,
    minBeds,
    filterSecurity,
    filterWater,
    filterPower,
    filterParking,
    sortBy
  ]);

  const handleResetFilters = () => {
    setSearchKeyword('');
    setSelectedState('');
    setSelectedType('');
    setRentalFrequency('all');
    setMaxRent('');
    setMinBeds('');
    setFilterSecurity(false);
    setFilterWater(false);
    setFilterPower(false);
    setFilterParking(false);
    setSortBy('newest');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-emerald-700 mb-1">
            Rental Marketplace
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 font-display">
            Houses, Flats & Commercial Spaces for Rent
          </h1>
          <p className="text-sm text-stone-500 mt-1">
            Discover verified rentals with transparent billing terms. Rental prices explicitly state whether payment is Monthly or Yearly.
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
            <option value="price-asc">Rent: Low to High</option>
            <option value="price-desc">Rent: High to Low</option>
          </select>
        </div>
      </div>

      {/* Rental Filter Bar */}
      <div className="bg-white rounded-xl border border-stone-200 p-4 sm:p-5 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Keyword */}
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3 pointer-events-none" />
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="Search area (e.g. Lekki, Kubwa)..."
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
              <option value="">All States</option>
              {ALL_STATE_NAMES.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          {/* Property Type */}
          <div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs text-stone-800 focus:outline-hidden focus:ring-1 focus:ring-emerald-600"
            >
              {rentalTypes.map((t) => (
                <option key={t} value={t === 'All Types' ? '' : t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* Frequency Toggle: Monthly vs Yearly */}
          <div>
            <select
              value={rentalFrequency}
              onChange={(e) => setRentalFrequency(e.target.value as any)}
              className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs text-stone-800 font-medium focus:outline-hidden focus:ring-1 focus:ring-emerald-600"
            >
              <option value="all">All Payment Cycles</option>
              <option value="yearly">Yearly Rent</option>
              <option value="monthly">Monthly Rent</option>
            </select>
          </div>

          {/* Max Rent */}
          <div>
            <input
              type="number"
              placeholder="Max Rent Budget (₦)"
              value={maxRent}
              onChange={(e) => setMaxRent(e.target.value ? Number(e.target.value) : '')}
              className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs text-stone-900 tabular-nums focus:outline-hidden focus:ring-1 focus:ring-emerald-600"
            />
          </div>
        </div>

        {/* Essential Nigerian Rental Amenities Checkboxes */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-stone-100 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-semibold text-stone-500 uppercase text-[10px] tracking-wider">Amenities:</span>
            
            <label className="inline-flex items-center gap-1.5 cursor-pointer text-stone-700 hover:text-stone-900">
              <input
                type="checkbox"
                checked={filterWater}
                onChange={(e) => setFilterWater(e.target.checked)}
                className="rounded-sm text-emerald-600 focus:ring-emerald-500"
              />
              <Droplet className="w-3.5 h-3.5 text-blue-500" />
              <span>Borehole / Water</span>
            </label>

            <label className="inline-flex items-center gap-1.5 cursor-pointer text-stone-700 hover:text-stone-900">
              <input
                type="checkbox"
                checked={filterPower}
                onChange={(e) => setFilterPower(e.target.checked)}
                className="rounded-sm text-emerald-600 focus:ring-emerald-500"
              />
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>Standby Power / Gen</span>
            </label>

            <label className="inline-flex items-center gap-1.5 cursor-pointer text-stone-700 hover:text-stone-900">
              <input
                type="checkbox"
                checked={filterSecurity}
                onChange={(e) => setFilterSecurity(e.target.checked)}
                className="rounded-sm text-emerald-600 focus:ring-emerald-500"
              />
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Gated / 24hr Security</span>
            </label>

            <label className="inline-flex items-center gap-1.5 cursor-pointer text-stone-700 hover:text-stone-900">
              <input
                type="checkbox"
                checked={filterParking}
                onChange={(e) => setFilterParking(e.target.checked)}
                className="rounded-sm text-emerald-600 focus:ring-emerald-500"
              />
              <span>Dedicated Parking</span>
            </label>
          </div>

          <button
            onClick={handleResetFilters}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>
        </div>
      </div>

      {/* Results */}
      <div className="space-y-4">
        <div className="text-xs text-stone-500">
          Showing <strong className="text-stone-900">{filteredProperties.length}</strong> rental properties
        </div>

        {filteredProperties.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                onSelect={onSelectProperty}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-stone-200 p-12 text-center space-y-3">
            <p className="text-stone-600 text-sm">No rental listings match your specific search criteria.</p>
            <button
              onClick={handleResetFilters}
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
