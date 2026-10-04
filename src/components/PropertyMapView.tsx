import React, { useState, useMemo } from 'react';
import { MapPin, Search, Layers, Compass, ExternalLink, ShieldCheck, CheckCircle2, Info, Eye } from 'lucide-react';
import { Property } from '../types';
import { useProperties } from '../context/PropertyContext';
import { formatCompactNaira, formatNaira } from '../utils/formatters';

interface PropertyMapViewProps {
  onSelectProperty: (property: Property) => void;
}

export const PropertyMapView: React.FC<PropertyMapViewProps> = ({ onSelectProperty }) => {
  const { properties } = useProperties();
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(properties[0]?.id || null);
  const [filterType, setFilterType] = useState<string>('all');
  const [locationSearch, setLocationSearch] = useState<string>('');

  const filteredProperties = useMemo(() => {
    return properties.filter((p) => {
      if (filterType !== 'all') {
        if (filterType === 'sale' && p.transactionType !== 'sale') return false;
        if (filterType === 'rent' && p.transactionType !== 'rent') return false;
        if (filterType === 'land' && p.category !== 'Land') return false;
      }
      if (locationSearch.trim()) {
        const q = locationSearch.toLowerCase();
        const matchesLoc = p.state.toLowerCase().includes(q) || p.city.toLowerCase().includes(q) || p.area.toLowerCase().includes(q);
        if (!matchesLoc) return false;
      }
      return true;
    });
  }, [properties, filterType, locationSearch]);

  const activeProperty = properties.find((p) => p.id === selectedPropertyId) || filteredProperties[0] || null;

  // Approximate center of Nigeria bounding box for interactive projection:
  // Lat: 4.5 to 13.5 (Delta: 9.0)
  // Lng: 3.0 to 14.5 (Delta: 11.5)
  const getMarkerPosition = (lat?: number, lng?: number) => {
    const defaultLat = 9.0765; // Abuja
    const defaultLng = 7.3986;
    const finalLat = lat || defaultLat;
    const finalLng = lng || defaultLng;

    // Convert to percentage coordinates across Nigeria SVG plane
    const topPercent = Math.max(10, Math.min(90, ((13.5 - finalLat) / 9.0) * 100));
    const leftPercent = Math.max(10, Math.min(90, ((finalLng - 3.0) / 11.5) * 100));

    return { top: `${topPercent}%`, left: `${leftPercent}%` };
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4">
      {/* Top Header & Search Filter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-stone-900 font-display flex items-center gap-2">
            <Compass className="w-5 h-5 text-emerald-700" />
            Nigeria Property Map Explorer
          </h1>
          <p className="text-xs text-stone-500">
            Interactive geographic discovery across Nigerian states. Approximate district positioning protects seller privacy.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Search Location */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              value={locationSearch}
              onChange={(e) => setLocationSearch(e.target.value)}
              placeholder="Filter by city/area..."
              className="bg-stone-50 border border-stone-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-stone-900 placeholder-stone-400 focus:outline-hidden focus:ring-1 focus:ring-emerald-600"
            />
          </div>

          {/* Quick Segmented Filter */}
          <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-lg text-xs font-medium text-stone-600">
            <button
              onClick={() => setFilterType('all')}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                filterType === 'all' ? 'bg-white text-stone-900 shadow-xs' : 'hover:text-stone-900'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterType('sale')}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                filterType === 'sale' ? 'bg-white text-stone-900 shadow-xs' : 'hover:text-stone-900'
              }`}
            >
              For Sale
            </button>
            <button
              onClick={() => setFilterType('rent')}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                filterType === 'rent' ? 'bg-white text-stone-900 shadow-xs' : 'hover:text-stone-900'
              }`}
            >
              For Rent
            </button>
            <button
              onClick={() => setFilterType('land')}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                filterType === 'land' ? 'bg-white text-stone-900 shadow-xs' : 'hover:text-stone-900'
              }`}
            >
              Land
            </button>
          </div>
        </div>
      </div>

      {/* Main Map Layout: Canvas + Property Detail Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive Map Visual Stage */}
        <div className="lg:col-span-2 relative aspect-4/3 sm:aspect-16/10 bg-gradient-to-b from-stone-100 via-emerald-50/20 to-stone-100 rounded-2xl border border-stone-300 shadow-inner overflow-hidden flex items-center justify-center p-4">
          {/* Subtle Grid Coordinates Background */}
          <div className="absolute inset-0 bg-[radial-gradient(#059669_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />

          {/* Nigeria Contour Outline Graphic */}
          <div className="relative w-full h-full max-w-2xl max-h-full">
            {/* SVG Nigeria Outline silhouette for authentic geographical orientation */}
            <svg
              viewBox="0 0 800 650"
              className="w-full h-full opacity-35 stroke-stone-400 fill-stone-200/50 stroke-[1.5]"
            >
              <path d="M 120 180 Q 250 80 400 90 Q 550 100 680 180 Q 720 280 650 420 Q 560 520 480 580 Q 320 600 200 520 Q 110 420 120 180 Z" />
              <text x="370" y="320" className="text-[18px] fill-stone-400 font-bold tracking-widest uppercase">
                Nigeria
              </text>
              <text x="360" y="345" className="text-[12px] fill-stone-400 font-medium">
                (FCT Abuja Corridor)
              </text>
            </svg>

            {/* Geographic Regional Reference Labels */}
            <div className="absolute top-[28%] left-[45%] text-[10px] font-bold text-stone-600 uppercase tracking-wider bg-white/70 px-1.5 py-0.5 rounded-sm shadow-xs pointer-events-none">
              FCT Abuja
            </div>
            <div className="absolute top-[68%] left-[16%] text-[10px] font-bold text-stone-600 uppercase tracking-wider bg-white/70 px-1.5 py-0.5 rounded-sm shadow-xs pointer-events-none">
              Lagos
            </div>
            <div className="absolute top-[65%] left-[58%] text-[10px] font-bold text-stone-600 uppercase tracking-wider bg-white/70 px-1.5 py-0.5 rounded-sm shadow-xs pointer-events-none">
              Enugu
            </div>
            <div className="absolute top-[80%] left-[50%] text-[10px] font-bold text-stone-600 uppercase tracking-wider bg-white/70 px-1.5 py-0.5 rounded-sm shadow-xs pointer-events-none">
              Port Harcourt
            </div>

            {/* Interactive Markers on Map Canvas */}
            {filteredProperties.map((prop) => {
              const pos = getMarkerPosition(prop.approximateLocation?.lat, prop.approximateLocation?.lng);
              const isSelected = prop.id === activeProperty?.id;

              return (
                <div
                  key={prop.id}
                  style={{ top: pos.top, left: pos.left }}
                  onClick={() => setSelectedPropertyId(prop.id)}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group cursor-pointer"
                >
                  {/* Pin button with Compact Price */}
                  <div
                    className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold shadow-md transition-all transform duration-150 ${
                      isSelected
                        ? 'bg-emerald-700 text-white ring-4 ring-emerald-300 scale-110'
                        : 'bg-white text-stone-900 border border-stone-300 hover:scale-105 hover:border-emerald-600'
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
                    <span className="tabular-nums font-display">{formatCompactNaira(prop.price)}</span>
                  </div>

                  {/* Hover Marker Tooltip */}
                  <div className="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 w-44 bg-stone-900 text-white text-[11px] p-2 rounded-lg shadow-lg pointer-events-none z-30">
                    <div className="font-semibold truncate">{prop.title}</div>
                    <div className="text-stone-300 text-[10px]">
                      {prop.area}, {prop.city}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Map Controls & Safeguard Badge */}
          <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-xs border border-stone-200 text-stone-700 text-[11px] px-2.5 py-1.5 rounded-lg shadow-xs flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Approximate map positioning active for privacy security</span>
          </div>
        </div>

        {/* Selected Property Preview Sidebar */}
        <div className="space-y-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-stone-500 flex items-center justify-between">
            <span>Selected Map Location</span>
            <span className="text-stone-400">{filteredProperties.length} active pins</span>
          </div>

          {activeProperty ? (
            <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-4">
              <div className="relative aspect-16/10 rounded-xl overflow-hidden bg-stone-100">
                <img
                  src={activeProperty.images?.[0] || '/src/assets/images/hero_abuja_estate_1790850408390.jpg'}
                  alt={activeProperty.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2 bg-stone-900/70 text-white text-[10px] font-semibold uppercase px-2 py-0.5 rounded-xs">
                  {activeProperty.transactionType === 'sale' ? 'For Sale' : 'For Rent'}
                </div>
              </div>

              <div>
                <div className="flex items-baseline justify-between">
                  <span className="text-xl font-bold text-emerald-800 tabular-nums font-display">
                    {formatNaira(activeProperty.price)}
                    {activeProperty.transactionType === 'rent' && activeProperty.rentalFrequency && (
                      <span className="text-xs text-stone-500 font-normal">/{activeProperty.rentalFrequency}</span>
                    )}
                  </span>
                  <span className="text-xs font-semibold text-stone-600">{activeProperty.propertyType}</span>
                </div>

                <h3 className="font-semibold text-stone-900 text-base mt-1 line-clamp-2">
                  {activeProperty.title}
                </h3>

                <div className="flex items-center gap-1 text-xs text-stone-500 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <span>
                    {activeProperty.area}, {activeProperty.city}, {activeProperty.state}
                  </span>
                </div>

                {activeProperty.approximateLocation?.addressNote && (
                  <p className="text-[11px] text-stone-400 mt-1 italic">
                    Note: {activeProperty.approximateLocation.addressNote}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-stone-100 text-xs text-stone-600">
                {activeProperty.bedrooms !== undefined && (
                  <span>{activeProperty.bedrooms} Beds · </span>
                )}
                {activeProperty.bathrooms !== undefined && (
                  <span>{activeProperty.bathrooms} Baths · </span>
                )}
                {activeProperty.landSize && (
                  <span>{activeProperty.landSize}</span>
                )}
              </div>

              <button
                onClick={() => onSelectProperty(activeProperty)}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              >
                <Eye className="w-4 h-4" />
                View Full Property Details
              </button>
            </div>
          ) : (
            <div className="bg-stone-50 border border-stone-200 rounded-2xl p-8 text-center text-xs text-stone-500">
              No property selected on the map. Click on any marker pin to inspect details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
