import { Heart, MapPin, Minus, Plus, Search, ShieldCheck, SlidersHorizontal, Star } from 'lucide-react';
import { DESTINATIONS } from '../data/stays';
import type { CoastalRegion, Stay, StayCategory } from '../types';
import { ImageWithFallback } from './ImageWithFallback';

interface ExploreViewProps {
  stays: Stay[];
  selectedRegion: CoastalRegion;
  onRegionChange: (region: CoastalRegion) => void;
  selectedCategory: StayCategory;
  onCategoryChange: (category: StayCategory) => void;
  searchQuery: string;
  onSearchQueryChange: (q: string) => void;
  checkIn: string;
  onCheckInChange: (date: string) => void;
  checkOut: string;
  onCheckOutChange: (date: string) => void;
  guests: number;
  onGuestsChange: (guests: number) => void;
  maxPrice: number | null;
  onMaxPriceChange: (price: number | null) => void;
  savedIds: string[];
  onToggleSave: (stayId: string) => void;
  onSelectStay: (stay: Stay) => void;
  searchSectionRef: React.RefObject<HTMLDivElement | null>;
}

const CATEGORIES: StayCategory[] = [
  'All Stays',
  'Cliffside Villas',
  'Beachfront',
  'Heritage',
  'Workation Studios',
];

const REGIONS: CoastalRegion[] = [
  'All Coastline',
  'North Goa',
  'South Goa',
  'Gokarna',
  'Alibaug',
  'Varkala',
];

