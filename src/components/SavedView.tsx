import { ArrowRight, BookmarkX, Heart } from 'lucide-react';
import type { Stay } from '../types';
import { ImageWithFallback } from './ImageWithFallback';

interface SavedViewProps {
  savedStays: Stay[];
  onToggleSave: (stayId: string) => void;
  onSelectStay: (stay: Stay) => void;
  onExploreAll: () => void;
}

export function SavedView({
  savedStays,
  onToggleSave,
  onSelectStay,
  onExploreAll,
}: SavedViewProps) {
  if (savedStays.length === 0) {
    return (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-lg mx-auto bg-[#181c1e] border border-[#41484b]/50 rounded-2xl p-8 text-center space-y-5">
          <div className="mx-auto h-12 w-12 rounded-2xl bg-[#1c2022] flex items-center justify-center text-[#a0cedf]">
            <Heart className="h-5 w-5" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold text-[#e0e3e5]">No saved coastal stays yet</h1>
            <p className="text-sm text-[#c0c8cb] leading-relaxed">
              Bookmark cliffside villas, beachfront pavilions, or workation studios while exploring to compare zero-brokerage tariffs side by side.
            </p>
          </div>
          <button
            type="button"
            onClick={onExploreAll}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#a0cedf] text-[#003543] text-sm font-semibold hover:bg-[#bbeafc] transition-colors cursor-pointer"
          >
            Browse Coastal Stays
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-2">
          <p className="text-xs font-medium text-[#a0cedf]">Shortlisted Coastline</p>
          <h1 className="text-3xl font-bold tracking-tight text-[#e0e3e5]">
            Saved Stays ({savedStays.length})
          </h1>
          <p className="text-sm text-[#c0c8cb]">
            Compare direct homeowner tariffs and shore proximity before confirming your dates.
          </p>
        </div>
        <button
          type="button"
          onClick={onExploreAll}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1c2022] border border-[#41484b]/60 text-sm font-medium text-[#e0e3e5] hover:bg-[#262b2c] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          Explore More
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {savedStays.map((stay) => (
          <article
            key={stay.id}
            className="bg-[#181c1e] border border-[#41484b]/50 rounded-2xl overflow-hidden flex flex-col"
          >
            <div className="relative aspect-[4/3] bg-[#0b0f10]">
              <ImageWithFallback
                imageKey={stay.imageKey}
                alt={stay.title}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f10]/80 via-transparent to-transparent" />
              <button
                type="button"
                onClick={() => onToggleSave(stay.id)}
                aria-label={`Remove ${stay.title} from saved stays`}
                className="absolute top-3 right-3 h-10 w-10 rounded-full bg-[#101416]/80 backdrop-blur-sm text-[#e0e3e5] hover:text-[#ffb4ab] flex items-center justify-center transition-colors cursor-pointer"
              >
                <BookmarkX className="h-4 w-4" />
              </button>
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs text-[#c0c8cb]">
                  <span>{stay.region}</span>
                  <span aria-hidden="true">·</span>
                  <span>{stay.shoreDistance}</span>
                  <span aria-hidden="true">·</span>
                  <span className="tabular-nums">{stay.rating.toFixed(2)}</span>
                </div>
                <h2 className="text-lg font-semibold text-[#e0e3e5]">{stay.title}</h2>
                <p className="text-xs text-[#8a9295]">
                  Hosted directly by {stay.host.name}
                </p>
              </div>

              <div className="pt-4 border-t border-[#41484b]/35 flex items-center justify-between gap-4">
                <div>
                  <span className="text-lg font-semibold text-[#e0e3e5] tabular-nums">
                    ₹{stay.nightlyRateInr.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs text-[#8a9295]"> / night</span>
                </div>
                <button
                  type="button"
                  onClick={() => onSelectStay(stay)}
                  className="px-4 py-2 rounded-full bg-[#a0cedf] text-[#003543] text-xs font-semibold hover:bg-[#bbeafc] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  Book Direct
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {savedStays.length >= 2 && (
        <div className="bg-[#181c1e] border border-[#41484b]/50 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-[#41484b]/40">
            <h2 className="text-base font-semibold text-[#e0e3e5]">
              Direct Tariff Comparison
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#1c2022] text-xs text-[#8a9295]">
                <tr>
                  <th className="px-6 py-3 font-medium">Property</th>
                  <th className="px-6 py-3 font-medium">Region</th>
                  <th className="px-6 py-3 font-medium">Capacity</th>
                  <th className="px-6 py-3 font-medium">Nightly Tariff</th>
                  <th className="px-6 py-3 font-medium">Brokerage</th>
                  <th className="px-6 py-3 font-medium">Shore Access</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#41484b]/30">
                {savedStays.map((stay) => (
                  <tr
                    key={stay.id}
                    onClick={() => onSelectStay(stay)}
                    className="hover:bg-[#1c2022]/70 transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-4 font-medium text-[#e0e3e5]">{stay.title}</td>
                    <td className="px-6 py-4 text-[#c0c8cb]">{stay.region}</td>
                    <td className="px-6 py-4 text-[#c0c8cb] tabular-nums">
                      Up to {stay.maxGuests} guests · {stay.bedrooms} bd
                    </td>
                    <td className="px-6 py-4 font-medium text-[#e0e3e5] tabular-nums">
                      ₹{stay.nightlyRateInr.toLocaleString('en-IN')}
                    </td>
                    <td className="px-6 py-4 font-medium text-[#a0cedf] tabular-nums">₹0</td>
                    <td className="px-6 py-4 text-[#c0c8cb]">{stay.shoreDistance}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}
