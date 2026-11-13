import { ArrowRight, Compass, Sun } from 'lucide-react';
import { DESTINATIONS } from '../data/stays';
import type { CoastalRegion, Stay } from '../types';
import { ImageWithFallback } from './ImageWithFallback';

interface DestinationsViewProps {
  stays: Stay[];
  onExploreRegion: (region: CoastalRegion) => void;
}

export function DestinationsView({ stays, onExploreRegion }: DestinationsViewProps) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="max-w-2xl space-y-3">
        <p className="text-xs font-medium tracking-wide text-[#a0cedf]">
          Western Coastline Directory
        </p>
        <h1
          className="text-3xl sm:text-4xl font-bold tracking-tight text-[#e0e3e5]"
          style={{ textWrap: 'balance' }}
        >
          Five coastal pockets with direct homeowner access
        </h1>
        <p className="text-base text-[#c0c8cb] leading-relaxed">
          Every shoreline below connects you directly with verified local families and architects. Choose a coastline to browse direct stays with zero commission fees.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {DESTINATIONS.map((dest) => {
          const regionCount = stays.filter((s) => s.region === dest.region).length;
          return (
            <article
              key={dest.region}
              className="group bg-[#181c1e] border border-[#41484b]/50 rounded-2xl overflow-hidden flex flex-col transition-transform duration-200 hover:-translate-y-0.5"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-[#0b0f10]">
                <ImageWithFallback
                  imageKey={dest.imageKey}
                  alt={`${dest.region} coastal view`}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f10]/90 via-[#0b0f10]/25 to-transparent" />
                <div className="absolute bottom-4 left-5 right-5">
                  <p className="text-xs font-medium text-[#a0cedf] mb-1">
                    {dest.subtitle}
                  </p>
                  <h2 className="text-xl font-semibold text-[#e0e3e5]">
                    {dest.region}
                  </h2>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-5">
                <div className="space-y-3">
                  <p className="text-sm text-[#c0c8cb] leading-relaxed">
                    {dest.summary}
                  </p>
                  <div className="pt-2 border-t border-[#41484b]/35 space-y-2 text-xs text-[#c0c8cb]">
                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1.5 text-[#8a9295]">
                        <Sun className="h-3.5 w-3.5 text-[#a0cedf]" />
                        Best season
                      </span>
                      <span className="font-medium text-[#e0e3e5]">{dest.bestSeason}</span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1.5 text-[#8a9295]">
                        <Compass className="h-3.5 w-3.5 text-[#a0cedf]" />
                        Avg direct tariff
                      </span>
                      <span className="font-medium text-[#e0e3e5] tabular-nums">
                        ₹{dest.avgDirectRateInr.toLocaleString('en-IN')} / night
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onExploreRegion(dest.region)}
                  className="w-full inline-flex items-center justify-between px-4 py-2.5 rounded-xl bg-[#262b2c] hover:bg-[#313537] text-sm font-medium text-[#e0e3e5] transition-colors cursor-pointer"
                >
                  <span>
                    View {regionCount} {regionCount === 1 ? 'stay' : 'stays'} in {dest.region}
                  </span>
                  <ArrowRight className="h-4 w-4 text-[#a0cedf]" />
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
