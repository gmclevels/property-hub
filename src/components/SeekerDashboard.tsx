import React, { useState } from 'react';
import { Heart, Bell, MessageSquare, PlusCircle, CheckCircle2, MapPin, Trash2, ArrowRight } from 'lucide-react';
import { Property, PropertyAlert } from '../types';
import { useProperties } from '../context/PropertyContext';
import { PropertyCard } from './PropertyCard';
import { formatNaira, formatCompactNaira, formatDate } from '../utils/formatters';
import { ALL_STATE_NAMES } from '../data/nigerianLocations';

interface SeekerDashboardProps {
  onSelectProperty: (property: Property) => void;
  onNavigateTab: (tab: string) => void;
}

export const SeekerDashboard: React.FC<SeekerDashboardProps> = ({
  onSelectProperty,
  onNavigateTab
}) => {
  const { properties, savedPropertyIds, enquiries, alerts, addAlert, currentUser } = useProperties();
  const [activeTab, setActiveTab] = useState<'saved' | 'enquiries' | 'alerts'>('saved');

  // New alert form state
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertType, setAlertType] = useState('Land');
  const [alertState, setAlertState] = useState('FCT - Abuja');
  const [alertCity, setAlertCity] = useState('Gwagwalada');
  const [alertMaxPrice, setAlertMaxPrice] = useState<number | ''>(15000000);
  const [channelEmail, setChannelEmail] = useState(true);
  const [channelWhatsapp, setChannelWhatsapp] = useState(true);

  const savedProperties = properties.filter((p) => savedPropertyIds.includes(p.id));
  const myEnquiries = enquiries.filter((e) => e.buyerId === currentUser.id);

  const handleCreateAlert = (e: React.FormEvent) => {
    e.preventDefault();
    addAlert({
      userId: currentUser.id,
      propertyType: alertType,
      state: alertState,
      city: alertCity,
      maxPrice: alertMaxPrice ? Number(alertMaxPrice) : undefined,
      active: true,
      notificationChannels: {
        email: channelEmail,
        sms: false,
        whatsapp: channelWhatsapp
      }
    });
    setShowAlertModal(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <div className="text-xs uppercase font-bold tracking-wider text-emerald-800">
            Seeker Workspace
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 font-display">
            Buyer & Renter Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Manage your saved properties, track active inquiries with agents, and configure smart property alerts.
          </p>
        </div>

        <button
          onClick={() => setShowAlertModal(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Bell className="w-4 h-4" />
          <span>Create Property Alert</span>
        </button>
      </div>

      {/* Navigation tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200">
        <button
          onClick={() => setActiveTab('saved')}
          className={`pb-3 px-3 text-xs font-bold transition-colors cursor-pointer border-b-2 flex items-center gap-1.5 ${
            activeTab === 'saved'
              ? 'border-emerald-700 text-emerald-800'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <Heart className="w-3.5 h-3.5" />
          <span>Saved Properties ({savedProperties.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('enquiries')}
          className={`pb-3 px-3 text-xs font-bold transition-colors cursor-pointer border-b-2 flex items-center gap-1.5 ${
            activeTab === 'enquiries'
              ? 'border-emerald-700 text-emerald-800'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>My Enquiries ({myEnquiries.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('alerts')}
          className={`pb-3 px-3 text-xs font-bold transition-colors cursor-pointer border-b-2 flex items-center gap-1.5 ${
            activeTab === 'alerts'
              ? 'border-emerald-700 text-emerald-800'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <Bell className="w-3.5 h-3.5" />
          <span>Property Alerts ({alerts.length})</span>
        </button>
      </div>

      {/* Tab: Saved Properties */}
      {activeTab === 'saved' && (
        <div className="space-y-4">
          {savedProperties.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedProperties.map((prop) => (
                <PropertyCard
                  key={prop.id}
                  property={prop}
                  onSelect={onSelectProperty}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-stone-200 p-12 text-center space-y-3">
              <Heart className="w-10 h-10 text-stone-300 mx-auto" />
              <p className="text-stone-600 text-sm">You haven't saved any properties yet.</p>
              <button
                onClick={() => onNavigateTab('buy')}
                className="inline-flex items-center gap-1 px-4 py-2 bg-emerald-700 text-white rounded-lg text-xs font-semibold hover:bg-emerald-800"
              >
                <span>Browse Buy Marketplace</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Tab: My Enquiries */}
      {activeTab === 'enquiries' && (
        <div className="space-y-3">
          {myEnquiries.length > 0 ? (
            <div className="bg-white rounded-xl border border-stone-200 divide-y divide-stone-100 overflow-hidden shadow-xs">
              {myEnquiries.map((enq) => (
                <div key={enq.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-stone-400">
                      Enquiry #{enq.id} · {formatDate(enq.createdAt)}
                    </span>
                    <h3 className="font-bold text-stone-900 text-sm">{enq.propertyTitle}</h3>
                    <p className="text-xs text-stone-600 italic bg-stone-50 p-2.5 rounded-lg border border-stone-100">
                      “{enq.message}”
                    </p>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0">
                    <span className="text-sm font-bold text-emerald-800 tabular-nums">
                      {formatNaira(enq.propertyPrice)}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      enq.status === 'new'
                        ? 'bg-blue-50 text-blue-800'
                        : enq.status === 'contacted'
                        ? 'bg-emerald-50 text-emerald-800'
                        : 'bg-stone-100 text-stone-600'
                    }`}>
                      {enq.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-stone-200 p-12 text-center text-sm text-stone-500">
              No inquiries sent yet. Click "Send Enquiry" on any property listing to contact sellers.
            </div>
          )}
        </div>
      )}

      {/* Tab: Alerts */}
      {activeTab === 'alerts' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {alerts.map((al) => (
              <div key={al.id} className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                    {al.propertyType || 'Any Property'} Alert
                  </span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                </div>

                <div className="text-xs text-stone-700 space-y-1">
                  <div><strong>Location:</strong> {al.city || al.state || 'Any Location'}</div>
                  {al.maxPrice && (
                    <div><strong>Max Budget:</strong> {formatCompactNaira(al.maxPrice)}</div>
                  )}
                  <div className="text-[11px] text-stone-400">Created: {al.createdAt}</div>
                </div>

                <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px]">
                  <span className="text-stone-500">
                    Channels: {al.notificationChannels.email ? 'Email, ' : ''}{al.notificationChannels.whatsapp ? 'WhatsApp' : ''}
                  </span>
                  <span className="text-emerald-700 font-semibold">Active</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Create Alert Modal */}
      {showAlertModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-stone-200 p-6 space-y-4 my-auto">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h2 className="text-base font-bold text-stone-900 font-display">Create Property Alert</h2>
              <button onClick={() => setShowAlertModal(false)} className="text-stone-400">✕</button>
            </div>

            <form onSubmit={handleCreateAlert} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-stone-700 block mb-1">Property Type</label>
                <select
                  value={alertType}
                  onChange={(e) => setAlertType(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1.5"
                >
                  <option value="Land">Land</option>
                  <option value="Duplex">Duplex</option>
                  <option value="Apartment">Apartment</option>
                  <option value="Flat">Flat</option>
                  <option value="Bungalow">Bungalow</option>
                  <option value="Shop">Commercial Shop</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">State</label>
                  <select
                    value={alertState}
                    onChange={(e) => setAlertState(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1.5"
                  >
                    {ALL_STATE_NAMES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Area / City</label>
                  <input
                    type="text"
                    value={alertCity}
                    onChange={(e) => setAlertCity(e.target.value)}
                    placeholder="e.g. Gwagwalada"
                    className="w-full bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1.5"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Maximum Price (₦)</label>
                <input
                  type="number"
                  value={alertMaxPrice}
                  onChange={(e) => setAlertMaxPrice(e.target.value ? Number(e.target.value) : '')}
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1.5 tabular-nums"
                />
              </div>

              <div className="space-y-1 pt-1">
                <span className="font-semibold text-stone-700 block">Notification Channels:</span>
                <div className="flex gap-4">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={channelEmail}
                      onChange={(e) => setChannelEmail(e.target.checked)}
                    />
                    <span>Email</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={channelWhatsapp}
                      onChange={(e) => setChannelWhatsapp(e.target.checked)}
                    />
                    <span>WhatsApp</span>
                  </label>
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAlertModal(false)}
                  className="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg shadow-sm"
                >
                  Save Alert
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
