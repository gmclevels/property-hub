import React, { useState, useEffect } from 'react';
import { 
  X, 
  MapPin, 
  Heart, 
  Phone, 
  MessageSquare, 
  ShieldCheck, 
  ShieldAlert, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Share2, 
  FileText, 
  Layers, 
  Home, 
  Calendar, 
  Compass, 
  Building,
  Flag
} from 'lucide-react';
import { Property } from '../types';
import { formatNaira, formatDate, createWhatsAppLink, LEGAL_DISCLAIMERS } from '../utils/formatters';
import { useProperties } from '../context/PropertyContext';

interface PropertyDetailsModalProps {
  property: Property | null;
  onClose: () => void;
  onOpenEnquiry: (property: Property) => void;
  onOpenReport: (property: Property) => void;
}

export const PropertyDetailsModal: React.FC<PropertyDetailsModalProps> = ({
  property,
  onClose,
  onOpenEnquiry,
  onOpenReport
}) => {
  const { isSaved, saveProperty, unsaveProperty, toggleCompare, comparedPropertyIds, incrementViewCount } = useProperties();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    if (property) {
      incrementViewCount(property.id);
      setSelectedImageIndex(0);
    }
  }, [property?.id]);

  if (!property) return null;

  const saved = isSaved(property.id);
  const isCompared = comparedPropertyIds.includes(property.id);
  const images = property.images && property.images.length > 0
    ? property.images
    : ['/src/assets/images/hero_abuja_estate_1790850408390.jpg'];

  const whatsappUrl = createWhatsAppLink(
    property.sellerWhatsapp || property.sellerPhone,
    property.title,
    `${property.area}, ${property.state}`
  );

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 md:p-6">
      <div 
        className="relative bg-white w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden border border-stone-200 my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-3">
            <span className="text-xs uppercase tracking-wider font-semibold text-stone-500">
              {property.category} Property Details
            </span>
            {property.isDemo && (
              <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-200 text-amber-900 px-2 py-0.5 rounded-sm">
                DEMO LISTING
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 text-stone-600 hover:text-stone-900 rounded-lg hover:bg-stone-200 transition-colors cursor-pointer"
              title="Share listing"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-stone-600 hover:text-stone-900 rounded-lg hover:bg-stone-200 transition-colors cursor-pointer"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Content Scrollable Area */}
        <div className="overflow-y-auto p-6 space-y-6 flex-1">
          {/* Photo Gallery Grid */}
          <div className="space-y-3">
            <div className="relative aspect-16/9 w-full bg-stone-100 rounded-xl overflow-hidden border border-stone-200">
              <img
                src={images[selectedImageIndex]}
                alt={property.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/src/assets/images/hero_abuja_estate_1790850408390.jpg';
                }}
              />
              <div className="absolute top-3 left-3 bg-stone-900/70 text-white text-xs px-2.5 py-1 rounded-md backdrop-blur-xs">
                {selectedImageIndex + 1} of {images.length} Photos
              </div>
            </div>

            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative w-20 h-16 rounded-lg overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                      selectedImageIndex === idx ? 'border-emerald-600 scale-95' : 'border-stone-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Header & Pricing */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pt-2 border-b border-stone-200 pb-5">
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center gap-2 text-xs text-stone-500">
                <span className="font-semibold text-stone-800">{property.propertyType}</span>
                <span>·</span>
                <span className="capitalize">{property.transactionType === 'sale' ? 'For Sale' : 'For Rent'}</span>
                <span>·</span>
                <span>Posted {formatDate(property.createdAt)}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 font-display">
                {property.title}
              </h1>
              <div className="flex items-center gap-1.5 text-sm text-stone-600">
                <MapPin className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>
                  {property.area}, {property.lga ? `${property.lga} LGA, ` : ''}{property.city}, {property.state}, Nigeria
                </span>
              </div>
              {property.approximateLocation?.addressNote && (
                <p className="text-xs text-stone-500 italic pl-5">
                  Location note: {property.approximateLocation.addressNote} (Exact private address safeguarded until inspection)
                </p>
              )}
            </div>

            <div className="flex flex-col items-start md:items-end justify-between shrink-0">
              <div className="text-2xl sm:text-3xl font-bold text-emerald-800 tabular-nums font-display">
                {formatNaira(property.price)}
                {property.transactionType === 'rent' && property.rentalFrequency && (
                  <span className="text-sm font-normal text-stone-500 lowercase ml-1">
                    /{property.rentalFrequency}
                  </span>
                )}
              </div>
              <span className="text-xs text-stone-500 mt-1">
                Status: <span className="font-semibold uppercase text-stone-800">{property.status}</span>
              </span>
            </div>
          </div>

          {/* Verification Transparency Box */}
          <div className={`p-4 rounded-xl border ${
            property.verificationStatus === 'VERIFIED'
              ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
              : property.verificationStatus === 'VERIFICATION_PENDING'
              ? 'bg-amber-50/70 border-amber-200 text-amber-950'
              : 'bg-stone-100 border-stone-200 text-stone-800'
          }`}>
            <div className="flex items-start gap-3">
              {property.verificationStatus === 'VERIFIED' ? (
                <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
              ) : property.verificationStatus === 'VERIFICATION_PENDING' ? (
                <Clock className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              ) : (
                <ShieldAlert className="w-5 h-5 text-stone-500 shrink-0 mt-0.5" />
              )}
              <div className="flex-1 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm">
                    {property.verificationStatus === 'VERIFIED'
                      ? 'Platform Verified Listing'
                      : property.verificationStatus === 'VERIFICATION_PENDING'
                      ? 'Verification Pending Review'
                      : 'Unverified Listing'}
                  </span>
                  {property.verificationRecord?.reviewedAt && (
                    <span className="text-[11px] text-stone-500">
                      Reviewed: {property.verificationRecord.reviewedAt}
                    </span>
                  )}
                </div>
                {property.verificationStatus === 'VERIFIED' ? (
                  <p>
                    Verified by {property.verificationRecord?.reviewedBy || 'Gerald Property Hub Compliance'}.
                    {property.verificationRecord?.verificationSource && ` Source: ${property.verificationRecord.verificationSource}.`}
                    {property.verificationRecord?.notes && ` Note: ${property.verificationRecord.notes}`}
                  </p>
                ) : property.verificationStatus === 'VERIFICATION_PENDING' ? (
                  <p>
                    Documents and title records have been submitted and are currently in the compliance review queue.
                  </p>
                ) : (
                  <p>
                    This listing has not undergone the platform verification process. Seekers must exercise due diligence.
                  </p>
                )}
                <div className="pt-1.5 text-[11px] text-stone-500 border-t border-stone-200/60 font-medium">
                  {LEGAL_DISCLAIMERS.documentNotice}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Specs Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-2">
            {property.bedrooms !== undefined && (
              <div className="bg-stone-50 p-3 rounded-lg border border-stone-200">
                <span className="text-xs text-stone-500 block">Bedrooms</span>
                <span className="text-base font-bold text-stone-900 tabular-nums">{property.bedrooms} Beds</span>
              </div>
            )}
            {property.bathrooms !== undefined && (
              <div className="bg-stone-50 p-3 rounded-lg border border-stone-200">
                <span className="text-xs text-stone-500 block">Bathrooms</span>
                <span className="text-base font-bold text-stone-900 tabular-nums">{property.bathrooms} Baths</span>
              </div>
            )}
            {property.landSize && (
              <div className="bg-stone-50 p-3 rounded-lg border border-stone-200">
                <span className="text-xs text-stone-500 block">Land Size</span>
                <span className="text-base font-bold text-stone-900">{property.landSize}</span>
              </div>
            )}
            {property.documentType && (
              <div className="bg-stone-50 p-3 rounded-lg border border-stone-200">
                <span className="text-xs text-stone-500 block">Document Title</span>
                <span className="text-base font-bold text-stone-900">{property.documentType}</span>
              </div>
            )}
            {property.buildingSize && (
              <div className="bg-stone-50 p-3 rounded-lg border border-stone-200">
                <span className="text-xs text-stone-500 block">Building Floor Size</span>
                <span className="text-base font-bold text-stone-900">{property.buildingSize}</span>
              </div>
            )}
            {property.propertyCondition && (
              <div className="bg-stone-50 p-3 rounded-lg border border-stone-200">
                <span className="text-xs text-stone-500 block">Condition</span>
                <span className="text-base font-bold text-stone-900 capitalize">
                  {property.propertyCondition.replace('_', ' ')}
                </span>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-stone-900 font-display">Property Overview</h2>
            <p className="text-sm text-stone-700 leading-relaxed whitespace-pre-line">
              {property.description}
            </p>
          </div>

          {/* Features and Amenities */}
          {property.features && property.features.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-stone-900 font-display">Features & Amenities</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {property.features.map((feat, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-stone-800 bg-stone-50 px-3 py-2 rounded-lg border border-stone-100">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Seller / Contact Box & Actions */}
          <div className="bg-stone-50 rounded-xl p-5 border border-stone-200 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-emerald-800 text-white font-bold flex items-center justify-center text-lg overflow-hidden">
                  {property.sellerAvatar ? (
                    <img src={property.sellerAvatar} alt="" className="w-full h-full object-cover" />
                  ) : (
                    property.sellerName.charAt(0)
                  )}
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wider text-stone-400 font-semibold">
                    Listed By {property.ownerRole.toUpperCase()}
                  </div>
                  <div className="font-bold text-stone-900 text-base">{property.sellerName}</div>
                  {property.businessName && (
                    <div className="text-xs text-stone-600 font-medium">{property.businessName}</div>
                  )}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => {
                    if (saved) unsaveProperty(property.id);
                    else saveProperty(property.id);
                  }}
                  className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                    saved
                      ? 'bg-rose-50 text-rose-700 border-rose-200'
                      : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-100'
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${saved ? 'fill-rose-600 text-rose-600' : ''}`} />
                  {saved ? 'Saved' : 'Save'}
                </button>

                <button
                  onClick={() => toggleCompare(property.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                    isCompared
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                      : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-100'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5 text-emerald-700" />
                  {isCompared ? 'Comparing' : 'Compare'}
                </button>
              </div>
            </div>

            {/* Direct Contact CTAs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
              {/* WhatsApp Seller Button */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg transition-colors shadow-xs"
              >
                <MessageSquare className="w-4 h-4" />
                WhatsApp Seller
              </a>

              {/* Call Seller Button */}
              <a
                href={`tel:${property.sellerPhone}`}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-lg transition-colors shadow-xs"
              >
                <Phone className="w-4 h-4" />
                Call: {property.sellerPhone}
              </a>

              {/* Send Enquiry Button */}
              <button
                onClick={() => onOpenEnquiry(property)}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-stone-300 hover:bg-stone-100 text-stone-800 text-xs font-semibold rounded-lg transition-colors cursor-pointer shadow-xs"
              >
                <FileText className="w-4 h-4 text-emerald-700" />
                Send Enquiry
              </button>
            </div>
          </div>

          {/* Anti-Scam Notice & Report button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-stone-200 text-xs text-stone-500">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{LEGAL_DISCLAIMERS.antiScamWarning}</span>
            </div>
            <button
              onClick={() => onOpenReport(property)}
              className="inline-flex items-center gap-1 text-stone-500 hover:text-rose-600 transition-colors cursor-pointer self-start sm:self-auto shrink-0 font-medium"
            >
              <Flag className="w-3.5 h-3.5" />
              Report this Listing
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
