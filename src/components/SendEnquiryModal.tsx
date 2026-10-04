import React, { useState } from 'react';
import { X, Send, CheckCircle2, ShieldCheck } from 'lucide-react';
import { Property } from '../types';
import { useProperties } from '../context/PropertyContext';
import { formatNaira } from '../utils/formatters';

interface SendEnquiryModalProps {
  property: Property | null;
  onClose: () => void;
}

export const SendEnquiryModal: React.FC<SendEnquiryModalProps> = ({ property, onClose }) => {
  const { sendEnquiry, currentUser } = useProperties();
  const [buyerName, setBuyerName] = useState(currentUser.fullName);
  const [buyerPhone, setBuyerPhone] = useState(currentUser.phone);
  const [buyerEmail, setBuyerEmail] = useState(currentUser.email);
  const [message, setMessage] = useState(
    'I am interested in this property. Please contact me with more information and inspection availability.'
  );
  const [isSuccess, setIsSuccess] = useState(false);

  if (!property) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!buyerName || !buyerPhone || !message.trim()) return;

    sendEnquiry(property, message, buyerName, buyerPhone, buyerEmail);
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
          <div>
            <span className="text-[11px] uppercase tracking-wider text-emerald-800 font-bold">Official Inquiry</span>
            <h2 className="text-base font-bold text-stone-900 font-display">Contact Property Seller</h2>
          </div>
          <button onClick={onClose} className="p-1 text-stone-400 hover:text-stone-700">✕</button>
        </div>

        {isSuccess ? (
          <div className="py-8 text-center space-y-2">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <h3 className="text-base font-bold text-stone-900">Enquiry Sent Successfully!</h3>
            <p className="text-xs text-stone-500">
              The listing representative ({property.sellerName}) has received your enquiry and will contact you via telephone or email.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3 text-xs">
            {/* Target Property Summary */}
            <div className="bg-stone-50 p-3 rounded-lg border border-stone-100 space-y-1">
              <span className="font-semibold text-stone-800 block line-clamp-1">{property.title}</span>
              <div className="flex items-center justify-between text-stone-500 text-[11px]">
                <span>{property.area}, {property.city}</span>
                <span className="font-bold text-emerald-800 tabular-nums">{formatNaira(property.price)}</span>
              </div>
            </div>

            <div>
              <label className="font-semibold text-stone-700 block mb-1">Your Full Name *</label>
              <input
                type="text"
                value={buyerName}
                onChange={(e) => setBuyerName(e.target.value)}
                required
                className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs text-stone-900"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="font-semibold text-stone-700 block mb-1">Phone Number *</label>
                <input
                  type="text"
                  value={buyerPhone}
                  onChange={(e) => setBuyerPhone(e.target.value)}
                  required
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs text-stone-900"
                />
              </div>
              <div>
                <label className="font-semibold text-stone-700 block mb-1">Email Address</label>
                <input
                  type="email"
                  value={buyerEmail}
                  onChange={(e) => setBuyerEmail(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs text-stone-900"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-stone-700 block mb-1">Message to Seller *</label>
              <textarea
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
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
                className="inline-flex items-center gap-1.5 px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg shadow-sm"
              >
                <Send className="w-3.5 h-3.5" />
                Submit Enquiry
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
