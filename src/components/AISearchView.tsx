import React, { useState } from 'react';
import { Sparkles, Search, CheckCircle2, AlertCircle, ArrowRight, CornerDownLeft, SlidersHorizontal, RefreshCw } from 'lucide-react';
import { Property, AISearchCriteria } from '../types';
import { useProperties } from '../context/PropertyContext';
import { PropertyCard } from './PropertyCard';
import { formatCompactNaira, formatNaira } from '../utils/formatters';

interface AISearchViewProps {
  onSelectProperty: (property: Property) => void;
}

export const AISearchView: React.FC<AISearchViewProps> = ({ onSelectProperty }) => {
  const { properties } = useProperties();
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [extractedCriteria, setExtractedCriteria] = useState<AISearchCriteria | null>(null);
  const [matchingProperties, setMatchingProperties] = useState<Property[]>([]);
  const [similarProperties, setSimilarProperties] = useState<Property[]>([]);
  const [searchSource, setSearchSource] = useState<string>('');

  const quickPrompts = [
    '3 bedroom house for sale in Abuja under ₦60 million',
    'Land for sale in Gwagwalada under ₦15 million',
    '2 bedroom apartment for rent in Lagos',
    'Shop for rent in Enugu'
  ];

  const handleSearch = async (textToSearch?: string) => {
    const searchText = textToSearch || query;
    if (!searchText.trim()) return;

    setIsLoading(true);
    setHasSearched(true);

    try {
      const response = await fetch('/api/ai/parse-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchText })
      });
      const data = await response.json();
      const criteria: AISearchCriteria = data.criteria || {};
      setSearchSource(data.source || 'local');
      setExtractedCriteria(criteria);

      // Now filter properties against the extracted criteria
      const exactMatches = properties.filter((p) => {
        // Transaction type
        if (criteria.transactionType && p.transactionType !== criteria.transactionType) {
          return false;
        }

        // Property type or category
        if (criteria.propertyType) {
          const critType = criteria.propertyType.toLowerCase();
          const pType = p.propertyType.toLowerCase();
          const pCat = p.category.toLowerCase();
          const matchesType = pType.includes(critType) || pCat.includes(critType) ||
            (critType === 'house' && (pType.includes('duplex') || pType.includes('bungalow') || pType.includes('mansion')));
          if (!matchesType) return false;
        }

        // Location (State/City/Area)
        if (criteria.state && !p.state.toLowerCase().includes(criteria.state.toLowerCase().replace('fct - ', ''))) {
          return false;
        }
        if (criteria.city && !p.city.toLowerCase().includes(criteria.city.toLowerCase())) {
          return false;
        }
        if (criteria.area && !p.area.toLowerCase().includes(criteria.area.toLowerCase())) {
          return false;
        }

        // Price constraints
        if (criteria.maxPrice && p.price > criteria.maxPrice) {
          return false;
        }
        if (criteria.minPrice && p.price < criteria.minPrice) {
          return false;
        }

        // Bedrooms
        if (criteria.bedrooms && p.bedrooms && p.bedrooms < criteria.bedrooms) {
          return false;
        }

        return true;
      });

      setMatchingProperties(exactMatches);

      // If no exact matches, compute nearest similar properties
      if (exactMatches.length === 0) {
        const fallback = properties.filter((p) => {
          // Match at least transaction or category or state
          const matchTrans = criteria.transactionType ? p.transactionType === criteria.transactionType : false;
          const matchState = criteria.state ? p.state.toLowerCase().includes(criteria.state.toLowerCase().replace('fct - ', '')) : false;
          const matchCat = criteria.propertyType ? p.category.toLowerCase().includes(criteria.propertyType.toLowerCase()) : false;
          return matchTrans || matchState || matchCat;
        });
        setSimilarProperties(fallback.slice(0, 4));
      } else {
        setSimilarProperties([]);
      }
    } catch (err) {
      console.error('AI search failed', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Hero Search Box Header */}
      <div className="bg-gradient-to-br from-stone-900 via-stone-800 to-emerald-950 rounded-3xl p-6 sm:p-10 text-white relative overflow-hidden shadow-xl border border-stone-800">
        <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-3xl space-y-4 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-xs font-semibold backdrop-blur-xs border border-emerald-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            Gerald AI Property Finder
          </div>

          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight font-display">
            Find Exactly What You Want in Natural Language
          </h1>

          <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
            Type your request just like you would describe it to an experienced Nigerian real estate consultant. Our engine converts your prose into structured filters without hallucinating prices or listings.
          </p>

          {/* Search Bar Input */}
          <div className="pt-2">
            <div className="relative flex items-center bg-white rounded-xl shadow-lg p-1.5 focus-within:ring-2 focus-within:ring-emerald-500 transition-all">
              <Search className="w-5 h-5 text-stone-400 ml-3 shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="e.g. 3 bedroom house for sale in Abuja under ₦60 million"
                className="w-full px-3 py-2.5 text-stone-900 placeholder-stone-400 text-sm sm:text-base bg-transparent border-0 focus:outline-hidden"
              />
              <button
                onClick={() => handleSearch()}
                disabled={isLoading}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 disabled:bg-stone-300 text-white font-semibold text-xs sm:text-sm rounded-lg transition-colors cursor-pointer shrink-0"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <span>Search</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Quick Prompts suggestions */}
          <div className="pt-2 space-y-1.5">
            <span className="text-xs text-stone-400">Try these popular queries:</span>
            <div className="flex flex-wrap gap-2">
              {quickPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setQuery(prompt);
                    handleSearch(prompt);
                  }}
                  className="text-xs bg-white/10 hover:bg-white/20 text-stone-200 px-3 py-1.5 rounded-lg border border-white/10 transition-colors cursor-pointer text-left"
                >
                  "{prompt}"
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Extracted Structured Criteria Card */}
      {hasSearched && extractedCriteria && (
        <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-emerald-700" />
              <h2 className="text-base font-bold text-stone-900 font-display">
                Your Search Interpretation
              </h2>
            </div>
            <span className="text-xs text-stone-400">
              Source: {searchSource === 'gemini-3.8-flash' ? 'Gemini 3.8 Intelligence' : 'Rule-Based Engine'}
            </span>
          </div>

          {/* Clean unboxed criteria display */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-stone-400 block uppercase tracking-wider text-[10px] font-semibold">Transaction</span>
              <span className="font-semibold text-stone-800 text-sm capitalize">
                {extractedCriteria.transactionType ? `For ${extractedCriteria.transactionType}` : 'Any (Sale or Rent)'}
              </span>
            </div>
            <div>
              <span className="text-stone-400 block uppercase tracking-wider text-[10px] font-semibold">Property Type</span>
              <span className="font-semibold text-stone-800 text-sm">
                {extractedCriteria.propertyType || 'All Property Categories'}
              </span>
            </div>
            <div>
              <span className="text-stone-400 block uppercase tracking-wider text-[10px] font-semibold">Target Location</span>
              <span className="font-semibold text-stone-800 text-sm">
                {[extractedCriteria.area, extractedCriteria.city, extractedCriteria.state].filter(Boolean).join(', ') || 'Nationwide Nigeria'}
              </span>
            </div>
            <div>
              <span className="text-stone-400 block uppercase tracking-wider text-[10px] font-semibold">Budget Range</span>
              <span className="font-semibold text-emerald-800 text-sm tabular-nums">
                {extractedCriteria.minPrice || extractedCriteria.maxPrice
                  ? `${extractedCriteria.minPrice ? formatCompactNaira(extractedCriteria.minPrice) : 'Up to'} ${extractedCriteria.maxPrice ? formatCompactNaira(extractedCriteria.maxPrice) : ''}`
                  : 'Any Budget'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Results Section */}
      {hasSearched && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-stone-900 font-display">
              Matching Listings ({matchingProperties.length})
            </h2>
          </div>

          {matchingProperties.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {matchingProperties.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  onSelect={onSelectProperty}
                />
              ))}
            </div>
          ) : (
            <div className="bg-stone-50 border border-stone-200 rounded-2xl p-8 text-center space-y-6">
              <div className="max-w-md mx-auto space-y-2">
                <AlertCircle className="w-10 h-10 text-amber-600 mx-auto" />
                <h3 className="text-lg font-bold text-stone-900">
                  I couldn't find an exact match.
                </h3>
                <p className="text-sm text-stone-600">
                  Here are properties with similar criteria currently listed in our verified database. You can also adjust your location, budget, or post a request.
                </p>
              </div>

              {similarProperties.length > 0 && (
                <div className="text-left space-y-3 pt-4 border-t border-stone-200">
                  <h4 className="text-sm font-semibold text-stone-700">Similar Alternatives:</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {similarProperties.map((prop) => (
                      <PropertyCard
                        key={prop.id}
                        property={prop}
                        onSelect={onSelectProperty}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
