import React from 'react';
import { Heart, MapPin, ShieldCheck, Clock, ShieldAlert, CheckCircle2, Layers } from 'lucide-react';
import { Property } from '../types';
import { formatNaira, formatDate } from '../utils/formatters';
import { useProperties } from '../context/PropertyContext';

interface PropertyCardProps {
  property: Property;
  onSelect: (property: Property) => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property, onSelect }) => {
  const { isSaved, saveProperty, unsaveProperty, comparedPropertyIds, toggleCompare } = useProperties();
  const saved = isSaved(property.id);
  const isCompared = comparedPropertyIds.includes(property.id);

  const handleSaveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (saved) {
      unsaveProperty(property.id);
    } else {
      saveProperty(property.id);
    }
  };

  const handleCompareClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleCompare(property.id);
  };

  // Verification status text & indicator
  const renderVerificationIndicator = () => {
    if (property.verificationStatus === 'VERIFIED') {
      return (
        <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 fill-amber-400" />
          Verified
        </span>
      );
    }
    if (property.verificationStatus === 'VERIFICATION_PENDING') {
      return (
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
          <Clock className="w-3.5 h-3.5 text-amber-600" />
          Verification Pending
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-xs text-stone-500 bg-stone-50 px-2 py-0.5 rounded-md border border-stone-200">
        <ShieldAlert className="w-3.5 h-3.5 text-stone-400" />
        Unverified
      </span>
    );
  };

  const mainImage = property.images && property.images.length > 0
    ? property.images[0]
    : '/src/assets/images/hero_abuja_estate_1790850408390.jpg';

  return (
    <div
      onClick={() => onSelect(property)}
      className="group relative bg-white border border-stone-200 rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 flex flex-col cursor-pointer"
    >
      {/* Photo Container */}
      <div className="relative aspect-4/3 w-full bg-stone-100 overflow-hidden">
        <img
          src={mainImage}
          alt={property.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
          onError={(e) => {
            // Resilient fallback
            (e.target as HTMLImageElement).src = '/src/assets/images/hero_abuja_estate_1790850408390.jpg';
          }}
        />

        {/* Gradient scrim for legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

        {/* Top bar controls on image */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
          {/* Demo Listing & Transaction indicator */}
          <div className="flex items-center gap-1.5">
            {property.isDemo && (
              <span className="text-[10px] font-bold tracking-wider uppercase text-amber-950 bg-amber-400/90 backdrop-blur-xs px-2 py-0.5 rounded-sm">
                DEMO LISTING
              </span>
            )}
            <span className="text-[11px] font-semibold text-white bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded-sm uppercase tracking-wide">
              {property.transactionType === 'sale' ? 'For Sale' : 'For Rent'}
            </span>
          </div>

          {/* Action buttons (Save & Compare) */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleCompareClick}
              className={`p-1.5 rounded-full backdrop-blur-xs transition-colors cursor-pointer ${
                isCompared
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white/80 hover:bg-white text-stone-700'
              }`}
              title={isCompared ? 'Remove from comparison' : 'Compare property'}
            >
              <Layers className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleSaveClick}
              className={`p-1.5 rounded-full backdrop-blur-xs transition-colors cursor-pointer ${
                saved
                  ? 'bg-rose-50 text-rose-600 fill-rose-600'
                  : 'bg-white/80 hover:bg-white text-stone-700'
              }`}
              title={saved ? 'Remove from saved' : 'Save property'}
            >
              <Heart className={`w-3.5 h-3.5 ${saved ? 'fill-rose-600 text-rose-600' : ''}`} />
            </button>
          </div>
        </div>

        {/* Price Tag positioned over bottom of photo */}
        <div className="absolute bottom-2.5 left-3 right-3 flex items-baseline justify-between text-white">
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold tracking-tight tabular-nums font-display drop-shadow-xs">
              {formatNaira(property.price)}
            </span>
            {property.transactionType === 'rent' && property.rentalFrequency && (
              <span className="text-xs text-stone-200 lowercase">
                /{property.rentalFrequency}
              </span>
            )}
          </div>
          <span className="text-[11px] text-stone-300 drop-shadow-xs">
            {formatDate(property.createdAt)}
          </span>
        </div>
      </div>

      {/* Details Container */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Unboxed Metadata Line with typographic separators (Rule 1.A) */}
          <div className="flex items-center gap-2 text-xs text-stone-500 mb-1">
            <span className="font-medium text-stone-700">{property.propertyType}</span>
            <span aria-hidden="true">·</span>
            <span>{property.state}</span>
          </div>

          {/* Title */}
          <h3 className="font-semibold text-stone-900 text-base line-clamp-1 group-hover:text-emerald-800 transition-colors">
            {property.title}
          </h3>

          {/* Location */}
          <div className="flex items-center gap-1 text-xs text-stone-600 mt-1.5">
            <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
            <span className="truncate">
              {property.area}, {property.city}
            </span>
          </div>

          {/* Spec details with typographic separators */}
          <div className="flex items-center gap-2 text-xs text-stone-600 mt-3 pt-2.5 border-t border-stone-100">
            {property.bedrooms !== undefined && (
              <>
                <span className="tabular-nums font-medium text-stone-900">
                  {property.bedrooms} <span className="text-stone-500 font-normal">Beds</span>
                </span>
                <span aria-hidden="true" className="text-stone-300">·</span>
              </>
            )}
            {property.bathrooms !== undefined && (
              <>
                <span className="tabular-nums font-medium text-stone-900">
                  {property.bathrooms} <span className="text-stone-500 font-normal">Baths</span>
                </span>
                <span aria-hidden="true" className="text-stone-300">·</span>
              </>
            )}
            {property.landSize && (
              <span className="tabular-nums font-medium text-stone-900">
                {property.landSize}
              </span>
            )}
          </div>
        </div>

        {/* Footer / Seller & Verification */}
        <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
          <div className="flex flex-col truncate pr-2">
            <span className="text-[10px] uppercase tracking-wider text-stone-400 font-medium">Seller</span>
            <span className="font-medium text-stone-800 truncate">
              {property.sellerName}
            </span>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            {renderVerificationIndicator()}
          </div>
        </div>
      </div>
    </div>
  );
};
