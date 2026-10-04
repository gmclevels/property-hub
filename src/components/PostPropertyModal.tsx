import React, { useState } from 'react';
import { 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Upload, 
  CheckCircle2, 
  MapPin, 
  AlertCircle,
  Building,
  Image as ImageIcon,
  Check
} from 'lucide-react';
import { Property, PropertyCategory, TransactionType, RentalFrequency, UserRole, DocumentType } from '../types';
import { ALL_STATE_NAMES, NIGERIAN_STATES } from '../data/nigerianLocations';
import { useProperties } from '../context/PropertyContext';
import { formatNaira, LEGAL_DISCLAIMERS } from '../utils/formatters';

interface PostPropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newProperty: Property) => void;
}

export const PostPropertyModal: React.FC<PostPropertyModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const { addProperty, currentUser } = useProperties();
  const [currentStep, setCurrentStep] = useState(1);
  const [errorMsg, setErrorMsg] = useState('');

  // Form State
  const [category, setCategory] = useState<PropertyCategory>('Residential');
  const [propertyType, setPropertyType] = useState('Duplex');
  const [transactionType, setTransactionType] = useState<TransactionType>('sale');

  // Location
  const [state, setState] = useState('FCT - Abuja');
  const [lga, setLga] = useState('Abuja Municipal');
  const [city, setCity] = useState('Abuja');
  const [area, setArea] = useState('');
  const [street, setStreet] = useState('');

  // Details
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [bedrooms, setBedrooms] = useState<number | ''>(3);
  const [bathrooms, setBathrooms] = useState<number | ''>(3);
  const [toilets, setToilets] = useState<number | ''>(4);
  const [landSize, setLandSize] = useState('500 sqm');
  const [buildingSize, setBuildingSize] = useState('');
  const [propertyCondition, setPropertyCondition] = useState<'brand_new' | 'fairly_used' | 'uncompleted' | 'renovated'>('brand_new');
  const [documentType, setDocumentType] = useState<DocumentType>('C of O');

  // Price
  const [price, setPrice] = useState<number | ''>(45000000);
  const [rentalFrequency, setRentalFrequency] = useState<RentalFrequency>('yearly');

  // Features
  const availableFeatures = [
    'Borehole & Water Treatment',
    'POP Ceiling',
    'Fenced Compound',
    'Security Post / Guard',
    'Standby Power / Generator',
    'Tiled Floor',
    'Dedicated Parking Space',
    'Swimming Pool',
    'Fitted Kitchen Cabinets',
    'All En-suite Bedrooms',
    'Prepaid Electricity Metre',
    'Electric Perimeter Fence'
  ];
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([
    'Borehole & Water Treatment',
    'POP Ceiling',
    'Fenced Compound',
    'Security Post / Guard'
  ]);

  // Photos
  const [photoUrls, setPhotoUrls] = useState<string[]>([
    '/src/assets/images/hero_abuja_estate_1790850408390.jpg'
  ]);
  const [customPhotoInput, setCustomPhotoInput] = useState('');

  // Seller info
  const [sellerRole, setSellerRole] = useState<UserRole>(currentUser.role === 'seeker' ? 'owner' : currentUser.role);
  const [sellerName, setSellerName] = useState(currentUser.fullName);
  const [sellerPhone, setSellerPhone] = useState(currentUser.phone);
  const [sellerWhatsapp, setSellerWhatsapp] = useState(currentUser.whatsapp || currentUser.phone);
  const [businessName, setBusinessName] = useState(currentUser.businessName || '');

  if (!isOpen) return null;

  const toggleFeature = (feat: string) => {
    setSelectedFeatures((prev) =>
      prev.includes(feat) ? prev.filter((f) => f !== feat) : [...prev, feat]
    );
  };

  const handleAddPhoto = () => {
    if (customPhotoInput.trim()) {
      setPhotoUrls((prev) => [...prev, customPhotoInput.trim()]);
      setCustomPhotoInput('');
    }
  };

  const validateStep = (step: number): boolean => {
    setErrorMsg('');
    if (step === 3) {
      if (!state || !area.trim()) {
        setErrorMsg('Please specify State and Area/Neighborhood.');
        return false;
      }
    }
    if (step === 4) {
      if (!title.trim() || !description.trim()) {
        setErrorMsg('Please provide a descriptive listing title and overview.');
        return false;
      }
    }
    if (step === 5) {
      if (!price || price <= 0) {
        setErrorMsg('Please enter a valid asking price in Nigerian Naira.');
        return false;
      }
    }
    if (step === 8) {
      if (!sellerName.trim() || !sellerPhone.trim()) {
        setErrorMsg('Please enter your contact name and telephone number.');
        return false;
      }
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(9, prev + 1));
    }
  };

  const prevStep = () => {
    setErrorMsg('');
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  const handlePublish = () => {
    const newProperty = addProperty({
      ownerId: currentUser.id,
      ownerRole: sellerRole,
      sellerName,
      sellerPhone,
      sellerWhatsapp,
      businessName: businessName || undefined,
      title,
      category,
      propertyType,
      transactionType,
      description,
      state,
      lga,
      city: city || state,
      area,
      street: street || undefined,
      approximateLocation: {
        lat: 9.0765,
        lng: 7.3986,
        addressNote: `${area}, ${city || state}`
      },
      price: Number(price),
      rentalFrequency: transactionType === 'rent' ? rentalFrequency : undefined,
      bedrooms: category !== 'Land' && bedrooms !== '' ? Number(bedrooms) : undefined,
      bathrooms: category !== 'Land' && bathrooms !== '' ? Number(bathrooms) : undefined,
      toilets: category !== 'Land' && toilets !== '' ? Number(toilets) : undefined,
      landSize: landSize || undefined,
      buildingSize: buildingSize || undefined,
      propertyCondition,
      documentType,
      features: selectedFeatures,
      images: photoUrls.length > 0 ? photoUrls : ['/src/assets/images/hero_abuja_estate_1790850408390.jpg'],
      status: 'available',
      verificationStatus: 'VERIFICATION_PENDING',
      isDemo: false
    });

    onSuccess(newProperty);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="relative bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden border border-stone-200 my-auto flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div>
            <span className="text-xs uppercase tracking-wider font-semibold text-emerald-800">
              Listing Creator
            </span>
            <h2 className="text-lg font-bold text-stone-900 font-display">
              Post a Property on Gerald Property Hub
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-200 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator Header */}
        <div className="px-6 py-2.5 bg-stone-100/70 border-b border-stone-200 text-xs flex items-center justify-between text-stone-600">
          <span>Step {currentStep} of 9: {
            currentStep === 1 ? 'Property Category' :
            currentStep === 2 ? 'Transaction Mode' :
            currentStep === 3 ? 'Location' :
            currentStep === 4 ? 'Property Details' :
            currentStep === 5 ? 'Pricing' :
            currentStep === 6 ? 'Features' :
            currentStep === 7 ? 'Photos' :
            currentStep === 8 ? 'Seller Info' :
            'Preview & Publish'
          }</span>
          <div className="flex gap-1">
            {Array.from({ length: 9 }).map((_, i) => (
              <span
                key={i}
                className={`w-2.5 h-1.5 rounded-full transition-colors ${
                  currentStep > i + 1 ? 'bg-emerald-600' : currentStep === i + 1 ? 'bg-emerald-700 w-5' : 'bg-stone-300'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Error Notification */}
        {errorMsg && (
          <div className="mx-6 mt-4 p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-800 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Step Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {/* Step 1: Property Type & Category */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-stone-900">Select Property Category & Type</h3>
              <div className="grid grid-cols-3 gap-3">
                {(['Residential', 'Land', 'Commercial'] as PropertyCategory[]).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setCategory(cat);
                      if (cat === 'Land') setPropertyType('Residential land');
                      else if (cat === 'Commercial') setPropertyType('Shop');
                      else setPropertyType('Duplex');
                    }}
                    className={`p-4 rounded-xl border text-center font-medium transition-all cursor-pointer ${
                      category === cat
                        ? 'border-emerald-700 bg-emerald-50 text-emerald-900 font-bold ring-2 ring-emerald-600'
                        : 'border-stone-200 hover:border-stone-300 text-stone-700'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="space-y-2 pt-2">
                <label className="text-xs font-semibold text-stone-700 block">Specific Property Type</label>
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs text-stone-800"
                >
                  {category === 'Residential' && (
                    <>
                      <option value="Duplex">Duplex</option>
                      <option value="Detached house">Detached house</option>
                      <option value="Semi-detached house">Semi-detached house</option>
                      <option value="Bungalow">Bungalow</option>
                      <option value="Apartment">Apartment</option>
                      <option value="Flat">Flat</option>
                      <option value="Mansion">Mansion</option>
                      <option value="Self-contained">Self-contained</option>
                      <option value="Room and parlour">Room and parlour</option>
                    </>
                  )}
                  {category === 'Land' && (
                    <>
                      <option value="Residential land">Residential land</option>
                      <option value="Commercial land">Commercial land</option>
                      <option value="Agricultural land">Agricultural land</option>
                      <option value="Industrial land">Industrial land</option>
                      <option value="Mixed-use land">Mixed-use land</option>
                    </>
                  )}
                  {category === 'Commercial' && (
                    <>
                      <option value="Shop">Shop / Retail Store</option>
                      <option value="Office">Office Space</option>
                      <option value="Warehouse">Warehouse</option>
                      <option value="Hotel">Hotel</option>
                      <option value="Event centre">Event centre</option>
                      <option value="Commercial building">Commercial building</option>
                    </>
                  )}
                </select>
              </div>
            </div>
          )}

          {/* Step 2: Transaction Type */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-stone-900">Is this property for Sale or Rent?</h3>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setTransactionType('sale')}
                  className={`p-6 rounded-2xl border text-center transition-all cursor-pointer ${
                    transactionType === 'sale'
                      ? 'border-emerald-700 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-600'
                      : 'border-stone-200 hover:border-stone-300 text-stone-700'
                  }`}
                >
                  <span className="text-lg font-bold block mb-1">For Sale</span>
                  <span className="text-xs text-stone-500">Outright purchase / property acquisition</span>
                </button>

                <button
                  onClick={() => setTransactionType('rent')}
                  className={`p-6 rounded-2xl border text-center transition-all cursor-pointer ${
                    transactionType === 'rent'
                      ? 'border-emerald-700 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-600'
                      : 'border-stone-200 hover:border-stone-300 text-stone-700'
                  }`}
                >
                  <span className="text-lg font-bold block mb-1">For Rent / Lease</span>
                  <span className="text-xs text-stone-500">Tenancy or commercial lease</span>
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Location */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-stone-900">Property Location in Nigeria</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">State *</label>
                  <select
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs text-stone-800"
                  >
                    {ALL_STATE_NAMES.map((st) => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">City / Town *</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Abuja, Lagos, Enugu"
                    className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs text-stone-900"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">Area / Neighborhood *</label>
                  <input
                    type="text"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    placeholder="e.g. Gwagwalada, Guzape, Lekki Phase 1"
                    className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs text-stone-900"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">Street / Estate / Landmark</label>
                  <input
                    type="text"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    placeholder="e.g. Off Admiralty Way"
                    className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs text-stone-900"
                  />
                </div>
              </div>

              <p className="text-[11px] text-stone-500 italic">
                Notice: Exact private house numbers are kept confidential until buyers contact you for verified physical inspections.
              </p>
            </div>
          )}

          {/* Step 4: Property Details */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-stone-900">Property Description & Details</h3>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">Listing Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Contemporary 4 Bedroom Duplex with BQ"
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs text-stone-900"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">Comprehensive Description *</label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe building layout, water supply, electricity, accessibility, finishings..."
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs text-stone-900"
                />
              </div>

              {category !== 'Land' && (
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-stone-700 block mb-1">Bedrooms</label>
                    <input
                      type="number"
                      value={bedrooms}
                      onChange={(e) => setBedrooms(e.target.value ? Number(e.target.value) : '')}
                      className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs text-stone-900"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-stone-700 block mb-1">Bathrooms</label>
                    <input
                      type="number"
                      value={bathrooms}
                      onChange={(e) => setBathrooms(e.target.value ? Number(e.target.value) : '')}
                      className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs text-stone-900"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-stone-700 block mb-1">Toilets</label>
                    <input
                      type="number"
                      value={toilets}
                      onChange={(e) => setToilets(e.target.value ? Number(e.target.value) : '')}
                      className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs text-stone-900"
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">Land Size</label>
                  <input
                    type="text"
                    value={landSize}
                    onChange={(e) => setLandSize(e.target.value)}
                    placeholder="e.g. 500 sqm, 2 plots"
                    className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs text-stone-900"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">Title Document</label>
                  <select
                    value={documentType}
                    onChange={(e) => setDocumentType(e.target.value as any)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs text-stone-800"
                  >
                    <option value="C of O">Certificate of Occupancy (C of O)</option>
                    <option value="Deed of Assignment">Deed of Assignment</option>
                    <option value="Gazette">Gazette / Excision</option>
                    <option value="Registered Survey">Registered Survey</option>
                    <option value="Governor's Consent">Governor's Consent</option>
                    <option value="Other">Other Document</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Price */}
          {currentStep === 5 && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-stone-900">Asking Price & Terms</h3>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">Asking Price (in Nigerian Naira ₦) *</label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value ? Number(e.target.value) : '')}
                  placeholder="e.g. 45000000"
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-sm text-stone-900 font-bold tabular-nums"
                />
                <span className="text-xs text-emerald-800 font-semibold mt-1 block">
                  Preview: {formatNaira(Number(price) || 0)}
                </span>
              </div>

              {transactionType === 'rent' && (
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">Rental Billing Frequency *</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setRentalFrequency('yearly')}
                      className={`p-3 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                        rentalFrequency === 'yearly' ? 'border-emerald-600 bg-emerald-50 text-emerald-900' : 'border-stone-200 text-stone-700'
                      }`}
                    >
                      Per Annum (Yearly)
                    </button>
                    <button
                      type="button"
                      onClick={() => setRentalFrequency('monthly')}
                      className={`p-3 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                        rentalFrequency === 'monthly' ? 'border-emerald-600 bg-emerald-50 text-emerald-900' : 'border-stone-200 text-stone-700'
                      }`}
                    >
                      Per Month (Monthly)
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 6: Features */}
          {currentStep === 6 && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-stone-900">Features & Amenities</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {availableFeatures.map((feat) => {
                  const checked = selectedFeatures.includes(feat);
                  return (
                    <button
                      key={feat}
                      type="button"
                      onClick={() => toggleFeature(feat)}
                      className={`p-3 rounded-lg border text-left text-xs flex items-center justify-between transition-colors cursor-pointer ${
                        checked ? 'bg-emerald-50 border-emerald-500 text-emerald-900 font-semibold' : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                      }`}
                    >
                      <span>{feat}</span>
                      {checked && <Check className="w-4 h-4 text-emerald-600" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 7: Photos */}
          {currentStep === 7 && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-stone-900">Property Photos</h3>
              <p className="text-xs text-stone-500">
                Provide clear photos of the exterior, compound, living areas, and access road.
              </p>

              {/* Photo preview list */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {photoUrls.map((url, i) => (
                  <div key={i} className="relative aspect-4/3 rounded-lg overflow-hidden border border-stone-200 group">
                    <img src={url} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setPhotoUrls((prev) => prev.filter((_, idx) => idx !== i))}
                      className="absolute top-1 right-1 bg-stone-900/80 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add custom URL / demo photo */}
              <div className="flex gap-2 pt-2">
                <input
                  type="text"
                  value={customPhotoInput}
                  onChange={(e) => setCustomPhotoInput(e.target.value)}
                  placeholder="Paste image URL (or leave default gallery photos)"
                  className="flex-1 bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs text-stone-900"
                />
                <button
                  type="button"
                  onClick={handleAddPhoto}
                  className="px-3 py-2 bg-stone-800 text-white text-xs font-semibold rounded-lg hover:bg-stone-900"
                >
                  Add
                </button>
              </div>
            </div>
          )}

          {/* Step 8: Seller Information */}
          {currentStep === 8 && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-stone-900">Seller / Contact Information</h3>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">Listing Role *</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['owner', 'agent', 'developer'] as UserRole[]).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setSellerRole(r)}
                      className={`p-2.5 rounded-lg border text-xs capitalize font-semibold transition-all cursor-pointer ${
                        sellerRole === r ? 'border-emerald-600 bg-emerald-50 text-emerald-900' : 'border-stone-200 text-stone-700'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">Contact Name *</label>
                  <input
                    type="text"
                    value={sellerName}
                    onChange={(e) => setSellerName(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs text-stone-900"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">Agency / Business Name</label>
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="Optional business name"
                    className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs text-stone-900"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">Phone Number *</label>
                  <input
                    type="text"
                    value={sellerPhone}
                    onChange={(e) => setSellerPhone(e.target.value)}
                    placeholder="+234..."
                    className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs text-stone-900"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">WhatsApp Number *</label>
                  <input
                    type="text"
                    value={sellerWhatsapp}
                    onChange={(e) => setSellerWhatsapp(e.target.value)}
                    placeholder="+234..."
                    className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs text-stone-900"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 9: Preview */}
          {currentStep === 9 && (
            <div className="space-y-4">
              <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-lg text-emerald-900 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Ready to publish! Review listing information before submitting for verification.</span>
              </div>

              <div className="bg-stone-50 border border-stone-200 rounded-xl p-5 space-y-3">
                <div className="flex items-baseline justify-between border-b border-stone-200 pb-3">
                  <div>
                    <span className="text-xs text-stone-500 uppercase tracking-wider">{propertyType} · {transactionType === 'sale' ? 'For Sale' : 'For Rent'}</span>
                    <h3 className="text-lg font-bold text-stone-900 font-display">{title}</h3>
                    <span className="text-xs text-stone-600">{area}, {city}, {state}</span>
                  </div>
                  <div className="text-xl font-bold text-emerald-800 tabular-nums">
                    {formatNaira(Number(price) || 0)}
                    {transactionType === 'rent' && <span className="text-xs text-stone-500 font-normal">/{rentalFrequency}</span>}
                  </div>
                </div>

                <p className="text-xs text-stone-700 line-clamp-3">{description}</p>

                <div className="flex flex-wrap gap-1 text-[11px] text-stone-600 pt-2 border-t border-stone-200">
                  {selectedFeatures.slice(0, 5).map((f) => (
                    <span key={f} className="bg-white px-2 py-0.5 rounded-sm border border-stone-200">{f}</span>
                  ))}
                  {selectedFeatures.length > 5 && <span>+{selectedFeatures.length - 5} more</span>}
                </div>
              </div>

              <p className="text-[11px] text-stone-500 italic">
                {LEGAL_DISCLAIMERS.documentNotice}
              </p>
            </div>
          )}
        </div>

        {/* Footer controls */}
        <div className="px-6 py-3.5 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
          <button
            type="button"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="inline-flex items-center gap-1 px-4 py-2 text-xs font-semibold text-stone-700 hover:text-stone-900 disabled:opacity-30 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>

          {currentStep < 9 ? (
            <button
              type="button"
              onClick={nextStep}
              className="inline-flex items-center gap-1 px-5 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors cursor-pointer"
            >
              Continue
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handlePublish}
              className="inline-flex items-center gap-1.5 px-6 py-2.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              Publish Listing
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
