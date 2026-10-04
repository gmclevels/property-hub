import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Users, 
  Building2, 
  Flag, 
  MapPin, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertTriangle, 
  BarChart3, 
  Search,
  FileCheck2,
  Trash2,
  Lock,
  Layers
} from 'lucide-react';
import { Property, VerificationStatus, ListingReport, User } from '../types';
import { useProperties } from '../context/PropertyContext';
import { formatNaira, formatDate } from '../utils/formatters';
import { NIGERIAN_STATES } from '../data/nigerianLocations';

export const AdminDashboard: React.FC = () => {
  const { 
    properties, 
    verifyProperty, 
    deleteProperty, 
    reports, 
    resolveReport, 
    enquiries, 
    currentUser 
  } = useProperties();

  const [activeTab, setActiveTab] = useState<'listings' | 'verification' | 'reports' | 'locations' | 'analytics'>('listings');
  const [selectedPropForVerify, setSelectedPropForVerify] = useState<Property | null>(null);
  const [verifyNotes, setVerifyNotes] = useState('');
  const [verifySource, setVerifySource] = useState('Physical Site & Registry Check');
  const [verifyDocs, setVerifyDocs] = useState('Survey Plan, C of O Search Report');

  // Filter listings in admin table
  const [listingSearch, setListingSearch] = useState('');
  const [verificationFilter, setVerificationFilter] = useState<string>('all');

  // Analytics Metrics
  const totalListings = properties.length;
  const activeListings = properties.filter((p) => p.status === 'available').length;
  const soldListings = properties.filter((p) => p.status === 'sold').length;
  const rentedListings = properties.filter((p) => p.status === 'rented').length;
  const verifiedListings = properties.filter((p) => p.verificationStatus === 'VERIFIED').length;
  const pendingListings = properties.filter((p) => p.verificationStatus === 'VERIFICATION_PENDING').length;

  const propertiesByState = properties.reduce((acc: Record<string, number>, p) => {
    acc[p.state] = (acc[p.state] || 0) + 1;
    return acc;
  }, {});

  const filteredProperties = properties.filter((p) => {
    if (verificationFilter !== 'all' && p.verificationStatus !== verificationFilter) return false;
    if (listingSearch.trim()) {
      const q = listingSearch.toLowerCase();
      return p.title.toLowerCase().includes(q) || p.sellerName.toLowerCase().includes(q) || p.area.toLowerCase().includes(q);
    }
    return true;
  });

  const handleApplyVerification = (status: VerificationStatus) => {
    if (!selectedPropForVerify) return;
    const docs = verifyDocs.split(',').map((d) => d.trim()).filter(Boolean);
    verifyProperty(selectedPropForVerify.id, status, verifyNotes, docs, verifySource);
    setSelectedPropForVerify(null);
    setVerifyNotes('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Admin Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <div className="text-xs uppercase font-bold tracking-wider text-rose-700 flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5" />
            ADMINISTRATOR PRIVILEGES
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 font-display">
            Gerald Property Hub Governance & Compliance
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Audit property titles, process verification workflows, investigate user scam reports, and monitor nationwide analytics.
          </p>
        </div>

        <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-700" />
          <span>Admin Authenticated: {currentUser.fullName}</span>
        </div>
      </div>

      {/* Analytics KPI Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
          <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block">Total Listings</span>
          <span className="text-xl font-bold text-stone-900 tabular-nums font-display mt-0.5 block">{totalListings}</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
          <span className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider block">Active</span>
          <span className="text-xl font-bold text-emerald-800 tabular-nums font-display mt-0.5 block">{activeListings}</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
          <span className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider block">Verified</span>
          <span className="text-xl font-bold text-emerald-700 tabular-nums font-display mt-0.5 block">{verifiedListings}</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
          <span className="text-[10px] text-amber-700 font-bold uppercase tracking-wider block">Pending Review</span>
          <span className="text-xl font-bold text-amber-700 tabular-nums font-display mt-0.5 block">{pendingListings}</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
          <span className="text-[10px] text-blue-700 font-bold uppercase tracking-wider block">Sold / Rented</span>
          <span className="text-xl font-bold text-blue-800 tabular-nums font-display mt-0.5 block">{soldListings + rentedListings}</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
          <span className="text-[10px] text-rose-700 font-bold uppercase tracking-wider block">Reports Queue</span>
          <span className="text-xl font-bold text-rose-700 tabular-nums font-display mt-0.5 block">{reports.filter((r) => r.status !== 'resolved').length}</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-stone-200 text-xs font-semibold text-stone-600 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('listings')}
          className={`px-4 py-2.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'listings' ? 'bg-stone-900 text-white font-bold' : 'hover:bg-stone-100'
          }`}
        >
          All Listings Management ({properties.length})
        </button>

        <button
          onClick={() => setActiveTab('verification')}
          className={`px-4 py-2.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'verification' ? 'bg-stone-900 text-white font-bold' : 'hover:bg-stone-100'
          }`}
        >
          <FileCheck2 className="w-3.5 h-3.5" />
          <span>Verification Queue ({pendingListings})</span>
        </button>

        <button
          onClick={() => setActiveTab('reports')}
          className={`px-4 py-2.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'reports' ? 'bg-stone-900 text-white font-bold' : 'hover:bg-stone-100'
          }`}
        >
          <Flag className="w-3.5 h-3.5" />
          <span>Scam & Content Reports ({reports.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('locations')}
          className={`px-4 py-2.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'locations' ? 'bg-stone-900 text-white font-bold' : 'hover:bg-stone-100'
          }`}
        >
          Nigerian Locations Database
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-4 py-2.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'analytics' ? 'bg-stone-900 text-white font-bold' : 'hover:bg-stone-100'
          }`}
        >
          Platform Analytics
        </button>
      </div>

      {/* Tab: All Listings */}
      {activeTab === 'listings' && (
        <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs space-y-4 p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-3" />
              <input
                type="text"
                value={listingSearch}
                onChange={(e) => setListingSearch(e.target.value)}
                placeholder="Search listing, seller or area..."
                className="w-full bg-stone-50 border border-stone-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-stone-900"
              />
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-stone-400">Status:</span>
              <select
                value={verificationFilter}
                onChange={(e) => setVerificationFilter(e.target.value)}
                className="bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1.5 text-stone-800"
              >
                <option value="all">All Verification</option>
                <option value="VERIFIED">Verified</option>
                <option value="VERIFICATION_PENDING">Pending Review</option>
                <option value="UNVERIFIED">Unverified</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-stone-50 text-stone-400 uppercase tracking-wider text-[10px] border-b border-stone-200">
                <tr>
                  <th className="p-3">Title & Location</th>
                  <th className="p-3">Price</th>
                  <th className="p-3">Seller</th>
                  <th className="p-3">Verification</th>
                  <th className="p-3 text-right">Admin Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredProperties.map((p) => (
                  <tr key={p.id} className="hover:bg-stone-50/70">
                    <td className="p-3">
                      <div className="font-semibold text-stone-900">{p.title}</div>
                      <div className="text-[11px] text-stone-500">
                        {p.propertyType} · {p.area}, {p.city}, {p.state}
                      </div>
                    </td>
                    <td className="p-3 font-bold text-emerald-800 tabular-nums">{formatNaira(p.price)}</td>
                    <td className="p-3 text-stone-700">
                      <div>{p.sellerName}</div>
                      <div className="text-[10px] text-stone-400 capitalize">{p.ownerRole} · {p.sellerPhone}</div>
                    </td>
                    <td className="p-3">
                      <span className={`inline-flex items-center gap-1 text-[11px] font-semibold ${
                        p.verificationStatus === 'VERIFIED'
                          ? 'text-emerald-700'
                          : p.verificationStatus === 'VERIFICATION_PENDING'
                          ? 'text-amber-700'
                          : 'text-stone-400'
                      }`}>
                        {p.verificationStatus}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setSelectedPropForVerify(p);
                            setVerifyNotes(p.verificationRecord?.notes || '');
                          }}
                          className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-md font-semibold text-[11px] cursor-pointer"
                        >
                          Audit & Verify
                        </button>
                        <button
                          onClick={() => deleteProperty(p.id)}
                          className="p-1 text-stone-400 hover:text-rose-600 rounded cursor-pointer"
                          title="Remove listing"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Verification Queue */}
      {activeTab === 'verification' && (
        <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-4">
          <div className="border-b border-stone-100 pb-3">
            <h2 className="text-base font-bold text-stone-900 font-display">
              Official Title Verification Queue
            </h2>
            <p className="text-xs text-stone-500">
              Review submitted document details, coordinate verification sources, and formally issue platform verification badges.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {properties.filter((p) => p.verificationStatus === 'VERIFICATION_PENDING').map((p) => (
              <div key={p.id} className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-sm">
                      Pending Audit
                    </span>
                    <h3 className="font-bold text-stone-900 text-sm mt-1">{p.title}</h3>
                  </div>
                  <span className="font-bold text-emerald-800 tabular-nums text-xs">{formatNaira(p.price)}</span>
                </div>

                <div className="text-xs text-stone-600 space-y-1 bg-white p-3 rounded-lg border border-stone-100">
                  <div><strong>Location:</strong> {p.area}, {p.city}, {p.state}</div>
                  <div><strong>Document Claimed:</strong> {p.documentType || 'Not specified'}</div>
                  {p.documentDetails && <div><strong>Claim Details:</strong> {p.documentDetails}</div>}
                  <div><strong>Seller / Mandate:</strong> {p.sellerName} ({p.ownerRole})</div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    onClick={() => {
                      setSelectedPropForVerify(p);
                      setVerifyNotes('Document and beacon physical audit performed.');
                    }}
                    className="px-4 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold"
                  >
                    Open Verification Audit
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Reports */}
      {activeTab === 'reports' && (
        <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-4">
          <div className="border-b border-stone-100 pb-3">
            <h2 className="text-base font-bold text-stone-900 font-display">
              Consumer Scam & Discrepancy Reports
            </h2>
            <p className="text-xs text-stone-500">
              Investigate listings reported for suspected scam, incorrect pricing, or already-sold statuses.
            </p>
          </div>

          <div className="space-y-3">
            {reports.map((rep) => (
              <div key={rep.id} className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 space-y-2">
                <div className="flex items-start justify-between">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold uppercase text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-sm">
                      {rep.reason.replace(/_/g, ' ')}
                    </span>
                    <h3 className="font-bold text-stone-900 text-sm mt-1">{rep.propertyTitle}</h3>
                  </div>

                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-sm ${
                    rep.status === 'resolved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {rep.status}
                  </span>
                </div>

                <p className="text-xs text-stone-700 bg-white p-2.5 rounded-lg border border-stone-100">
                  “{rep.description}”
                </p>

                <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1">
                  <span>Reported by {rep.reporterName || 'Anonymous Seeker'} on {formatDate(rep.createdAt)}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => resolveReport(rep.id, 'resolved', 'Listing reviewed and compliance checks performed.')}
                      className="text-emerald-700 font-bold hover:underline cursor-pointer"
                    >
                      Mark Resolved
                    </button>
                    <button
                      onClick={() => resolveReport(rep.id, 'dismissed', 'Insufficient evidence.')}
                      className="text-stone-500 hover:text-stone-800 cursor-pointer"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Locations */}
      {activeTab === 'locations' && (
        <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-4">
          <div className="border-b border-stone-100 pb-3">
            <h2 className="text-base font-bold text-stone-900 font-display">
              Nigerian Geospatial & Administrative Locations
            </h2>
            <p className="text-xs text-stone-500">
              Configured coverage for all 36 Nigerian states and Federal Capital Territory (FCT).
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
            {NIGERIAN_STATES.slice(0, 12).map((st) => (
              <div key={st.state} className="p-3 rounded-lg border border-stone-200 bg-stone-50">
                <span className="font-bold text-stone-900 block">{st.state}</span>
                <span className="text-stone-500 text-[11px] block mt-0.5">Capital: {st.capital}</span>
                <span className="text-stone-600 text-[11px] block mt-1 line-clamp-1">
                  Districts: {st.prominentAreas.slice(0, 3).join(', ')}...
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Analytics */}
      {activeTab === 'analytics' && (
        <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-6">
          <div className="border-b border-stone-100 pb-3">
            <h2 className="text-base font-bold text-stone-900 font-display">
              Regional Marketplace Analytics
            </h2>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400">Inventory Distribution by State</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {Object.entries(propertiesByState).map(([stateName, count]) => (
                <div key={stateName} className="p-3 rounded-lg bg-stone-50 border border-stone-200 text-xs">
                  <span className="text-stone-500 block truncate">{stateName}</span>
                  <span className="text-lg font-bold text-stone-900 tabular-nums block mt-1">{count} Listings</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Audit Modal */}
      {selectedPropForVerify && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-stone-200 p-6 space-y-4 my-auto">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">Compliance Audit</span>
                <h2 className="text-base font-bold text-stone-900 font-display">Verify Property Listing</h2>
              </div>
              <button onClick={() => setSelectedPropForVerify(null)} className="text-stone-400">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-stone-50 p-3 rounded-lg border border-stone-100">
                <span className="font-bold text-stone-900 block">{selectedPropForVerify.title}</span>
                <span className="text-stone-500">{selectedPropForVerify.area}, {selectedPropForVerify.state}</span>
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Verification Source</label>
                <input
                  type="text"
                  value={verifySource}
                  onChange={(e) => setVerifySource(e.target.value)}
                  placeholder="e.g. AGIS Search, Physical Land Registry"
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1.5"
                />
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Documents Examined (Comma Separated)</label>
                <input
                  type="text"
                  value={verifyDocs}
                  onChange={(e) => setVerifyDocs(e.target.value)}
                  placeholder="Survey Plan, C of O, Deed"
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1.5"
                />
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Audit Record & Field Notes</label>
                <textarea
                  rows={3}
                  value={verifyNotes}
                  onChange={(e) => setVerifyNotes(e.target.value)}
                  placeholder="Confirm beacon numbers, physical access check, unencumbered status..."
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1.5"
                />
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => handleApplyVerification('UNVERIFIED')}
                  className="px-3 py-2 bg-stone-100 text-stone-700 rounded-lg text-xs font-semibold hover:bg-stone-200 cursor-pointer"
                >
                  Mark Unverified
                </button>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleApplyVerification('VERIFICATION_PENDING')}
                    className="px-3 py-2 bg-amber-50 text-amber-900 border border-amber-200 rounded-lg text-xs font-semibold hover:bg-amber-100 cursor-pointer"
                  >
                    Set Pending
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyVerification('VERIFIED')}
                    className="px-5 py-2 bg-emerald-700 text-white rounded-lg text-xs font-bold hover:bg-emerald-800 shadow-sm cursor-pointer"
                  >
                    Approve Verification
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
