import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import type { NavTab } from '../types';

interface HeaderProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onPlanStay: () => void;
  savedCount: number;
  tripsCount: number;
}

export function Header({
  activeTab,
  onSelectTab,
  onPlanStay,
  savedCount,
  tripsCount,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: NavTab; label: string }[] = [
    { id: 'explore', label: 'Explore' },
    { id: 'destinations', label: 'Destinations' },
    { id: 'saved', label: savedCount > 0 ? `Saved (${savedCount})` : 'Saved' },
    { id: 'trips', label: tripsCount > 0 ? `My Trips (${tripsCount})` : 'My Trips' },
    { id: 'host', label: 'Host Direct' },
  ];

  const handleNavClick = (id: NavTab) => {
    onSelectTab(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#101416]/95 backdrop-blur-md border-b border-[#41484b]/45">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        <button
          type="button"
          onClick={() => handleNavClick('explore')}
          className="text-xl font-bold tracking-tight text-[#e0e3e5] hover:text-[#a0cedf] transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#a0cedf] rounded-sm"
        >
          CoastMitra
        </button>

        <nav
          aria-label="Primary Navigation"
          className="hidden md:flex items-center gap-7 text-sm font-medium"
        >
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className={`relative py-1 transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#a0cedf] rounded-sm ${
                  isActive
                    ? 'text-[#a0cedf]'
                    : 'text-[#c0c8cb] hover:text-[#e0e3e5]'
                }`}
              >
                {item.label}
                {isActive && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 -bottom-[21px] h-[2px] bg-[#a0cedf]"
                  />
                )}
              </button>
            );
          })}
        </nav>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              onPlanStay();
            }}
            className="hidden sm:inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold rounded-full bg-[#a0cedf] text-[#003543] hover:bg-[#bbeafc] transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#bbeafc]"
          >
            Plan Stay
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
            className="md:hidden inline-flex items-center justify-center h-11 w-11 rounded-xl bg-[#1c2022] text-[#e0e3e5] border border-[#41484b]/60 hover:bg-[#262b2c] transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#41484b]/45 bg-[#101416] px-4 py-4 space-y-2">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-[#1c2022] text-[#a0cedf]'
                    : 'text-[#c0c8cb] hover:bg-[#181c1e] hover:text-[#e0e3e5]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              onPlanStay();
            }}
            className="w-full mt-2 px-5 py-3 rounded-full text-sm font-semibold bg-[#a0cedf] text-[#003543] hover:bg-[#bbeafc] transition-colors cursor-pointer"
          >
            Plan Stay
          </button>
        </div>
      )}
    </header>
  );
}
