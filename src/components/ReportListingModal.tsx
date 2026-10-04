import React, { useState } from 'react';
import { Flag, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Property, ListingReport } from '../types';
import { useProperties } from '../context/PropertyContext';

interface ReportListingModalProps {
  property: Property | null;
  onClose: () => void;
}

export const ReportListingModal: React.FC<ReportListingModalProps> = ({ property, onClose }) => {
  const { reportListing, currentUser } = useProperties();
  const [reason, setReason] = useState<ListingReport['reason']>('suspected_scam');
  const [description, setDescription] = useState('');
  const [reporterName, setReporterName] = useState(currentUser.fullName);
  const [reporterEmail, setReporterEmail] = useState(currentUser.email);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!property) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    reportListing({
      propertyId: property.id,
      propertyTitle: property.title,
      reporterId: currentUser.id,
      reporterName,
      reporterEmail,
      reason,
      description
    });

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-stone-200 p-6 space-y-4 my-auto">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div className="flex items-center gap-2">
            <Flag className="w-4 h-4 text-rose-600" />
            <h2 className="text-base font-bold text-stone-900 font-display">Report this Listing</h2>
          </div>
          <button onClick={onClose} className="p-1 text-stone-400 hover:text-stone-700">✕</button>
        </div>

        {isSuccess ? (
          <div className="py-8 text-center space-y-2">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <h3 className="text-base font-bold text-stone-900">Report Submitted</h3>
            <p className="text-xs text-stone-500">
              Our compliance team will investigate this listing against our platform verification guidelines.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3 text-xs">
            <p className="text-stone-600 text-xs">
              Reporting: <strong>{property.title}</strong>
            </p>

            <div>
              <label className="font-semibold text-stone-700 block mb-1">Reason for Report *</label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value as any)}
                className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs text-stone-800"
              >
                <option value="suspected_scam">Suspected scam / fraudulent seller</option>
                <option value="incorrect_price">Incorrect or misleading price</option>
                <option value="property_already_sold">Property already sold</option>
                <option value="property_already_rented">Property already rented</option>
                <option value="false_information">False information or fake photos</option>
                <option value="duplicate_listing">Duplicate listing</option>
                <option value="inappropriate_content">Inappropriate content</option>
                <option value="other">Other reason</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-stone-700 block mb-1">Detailed Explanation *</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explain what seems incorrect or fraudulent about this listing..."
                required
                className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs text-stone-900"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg shadow-sm"
              >
                Submit Report
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
