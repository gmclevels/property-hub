import React, { createContext, useContext, useState, useEffect } from 'react';
import { Property, User, Enquiry, PropertyAlert, BuyerRequest, ListingReport, VerificationStatus } from '../types';
import { DEMO_PROPERTIES } from '../data/demoProperties';

interface PropertyContextType {
  properties: Property[];
  currentUser: User;
  savedPropertyIds: string[];
  comparedPropertyIds: string[];
  enquiries: Enquiry[];
  buyerRequests: BuyerRequest[];
  alerts: PropertyAlert[];
  reports: ListingReport[];
  
  // Actions
  setCurrentUserRole: (role: User['role']) => void;
  saveProperty: (id: string) => void;
  unsaveProperty: (id: string) => void;
  isSaved: (id: string) => boolean;
  toggleCompare: (id: string) => void;
  removeFromCompare: (id: string) => void;
  clearCompare: () => void;
  
  addProperty: (property: Omit<Property, 'id' | 'createdAt' | 'updatedAt' | 'viewsCount' | 'savesCount' | 'enquiriesCount'>) => Property;
  updateProperty: (id: string, updates: Partial<Property>) => void;
  deleteProperty: (id: string) => void;
  verifyProperty: (id: string, status: VerificationStatus, notes?: string, docsReviewed?: string[], source?: string) => void;
  
  sendEnquiry: (property: Property, message: string, buyerName: string, buyerPhone: string, buyerEmail: string) => void;
  updateEnquiryStatus: (id: string, status: Enquiry['status']) => void;
  
  addBuyerRequest: (request: Omit<BuyerRequest, 'id' | 'createdAt' | 'status'>) => void;
  addAlert: (alert: Omit<PropertyAlert, 'id' | 'createdAt'>) => void;
  reportListing: (report: Omit<ListingReport, 'id' | 'createdAt' | 'status'>) => void;
  resolveReport: (id: string, status: ListingReport['status'], adminNotes?: string) => void;
  
  incrementViewCount: (id: string) => void;
}

const PropertyContext = createContext<PropertyContextType | undefined>(undefined);

const DEFAULT_USER: User = {
  id: 'current-user-seeker',
  fullName: 'Chidi Okonkwo',
  email: 'chidi.seeker@example.com',
  phone: '+234 800 000 0200',
  whatsapp: '2348000000200',
  role: 'seeker',
  location: 'Abuja, Nigeria',
  createdAt: '2026-09-01'
};

