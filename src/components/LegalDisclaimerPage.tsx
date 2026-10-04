import React from 'react';
import { ShieldCheck, AlertTriangle, FileText, CheckCircle2, UserCheck, HelpCircle } from 'lucide-react';
import { LEGAL_DISCLAIMERS } from '../utils/formatters';

export const LegalDisclaimerPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-8">
      {/* Brand Header */}
      <div className="text-center space-y-3 border-b border-stone-200 pb-8">
        <span className="text-xs uppercase tracking-widest font-bold text-emerald-800">
          Transparency & Due Diligence Standard
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold text-stone-900 font-display">
          Gerald Property Hub
        </h1>
        <p className="text-base text-emerald-800 font-semibold italic">
          “Find It. Verify It. Own It.”
        </p>
        <p className="text-xs text-stone-500 max-w-xl mx-auto">
          Founded by Mr Gerald N. Uzor to bring trust, clarity, and rigorous verification transparency to the Nigerian real estate and land marketplace.
        </p>
      </div>

      {/* Core Verification Principle Banner */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 space-y-3 text-emerald-950">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-6 h-6 text-emerald-700 shrink-0" />
          <h2 className="text-lg font-bold font-display">User Information vs Platform-Verified Information</h2>
        </div>
        <p className="text-sm leading-relaxed">
          Gerald Property Hub strictly distinguishes between <strong>user-submitted information</strong> and <strong>platform-verified information</strong>.
          We never claim that a property is legally verified unless an actual verification process has been completed and recorded by our compliance desk.
        </p>
      </div>

      {/* Anti-Scam Precautions */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 space-y-3 text-amber-950">
        <div className="flex items-center gap-2.5">
          <AlertTriangle className="w-6 h-6 text-amber-700 shrink-0" />
          <h2 className="text-lg font-bold font-display">Mandatory Anti-Scam Directives for Seekers</h2>
        </div>
        <ul className="text-xs space-y-2 list-disc pl-5 text-amber-900 leading-relaxed">
          <li><strong>Never send money or inspection fees</strong> before independently confirming the physical property, the seller's verified identity, and title credentials.</li>
          <li>Never transact in cash. Always conduct transactions through formal banking channels with legal receipts.</li>
          <li>For land transactions, demand physical beacon coordinates and inspect them on ground with a registered surveyor.</li>
          <li>Request an official search report at the relevant Land Registry (e.g. AGIS in Abuja or the State Ministry of Lands).</li>
        </ul>
      </div>

      {/* Detailed Legal Clauses */}
      <div className="space-y-6 text-xs text-stone-700 leading-relaxed bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-xs">
        <section className="space-y-2">
          <h3 className="text-sm font-bold text-stone-900">1. Nature of the Platform</h3>
          <p>
            Gerald Property Hub operates as a proptech marketplace connecting property seekers with property owners, real estate developers, and licensed agents. Gerald Property Hub is not the legal owner, developer, or landlord of listings posted on this platform unless explicitly designated.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="text-sm font-bold text-stone-900">2. Accuracy of User-Submitted Content</h3>
          <p>
            Property descriptions, architectural measurements, photos, amenities, and asking prices are initially provided by listing owners or their agents. Prices and availability are subject to change without prior notice.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="text-sm font-bold text-stone-900">3. Title Document Information Disclaimer</h3>
          <p>
            {LEGAL_DISCLAIMERS.documentNotice} Uploading document scans or specifying document categories (such as C of O, Deed of Assignment, Gazette, or Registered Survey) does not automatically certify genuine legal title. Independent search and surveying confirmation is always mandatory.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="text-sm font-bold text-stone-900">4. Professional Advice Disclaimer</h3>
          <p>
            The content and tools provided on Gerald Property Hub do not constitute formal legal counsel, statutory land surveying, or certified financial advice. Users must engage independent legal practitioners and registered surveyors prior to executing binding property conveyances.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="text-sm font-bold text-stone-900">5. Reporting Infringements & Scams</h3>
          <p>
            If you encounter any misleading pricing, duplicate listings, or suspicious individuals, use the “Report Listing” button on any property page or contact the compliance desk immediately for prompt investigation and listing suspension.
          </p>
        </section>
      </div>
    </div>
  );
};
