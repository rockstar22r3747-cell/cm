import { useState } from 'react';
import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  MessageSquare,
  Phone,
  XCircle,
} from 'lucide-react';
import type { Booking, HostInquiry } from '../types';
import { ImageWithFallback } from './ImageWithFallback';

interface TripsViewProps {
  bookings: Booking[];
  inquiries: HostInquiry[];
  latestBookingId: string | null;
  onCancelBooking: (bookingId: string) => void;
  onUpdateArrivalNote: (bookingId: string, note: string) => void;
  onExploreAll: () => void;
}

export function TripsView({
  bookings,
  inquiries,
  latestBookingId,
  onCancelBooking,
  onUpdateArrivalNote,
  onExploreAll,
}: TripsViewProps) {
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [draftNote, setDraftNote] = useState('');

  if (bookings.length === 0 && inquiries.length === 0) {
    return (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-lg mx-auto bg-[#181c1e] border border-[#41484b]/50 rounded-2xl p-8 text-center space-y-5">
          <div className="mx-auto h-12 w-12 rounded-2xl bg-[#1c2022] flex items-center justify-center text-[#a0cedf]">
            <Calendar className="h-5 w-5" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold text-[#e0e3e5]">No coastal trips booked yet</h1>
            <p className="text-sm text-[#c0c8cb] leading-relaxed">
              When you reserve a villa or studio directly with a CoastMitra host, your confirmation code, itemized zero-brokerage receipt, and host contact details appear here.
            </p>
          </div>
          <button
            type="button"
            onClick={onExploreAll}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#a0cedf] text-[#003543] text-sm font-semibold hover:bg-[#bbeafc] transition-colors cursor-pointer"
          >
            Explore Coastal Stays
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-2">
          <p className="text-xs font-medium text-[#a0cedf]">Direct Reservations</p>
          <h1 className="text-3xl font-bold tracking-tight text-[#e0e3e5]">
            My Trips & Host Threads
          </h1>
          <p className="text-sm text-[#c0c8cb]">
            Manage arrival notes, direct host phone numbers, and zero-brokerage receipts.
          </p>
        </div>
        <button
          type="button"
          onClick={onExploreAll}
          className="px-4 py-2 rounded-xl bg-[#1c2022] border border-[#41484b]/60 text-sm font-medium text-[#e0e3e5] hover:bg-[#262b2c] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          Book Another Stay
        </button>
      </div>

      {bookings.length > 0 && (
        <div className="space-y-6">
          {bookings.map((booking) => {
            const isRecent = booking.id === latestBookingId;
            const isEditing = editingNoteId === booking.id;
            return (
              <article
                key={booking.id}
                className={`bg-[#181c1e] rounded-2xl overflow-hidden border transition-colors ${
                  isRecent ? 'border-[#a0cedf]/70' : 'border-[#41484b]/50'
                }`}
              >
                <div className="grid grid-cols-1 lg:grid-cols-12">
                  <div className="lg:col-span-4 relative aspect-[4/3] lg:aspect-auto bg-[#0b0f10]">
                    <ImageWithFallback
                      imageKey={booking.imageKey}
                      alt={booking.stayTitle}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="lg:col-span-8 p-6 space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-3 text-xs">
                          <span className="font-mono-tabular text-[#a0cedf] font-medium">
                            Ref {booking.reference}
                          </span>
                          <span aria-hidden="true" className="text-[#41484b]">
                            ·
                          </span>
                          {booking.status === 'Confirmed' ? (
                            <span className="inline-flex items-center gap-1.5 text-[#a0cedf] font-medium">
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              Direct Booking Confirmed
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 text-[#ffb4ab] font-medium">
                              <XCircle className="h-3.5 w-3.5" />
                              Cancelled
                            </span>
                          )}
                        </div>
                        <h2 className="text-xl font-semibold text-[#e0e3e5]">
                          {booking.stayTitle}
                        </h2>
                        <p className="text-xs text-[#c0c8cb]">
                          {booking.region} · {booking.checkIn} to {booking.checkOut} ({booking.nights}{' '}
                          {booking.nights === 1 ? 'night' : 'nights'}) · {booking.guests}{' '}
                          {booking.guests === 1 ? 'guest' : 'guests'}
                        </p>
                      </div>

                      <div className="text-left sm:text-right">
                        <p className="text-xl font-bold text-[#e0e3e5] tabular-nums">
                          ₹{booking.totalInr.toLocaleString('en-IN')}
                        </p>
                        <p className="text-xs text-[#a0cedf] tabular-nums">
                          ₹0 Brokerage · Saved ₹{booking.estimatedOtaSavingsInr.toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-[#41484b]/35 text-xs">
                      <div className="space-y-1.5">
                        <p className="text-[#8a9295] font-medium">Direct Host Contact</p>
                        <p className="text-sm font-medium text-[#e0e3e5]">{booking.hostName}</p>
                        <p className="inline-flex items-center gap-1.5 text-[#c0c8cb] tabular-nums">
                          <Phone className="h-3.5 w-3.5 text-[#a0cedf]" />
                          {booking.hostPhone}
                        </p>
                      </div>

                      <div className="space-y-1.5">
                        <p className="text-[#8a9295] font-medium">Receipt Breakdown</p>
                        <div className="flex justify-between text-[#c0c8cb]">
                          <span>Stay + cleaning + add-ons</span>
                          <span className="tabular-nums">
                            ₹{booking.totalInr.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <div className="flex justify-between text-[#a0cedf]">
                          <span>Platform commission</span>
                          <span className="tabular-nums">₹0</span>
                        </div>
                      </div>
                    </div>

                    {/* Arrival Note */}
                    <div className="bg-[#101416] border border-[#41484b]/45 rounded-xl p-4 space-y-2.5">
                      <div className="flex items-center justify-between gap-4">
                        <p className="text-xs font-medium text-[#c0c8cb]">
                          Arrival Note for {booking.hostName}
                        </p>
                        {booking.status === 'Confirmed' && !isEditing && (
                          <button
                            type="button"
                            onClick={() => {
                              setEditingNoteId(booking.id);
                              setDraftNote(booking.arrivalNote || '');
                            }}
                            className="text-xs font-medium text-[#a0cedf] hover:underline cursor-pointer"
                          >
                            {booking.arrivalNote ? 'Edit Note' : 'Add Note'}
                          </button>
                        )}
                      </div>

                      {isEditing ? (
                        <div className="flex flex-col sm:flex-row gap-2">
                          <input
                            type="text"
                            value={draftNote}
                            onChange={(e) => setDraftNote(e.target.value)}
                            placeholder="Share flight/train time or dietary notes..."
                            className="flex-1 h-10 px-3 rounded-lg bg-[#181c1e] border border-[#41484b]/70 text-xs text-[#e0e3e5] focus:outline-none focus:border-[#a0cedf]"
                          />
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                onUpdateArrivalNote(booking.id, draftNote);
                                setEditingNoteId(null);
                              }}
                              className="px-4 h-10 rounded-lg bg-[#a0cedf] text-[#003543] text-xs font-semibold hover:bg-[#bbeafc] cursor-pointer"
                            >
                              Save
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingNoteId(null)}
                              className="px-3 h-10 rounded-lg bg-[#262b2c] text-xs text-[#c0c8cb] hover:text-[#e0e3e5] cursor-pointer"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-xs text-[#c0c8cb]">
                          {booking.arrivalNote || 'No arrival note added yet.'}
                        </p>
                      )}
                    </div>

                    {booking.status === 'Confirmed' && (
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => onCancelBooking(booking.id)}
                          className="px-4 py-2 rounded-xl bg-[#262b2c] hover:bg-[#93000a]/50 text-xs font-medium text-[#c0c8cb] hover:text-[#ffdad6] transition-colors cursor-pointer"
                        >
                          Cancel Reservation
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {inquiries.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-[#a0cedf]" />
            <h2 className="text-xl font-semibold text-[#e0e3e5]">
              Direct Host Inquiries ({inquiries.length})
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {inquiries.map((inq) => (
              <div
                key={inq.id}
                className="bg-[#181c1e] border border-[#41484b]/50 rounded-2xl p-5 space-y-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-[#e0e3e5]">{inq.stayTitle}</p>
                  <span className="text-xs text-[#8a9295]">Host: {inq.hostName}</span>
                </div>
                <div className="bg-[#101416] rounded-xl p-3.5 space-y-1">
                  <p className="text-[11px] font-medium text-[#8a9295]">
                    Your note ({inq.senderName})
                  </p>
                  <p className="text-xs text-[#e0e3e5] leading-relaxed">{inq.message}</p>
                </div>
                <div className="bg-[#1c2022] rounded-xl p-3.5 space-y-1">
                  <p className="text-[11px] font-medium text-[#a0cedf]">Host Response</p>
                  <p className="text-xs text-[#c0c8cb] leading-relaxed">{inq.hostReply}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
