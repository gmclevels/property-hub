import React, { useState, useMemo } from 'react';
import { Search, RotateCcw, Filter, SlidersHorizontal, Check, ChevronDown } from 'lucide-react';
import { Property, PropertyStatus, UserRole } from '../types';
import { useProperties } from '../context/PropertyContext';
import { PropertyCard } from './PropertyCard';
import { NIGERIAN_STATES, ALL_STATE_NAMES } from '../data/nigerianLocations';
import { formatCompactNaira, formatNaira } from '../utils/formatters';

interface BuyPageProps {
  onSelectProperty: (property: Property) => void;
  initialSearchQuery?: string;
}

export const BuyPage: React.FC<BuyPageProps> = ({ onSelectProperty, initialSearchQuery = '' }) => {
  const { properties } = useProperties();

  // Filters State
  const [searchKeyword, setSearchKeyword] = useState(initialSearchQuery);
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [minPrice, setMinPrice] = useState<number | ''>('');
  const [maxPrice, setMaxPrice] = useState<number | ''>('');
  const [minBeds, setMinBeds] = useState<number | ''>('');
  const [minBaths, setMinBaths] = useState<number | ''>('');
  const [statusFilter, setStatusFilter] = useState<PropertyStatus | 'all'>('available');
  const [listingTypeFilter, setListingTypeFilter] = useState<UserRole | 'all'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'price-asc' | 'price-desc'>('newest');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Available cities/areas based on chosen state
  const availableCities = useMemo(() => {
    if (!selectedState) return [];
    const stateObj = NIGERIAN_STATES.find((s) => s.state === selectedState);
    return stateObj ? stateObj.majorCities : [];
  }, [selectedState]);

  const propertyTypes = [
    'All Types',
    'Duplex',
    'Detached house',
    'Semi-detached house',
    'Bungalow',
    'Apartment',
    'Flat',
    'Mansion',
    'Residential land',
    'Commercial land',
    'Commercial building'
  ];

  const filteredProperties = useMemo(() => {
    return properties
      .filter((p) => {
        // Must be for sale
        if (p.transactionType !== 'sale') return false;

        // Status filter
        if (statusFilter !== 'all' && p.status !== statusFilter) return false;

        // Listing type filter (owner, agent, developer)
        if (listingTypeFilter !== 'all' && p.ownerRole !== listingTypeFilter) return false;

        // State & City
        if (selectedState && p.state !== selectedState) return false;
        if (selectedCity && !p.city.toLowerCase().includes(selectedCity.toLowerCase())) return false;

        // Property Type
        if (selectedType && selectedType !== 'All Types') {
          if (!p.propertyType.toLowerCase().includes(selectedType.toLowerCase())) return false;
        }

        // Price
        if (minPrice !== '' && p.price < minPrice) return false;
        if (maxPrice !== '' && p.price > maxPrice) return false;

        // Bedrooms & Bathrooms
        if (minBeds !== '' && (p.bedrooms === undefined || p.bedrooms < minBeds)) return false;
        if (minBaths !== '' && (p.bathrooms === undefined || p.bathrooms < minBaths)) return false;

        // Keyword
        if (searchKeyword.trim()) {
          const q = searchKeyword.toLowerCase();
          const matchTitle = p.title.toLowerCase().includes(q);
          const matchArea = p.area.toLowerCase().includes(q);
          const matchCity = p.city.toLowerCase().includes(q);
          const matchState = p.state.toLowerCase().includes(q);
          const matchType = p.propertyType.toLowerCase().includes(q);
          if (!matchTitle && !matchArea && !matchCity && !matchState && !matchType) return false;
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
    selectedCity,
    selectedType,
    minPrice,
    maxPrice,
    minBeds,
    minBaths,
    statusFilter,
    listingTypeFilter,
    sortBy
  ]);

  const handleResetFilters = () => {
    setSearchKeyword('');
    setSelectedState('');
    setSelectedCity('');
    setSelectedType('');
    setMinPrice('');
    setMaxPrice('');
    setMinBeds('');
    setMinBaths('');
    setStatusFilter('available');
    setListingTypeFilter('all');
    setSortBy('newest');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-emerald-700 mb-1">
            Properties For Sale
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 font-display">
            Buy Verified Properties Across Nigeria
          </h1>
          <p className="text-sm text-stone-500 mt-1">
            Discover verified houses, duplexes, bungalows, and titled lands for acquisition with complete pricing transparency.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="md:hidden inline-flex items-center gap-1.5 px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-medium rounded-lg"
          >
            <Filter className="w-3.5 h-3.5" />
            Filters
          </button>

          {/* Sort By Dropdown */}
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
      </div>

      {/* Main Filter Bar */}
      <div className={`bg-white rounded-xl border border-stone-200 p-4 sm:p-5 shadow-xs space-y-4 ${showMobileFilters ? 'block' : 'hidden md:block'}`}>
        {/* Row 1: Keyword search + State + City + Type */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Keyword */}
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3 pointer-events-none" />
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="Search area, title, or type..."
              className="w-full bg-stone-50 border border-stone-200 rounded-lg pl-9 pr-3 py-2 text-xs text-stone-900 placeholder-stone-400 focus:outline-hidden focus:ring-1 focus:ring-emerald-600"
            />
          </div>

          {/* State */}
          <div>
            <select
              value={selectedState}
              onChange={(e) => {
                setSelectedState(e.target.value);
                setSelectedCity('');
              }}
              className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs text-stone-800 focus:outline-hidden focus:ring-1 focus:ring-emerald-600"
            >
              <option value="">All Nigerian States (36 + FCT)</option>
              {ALL_STATE_NAMES.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          {/* City / Area */}
          <div>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              disabled={!selectedState}
              className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs text-stone-800 disabled:opacity-50 focus:outline-hidden focus:ring-1 focus:ring-emerald-600"
            >
              <option value="">{selectedState ? 'All Major Cities/Districts' : 'Select State First'}</option>
              {availableCities.map((city) => (
                <option key={city} value={city}>
                  {city}
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
              {propertyTypes.map((t) => (
                <option key={t} value={t === 'All Types' ? '' : t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Row 2: Price range, Beds, Status, Listing Type & Reset */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-1 border-t border-stone-100">
          {/* Min Price */}
          <div>
            <label className="text-[10px] font-semibold uppercase text-stone-400 block mb-0.5">Min Price (₦)</label>
            <input
              type="number"
              placeholder="e.g. 10000000"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value ? Number(e.target.value) : '')}
              className="w-full bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1.5 text-xs text-stone-900 tabular-nums focus:outline-hidden focus:ring-1 focus:ring-emerald-600"
            />
          </div>

          {/* Max Price */}
          <div>
            <label className="text-[10px] font-semibold uppercase text-stone-400 block mb-0.5">Max Price (₦)</label>
            <input
              type="number"
              placeholder="e.g. 90000000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : '')}
              className="w-full bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1.5 text-xs text-stone-900 tabular-nums focus:outline-hidden focus:ring-1 focus:ring-emerald-600"
            />
          </div>

          {/* Bedrooms */}
          <div>
            <label className="text-[10px] font-semibold uppercase text-stone-400 block mb-0.5">Min Beds</label>
            <select
              value={minBeds}
              onChange={(e) => setMinBeds(e.target.value ? Number(e.target.value) : '')}
              className="w-full bg-stone-50 border border-stone-200 rounded-lg px-2 py-1.5 text-xs text-stone-800 focus:outline-hidden focus:ring-1 focus:ring-emerald-600"
            >
              <option value="">Any</option>
              <option value="1">1+ Bed</option>
              <option value="2">2+ Beds</option>
              <option value="3">3+ Beds</option>
              <option value="4">4+ Beds</option>
              <option value="5">5+ Beds</option>
            </select>
          </div>

          {/* Listing Status */}
          <div>
            <label className="text-[10px] font-semibold uppercase text-stone-400 block mb-0.5">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full bg-stone-50 border border-stone-200 rounded-lg px-2 py-1.5 text-xs text-stone-800 focus:outline-hidden focus:ring-1 focus:ring-emerald-600"
            >
              <option value="available">Available</option>
              <option value="reserved">Reserved</option>
              <option value="sold">Sold</option>
              <option value="all">All Statuses</option>
            </select>
          </div>

          {/* Seller / Listing Type */}
          <div>
            <label className="text-[10px] font-semibold uppercase text-stone-400 block mb-0.5">Listed By</label>
            <select
              value={listingTypeFilter}
              onChange={(e) => setListingTypeFilter(e.target.value as any)}
              className="w-full bg-stone-50 border border-stone-200 rounded-lg px-2 py-1.5 text-xs text-stone-800 focus:outline-hidden focus:ring-1 focus:ring-emerald-600"
            >
              <option value="all">All Types</option>
              <option value="owner">Direct Owner</option>
              <option value="agent">Licensed Agent</option>
              <option value="developer">Developer</option>
            </select>
          </div>

          {/* Reset Action */}
          <div className="flex items-end">
            <button
              onClick={handleResetFilters}
              className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      {/* Results Count & Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-stone-500">
          <span>Showing <strong className="text-stone-900">{filteredProperties.length}</strong> properties for sale</span>
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
            <p className="text-stone-600 text-sm">
              No properties match your exact filters.
            </p>
            <button
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-700 text-white rounded-lg text-xs font-semibold hover:bg-emerald-800 transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
