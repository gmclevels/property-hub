import React from 'react';
import { X, Layers, CheckCircle2, ShieldAlert, Clock, Trash2, ExternalLink } from 'lucide-react';
import { Property } from '../types';
import { formatNaira, formatDate } from '../utils/formatters';
import { useProperties } from '../context/PropertyContext';

interface PropertyComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProperty: (property: Property) => void;
}

export const PropertyComparisonModal: React.FC<PropertyComparisonModalProps> = ({
  isOpen,
  onClose,
  onSelectProperty
}) => {
  const { properties, comparedPropertyIds, removeFromCompare, clearCompare } = useProperties();

  if (!isOpen) return null;

  const comparedProperties = properties.filter((p) => comparedPropertyIds.includes(p.id));

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="relative bg-white w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden border border-stone-200 my-auto flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-700" />
            <div>
              <h2 className="text-lg font-bold text-stone-900 font-display">
                Property Comparison Matrix ({comparedProperties.length}/3)
              </h2>
              <p className="text-xs text-stone-500">
                Objective side-by-side factual comparison. We present verified parameters so you can make informed decisions.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {comparedProperties.length > 0 && (
              <button
                onClick={clearCompare}
                className="text-xs text-stone-500 hover:text-stone-800 px-2 py-1"
              >
                Clear All
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-200 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Table Area */}
        <div className="p-6 overflow-y-auto flex-1">
          {comparedProperties.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <Layers className="w-10 h-10 text-stone-300 mx-auto" />
              <p className="text-stone-600 text-sm">
                No properties selected for comparison yet.
              </p>
              <p className="text-xs text-stone-400">
                Click the compare icon on any property card to compare up to 3 listings side-by-side.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-stone-200">
                    <th className="p-3 w-40 font-semibold text-stone-400 uppercase tracking-wider text-[10px]">
                      Parameter
                    </th>
                    {comparedProperties.map((p) => (
                      <th key={p.id} className="p-3 min-w-[220px] align-top">
                        <div className="space-y-2">
                          <div className="relative aspect-16/10 rounded-lg overflow-hidden bg-stone-100">
                            <img
                              src={p.images?.[0] || '/src/assets/images/hero_abuja_estate_1790850408390.jpg'}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                            <button
                              onClick={() => removeFromCompare(p.id)}
                              className="absolute top-1 right-1 p-1 bg-black/60 hover:bg-black text-white rounded-full transition-colors cursor-pointer"
                              title="Remove"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <div className="font-bold text-stone-900 text-sm line-clamp-1">{p.title}</div>
                          <button
                            onClick={() => {
                              onClose();
                              onSelectProperty(p);
                            }}
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 hover:underline cursor-pointer"
                          >
                            <span>Inspect Full Details</span>
                            <ExternalLink className="w-3 h-3" />
                          </button>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  <tr>
                    <td className="p-3 font-semibold text-stone-500 bg-stone-50/50">Asking Price</td>
                    {comparedProperties.map((p) => (
                      <td key={p.id} className="p-3 font-bold text-emerald-800 text-sm tabular-nums">
                        {formatNaira(p.price)}
                        {p.transactionType === 'rent' && p.rentalFrequency && (
                          <span className="text-xs text-stone-500 font-normal">/{p.rentalFrequency}</span>
                        )}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-stone-500 bg-stone-50/50">Location</td>
                    {comparedProperties.map((p) => (
                      <td key={p.id} className="p-3 text-stone-800 font-medium">
                        {p.area}, {p.city}, {p.state}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-stone-500 bg-stone-50/50">Property Type</td>
                    {comparedProperties.map((p) => (
                      <td key={p.id} className="p-3 text-stone-700">
                        {p.propertyType} ({p.transactionType === 'sale' ? 'Sale' : 'Rent'})
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-stone-500 bg-stone-50/50">Bedrooms / Baths</td>
                    {comparedProperties.map((p) => (
                      <td key={p.id} className="p-3 text-stone-700 tabular-nums">
                        {p.bedrooms !== undefined ? `${p.bedrooms} Beds` : 'N/A'} · {p.bathrooms !== undefined ? `${p.bathrooms} Baths` : 'N/A'}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-stone-500 bg-stone-50/50">Land / Floor Size</td>
                    {comparedProperties.map((p) => (
                      <td key={p.id} className="p-3 text-stone-700">
                        {p.landSize || p.buildingSize || 'Not specified'}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-stone-500 bg-stone-50/50">Title Document</td>
                    {comparedProperties.map((p) => (
                      <td key={p.id} className="p-3 text-stone-800 font-semibold">
                        {p.documentType || 'Not specified'}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-stone-500 bg-stone-50/50">Verification Status</td>
                    {comparedProperties.map((p) => (
                      <td key={p.id} className="p-3">
                        {p.verificationStatus === 'VERIFIED' ? (
                          <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Verified
                          </span>
                        ) : p.verificationStatus === 'VERIFICATION_PENDING' ? (
                          <span className="inline-flex items-center gap-1 text-amber-700 font-medium">
                            <Clock className="w-3.5 h-3.5" />
                            Pending Review
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-stone-500">
                            <ShieldAlert className="w-3.5 h-3.5" />
                            Unverified
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-stone-500 bg-stone-50/50">Listed By</td>
                    {comparedProperties.map((p) => (
                      <td key={p.id} className="p-3 text-stone-700">
                        {p.sellerName} ({p.ownerRole})
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-stone-500 bg-stone-50/50">Top Features</td>
                    {comparedProperties.map((p) => (
                      <td key={p.id} className="p-3 text-stone-600 text-[11px] leading-relaxed">
                        {p.features?.slice(0, 4).join(', ') || 'Standard specs'}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
