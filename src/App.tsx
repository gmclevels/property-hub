import React, { useState } from 'react';
import { PropertyProvider, useProperties } from './context/PropertyContext';
import { Navbar } from './components/Navbar';
import { MobileBottomNav } from './components/MobileBottomNav';
import { LandingPage } from './components/LandingPage';
import { BuyPage } from './components/BuyPage';
import { RentPage } from './components/RentPage';
import { LandPage } from './components/LandPage';
import { AISearchView } from './components/AISearchView';
import { PropertyMapView } from './components/PropertyMapView';
import { BuyerRequestView } from './components/BuyerRequestView';
import { SellerDashboard } from './components/SellerDashboard';
import { SeekerDashboard } from './components/SeekerDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { LegalDisclaimerPage } from './components/LegalDisclaimerPage';
import { ProfileView } from './components/ProfileView';

import { PropertyDetailsModal } from './components/PropertyDetailsModal';
import { PostPropertyModal } from './components/PostPropertyModal';
import { PropertyComparisonModal } from './components/PropertyComparisonModal';
import { SendEnquiryModal } from './components/SendEnquiryModal';
import { ReportListingModal } from './components/ReportListingModal';
import { AIAssistantDrawer } from './components/AIAssistantDrawer';

import { Property } from './types';
import { Sparkles } from 'lucide-react';

function AppContent() {
  const { currentUser } = useProperties();
  const [activeTab, setActiveTab] = useState<string>('home');
  const [initialSearchQuery, setInitialSearchQuery] = useState<string>('');

  // Modals state
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [enquiryProperty, setEnquiryProperty] = useState<Property | null>(null);
  const [reportProperty, setReportProperty] = useState<Property | null>(null);
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);

  const handleNavigateTab = (tab: string, query?: string) => {
    if (query) {
      setInitialSearchQuery(query);
    }
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectProperty = (property: Property) => {
    setSelectedProperty(property);
  };

  const handlePostSuccess = (newProp: Property) => {
    setIsPostModalOpen(false);
    setSelectedProperty(newProp);
  };

  return (
    <div className="min-h-screen bg-theme-triad text-stone-900 flex flex-col font-sans pb-16 md:pb-0 selection:bg-amber-100 selection:text-emerald-900">
      {/* Signature Nigerian Triad Header Accent: Green, Gold and White */}
      <div className="h-1.5 w-full grid grid-cols-3 z-50 sticky top-0">
        <div className="bg-emerald-700"></div>
        <div className="bg-amber-400"></div>
        <div className="bg-emerald-700"></div>
      </div>

      {/* Top Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        openPostModal={() => setIsPostModalOpen(true)}
        openCompareModal={() => setIsCompareModalOpen(true)}
      />

      {/* Main Content Body */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <LandingPage
            onNavigateTab={handleNavigateTab}
            onSelectProperty={handleSelectProperty}
            onOpenPostModal={() => setIsPostModalOpen(true)}
          />
        )}

        {activeTab === 'buy' && (
          <BuyPage
            onSelectProperty={handleSelectProperty}
            initialSearchQuery={initialSearchQuery}
          />
        )}

        {activeTab === 'rent' && (
          <RentPage onSelectProperty={handleSelectProperty} />
        )}

        {activeTab === 'land' && (
          <LandPage onSelectProperty={handleSelectProperty} />
        )}

        {activeTab === 'map' && (
          <PropertyMapView onSelectProperty={handleSelectProperty} />
        )}

        {activeTab === 'ai-search' && (
          <AISearchView onSelectProperty={handleSelectProperty} />
        )}

        {activeTab === 'buyer-requests' && (
          <BuyerRequestView />
        )}

        {activeTab === 'saved' && (
          <SeekerDashboard
            onSelectProperty={handleSelectProperty}
            onNavigateTab={handleNavigateTab}
          />
        )}

        {activeTab === 'enquiries' && (
          <SeekerDashboard
            onSelectProperty={handleSelectProperty}
            onNavigateTab={handleNavigateTab}
          />
        )}

        {activeTab === 'seller-dashboard' && (
          <SellerDashboard
            onOpenPostModal={() => setIsPostModalOpen(true)}
            onSelectProperty={handleSelectProperty}
          />
        )}

        {activeTab === 'seeker-dashboard' && (
          <SeekerDashboard
            onSelectProperty={handleSelectProperty}
            onNavigateTab={handleNavigateTab}
          />
        )}

        {activeTab === 'admin' && (
          <AdminDashboard />
        )}

        {activeTab === 'disclaimer' && (
          <LegalDisclaimerPage />
        )}

        {activeTab === 'profile' && (
          <ProfileView />
        )}
      </main>

      {/* Floating Gerald AI Assistant Button in Green, Gold and White */}
      <div className="fixed bottom-20 md:bottom-6 right-5 z-40">
        <button
          onClick={() => setIsAIAssistantOpen(!isAIAssistantOpen)}
          className="flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-emerald-900 via-emerald-800 to-stone-900 text-white rounded-full shadow-2xl hover:scale-105 transition-all duration-200 cursor-pointer border-2 border-amber-400 group ring-4 ring-emerald-900/20"
          title="Ask Gerald AI Assistant"
        >
          <Sparkles className="w-5 h-5 text-amber-300 group-hover:rotate-12 transition-transform" />
          <span className="text-xs font-bold tracking-tight text-white">Gerald AI Assistant</span>
        </button>
      </div>

      {/* Floating AI Assistant Drawer */}
      <AIAssistantDrawer
        isOpen={isAIAssistantOpen}
        onClose={() => setIsAIAssistantOpen(false)}
        onSelectProperty={handleSelectProperty}
      />

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Modals */}
      <PropertyDetailsModal
        property={selectedProperty}
        onClose={() => setSelectedProperty(null)}
        onOpenEnquiry={(prop) => setEnquiryProperty(prop)}
        onOpenReport={(prop) => setReportProperty(prop)}
      />

      <PostPropertyModal
        isOpen={isPostModalOpen}
        onClose={() => setIsPostModalOpen(false)}
        onSuccess={handlePostSuccess}
      />

      <PropertyComparisonModal
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
        onSelectProperty={handleSelectProperty}
      />

      <SendEnquiryModal
        property={enquiryProperty}
        onClose={() => setEnquiryProperty(null)}
      />

      <ReportListingModal
        property={reportProperty}
        onClose={() => setReportProperty(null)}
      />
    </div>
  );
}

export default function App() {
  return (
    <PropertyProvider>
      <AppContent />
    </PropertyProvider>
  );
}
