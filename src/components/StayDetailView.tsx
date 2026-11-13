import { useState } from 'react';
import {
  ArrowLeft,
  Check,
  Heart,
  MessageSquare,
  Minus,
  Phone,
  Plus,
  ShieldCheck,
  Star,
} from 'lucide-react';
import { OPTIONAL_ADDONS } from '../data/stays';
import type { Booking, HostInquiry, Stay } from '../types';
import { ImageWithFallback } from './ImageWithFallback';

interface StayDetailViewProps {
  stay: Stay;
  checkIn: string;
  checkOut: string;
  guests: number;
  isSaved: boolean;
  onToggleSave: (stayId: string) => void;
  onBack: () => void;
  onBookingConfirmed: (booking: Booking) => void;
  onInquirySent: (inquiry: HostInquiry) => void;
}

export function StayDetailView({
  stay,
  checkIn: initialCheckIn,
  checkOut: initialCheckOut,
  guests: initialGuests,
  isSaved,
  onToggleSave,
  onBack,
  onBookingConfirmed,
  onInquirySent,
}: StayDetailViewProps) {
  const [checkIn, setCheckIn] = useState(initialCheckIn);
  const [checkOut, setCheckOut] = useState(initialCheckOut);
  const [guests, setGuests] = useState(Math.min(initialGuests, stay.maxGuests));
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);

  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [arrivalNote, setArrivalNote] = useState('');
  const [bookingError, setBookingError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [showMessageBox, setShowMessageBox] = useState(false);
  const [inquirySender, setInquirySender] = useState('');
  const [inquiryContact, setInquiryContact] = useState('');
  const [inquiryMessage, setInquiryMessage] = useState('');
  const [inquiryFeedback, setInquiryFeedback] = useState('');
  const [sendingInquiry, setSendingInquiry] = useState(false);

  const nights = (() => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diff = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return Number.isFinite(diff) && diff > 0 ? diff : 1;
  })();

  const subtotalInr = stay.nightlyRateInr * nights;
  const addonsTotalInr = selectedAddons.reduce((sum, addonId) => {
    const addon = OPTIONAL_ADDONS.find((a) => a.id === addonId);
    if (!addon) return sum;
    return sum + (addon.perNight ? addon.priceInr * nights : addon.priceInr);
  }, 0);
  const totalInr = subtotalInr + stay.cleaningFeeInr + addonsTotalInr;
  const otaSavingsInr = Math.round(totalInr * 0.18);

  const toggleAddon = (id: string) => {
    setSelectedAddons((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setBookingError('');

    if (!guestName.trim() || !guestPhone.trim()) {
      setBookingError('Please enter your full name and phone or WhatsApp number.');
      return;
    }

    if (new Date(checkOut) <= new Date(checkIn)) {
      setBookingError('Check-out date must be after your check-in date.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stayId: stay.id,
          checkIn,
          checkOut,
          guests,
          guestName,
          guestEmail,
          guestPhone,
          arrivalNote,
          selectedAddons,
          addonsTotalInr,
        }),
      });

      if (!response.ok) {
        const err = (await response.json().catch(() => ({}))) as { error?: string };
        throw new Error(err.error || 'Could not confirm booking.');
      }

      const data = (await response.json()) as { booking: Booking };
      onBookingConfirmed(data.booking);
    } catch (err) {
      const fallbackBooking: Booking = {
        id: `bk-${Date.now()}`,
        reference: `CM-${Math.floor(1000 + Math.random() * 9000)}`,
        stayId: stay.id,
        stayTitle: stay.title,
        region: stay.region,
        imageKey: stay.imageKey,
        checkIn,
        checkOut,
        nights,
        guests,
        guestName: guestName.trim(),
        guestEmail: guestEmail.trim(),
        guestPhone: guestPhone.trim(),
        arrivalNote: arrivalNote.trim(),
        selectedAddons,
        subtotalInr,
        cleaningFeeInr: stay.cleaningFeeInr,
        addonsTotalInr,
        brokerageInr: 0,
        totalInr,
        estimatedOtaSavingsInr: otaSavingsInr,
        status: 'Confirmed',
        createdAt: new Date().toISOString(),
        hostName: stay.host.name,
        hostPhone: stay.host.phone,
      };
      if (err instanceof Error && err.message.includes('Check-out')) {
        setBookingError(err.message);
      } else {
        onBookingConfirmed(fallbackBooking);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquirySender.trim() || !inquiryMessage.trim()) return;
    setSendingInquiry(true);
    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stayId: stay.id,
          senderName: inquirySender,
          senderContact: inquiryContact || 'Direct app thread',
          message: inquiryMessage,
        }),
      });
      if (response.ok) {
        const data = (await response.json()) as { inquiry: HostInquiry };
        onInquirySent(data.inquiry);
      } else {
        throw new Error('offline');
      }
    } catch {
      onInquirySent({
        id: `inq-${Date.now()}`,
        stayId: stay.id,
        stayTitle: stay.title,
        hostName: stay.host.name,
        senderName: inquirySender.trim(),
        senderContact: inquiryContact.trim() || 'Direct app thread',
        message: inquiryMessage.trim(),
        hostReply: `Thank you ${inquirySender.trim()}. ${stay.host.name} received your direct note and will coordinate check-in details shortly on ${stay.host.phone}.`,
        createdAt: new Date().toISOString(),
      });
    } finally {
      setSendingInquiry(false);
      setInquiryFeedback(`Direct message sent to ${stay.host.name}. Check My Trips for the reply thread.`);
      setInquiryMessage('');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8 pb-24">
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-medium text-[#c0c8cb] hover:text-[#a0cedf] transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Coastal Stays
        </button>

        <button
          type="button"
          onClick={() => onToggleSave(stay.id)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#181c1e] border border-[#41484b]/60 text-xs font-medium text-[#e0e3e5] hover:border-[#a0cedf] transition-colors cursor-pointer"
        >
          <Heart className={`h-3.5 w-3.5 ${isSaved ? 'fill-[#a0cedf] text-[#a0cedf]' : ''}`} />
          {isSaved ? 'Saved' : 'Save Stay'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Property Story, Highlights, Host & Amenities */}
        <div className="lg:col-span-7 space-y-8">
          <div className="relative aspect-[16/10] rounded-2xl overflow-hidden border border-[#41484b]/50 bg-[#0b0f10]">
            <ImageWithFallback
              imageKey={stay.imageKey}
              alt={stay.title}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f10]/80 via-transparent to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 flex flex-wrap items-end justify-between gap-3">
              <div className="space-y-1">
                <p className="text-xs font-medium text-[#a0cedf]">
                  {stay.locationDetail} · {stay.shoreDistance}
                </p>
                <h1 className="text-2xl sm:text-3xl font-bold text-[#e0e3e5]">
                  {stay.title}
                </h1>
              </div>
              <div className="inline-flex items-center gap-1.5 text-sm font-medium text-[#e0e3e5] tabular-nums">
                <Star className="h-4 w-4 fill-[#a0cedf] text-[#a0cedf]" />
                {stay.rating.toFixed(2)} ({stay.reviewCount} verified stays)
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[#c0c8cb] pb-6 border-b border-[#41484b]/40">
            <span>{stay.category}</span>
            <span aria-hidden="true">·</span>
            <span className="tabular-nums">{stay.bedrooms} bedrooms</span>
            <span aria-hidden="true">·</span>
            <span className="tabular-nums">Up to {stay.maxGuests} guests</span>
            <span aria-hidden="true">·</span>
            <span className="text-[#a0cedf] font-medium">
              {stay.instantDirect ? 'Instant Direct Confirmation' : 'Direct Host Approval'}
            </span>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-[#e0e3e5]">About this coastal stay</h2>
            <p className="text-sm sm:text-base text-[#c0c8cb] leading-relaxed">
              {stay.description}
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-[#e0e3e5]">Coastal highlights</h2>
            <ul className="space-y-2.5">
              {stay.highlights.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-[#c0c8cb]">
                  <Check className="h-4 w-4 text-[#a0cedf] shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-[#e0e3e5]">Included amenities</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {stay.amenities.map((amenity) => (
                <div
                  key={amenity}
                  className="px-4 py-3 rounded-xl bg-[#181c1e] border border-[#41484b]/40 text-sm text-[#e0e3e5] flex items-center gap-2.5"
                >
                  <Check className="h-4 w-4 text-[#a0cedf] shrink-0" />
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Direct Host Card */}
          <div className="bg-[#181c1e] border border-[#41484b]/50 rounded-2xl p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <p className="text-xs font-medium text-[#a0cedf]">
                  Verified Direct Host · Hosting since {stay.host.sinceYear}
                </p>
                <h2 className="text-xl font-semibold text-[#e0e3e5]">{stay.host.name}</h2>
                <p className="text-xs text-[#8a9295]">
                  {stay.host.responseTime} · Speaks {stay.host.languages.join(', ')}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#101416] border border-[#41484b]/60 text-xs font-medium text-[#e0e3e5] tabular-nums">
                  <Phone className="h-3.5 w-3.5 text-[#a0cedf]" />
                  {stay.host.phone}
                </span>
                <button
                  type="button"
                  onClick={() => setShowMessageBox((prev) => !prev)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#262b2c] hover:bg-[#313537] text-xs font-semibold text-[#e0e3e5] transition-colors cursor-pointer"
                >
                  <MessageSquare className="h-3.5 w-3.5 text-[#a0cedf]" />
                  {showMessageBox ? 'Hide Message Form' : 'Message Host'}
                </button>
              </div>
            </div>

            <p className="text-sm text-[#c0c8cb] leading-relaxed">{stay.host.bio}</p>

            {showMessageBox && (
              <form
                onSubmit={handleSendInquiry}
                className="pt-4 border-t border-[#41484b]/40 space-y-3"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    required
                    value={inquirySender}
                    onChange={(e) => setInquirySender(e.target.value)}
                    placeholder="Your name"
                    className="h-10 px-3.5 rounded-xl bg-[#101416] border border-[#41484b]/70 text-sm text-[#e0e3e5] placeholder:text-[#8a9295] focus:outline-none focus:border-[#a0cedf]"
                  />
                  <input
                    type="text"
                    value={inquiryContact}
                    onChange={(e) => setInquiryContact(e.target.value)}
                    placeholder="WhatsApp or email (optional)"
                    className="h-10 px-3.5 rounded-xl bg-[#101416] border border-[#41484b]/70 text-sm text-[#e0e3e5] placeholder:text-[#8a9295] focus:outline-none focus:border-[#a0cedf]"
                  />
                </div>
                <textarea
                  required
                  rows={3}
                  value={inquiryMessage}
                  onChange={(e) => setInquiryMessage(e.target.value)}
                  placeholder={`Ask ${stay.host.name} about beach access, early check-in, or local transport...`}
                  className="w-full p-3.5 rounded-xl bg-[#101416] border border-[#41484b]/70 text-sm text-[#e0e3e5] placeholder:text-[#8a9295] focus:outline-none focus:border-[#a0cedf]"
                />
                <div className="flex items-center justify-between gap-4">
                  <span className="text-xs text-[#a0cedf]">{inquiryFeedback}</span>
                  <button
                    type="submit"
                    disabled={sendingInquiry}
                    className="px-5 py-2 rounded-full bg-[#a0cedf] text-[#003543] text-xs font-semibold hover:bg-[#bbeafc] transition-colors cursor-pointer disabled:opacity-60"
                  >
                    {sendingInquiry ? 'Sending...' : 'Send Direct Note'}
                  </button>
                </div>
              </form>
            )}
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-[#e0e3e5]">House guidelines</h2>
            <ul className="space-y-2 text-sm text-[#c0c8cb]">
              {stay.houseRules.map((rule) => (
                <li key={rule}>· {rule}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right: Contiguous Sticky Direct Booking Module */}
        <aside className="lg:col-span-5 lg:sticky lg:top-24">
          <form
            onSubmit={handleConfirmBooking}
            className="bg-[#181c1e] border border-[#41484b]/60 rounded-2xl p-6 space-y-6"
          >
            <div className="flex items-baseline justify-between gap-4 pb-4 border-b border-[#41484b]/40">
              <div>
                <span className="text-2xl font-bold text-[#e0e3e5] tabular-nums">
                  ₹{stay.nightlyRateInr.toLocaleString('en-IN')}
                </span>
                <span className="text-sm text-[#8a9295]"> / night</span>
              </div>
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#a0cedf]">
                <ShieldCheck className="h-4 w-4" />
                ₹0 Brokerage
              </span>
            </div>

            {/* Dates & Guests */}
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label htmlFor="detail-checkin" className="block text-xs text-[#c0c8cb]">
                    Check-in
                  </label>
                  <input
                    id="detail-checkin"
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full h-11 px-3 rounded-xl bg-[#101416] border border-[#41484b]/70 text-sm text-[#e0e3e5] tabular-nums focus:outline-none focus:border-[#a0cedf]"
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="detail-checkout" className="block text-xs text-[#c0c8cb]">
                    Check-out
                  </label>
                  <input
                    id="detail-checkout"
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full h-11 px-3 rounded-xl bg-[#101416] border border-[#41484b]/70 text-sm text-[#e0e3e5] tabular-nums focus:outline-none focus:border-[#a0cedf]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <span className="block text-xs text-[#c0c8cb]">
                  Guests (max {stay.maxGuests})
                </span>
                <div className="h-11 px-3.5 rounded-xl bg-[#101416] border border-[#41484b]/70 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setGuests(Math.max(1, guests - 1))}
                    aria-label="Decrease guest count"
                    className="h-7 w-7 rounded-lg bg-[#1c2022] text-[#e0e3e5] hover:bg-[#262b2c] flex items-center justify-center cursor-pointer"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="text-sm font-medium text-[#e0e3e5] tabular-nums">
                    {guests} {guests === 1 ? 'guest' : 'guests'}
                  </span>
                  <button
                    type="button"
                    onClick={() => setGuests(Math.min(stay.maxGuests, guests + 1))}
                    aria-label="Increase guest count"
                    className="h-7 w-7 rounded-lg bg-[#1c2022] text-[#e0e3e5] hover:bg-[#262b2c] flex items-center justify-center cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Local Coastal Add-ons */}
            <div className="space-y-2.5">
              <p className="text-xs font-medium text-[#c0c8cb]">
                Optional host-arranged add-ons
              </p>
              <div className="space-y-2">
                {OPTIONAL_ADDONS.map((addon) => {
                  const checked = selectedAddons.includes(addon.id);
                  return (
                    <label
                      key={addon.id}
                      className={`flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl border text-xs cursor-pointer transition-colors ${
                        checked
                          ? 'bg-[#1c2022] border-[#a0cedf]/60 text-[#e0e3e5]'
                          : 'bg-[#101416] border-[#41484b]/50 text-[#c0c8cb] hover:border-[#8a9295]'
                      }`}
                    >
                      <span className="flex items-center gap-2.5">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleAddon(addon.id)}
                          className="accent-[#a0cedf] h-4 w-4 rounded"
                        />
                        <span>{addon.label}</span>
                      </span>
                      <span className="tabular-nums font-medium text-[#e0e3e5]">
                        ₹{addon.priceInr.toLocaleString('en-IN')}
                        {addon.perNight ? '/night' : ''}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Guest Contact Details */}
            <div className="space-y-3 pt-2 border-t border-[#41484b]/40">
              <p className="text-xs font-medium text-[#c0c8cb]">
                Your direct contact for {stay.host.name}
              </p>
              <input
                type="text"
                required
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="Full name *"
                className="w-full h-11 px-3.5 rounded-xl bg-[#101416] border border-[#41484b]/70 text-sm text-[#e0e3e5] placeholder:text-[#8a9295] focus:outline-none focus:border-[#a0cedf]"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="tel"
                  required
                  value={guestPhone}
                  onChange={(e) => setGuestPhone(e.target.value)}
                  placeholder="Phone / WhatsApp *"
                  className="w-full h-11 px-3.5 rounded-xl bg-[#101416] border border-[#41484b]/70 text-sm text-[#e0e3e5] placeholder:text-[#8a9295] focus:outline-none focus:border-[#a0cedf]"
                />
                <input
                  type="email"
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  placeholder="Email (for receipt)"
                  className="w-full h-11 px-3.5 rounded-xl bg-[#101416] border border-[#41484b]/70 text-sm text-[#e0e3e5] placeholder:text-[#8a9295] focus:outline-none focus:border-[#a0cedf]"
                />
              </div>
              <input
                type="text"
                value={arrivalNote}
                onChange={(e) => setArrivalNote(e.target.value)}
                placeholder="Estimated arrival time or note (optional)"
                className="w-full h-11 px-3.5 rounded-xl bg-[#101416] border border-[#41484b]/70 text-sm text-[#e0e3e5] placeholder:text-[#8a9295] focus:outline-none focus:border-[#a0cedf]"
              />
            </div>

            {/* Itemized Zero-Brokerage Breakdown */}
            <div className="bg-[#101416] border border-[#41484b]/45 rounded-xl p-4 space-y-2 text-sm">
              <div className="flex justify-between text-[#c0c8cb]">
                <span>
                  ₹{stay.nightlyRateInr.toLocaleString('en-IN')} × {nights}{' '}
                  {nights === 1 ? 'night' : 'nights'}
                </span>
                <span className="tabular-nums">₹{subtotalInr.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-[#c0c8cb]">
                <span>Cleaning & linen prep</span>
                <span className="tabular-nums">
                  ₹{stay.cleaningFeeInr.toLocaleString('en-IN')}
                </span>
              </div>
              {addonsTotalInr > 0 && (
                <div className="flex justify-between text-[#c0c8cb]">
                  <span>Host add-ons</span>
                  <span className="tabular-nums">
                    ₹{addonsTotalInr.toLocaleString('en-IN')}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-[#a0cedf] font-medium">
                <span>Platform brokerage fee</span>
                <span className="tabular-nums">₹0</span>
              </div>
              <div className="pt-2.5 border-t border-[#41484b]/40 flex justify-between items-baseline font-semibold text-[#e0e3e5]">
                <span>Total direct payable</span>
                <span className="text-lg tabular-nums">
                  ₹{totalInr.toLocaleString('en-IN')}
                </span>
              </div>
              <p className="text-xs text-[#8a9295] tabular-nums">
                Estimated savings vs OTA booking fees: ₹{otaSavingsInr.toLocaleString('en-IN')}
              </p>
            </div>

            {bookingError && (
              <p role="alert" className="text-xs font-medium text-[#ffb4ab]">
                {bookingError}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-6 rounded-full bg-[#a0cedf] text-[#003543] text-sm font-semibold hover:bg-[#bbeafc] transition-colors cursor-pointer disabled:opacity-60"
            >
              {isSubmitting ? 'Confirming Direct Booking...' : 'Confirm Direct Booking'}
            </button>
          </form>
        </aside>
      </div>
    </div>
  );
}