export function ExploreView({
  stays,
  selectedRegion,
  onRegionChange,
  selectedCategory,
  onCategoryChange,
  searchQuery,
  onSearchQueryChange,
  checkIn,
  onCheckInChange,
  checkOut,
  onCheckOutChange,
  guests,
  onGuestsChange,
  maxPrice,
  onMaxPriceChange,
  savedIds,
  onToggleSave,
  onSelectStay,
  searchSectionRef,
}: ExploreViewProps) {
  const filteredStays = stays.filter((stay) => {
    if (selectedRegion !== 'All Coastline' && stay.region !== selectedRegion) return false;
    if (selectedCategory !== 'All Stays' && stay.category !== selectedCategory) return false;
    if (stay.maxGuests < guests) return false;
    if (maxPrice !== null && stay.nightlyRateInr > maxPrice) return false;
    if (searchQuery.trim()) {
      const haystack = `${stay.title} ${stay.region} ${stay.locationDetail} ${stay.amenities.join(' ')}`.toLowerCase();
      if (!haystack.includes(searchQuery.trim().toLowerCase())) return false;
    }
    return true;
  });

  const resetFilters = () => {
    onRegionChange('All Coastline');
    onCategoryChange('All Stays');
    onSearchQueryChange('');
    onGuestsChange(2);
    onMaxPriceChange(null);
  };

  const featuredHeroStay = stays[0];

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          <div className="lg:col-span-5 bg-[#181c1e] border border-[#41484b]/50 rounded-2xl p-6 sm:p-8 flex flex-col justify-between space-y-8">
            <div className="space-y-4">
              <p className="text-xs font-medium tracking-wide text-[#a0cedf]">
                Zero-Brokerage Coastal Stays · Goa to Kerala
              </p>
              <h1
                className="text-3xl sm:text-4xl lg:text-[42px] font-bold tracking-tight text-[#e0e3e5] leading-[1.15]"
                style={{ textWrap: 'balance' }}
              >
                Book directly with coastal homeowners, pay zero commission
              </h1>
              <p className="text-sm sm:text-base text-[#c0c8cb] leading-relaxed">
                Curated cliffside villas, heritage manors, and workation studios along India’s western shoreline. Connect straight with verified hosts and keep 100% of platform markups off your bill.
              </p>
            </div>

            <div className="space-y-5">
              <div className="grid grid-cols-3 gap-4 pt-5 border-t border-[#41484b]/40">
                <div>
                  <p className="text-lg font-bold text-[#e0e3e5] tabular-nums">₹0</p>
                  <p className="text-xs text-[#8a9295]">Brokerage fee</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-[#e0e3e5] tabular-nums">18%</p>
                  <p className="text-xs text-[#8a9295]">Avg OTA savings</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-[#e0e3e5] tabular-nums">15 min</p>
                  <p className="text-xs text-[#8a9295]">Direct host reply</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    searchSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }}
                  className="px-6 py-3 rounded-full bg-[#a0cedf] text-[#003543] text-sm font-semibold hover:bg-[#bbeafc] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  Search Coastal Stays
                </button>
                {featuredHeroStay && (
                  <button
                    type="button"
                    onClick={() => onSelectStay(featuredHeroStay)}
                    className="px-5 py-3 rounded-full bg-[#262b2c] text-[#e0e3e5] text-sm font-medium hover:bg-[#313537] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    Preview Featured Villa
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 relative rounded-2xl overflow-hidden border border-[#41484b]/50 bg-[#0b0f10] min-h-[280px] sm:min-h-[380px]">
            <ImageWithFallback
              imageKey="hero_cliff"
              alt="Samudra Edge Cliff Villa overlooking the Arabian Sea at dusk"
              className="h-full w-full lg:h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f10]/85 via-[#0b0f10]/20 to-transparent" />
            {featuredHeroStay && (
              <div className="absolute bottom-5 left-5 right-5 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
                <div>
                  <p className="text-xs font-medium text-[#a0cedf]">
                    {featuredHeroStay.region} · {featuredHeroStay.shoreDistance}
                  </p>
                  <p className="text-xl font-semibold text-[#e0e3e5]">
                    {featuredHeroStay.title}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onSelectStay(featuredHeroStay)}
                  className="self-start sm:self-auto px-4 py-2 rounded-full bg-[#101416]/85 backdrop-blur-sm border border-[#41484b]/70 text-xs font-medium text-[#e0e3e5] hover:border-[#a0cedf] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <span className="tabular-nums">
                    ₹{featuredHeroStay.nightlyRateInr.toLocaleString('en-IN')} / night
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Full-Width Horizontal Search & Filter Strip */}
        <div
          ref={searchSectionRef}
          className="bg-[#181c1e] border border-[#41484b]/55 rounded-2xl p-4 sm:p-5"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 items-end">
            <div className="lg:col-span-3 space-y-1.5">
              <label
                htmlFor="search-region"
                className="block text-xs font-medium text-[#c0c8cb]"
              >
                Coastline Region
              </label>
              <div className="relative">
                <MapPin className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#a0cedf]" />
                <select
                  id="search-region"
                  value={selectedRegion}
                  onChange={(e) => onRegionChange(e.target.value as CoastalRegion)}
                  className="w-full h-11 pl-10 pr-4 rounded-xl bg-[#101416] border border-[#41484b]/70 text-sm text-[#e0e3e5] focus:outline-none focus:border-[#a0cedf]"
                >
                  {REGIONS.map((region) => (
                    <option key={region} value={region}>
                      {region}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="lg:col-span-3 space-y-1.5">
              <label
                htmlFor="search-keyword"
                className="block text-xs font-medium text-[#c0c8cb]"
              >
                Search by beach, vibe, or amenity
              </label>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8a9295]" />
                <input
                  id="search-keyword"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => onSearchQueryChange(e.target.value)}
                  placeholder="Morjim, infinity pool, fiber..."
                  className="w-full h-11 pl-10 pr-4 rounded-xl bg-[#101416] border border-[#41484b]/70 text-sm text-[#e0e3e5] placeholder:text-[#8a9295] focus:outline-none focus:border-[#a0cedf]"
                />
              </div>
            </div>

            <div className="lg:col-span-2 space-y-1.5">
              <label
                htmlFor="search-checkin"
                className="block text-xs font-medium text-[#c0c8cb]"
              >
                Check-in
              </label>
              <input
                id="search-checkin"
                type="date"
                value={checkIn}
                onChange={(e) => onCheckInChange(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl bg-[#101416] border border-[#41484b]/70 text-sm text-[#e0e3e5] tabular-nums focus:outline-none focus:border-[#a0cedf]"
              />
            </div>

            <div className="lg:col-span-2 space-y-1.5">
              <label
                htmlFor="search-checkout"
                className="block text-xs font-medium text-[#c0c8cb]"
              >
                Check-out
              </label>
              <input
                id="search-checkout"
                type="date"
                value={checkOut}
                onChange={(e) => onCheckOutChange(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl bg-[#101416] border border-[#41484b]/70 text-sm text-[#e0e3e5] tabular-nums focus:outline-none focus:border-[#a0cedf]"
              />
            </div>

            <div className="lg:col-span-2 space-y-1.5">
              <span className="block text-xs font-medium text-[#c0c8cb]">Guests</span>
              <div className="h-11 px-3 rounded-xl bg-[#101416] border border-[#41484b]/70 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => onGuestsChange(Math.max(1, guests - 1))}
                  aria-label="Decrease guests"
                  className="h-7 w-7 rounded-lg bg-[#1c2022] text-[#e0e3e5] hover:bg-[#262b2c] flex items-center justify-center cursor-pointer"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="text-sm font-medium text-[#e0e3e5] tabular-nums">
                  {guests} {guests === 1 ? 'guest' : 'guests'}
                </span>
                <button
                  type="button"
                  onClick={() => onGuestsChange(Math.min(10, guests + 1))}
                  aria-label="Increase guests"
                  className="h-7 w-7 rounded-lg bg-[#1c2022] text-[#e0e3e5] hover:bg-[#262b2c] flex items-center justify-center cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Curated Stays Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            {CATEGORIES.map((category) => {
              const active = selectedCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => onCategoryChange(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    active
                      ? 'bg-[#a0cedf] text-[#003543]'
                      : 'bg-[#181c1e] text-[#c0c8cb] border border-[#41484b]/50 hover:text-[#e0e3e5] hover:bg-[#1c2022]'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-[#181c1e] border border-[#41484b]/50 text-xs text-[#c0c8cb]">
              <SlidersHorizontal className="h-3.5 w-3.5 text-[#a0cedf]" />
              <label htmlFor="tariff-cap" className="sr-only">
                Maximum nightly tariff
              </label>
              <select
                id="tariff-cap"
                value={maxPrice ?? ''}
                onChange={(e) =>
                  onMaxPriceChange(e.target.value ? Number(e.target.value) : null)
                }
                className="bg-transparent text-xs font-medium text-[#e0e3e5] focus:outline-none cursor-pointer"
              >
                <option value="" className="bg-[#181c1e]">
                  Any nightly tariff
                </option>
                <option value="10000" className="bg-[#181c1e]">
                  Up to ₹10,000 / night
                </option>
                <option value="15000" className="bg-[#181c1e]">
                  Up to ₹15,000 / night
                </option>
              </select>
            </div>

            <span className="text-xs text-[#8a9295] tabular-nums">
              {filteredStays.length} {filteredStays.length === 1 ? 'stay' : 'stays'} available
            </span>
          </div>
        </div>

        {filteredStays.length === 0 ? (
          <div className="bg-[#181c1e] border border-[#41484b]/50 rounded-2xl p-10 text-center space-y-4">
            <p className="text-lg font-semibold text-[#e0e3e5]">
              No coastal stays match those filters
            </p>
            <p className="text-sm text-[#c0c8cb] max-w-md mx-auto">
              Try clearing your tariff ceiling, lowering the guest count, or browsing across the entire Goa-to-Kerala coastline.
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="px-5 py-2.5 rounded-full bg-[#a0cedf] text-[#003543] text-sm font-semibold hover:bg-[#bbeafc] transition-colors cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStays.map((stay) => {
              const isSaved = savedIds.includes(stay.id);
              return (
                <article
                  key={stay.id}
                  className="group bg-[#181c1e] border border-[#41484b]/50 rounded-2xl overflow-hidden flex flex-col transition-transform duration-200 hover:-translate-y-0.5 hover:border-[#a0cedf]/45"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-[#0b0f10]">
                    <button
                      type="button"
                      onClick={() => onSelectStay(stay)}
                      aria-label={`View ${stay.title}`}
                      className="block w-full h-full cursor-pointer text-left"
                    >
                      <ImageWithFallback
                        imageKey={stay.imageKey}
                        alt={stay.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                      />
                    </button>
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0b0f10]/75 via-transparent to-transparent" />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleSave(stay.id);
                      }}
                      aria-label={isSaved ? `Unsave ${stay.title}` : `Save ${stay.title}`}
                      className="absolute top-3 right-3 h-10 w-10 rounded-full bg-[#101416]/80 backdrop-blur-sm flex items-center justify-center text-[#e0e3e5] hover:bg-[#101416] transition-colors cursor-pointer"
                    >
                      <Heart
                        className={`h-4 w-4 transition-colors ${
                          isSaved ? 'fill-[#a0cedf] text-[#a0cedf]' : 'text-[#e0e3e5]'
                        }`}
                      />
                    </button>
                    <div className="pointer-events-none absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs text-[#e0e3e5]">
                      <span>{stay.category}</span>
                      <span className="inline-flex items-center gap-1 tabular-nums font-medium">
                        <Star className="h-3.5 w-3.5 fill-[#a0cedf] text-[#a0cedf]" />
                        {stay.rating.toFixed(2)} ({stay.reviewCount})
                      </span>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <button
                      type="button"
                      onClick={() => onSelectStay(stay)}
                      className="text-left space-y-1.5 cursor-pointer"
                    >
                      <div className="flex items-center gap-2 text-xs text-[#c0c8cb]">
                        <span>{stay.region}</span>
                        <span aria-hidden="true">·</span>
                        <span>{stay.shoreDistance}</span>
                      </div>
                      <h2 className="text-lg font-semibold text-[#e0e3e5] group-hover:text-[#a0cedf] transition-colors">
                        {stay.title}
                      </h2>
                      <p className="text-xs text-[#8a9295]">
                        Direct with {stay.host.name} · {stay.bedrooms}{' '}
                        {stay.bedrooms === 1 ? 'bedroom' : 'bedrooms'} · Up to {stay.maxGuests}{' '}
                        guests
                      </p>
                    </button>

                    <div className="pt-4 border-t border-[#41484b]/35 flex items-center justify-between gap-3">
                      <div>
                        <span className="text-lg font-semibold text-[#e0e3e5] tabular-nums">
                          ₹{stay.nightlyRateInr.toLocaleString('en-IN')}
                        </span>
                        <span className="text-xs text-[#8a9295]"> / night</span>
                        <p className="text-[11px] font-medium text-[#a0cedf]">
                          ₹0 Brokerage
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => onSelectStay(stay)}
                        className="px-4 py-2 rounded-full bg-[#262b2c] hover:bg-[#a0cedf] text-[#e0e3e5] hover:text-[#003543] text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                      >
                        View & Book
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* Transparent Zero-Brokerage Breakdown & Coastal Pockets */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          <div className="lg:col-span-7 bg-[#181c1e] border border-[#41484b]/50 rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 text-xs font-medium text-[#a0cedf]">
                <ShieldCheck className="h-4 w-4" />
                Direct Tariff Guarantee
              </div>
              <h2 className="text-2xl font-bold text-[#e0e3e5]">
                Why coastal travelers save ₹8,000+ per trip
              </h2>
              <p className="text-sm text-[#c0c8cb] leading-relaxed">
                Online booking portals routinely add 15–20% guest service fees on top of owner rates. CoastMitra connects you directly to verified hosts with full itemized transparency.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-[#101416] border border-[#41484b]/40 rounded-xl p-4 space-y-3">
                <p className="text-xs font-medium text-[#8a9295]">
                  Typical Booking Portal (4 nights)
                </p>
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between text-[#c0c8cb]">
                    <span>Villa tariff (₹11,200 × 4)</span>
                    <span className="tabular-nums">₹44,800</span>
                  </div>
                  <div className="flex justify-between text-[#ffb4ab]">
                    <span>Portal brokerage & service fee</span>
                    <span className="tabular-nums">+₹8,064</span>
                  </div>
                  <div className="pt-2 border-t border-[#41484b]/35 flex justify-between font-semibold text-[#e0e3e5]">
                    <span>Total paid</span>
                    <span className="tabular-nums">₹52,864</span>
                  </div>
                </div>
              </div>

              <div className="bg-[#1c2022] border border-[#a0cedf]/45 rounded-xl p-4 space-y-3">
                <p className="text-xs font-medium text-[#a0cedf]">
                  CoastMitra Direct (4 nights)
                </p>
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between text-[#c0c8cb]">
                    <span>Villa tariff (₹11,200 × 4)</span>
                    <span className="tabular-nums">₹44,800</span>
                  </div>
                  <div className="flex justify-between text-[#a0cedf]">
                    <span>Platform brokerage</span>
                    <span className="tabular-nums">₹0</span>
                  </div>
                  <div className="pt-2 border-t border-[#41484b]/35 flex justify-between font-semibold text-[#e0e3e5]">
                    <span>Total direct to host</span>
                    <span className="tabular-nums">₹44,800</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 bg-[#181c1e] border border-[#41484b]/50 rounded-2xl p-6 sm:p-8 flex flex-col justify-between space-y-5">
            <div className="space-y-2">
              <p className="text-xs font-medium text-[#a0cedf]">Quick Shoreline Jump</p>
              <h2 className="text-xl font-semibold text-[#e0e3e5]">
                Explore by coastal pocket
              </h2>
            </div>

            <div className="divide-y divide-[#41484b]/35">
              {DESTINATIONS.map((dest) => (
                <button
                  key={dest.region}
                  type="button"
                  onClick={() => {
                    onRegionChange(dest.region);
                    searchSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }}
                  className="w-full py-3 flex items-center justify-between text-left hover:text-[#a0cedf] transition-colors cursor-pointer group"
                >
                  <div>
                    <p className="text-sm font-medium text-[#e0e3e5] group-hover:text-[#a0cedf]">
                      {dest.region}
                    </p>
                    <p className="text-xs text-[#8a9295]">{dest.subtitle}</p>
                  </div>
                  <span className="text-xs font-medium text-[#c0c8cb] tabular-nums">
                    Avg ₹{dest.avgDirectRateInr.toLocaleString('en-IN')}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
