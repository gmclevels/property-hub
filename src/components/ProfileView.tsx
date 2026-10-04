import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { useProperties } from '../context/PropertyContext';
import { User as UserIcon, ShieldCheck, Mail, Phone, MapPin, Briefcase, Building, Save, LogOut } from 'lucide-react';

export const ProfileView: React.FC = () => {
  const { currentUser, setCurrentUserRole, savedPropertyIds, enquiries, properties } = useProperties();

  const [fullName, setFullName] = useState(currentUser.fullName);
  const [email, setEmail] = useState(currentUser.email);
  const [phone, setPhone] = useState(currentUser.phone);
  const [location, setLocation] = useState(currentUser.location || 'Abuja, Nigeria');
  const [businessName, setBusinessName] = useState(currentUser.businessName || '');
  const [about, setAbout] = useState(currentUser.about || 'Experienced Nigerian real estate professional committed to verified property discovery.');
  const [yearsOfExperience, setYearsOfExperience] = useState<number | ''>(currentUser.yearsOfExperience || 8);
  const [officeLocation, setOfficeLocation] = useState(currentUser.officeLocation || 'Suite 402, Garki 2, Abuja');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const roles: { role: UserRole; title: string }[] = [
    { role: 'seeker', title: 'Property Seeker (Buyer/Renter)' },
    { role: 'owner', title: 'Direct Property Owner' },
    { role: 'agent', title: 'Licensed Real Estate Agent' },
    { role: 'developer', title: 'Property Development Company' },
    { role: 'admin', title: 'Platform Compliance Administrator' }
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const isProfessional = currentUser.role === 'agent' || currentUser.role === 'developer' || currentUser.role === 'owner';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
            Account Management
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 font-display">
            User Profile & Credentials
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs bg-emerald-50 border border-emerald-200 text-emerald-800 font-semibold px-3 py-1.5 rounded-lg capitalize">
            Role: {currentUser.role}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Avatar & Summary */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4 text-center">
          <div className="w-24 h-24 rounded-full bg-emerald-800 text-white text-3xl font-bold flex items-center justify-center mx-auto shadow-md">
            {fullName.charAt(0)}
          </div>
          <div>
            <h2 className="text-lg font-bold text-stone-900">{fullName}</h2>
            <p className="text-xs text-stone-500 capitalize">{currentUser.role}</p>
          </div>

          <div className="pt-3 border-t border-stone-100 text-xs text-stone-600 space-y-2 text-left">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-stone-400 shrink-0" />
              <span className="truncate">{email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-stone-400 shrink-0" />
              <span>{phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-stone-400 shrink-0" />
              <span>{location}</span>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 gap-2 pt-3 border-t border-stone-100 text-center text-xs">
            <div className="p-2 bg-stone-50 rounded-lg">
              <span className="text-stone-400 text-[10px] block uppercase font-bold">Saved</span>
              <span className="text-base font-bold text-stone-900 tabular-nums">{savedPropertyIds.length}</span>
            </div>
            <div className="p-2 bg-stone-50 rounded-lg">
              <span className="text-stone-400 text-[10px] block uppercase font-bold">Inquiries</span>
              <span className="text-base font-bold text-stone-900 tabular-nums">{enquiries.length}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Edit Profile Form */}
        <div className="md:col-span-2 bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-xs space-y-5">
          <h3 className="text-base font-bold text-stone-900 font-display">Personal & Business Information</h3>

          <form onSubmit={handleSave} className="space-y-4 text-xs">
            {/* Role switch toggle */}
            <div>
              <label className="font-semibold text-stone-700 block mb-1.5">Switch Platform Role (MVP Testing)</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {roles.map((r) => (
                  <button
                    key={r.role}
                    type="button"
                    onClick={() => setCurrentUserRole(r.role)}
                    className={`p-2.5 rounded-lg border text-left font-medium transition-all cursor-pointer ${
                      currentUser.role === r.role
                        ? 'border-emerald-700 bg-emerald-50 text-emerald-950 font-bold'
                        : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    {r.title}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div>
                <label className="font-semibold text-stone-700 block mb-1">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-stone-900"
                />
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-stone-900"
                />
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Phone / WhatsApp</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-stone-900"
                />
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Base Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-stone-900"
                />
              </div>
            </div>

            {/* Professional fields for owners and agents */}
            {isProfessional && (
              <div className="space-y-3 pt-3 border-t border-stone-100">
                <span className="font-bold text-stone-900 block text-xs">Professional Profile Details</span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-stone-700 block mb-1">Agency / Business Name</label>
                    <input
                      type="text"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      placeholder="e.g. Uzor & Partners Realties"
                      className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-stone-900"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-stone-700 block mb-1">Years of Experience</label>
                    <input
                      type="number"
                      value={yearsOfExperience}
                      onChange={(e) => setYearsOfExperience(e.target.value ? Number(e.target.value) : '')}
                      className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-stone-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Physical Office Location</label>
                  <input
                    type="text"
                    value={officeLocation}
                    onChange={(e) => setOfficeLocation(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-stone-900"
                  />
                </div>

                <div>
                  <label className="font-semibold text-stone-700 block mb-1">About / Bio</label>
                  <textarea
                    rows={3}
                    value={about}
                    onChange={(e) => setAbout(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-stone-900"
                  />
                </div>
              </div>
            )}

            {savedSuccess && (
              <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-semibold">
                Profile updated successfully!
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg shadow-sm transition-colors cursor-pointer"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
