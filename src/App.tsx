import { useEffect, useRef, useState } from 'react';
import { DestinationsView } from './components/DestinationsView';
import { ExploreView } from './components/ExploreView';
import { Header } from './components/Header';
import { HostDirectView } from './components/HostDirectView';
import { SavedView } from './components/SavedView';
import { StayDetailView } from './components/StayDetailView';
import { TripsView } from './components/TripsView';
import { INITIAL_STAYS } from './data/stays';
import type {
  Booking,
  CoastalRegion,
  HostInquiry,
  NavTab,
  Stay,
  StayCategory,
} from './types';

const SAVED_STORAGE_KEY = 'coastmitra_saved_ids_v1';
const BOOKINGS_STORAGE_KEY = 'coastmitra_bookings_v1';
const INQUIRIES_STORAGE_KEY = 'coastmitra_inquiries_v1';

function getDefaultDates() {
  const now = new Date();
  const checkInDate = new Date(now);
  checkInDate.setDate(now.getDate() + 14);
  const checkOutDate = new Date(checkInDate);
  checkOutDate.setDate(checkInDate.getDate() + 3);
  return {
    checkIn: checkInDate.toISOString().slice(0, 10),
    checkOut: checkOutDate.toISOString().slice(0, 10),
  };
}

export default function App() {
  const defaultDates = getDefaultDates();

  const [activeTab, setActiveTab] = useState<NavTab>('explore');
  const [selectedStay, setSelectedStay] = useState<Stay | null>(null);

  const [stays, setStays] = useState<Stay[]>(INITIAL_STAYS);
  const [selectedRegion, setSelectedRegion] = useState<CoastalRegion>('All Coastline');
  const [selectedCategory, setSelectedCategory] = useState<StayCategory>('All Stays');
  const [searchQuery, setSearchQuery] = useState('');
  const [checkIn, setCheckIn] = useState(defaultDates.checkIn);
  const [checkOut, setCheckOut] = useState(defaultDates.checkOut);
  const [guests, setGuests] = useState(2);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);

  const [savedIds, setSavedIds] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem(SAVED_STORAGE_KEY);
      return raw ? (JSON.parse(raw) as string[]) : ['stay-vagator-horizon'];
    } catch {
      return ['stay-vagator-horizon'];
    }
  });

  const [bookings, setBookings] = useState<Booking[]>(() => {
    try {
      const raw = localStorage.getItem(BOOKINGS_STORAGE_KEY);
      return raw ? (JSON.parse(raw) as Booking[]) : [];
    } catch {
      return [];
    }
  });

  const [inquiries, setInquiries] = useState<HostInquiry[]>(() => {
    try {
      const raw = localStorage.getItem(INQUIRIES_STORAGE_KEY);
      return raw ? (JSON.parse(raw) as HostInquiry[]) : [];
    } catch {
      return [];
    }
  });

  const [latestBookingId, setLatestBookingId] = useState<string | null>(null);
  const searchSectionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let active = true;

    async function hydrateFromServer() {
      try {
        const [staysRes, bookingsRes, inquiriesRes] = await Promise.all([
          fetch('/api/stays'),
          fetch('/api/bookings'),
          fetch('/api/inquiries'),
        ]);

        if (!active) return;

        if (staysRes.ok) {
          const data = (await staysRes.json()) as { stays?: Stay[] };
          if (Array.isArray(data.stays) && data.stays.length > 0) {
            setStays(data.stays);
          }
        }

        if (bookingsRes.ok) {
          const data = (await bookingsRes.json()) as { bookings?: Booking[] };
          if (Array.isArray(data.bookings)) {
            setBookings((prev) => {
              const merged = [...prev];
              for (const b of data.bookings ?? []) {
                if (!merged.some((item) => item.id === b.id)) {
                  merged.push(b);
                }
              }
              return merged;
            });
          }
        }

        if (inquiriesRes.ok) {
          const data = (await inquiriesRes.json()) as { inquiries?: HostInquiry[] };
          if (Array.isArray(data.inquiries)) {
            setInquiries((prev) => {
              const merged = [...prev];
              for (const inq of data.inquiries ?? []) {
                if (!merged.some((item) => item.id === inq.id)) {
                  merged.push(inq);
                }
              }
              return merged;
            });
          }
        }
      } catch {
        // Initial curated data remains ready if backend is unreachable
      }
    }

    hydrateFromServer();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(SAVED_STORAGE_KEY, JSON.stringify(savedIds));
    } catch {
      // Ignore storage quota errors
    }
  }, [savedIds]);

  useEffect(() => {
    try {
      localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(bookings));
    } catch {
      // Ignore storage quota errors
    }
  }, [bookings]);

  useEffect(() => {
    try {
      localStorage.setItem(INQUIRIES_STORAGE_KEY, JSON.stringify(inquiries));
    } catch {
      // Ignore storage quota errors
    }
  }, [inquiries]);

  const handleToggleSave = (stayId: string) => {
    setSavedIds((prev) =>
      prev.includes(stayId) ? prev.filter((id) => id !== stayId) : [...prev, stayId]
    );
  };

  const handleSelectStay = (stay: Stay) => {
    setSelectedStay(stay);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectTab = (tab: NavTab) => {
    setSelectedStay(null);
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePlanStay = () => {
    setSelectedStay(null);
    setActiveTab('explore');
    setTimeout(() => {
      searchSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 60);
  };

  const handleBookingConfirmed = (booking: Booking) => {
    setBookings((prev) => [booking, ...prev.filter((b) => b.id !== booking.id)]);
    setLatestBookingId(booking.id);
    setSelectedStay(null);
    setActiveTab('trips');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleInquirySent = (inquiry: HostInquiry) => {
    setInquiries((prev) => [inquiry, ...prev.filter((i) => i.id !== inquiry.id)]);
  };

  const handleCancelBooking = async (bookingId: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: 'Cancelled' } : b))
    );
    try {
      await fetch(`/api/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Cancelled' }),
      });
    } catch {
      // Updated optimistically
    }
  };

  const handleUpdateArrivalNote = async (bookingId: string, note: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, arrivalNote: note } : b))
    );
    try {
      await fetch(`/api/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ arrivalNote: note }),
      });
    } catch {
      // Updated optimistically
    }
  };

  const handlePublishStay = (newStay: Stay) => {
    setStays((prev) => [newStay, ...prev]);
    setSelectedRegion(newStay.region);
    setSelectedCategory('All Stays');
    setSelectedStay(null);
    setActiveTab('explore');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const savedStays = stays.filter((s) => savedIds.includes(s.id));
  const activeTripsCount = bookings.filter((b) => b.status === 'Confirmed').length;

  return (
    <div className="min-h-screen flex flex-col bg-[#101416] text-[#e0e3e5]">
      <Header
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        onPlanStay={handlePlanStay}
        savedCount={savedStays.length}
        tripsCount={activeTripsCount}
      />

      <main className="flex-1">
        {selectedStay ? (
          <StayDetailView
            stay={selectedStay}
            checkIn={checkIn}
            checkOut={checkOut}
            guests={guests}
            isSaved={savedIds.includes(selectedStay.id)}
            onToggleSave={handleToggleSave}
            onBack={() => setSelectedStay(null)}
            onBookingConfirmed={handleBookingConfirmed}
            onInquirySent={handleInquirySent}
          />
        ) : activeTab === 'explore' ? (
          <ExploreView
            stays={stays}
            selectedRegion={selectedRegion}
            onRegionChange={setSelectedRegion}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            searchQuery={searchQuery}
            onSearchQueryChange={setSearchQuery}
            checkIn={checkIn}
            onCheckInChange={setCheckIn}
            checkOut={checkOut}
            onCheckOutChange={setCheckOut}
            guests={guests}
            onGuestsChange={setGuests}
            maxPrice={maxPrice}
            onMaxPriceChange={setMaxPrice}
            savedIds={savedIds}
            onToggleSave={handleToggleSave}
            onSelectStay={handleSelectStay}
            searchSectionRef={searchSectionRef}
          />
        ) : activeTab === 'destinations' ? (
          <DestinationsView
            stays={stays}
            onExploreRegion={(region) => {
              setSelectedRegion(region);
              setSelectedCategory('All Stays');
              setActiveTab('explore');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        ) : activeTab === 'saved' ? (
          <SavedView
            savedStays={savedStays}
            onToggleSave={handleToggleSave}
            onSelectStay={handleSelectStay}
            onExploreAll={() => handleSelectTab('explore')}
          />
        ) : activeTab === 'trips' ? (
          <TripsView
            bookings={bookings}
            inquiries={inquiries}
            latestBookingId={latestBookingId}
            onCancelBooking={handleCancelBooking}
            onUpdateArrivalNote={handleUpdateArrivalNote}
            onExploreAll={() => handleSelectTab('explore')}
          />
        ) : (
          <HostDirectView onPublishStay={handlePublishStay} />
        )}
      </main>

      <footer className="border-t border-[#41484b]/40 bg-[#0b0f10]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-[#8a9295]">
          <div className="space-y-1">
            <p className="text-sm font-semibold text-[#e0e3e5]">CoastMitra</p>
            <p>Direct zero-brokerage stays across Goa, Gokarna, Alibaug, and Varkala.</p>
          </div>
          <div className="flex flex-wrap items-center gap-6 text-[#c0c8cb]">
            <button
              type="button"
              onClick={() => handleSelectTab('explore')}
              className="hover:text-[#a0cedf] transition-colors cursor-pointer"
            >
              Explore Stays
            </button>
            <button
              type="button"
              onClick={() => handleSelectTab('destinations')}
              className="hover:text-[#a0cedf] transition-colors cursor-pointer"
            >
              Coastal Guides
            </button>
            <button
              type="button"
              onClick={() => handleSelectTab('trips')}
              className="hover:text-[#a0cedf] transition-colors cursor-pointer"
            >
              My Trips
            </button>
            <button
              type="button"
              onClick={() => handleSelectTab('host')}
              className="hover:text-[#a0cedf] transition-colors cursor-pointer"
            >
              Host Direct
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
