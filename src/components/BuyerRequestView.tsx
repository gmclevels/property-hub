import React, { useState } from 'react';
import { HelpCircle, PlusCircle, Search, MapPin, CheckCircle2, MessageSquare, Phone } from 'lucide-react';
import { BuyerRequest, TransactionType } from '../types';
import { useProperties } from '../context/PropertyContext';
import { formatNaira, formatCompactNaira, createWhatsAppLink } from '../utils/formatters';
import { ALL_STATE_NAMES } from '../data/nigerianLocations';

export const BuyerRequestView: React.FC = () => {
  const { buyerRequests, addBuyerRequest, currentUser } = useProperties();
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [filterState, setFilterState] = useState('');
  const [filterType, setFilterType] = useState('');

  // Form State
  const [propertyType, setPropertyType] = useState('Land');
  const [transactionType, setTransactionType] = useState<TransactionType>('sale');
  const [state, setState] = useState('FCT - Abuja');
  const [city, setCity] = useState('Abuja');
  const [area, setArea] = useState('Gwagwalada');
  const [minBudget, setMinBudget] = useState<number | ''>(10000000);
  const [maxBudget, setMaxBudget] = useState<number | ''>(20000000);
  const [size, setSize] = useState('500–1000 sqm');
  const [purpose, setPurpose] = useState('Residential');
  const [requirements, setRequirements] = useState('Near major tarred road with clean registered survey.');
  const [userPhone, setUserPhone] = useState(currentUser.phone);
  const [userName, setUserName] = useState(currentUser.fullName);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName || !userPhone || !minBudget || !maxBudget) return;

    addBuyerRequest({
      userId: currentUser.id,
      userName,
      userPhone,
      propertyType,
      transactionType,
      state,
      city,
      area,
      minBudget: Number(minBudget),
      maxBudget: Number(maxBudget),
      size,
      purpose,
      requirements
    });

    setSubmittedSuccess(true);
    setTimeout(() => {
      setSubmittedSuccess(false);
      setShowSubmitModal(false);
    }, 1800);
  };

  const filteredRequests = buyerRequests.filter((r) => {
    if (filterState && r.state !== filterState) return false;
    if (filterType && !r.propertyType.toLowerCase().includes(filterType.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-stone-900 to-emerald-950 rounded-2xl p-6 sm:p-8 text-white flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-md border border-stone-800">
        <div className="space-y-2 max-w-2xl">
          <div className="text-xs uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4" />
            Matching System
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display">
            I'M LOOKING FOR PROPERTY
          </h1>
          <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
            Can't find the exact house, land parcel, or commercial shop you want? Post your exact requirements and let verified owners and licensed agents pitch directly matching properties to you.
          </p>
        </div>

        <button
          onClick={() => setShowSubmitModal(true)}
          className="inline-flex items-center gap-2 px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-md transition-colors cursor-pointer shrink-0 self-start md:self-center"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Post Your Property Need</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-xl border border-stone-200">
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={filterState}
            onChange={(e) => setFilterState(e.target.value)}
            className="text-xs bg-stone-50 border border-stone-200 rounded-lg px-3 py-1.5 text-stone-800"
          >
            <option value="">All Locations</option>
            {ALL_STATE_NAMES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="text-xs bg-stone-50 border border-stone-200 rounded-lg px-3 py-1.5 text-stone-800"
          >
            <option value="">All Property Types</option>
            <option value="Land">Land</option>
            <option value="House">House / Duplex</option>
            <option value="Apartment">Apartment</option>
            <option value="Commercial">Commercial / Shop</option>
          </select>
        </div>

        <span className="text-xs text-stone-500">
          Showing <strong className="text-stone-900">{filteredRequests.length}</strong> active buyer requests
        </span>
      </div>

      {/* Requests Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredRequests.map((req) => {
          const waLink = createWhatsAppLink(
            req.userPhone,
            `Buyer Request for ${req.propertyType}`,
            `${req.area || req.city}, ${req.state}`
          );

          return (
            <div
              key={req.id}
              className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs space-y-3 hover:border-emerald-600 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs text-stone-500">
                    <span className="font-semibold text-emerald-800">{req.propertyType}</span>
                    <span>·</span>
                    <span className="uppercase text-[10px] bg-stone-100 px-1.5 py-0.5 rounded-sm font-bold text-stone-700">
                      {req.transactionType === 'sale' ? 'To Buy' : 'To Rent'}
                    </span>
                  </div>
                  <h3 className="font-bold text-stone-900 text-base mt-1">
                    Seeking {req.propertyType} in {req.city || req.state}
                  </h3>
                </div>

                <div className="text-right">
                  <span className="text-xs text-stone-400 block">Target Budget</span>
                  <span className="text-sm font-bold text-emerald-800 tabular-nums">
                    {formatCompactNaira(req.minBudget)} – {formatCompactNaira(req.maxBudget)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-stone-600">
                <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                <span>
                  {req.area ? `${req.area}, ` : ''}{req.city}, {req.state}
                </span>
              </div>

              <div className="bg-stone-50 p-3 rounded-lg border border-stone-100 text-xs text-stone-700 space-y-1">
                <div><strong>Specific Requirements:</strong> {req.requirements}</div>
                {req.size && <div><strong>Preferred Size:</strong> {req.size}</div>}
                {req.purpose && <div><strong>Purpose:</strong> {req.purpose}</div>}
              </div>

              <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                <div>
                  <span className="text-stone-400 text-[11px] block">Seeker</span>
                  <span className="font-medium text-stone-800">{req.userName}</span>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={waLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-lg shadow-xs"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Pitch via WhatsApp</span>
                  </a>
                  <a
                    href={`tel:${req.userPhone}`}
                    className="p-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg"
                    title="Call seeker"
                  >
                    <Phone className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Submission Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-stone-200 p-6 space-y-4 my-auto">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h2 className="text-lg font-bold text-stone-900 font-display">
                Post “I'm Looking For Property” Request
              </h2>
              <button
                onClick={() => setShowSubmitModal(false)}
                className="p-1 text-stone-400 hover:text-stone-700"
              >
                ✕
              </button>
            </div>

            {submittedSuccess ? (
              <div className="py-8 text-center space-y-2">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h3 className="text-base font-bold text-stone-900">Request Published Successfully!</h3>
                <p className="text-xs text-stone-500">
                  Verified sellers and agents will reach out when matching listings become available.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-stone-700 block mb-1">Property Type</label>
                    <select
                      value={propertyType}
                      onChange={(e) => setPropertyType(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1.5"
                    >
                      <option value="Land">Land</option>
                      <option value="House">House / Duplex</option>
                      <option value="Apartment">Apartment / Flat</option>
                      <option value="Commercial">Commercial / Shop</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-semibold text-stone-700 block mb-1">Transaction</label>
                    <select
                      value={transactionType}
                      onChange={(e) => setTransactionType(e.target.value as any)}
                      className="w-full bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1.5"
                    >
                      <option value="sale">To Buy (Sale)</option>
                      <option value="rent">To Rent</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-stone-700 block mb-1">State</label>
                    <select
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1.5"
                    >
                      {ALL_STATE_NAMES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="font-semibold text-stone-700 block mb-1">Area / Landmark</label>
                    <input
                      type="text"
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                      placeholder="e.g. Gwagwalada, Lekki"
                      className="w-full bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1.5"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-stone-700 block mb-1">Min Budget (₦)</label>
                    <input
                      type="number"
                      value={minBudget}
                      onChange={(e) => setMinBudget(e.target.value ? Number(e.target.value) : '')}
                      className="w-full bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1.5"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-stone-700 block mb-1">Max Budget (₦)</label>
                    <input
                      type="number"
                      value={maxBudget}
                      onChange={(e) => setMaxBudget(e.target.value ? Number(e.target.value) : '')}
                      className="w-full bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1.5"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Size / Bedrooms / Purpose</label>
                  <input
                    type="text"
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                    placeholder="e.g. 500–1000 sqm or 3 Bedrooms"
                    className="w-full bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1.5"
                  />
                </div>

                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Additional Requirements</label>
                  <textarea
                    rows={2}
                    value={requirements}
                    onChange={(e) => setRequirements(e.target.value)}
                    placeholder="e.g. Near major road, constant water supply, clean C of O title..."
                    className="w-full bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1.5"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="font-semibold text-stone-700 block mb-1">Your Name</label>
                    <input
                      type="text"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1.5"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-stone-700 block mb-1">Your Phone / WhatsApp</label>
                    <input
                      type="text"
                      value={userPhone}
                      onChange={(e) => setUserPhone(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1.5"
                    />
                  </div>
                </div>

                <div className="pt-3 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowSubmitModal(false)}
                    className="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg shadow-sm"
                  >
                    Publish Request
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