export const PropertyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [properties, setProperties] = useState<Property[]>(() => {
    const saved = localStorage.getItem('gph_properties');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse cached properties', e);
      }
    }
    return DEMO_PROPERTIES;
  });

  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem('gph_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return DEFAULT_USER;
  });

  const [savedPropertyIds, setSavedPropertyIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('gph_saved_ids');
    return saved ? JSON.parse(saved) : ['prop-abuja-gwagwalada-land'];
  });

  const [comparedPropertyIds, setComparedPropertyIds] = useState<string[]>([]);

  const [enquiries, setEnquiries] = useState<Enquiry[]>(() => {
    const saved = localStorage.getItem('gph_enquiries');
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 'enq-1',
            propertyId: 'prop-abuja-gwagwalada-land',
            propertyTitle: 'Dry Residential Plot of Land at Gwagwalada Phase 1',
            propertyPrice: 14500000,
            buyerId: 'current-user-seeker',
            buyerName: 'Chidi Okonkwo',
            buyerPhone: '+234 800 000 0200',
            buyerEmail: 'chidi.seeker@example.com',
            sellerId: 'user-owner-2',
            message: 'Hello, is this Gwagwalada land still available for physical inspection this Saturday?',
            status: 'new',
            createdAt: '2026-09-26T10:15:00Z'
          }
        ];
  });

  const [buyerRequests, setBuyerRequests] = useState<BuyerRequest[]>(() => {
    const saved = localStorage.getItem('gph_buyer_requests');
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 'req-1',
            userId: 'seeker-emeka',
            userName: 'Emeka Eze',
            userPhone: '+234 800 000 0301',
            propertyType: 'Land',
            transactionType: 'sale',
            state: 'FCT - Abuja',
            city: 'Gwagwalada',
            area: 'Near Teaching Hospital',
            minBudget: 10000000,
            maxBudget: 16000000,
            size: '500–800 sqm',
            purpose: 'Residential',
            requirements: 'Dry land with registered survey or R of O near tarred access road.',
            status: 'open',
            createdAt: '2026-09-24T14:00:00Z'
          },
          {
            id: 'req-2',
            userId: 'seeker-aminat',
            userName: 'Aminat Bello',
            userPhone: '+234 800 000 0302',
            propertyType: 'Apartment',
            transactionType: 'rent',
            state: 'Lagos',
            city: 'Lekki',
            area: 'Lekki Phase 1',
            minBudget: 7000000,
            maxBudget: 10000000,
            size: '3 Bedrooms',
            requirements: 'Serviced apartment with standby generator and 24hr security.',
            status: 'open',
            createdAt: '2026-09-25T09:30:00Z'
          }
        ];
  });

  const [alerts, setAlerts] = useState<PropertyAlert[]>(() => {
    const saved = localStorage.getItem('gph_alerts');
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 'alert-1',
            userId: 'current-user-seeker',
            propertyType: 'Land',
            transactionType: 'sale',
            state: 'FCT - Abuja',
            city: 'Gwagwalada',
            maxPrice: 15000000,
            active: true,
            notificationChannels: { email: true, sms: false, whatsapp: true },
            createdAt: '2026-09-20'
          }
        ];
  });

  const [reports, setReports] = useState<ListingReport[]>(() => {
    const saved = localStorage.getItem('gph_reports');
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 'rep-1',
            propertyId: 'prop-abuja-kubwa-flat-rent',
            propertyTitle: 'Decent 2-Bedroom Flat in Gated Estate, Kubwa',
            reporterId: 'user-seeker-9',
            reason: 'incorrect_price',
            description: 'Agent previously quoted ₦2.2m inspection fee, please verify rent breakdown.',
            status: 'investigating',
            adminNotes: 'Hub officer contacting owner to re-confirm fee schedule.',
            createdAt: '2026-09-27T11:00:00Z'
          }
        ];
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('gph_properties', JSON.stringify(properties));
  }, [properties]);

  useEffect(() => {
    localStorage.setItem('gph_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('gph_saved_ids', JSON.stringify(savedPropertyIds));
  }, [savedPropertyIds]);

  useEffect(() => {
    localStorage.setItem('gph_enquiries', JSON.stringify(enquiries));
  }, [enquiries]);

  useEffect(() => {
    localStorage.setItem('gph_buyer_requests', JSON.stringify(buyerRequests));
  }, [buyerRequests]);

  useEffect(() => {
    localStorage.setItem('gph_alerts', JSON.stringify(alerts));
  }, [alerts]);

  useEffect(() => {
    localStorage.setItem('gph_reports', JSON.stringify(reports));
  }, [reports]);

  const setCurrentUserRole = (role: User['role']) => {
    const updated = {
      ...currentUser,
      role,
      businessName: role === 'agent' ? 'Premier Axis Realties [Demo]' : role === 'developer' ? 'Apex Urban Homes [Demo]' : undefined
    };
    setCurrentUser(updated);
  };

  const saveProperty = (id: string) => {
    if (!savedPropertyIds.includes(id)) {
      setSavedPropertyIds((prev) => [...prev, id]);
      setProperties((prev) =>
        prev.map((p) => (p.id === id ? { ...p, savesCount: p.savesCount + 1 } : p))
      );
    }
  };

  const unsaveProperty = (id: string) => {
    setSavedPropertyIds((prev) => prev.filter((item) => item !== id));
    setProperties((prev) =>
      prev.map((p) => (p.id === id ? { ...p, savesCount: Math.max(0, p.savesCount - 1) } : p))
    );
  };

  const isSaved = (id: string) => savedPropertyIds.includes(id);

  const toggleCompare = (id: string) => {
    if (comparedPropertyIds.includes(id)) {
      setComparedPropertyIds((prev) => prev.filter((item) => item !== id));
    } else {
      if (comparedPropertyIds.length >= 3) {
        // limit to 3 properties
        setComparedPropertyIds((prev) => [...prev.slice(1), id]);
      } else {
        setComparedPropertyIds((prev) => [...prev, id]);
      }
    }
  };

  const removeFromCompare = (id: string) => {
    setComparedPropertyIds((prev) => prev.filter((item) => item !== id));
  };

  const clearCompare = () => setComparedPropertyIds([]);

  const addProperty = (newPropData: Omit<Property, 'id' | 'createdAt' | 'updatedAt' | 'viewsCount' | 'savesCount' | 'enquiriesCount'>): Property => {
    const newProperty: Property = {
      ...newPropData,
      id: `prop-${Date.now()}`,
      viewsCount: 1,
      savesCount: 0,
      enquiriesCount: 0,
      verificationStatus: 'VERIFICATION_PENDING',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setProperties((prev) => [newProperty, ...prev]);
    return newProperty;
  };

  const updateProperty = (id: string, updates: Partial<Property>) => {
    setProperties((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p))
    );
  };

  const deleteProperty = (id: string) => {
    setProperties((prev) => prev.filter((p) => p.id !== id));
    setSavedPropertyIds((prev) => prev.filter((i) => i !== id));
    setComparedPropertyIds((prev) => prev.filter((i) => i !== id));
  };

  const verifyProperty = (
    id: string,
    status: VerificationStatus,
    notes?: string,
    docsReviewed?: string[],
    source?: string
  ) => {
    setProperties((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        return {
          ...p,
          verificationStatus: status,
          verificationRecord: {
            status,
            reviewedBy: 'Gerald Property Hub Administrator',
            reviewedAt: new Date().toISOString().split('T')[0],
            notes: notes || p.verificationRecord?.notes || 'Admin manual review updated.',
            documentsReviewed: docsReviewed || p.verificationRecord?.documentsReviewed || [],
            verificationSource: source || p.verificationRecord?.verificationSource || 'Internal Verification Desk'
          }
        };
      })
    );
  };

  const sendEnquiry = (
    property: Property,
    message: string,
    buyerName: string,
    buyerPhone: string,
    buyerEmail: string
  ) => {
    const newEnquiry: Enquiry = {
      id: `enq-${Date.now()}`,
      propertyId: property.id,
      propertyTitle: property.title,
      propertyPrice: property.price,
      buyerId: currentUser.id,
      buyerName,
      buyerPhone,
      buyerEmail,
      sellerId: property.ownerId,
      message,
      status: 'new',
      createdAt: new Date().toISOString()
    };
    setEnquiries((prev) => [newEnquiry, ...prev]);
    setProperties((prev) =>
      prev.map((p) => (p.id === property.id ? { ...p, enquiriesCount: p.enquiriesCount + 1 } : p))
    );
  };

  const updateEnquiryStatus = (id: string, status: Enquiry['status']) => {
    setEnquiries((prev) => prev.map((e) => (e.id === id ? { ...e, status } : e)));
  };

  const addBuyerRequest = (reqData: Omit<BuyerRequest, 'id' | 'createdAt' | 'status'>) => {
    const newReq: BuyerRequest = {
      ...reqData,
      id: `req-${Date.now()}`,
      status: 'open',
      createdAt: new Date().toISOString()
    };
    setBuyerRequests((prev) => [newReq, ...prev]);
  };

  const addAlert = (alertData: Omit<PropertyAlert, 'id' | 'createdAt'>) => {
    const newAlert: PropertyAlert = {
      ...alertData,
      id: `alert-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setAlerts((prev) => [newAlert, ...prev]);
  };

  const reportListing = (reportData: Omit<ListingReport, 'id' | 'createdAt' | 'status'>) => {
    const newReport: ListingReport = {
      ...reportData,
      id: `rep-${Date.now()}`,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    setReports((prev) => [newReport, ...prev]);
  };

  const resolveReport = (id: string, status: ListingReport['status'], adminNotes?: string) => {
    setReports((prev) => prev.map((r) => (r.id === id ? { ...r, status, adminNotes } : r)));
  };

  const incrementViewCount = (id: string) => {
    setProperties((prev) =>
      prev.map((p) => (p.id === id ? { ...p, viewsCount: p.viewsCount + 1 } : p))
    );
  };

  return (
    <PropertyContext.Provider
      value={{
        properties,
        currentUser,
        savedPropertyIds,
        comparedPropertyIds,
        enquiries,
        buyerRequests,
        alerts,
        reports,
        setCurrentUserRole,
        saveProperty,
        unsaveProperty,
        isSaved,
        toggleCompare,
        removeFromCompare,
        clearCompare,
        addProperty,
        updateProperty,
        deleteProperty,
        verifyProperty,
        sendEnquiry,
        updateEnquiryStatus,
        addBuyerRequest,
        addAlert,
        reportListing,
        resolveReport,
        incrementViewCount
      }}
    >
      {children}
    </PropertyContext.Provider>
  );
};

export const useProperties = () => {
  const context = useContext(PropertyContext);
  if (!context) {
    throw new Error('useProperties must be used within a PropertyProvider');
  }
  return context;
};
