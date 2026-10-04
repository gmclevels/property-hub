import React, { useState } from 'react';
import { 
  Building2, 
  Eye, 
  Heart, 
  MessageSquare, 
  PlusCircle, 
  CheckCircle2, 
  PauseCircle, 
  Trash2, 
  RefreshCw, 
  AlertCircle,
  Clock,
  ShieldCheck,
  ShieldAlert
} from 'lucide-react';
import { Property, PropertyStatus } from '../types';
import { useProperties } from '../context/PropertyContext';
import { formatNaira, formatDate } from '../utils/formatters';

interface SellerDashboardProps {
  onOpenPostModal: () => void;
  onSelectProperty: (property: Property) => void;
}

export const SellerDashboard: React.FC<SellerDashboardProps> = ({
  onOpenPostModal,
  onSelectProperty
}) => {
  const { properties, updateProperty, deleteProperty, currentUser } = useProperties();
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Listings for current user (or demo listings owned by agents/owners)
  const myListings = properties.filter((p) => {
    // If user is owner/agent, show listings matching their role or user id
    if (currentUser.role === 'admin') return true;
    return p.ownerId === currentUser.id || p.ownerRole === currentUser.role;
  });

  const totalListings = myListings.length;
  const activeListings = myListings.filter((p) => p.status === 'available').length;
  const totalViews = myListings.reduce((sum, p) => sum + (p.viewsCount || 0), 0);
  const totalEnquiries = myListings.reduce((sum, p) => sum + (p.enquiriesCount || 0), 0);

  const filteredListings = myListings.filter((p) => {
    if (statusFilter === 'all') return true;
    return p.status === statusFilter;
  });

  const handleStatusChange = (id: string, newStatus: PropertyStatus) => {
    updateProperty(id, { status: newStatus });
  };

  const handleRenew = (id: string) => {
    updateProperty(id, { updatedAt: new Date().toISOString() });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header & Post CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <div className="text-xs uppercase font-bold tracking-wider text-emerald-800">
            {currentUser.role.toUpperCase()} CONSOLE
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 font-display">
            Seller & Agent Management Hub
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Track inquiries, update availability statuses, and view seeker interactions for your properties.
          </p>
        </div>

        <button
          onClick={onOpenPostModal}
          className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Post New Property</span>
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs">
          <span className="text-xs text-stone-400 font-medium uppercase tracking-wider block">Total Listings</span>
          <span className="text-2xl font-bold text-stone-900 tabular-nums font-display mt-1 block">
            {totalListings}
          </span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs">
          <span className="text-xs text-emerald-700 font-medium uppercase tracking-wider block">Active Listings</span>
          <span className="text-2xl font-bold text-emerald-800 tabular-nums font-display mt-1 block">
            {activeListings}
          </span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs">
          <span className="text-xs text-stone-400 font-medium uppercase tracking-wider block">Total Views</span>
          <span className="text-2xl font-bold text-stone-900 tabular-nums font-display mt-1 block">
            {totalViews}
          </span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs">
          <span className="text-xs text-stone-400 font-medium uppercase tracking-wider block">Total Inquiries</span>
          <span className="text-2xl font-bold text-stone-900 tabular-nums font-display mt-1 block">
            {totalEnquiries}
          </span>
        </div>
      </div>

      {/* Listings Table Section */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-base font-bold text-stone-900 font-display">My Property Portfolio</h2>

          {/* Filter segment */}
          <div className="flex items-center gap-1 text-xs">
            {['all', 'available', 'reserved', 'sold', 'rented'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg capitalize transition-colors cursor-pointer ${
                  statusFilter === st ? 'bg-stone-900 text-white font-semibold' : 'text-stone-600 hover:bg-stone-100'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {filteredListings.length === 0 ? (
          <div className="p-12 text-center text-stone-500 text-sm">
            No properties found for this filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider text-[10px] border-b border-stone-200">
                <tr>
                  <th className="p-4">Property</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Verification</th>
                  <th className="p-4 text-center">Metrics</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredListings.map((prop) => (
                  <tr key={prop.id} className="hover:bg-stone-50/70 transition-colors">
                    {/* Property info */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={prop.images?.[0] || '/src/assets/images/hero_abuja_estate_1790850408390.jpg'}
                          alt=""
                          className="w-14 h-11 object-cover rounded-lg shrink-0 border border-stone-200"
                        />
                        <div className="space-y-0.5">
                          <span
                            onClick={() => onSelectProperty(prop)}
                            className="font-bold text-stone-900 hover:text-emerald-800 cursor-pointer line-clamp-1 text-xs"
                          >
                            {prop.title}
                          </span>
                          <span className="text-[11px] text-stone-500 block">
                            {prop.propertyType} · {prop.area}, {prop.city}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Price */}
                    <td className="p-4 font-bold text-emerald-800 tabular-nums">
                      {formatNaira(prop.price)}
                    </td>

                    {/* Status Badge */}
                    <td className="p-4">
                      <span className={`inline-block px-2 py-0.5 rounded-sm uppercase text-[10px] font-bold ${
                        prop.status === 'available'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : prop.status === 'reserved'
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : 'bg-stone-100 text-stone-700 border border-stone-200'
                      }`}>
                        {prop.status}
                      </span>
                    </td>

                    {/* Verification Status */}
                    <td className="p-4">
                      {prop.verificationStatus === 'VERIFIED' ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold text-xs">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Verified
                        </span>
                      ) : prop.verificationStatus === 'VERIFICATION_PENDING' ? (
                        <span className="inline-flex items-center gap-1 text-amber-700 text-xs font-medium">
                          <Clock className="w-3.5 h-3.5" />
                          Pending Review
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-stone-400 text-xs">
                          <ShieldAlert className="w-3.5 h-3.5" />
                          Unverified
                        </span>
                      )}
                    </td>

                    {/* Metrics */}
                    <td className="p-4 text-center tabular-nums text-stone-600">
                      <div className="flex items-center justify-center gap-3">
                        <span title="Views" className="flex items-center gap-1">
                          <Eye className="w-3 h-3 text-stone-400" />
                          {prop.viewsCount}
                        </span>
                        <span title="Saves" className="flex items-center gap-1">
                          <Heart className="w-3 h-3 text-stone-400" />
                          {prop.savesCount}
                        </span>
                        <span title="Inquiries" className="flex items-center gap-1">
                          <MessageSquare className="w-3 h-3 text-stone-400" />
                          {prop.enquiriesCount}
                        </span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {prop.status === 'available' ? (
                          <>
                            <button
                              onClick={() => handleStatusChange(prop.id, prop.transactionType === 'rent' ? 'rented' : 'sold')}
                              className="px-2 py-1 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-md text-[11px] font-medium"
                              title={`Mark as ${prop.transactionType === 'rent' ? 'Rented' : 'Sold'}`}
                            >
                              Mark {prop.transactionType === 'rent' ? 'Rented' : 'Sold'}
                            </button>
                            <button
                              onClick={() => handleStatusChange(prop.id, 'reserved')}
                              className="px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 rounded-md text-[11px]"
                            >
                              Reserve
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => handleStatusChange(prop.id, 'available')}
                            className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-md text-[11px] font-semibold"
                          >
                            Set Available
                          </button>
                        )}

                        <button
                          onClick={() => handleRenew(prop.id)}
                          className="p-1 text-stone-400 hover:text-stone-700"
                          title="Renew listing"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => deleteProperty(prop.id)}
                          className="p-1 text-stone-400 hover:text-rose-600"
                          title="Delete listing"
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
        )}
      </div>
    </div>
  );
};
