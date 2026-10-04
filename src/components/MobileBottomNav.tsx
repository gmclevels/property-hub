import React from 'react';
import { Home, Compass, KeyRound, Trees, Sparkles, User } from 'lucide-react';
import { useProperties } from '../context/PropertyContext';

interface MobileBottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ activeTab, setActiveTab }) => {
  const { currentUser } = useProperties();

  const getDashboardTab = () => {
    if (currentUser.role === 'admin') return 'admin';
    if (currentUser.role === 'owner' || currentUser.role === 'agent' || currentUser.role === 'developer') {
      return 'seller-dashboard';
    }
    return 'seeker-dashboard';
  };

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'buy', label: 'Buy', icon: Compass },
    { id: 'rent', label: 'Rent', icon: KeyRound },
    { id: 'land', label: 'Land', icon: Trees },
    { id: 'ai-search', label: 'AI Find', icon: Sparkles },
    { id: 'profile', label: 'Profile', icon: User }
  ];

  return (
    <nav
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t-2 border-emerald-800/30 safe-area-bottom shadow-xl"
    >
      <div className="grid grid-cols-6 h-14 items-center">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`flex flex-col items-center justify-center h-full w-full py-1 transition-colors relative cursor-pointer ${
                isActive ? 'text-emerald-800 font-bold' : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              {isActive && (
                <span className="absolute top-0 w-8 h-1 bg-amber-400 rounded-b-md"></span>
              )}
              <Icon className={`w-4 h-4 ${isActive ? 'stroke-[2.5px] text-emerald-800' : 'stroke-2'}`} />
              <span className="text-[10px] tracking-tight mt-0.5 whitespace-nowrap">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
