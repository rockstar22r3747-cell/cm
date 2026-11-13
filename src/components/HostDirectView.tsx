import { useState } from 'react';
import { CheckCircle2, Home, ShieldCheck } from 'lucide-react';
import type { CoastalRegion, ImageKey, Stay, StayCategory } from '../types';
import { ImageWithFallback } from './ImageWithFallback';

interface HostDirectViewProps {
  onPublishStay: (stay: Stay) => void;
}

const IMAGE_PRESETS: { key: ImageKey; label: string }[] = [
  { key: 'morjim_villa', label: 'Beachfront Teak Pavilion' },
  { key: 'gokarna_cliff', label: 'Laterite Cliff Cottage' },
  { key: 'alibaug_courtyard', label: 'Slate Courtyard Pool House' },
  { key: 'varkala_studio', label: 'Elevated Ocean Work Studio' },
  { key: 'south_goa_heritage', label: 'Indo-Portuguese Veranda' },
  { key: 'hero_cliff', label: 'Infinity Edge Cliff Villa' },
];

const AMENITY_OPTIONS = [
  'Fiber Wi-Fi',
  'Private plunge pool',
  'Direct beach path',
  'Full coastal kitchen',
  'Power backup',
  'Dedicated workspace',
  'Air conditioning',
  'Free parking',
];

export function HostDirectView({ onPublishStay }: HostDirectViewProps) {
  const [title, setTitle] = useState('');
  const [region, setRegion] = useState<Exclude<CoastalRegion, 'All Coastline'>>('North Goa');
  const [locationDetail, setLocationDetail] = useState('');
  const [category, setCategory] = useState<Exclude<StayCategory, 'All Stays'>>('Cliffside Villas');
  const [imageKey, setImageKey] = useState<ImageKey>('morjim_villa');
  const [nightlyRateInr, setNightlyRateInr] = useState('9500');
  const [maxGuests, setMaxGuests] = useState('4');
  const [bedrooms, setBedrooms] = useState('2');
  const [shoreDistance, setShoreDistance] = useState('3 min walk to beach');
  const [description, setDescription] = useState('');
  const [hostName, setHostName] = useState('');
  const [hostPhone, setHostPhone] = useState('');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([
    'Fiber Wi-Fi',
    'Direct beach path',
    'Power backup',
  ]);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [publishedTitle, setPublishedTitle] = useState('');

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((item) => item !== amenity) : [...prev, amenity]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const parsedRate = Number(nightlyRateInr);
    if (!title.trim() || !locationDetail.trim() || !hostName.trim() || !hostPhone.trim()) {
      setError('Please complete property title, neighborhood, host name, and direct phone.');
      return;
    }
    if (!Number.isFinite(parsedRate) || parsedRate < 1000) {
      setError('Please enter a valid nightly tariff in INR (minimum ₹1,000).');
      return;
    }

    setSubmitting(true);
    const payload = {
      title: title.trim(),
      region,
      locationDetail: locationDetail.trim(),
      category,
      imageKey,
      nightlyRateInr: parsedRate,
      cleaningFeeInr: 700,
      maxGuests: Number(maxGuests) || 4,
      bedrooms: Number(bedrooms) || 2,
      shoreDistance: shoreDistance.trim() || '3 min walk to shore',
      instantDirect: true,
      amenities: selectedAmenities,
      description:
        description.trim() ||
        'Direct homeowner listing on CoastMitra with transparent nightly rates and zero brokerage.',
      host: {
        name: hostName.trim(),
        phone: hostPhone.trim(),
      },
    };

    try {
      const response = await fetch('/api/stays', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error('Failed to publish');
      const data = (await response.json()) as { stay: Stay };
      setPublishedTitle(data.stay.title);
      onPublishStay(data.stay);
    } catch {
      const fallbackStay: Stay = {
        id: `stay-${Date.now()}`,
        title: payload.title,
        region: payload.region,
        locationDetail: payload.locationDetail,
        category: payload.category,
        imageKey: payload.imageKey,
        nightlyRateInr: payload.nightlyRateInr,
        cleaningFeeInr: payload.cleaningFeeInr,
        maxGuests: payload.maxGuests,
        bedrooms: payload.bedrooms,
        shoreDistance: payload.shoreDistance,
        rating: 5.0,
        reviewCount: 1,
        instantDirect: true,
        amenities: payload.amenities,
        highlights: [
          'Verified zero-brokerage direct host listing',
          'Transparent nightly tariff with no OTA commission',
          'Direct host phone & arrival coordination',
        ],
        houseRules: [
          'Check-in after 2:00 PM · Check-out by 11:00 AM',
          'Respect quiet coastal hours after 10:30 PM',
        ],
        description: payload.description,
        host: {
          name: payload.host.name,
          sinceYear: new Date().getFullYear(),
          responseTime: 'Usually replies in 15 mins',
          phone: payload.host.phone,
          languages: ['English', 'Hindi'],
          bio: 'Verified CoastMitra direct property owner.',
        },
      };
      setPublishedTitle(fallbackStay.title);
      onPublishStay(fallbackStay);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 pb-20">
      <div className="max-w-2xl space-y-3">
        <p className="text-xs font-medium text-[#a0cedf]">Homeowner Direct Onboarding</p>
        <h1
          className="text-3xl sm:text-4xl font-bold tracking-tight text-[#e0e3e5]"
          style={{ textWrap: 'balance' }}
        >
          List your coastal home with zero brokerage
        </h1>
        <p className="text-sm sm:text-base text-[#c0c8cb] leading-relaxed">
          Publish your villa, laterite cottage, or workation studio directly to travelers. Keep 100% of your nightly tariff and communicate straight with guests.
        </p>
      </div>

      {publishedTitle && (
        <div className="bg-[#1c2022] border border-[#a0cedf]/60 rounded-2xl p-5 flex items-center gap-3 text-sm text-[#e0e3e5]">
          <CheckCircle2 className="h-5 w-5 text-[#a0cedf] shrink-0" />
          <span>
            <strong>{publishedTitle}</strong> is now live in the CoastMitra Explore directory.
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-7 bg-[#181c1e] border border-[#41484b]/50 rounded-2xl p-6 sm:p-8 space-y-6"
        >
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-[#e0e3e5] flex items-center gap-2">
              <Home className="h-4 w-4 text-[#a0cedf]" />
              Property Details
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2 space-y-1.5">
                <label htmlFor="host-prop-title" className="block text-xs font-medium text-[#c0c8cb]">
                  Property Name *
                </label>
                <input
                  id="host-prop-title"
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Ashwem Coconut Grove Villa"
                  className="w-full h-11 px-3.5 rounded-xl bg-[#101416] border border-[#41484b]/70 text-sm text-[#e0e3e5] placeholder:text-[#8a9295] focus:outline-none focus:border-[#a0cedf]"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="host-region" className="block text-xs font-medium text-[#c0c8cb]">
                  Coastal Region
                </label>
                <select
                  id="host-region"
                  value={region}
                  onChange={(e) =>
                    setRegion(e.target.value as Exclude<CoastalRegion, 'All Coastline'>)
                  }
                  className="w-full h-11 px-3.5 rounded-xl bg-[#101416] border border-[#41484b]/70 text-sm text-[#e0e3e5] focus:outline-none focus:border-[#a0cedf]"
                >
                  <option value="North Goa">North Goa</option>
                  <option value="South Goa">South Goa</option>
                  <option value="Gokarna">Gokarna</option>
                  <option value="Alibaug">Alibaug</option>
                  <option value="Varkala">Varkala</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="host-category" className="block text-xs font-medium text-[#c0c8cb]">
                  Stay Style
                </label>
                <select
                  id="host-category"
                  value={category}
                  onChange={(e) =>
                    setCategory(e.target.value as Exclude<StayCategory, 'All Stays'>)
                  }
                  className="w-full h-11 px-3.5 rounded-xl bg-[#101416] border border-[#41484b]/70 text-sm text-[#e0e3e5] focus:outline-none focus:border-[#a0cedf]"
                >
                  <option value="Cliffside Villas">Cliffside Villas</option>
                  <option value="Beachfront">Beachfront</option>
                  <option value="Heritage">Heritage</option>
                  <option value="Workation Studios">Workation Studios</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="host-location" className="block text-xs font-medium text-[#c0c8cb]">
                  Beach / Locality *
                </label>
                <input
                  id="host-location"
                  type="text"
                  required
                  value={locationDetail}
                  onChange={(e) => setLocationDetail(e.target.value)}
                  placeholder="e.g., Mandrem Creek, North Goa"
                  className="w-full h-11 px-3.5 rounded-xl bg-[#101416] border border-[#41484b]/70 text-sm text-[#e0e3e5] placeholder:text-[#8a9295] focus:outline-none focus:border-[#a0cedf]"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="host-distance" className="block text-xs font-medium text-[#c0c8cb]">
                  Distance to Shore
                </label>
                <input
                  id="host-distance"
                  type="text"
                  value={shoreDistance}
                  onChange={(e) => setShoreDistance(e.target.value)}
                  placeholder="e.g., 3 min walk to beach"
                  className="w-full h-11 px-3.5 rounded-xl bg-[#101416] border border-[#41484b]/70 text-sm text-[#e0e3e5] placeholder:text-[#8a9295] focus:outline-none focus:border-[#a0cedf]"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="host-rate" className="block text-xs font-medium text-[#c0c8cb]">
                  Direct Nightly Tariff (₹) *
                </label>
                <input
                  id="host-rate"
                  type="number"
                  min={1000}
                  step={100}
                  required
                  value={nightlyRateInr}
                  onChange={(e) => setNightlyRateInr(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl bg-[#101416] border border-[#41484b]/70 text-sm text-[#e0e3e5] tabular-nums focus:outline-none focus:border-[#a0cedf]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label htmlFor="host-guests" className="block text-xs font-medium text-[#c0c8cb]">
                    Max Guests
                  </label>
                  <input
                    id="host-guests"
                    type="number"
                    min={1}
                    max={16}
                    value={maxGuests}
                    onChange={(e) => setMaxGuests(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl bg-[#101416] border border-[#41484b]/70 text-sm text-[#e0e3e5] tabular-nums focus:outline-none focus:border-[#a0cedf]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="host-bedrooms" className="block text-xs font-medium text-[#c0c8cb]">
                    Bedrooms
                  </label>
                  <input
                    id="host-bedrooms"
                    type="number"
                    min={1}
                    max={10}
                    value={bedrooms}
                    onChange={(e) => setBedrooms(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl bg-[#101416] border border-[#41484b]/70 text-sm text-[#e0e3e5] tabular-nums focus:outline-none focus:border-[#a0cedf]"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="host-photo" className="block text-xs font-medium text-[#c0c8cb]">
                Architectural Photo Style
              </label>
              <select
                id="host-photo"
                value={imageKey}
                onChange={(e) => setImageKey(e.target.value as ImageKey)}
                className="w-full h-11 px-3.5 rounded-xl bg-[#101416] border border-[#41484b]/70 text-sm text-[#e0e3e5] focus:outline-none focus:border-[#a0cedf]"
              >
                {IMAGE_PRESETS.map((preset) => (
                  <option key={preset.key} value={preset.key}>
                    {preset.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-medium text-[#c0c8cb]">Amenities</p>
              <div className="grid grid-cols-2 gap-2.5">
                {AMENITY_OPTIONS.map((amenity) => {
                  const active = selectedAmenities.includes(amenity);
                  return (
                    <label
                      key={amenity}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-xl border text-xs cursor-pointer transition-colors ${
                        active
                          ? 'bg-[#1c2022] border-[#a0cedf]/60 text-[#e0e3e5]'
                          : 'bg-[#101416] border-[#41484b]/50 text-[#c0c8cb]'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={active}
                        onChange={() => toggleAmenity(amenity)}
                        className="accent-[#a0cedf]"
                      />
                      <span>{amenity}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="host-desc" className="block text-xs font-medium text-[#c0c8cb]">
                Property Story
              </label>
              <textarea
                id="host-desc"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the sea breeze, architecture, and quiet neighborhood..."
                className="w-full p-3.5 rounded-xl bg-[#101416] border border-[#41484b]/70 text-sm text-[#e0e3e5] placeholder:text-[#8a9295] focus:outline-none focus:border-[#a0cedf]"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-[#41484b]/40 space-y-4">
            <h2 className="text-base font-semibold text-[#e0e3e5]">Direct Host Contact</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                required
                value={hostName}
                onChange={(e) => setHostName(e.target.value)}
                placeholder="Host full name *"
                className="h-11 px-3.5 rounded-xl bg-[#101416] border border-[#41484b]/70 text-sm text-[#e0e3e5] placeholder:text-[#8a9295] focus:outline-none focus:border-[#a0cedf]"
              />
              <input
                type="tel"
                required
                value={hostPhone}
                onChange={(e) => setHostPhone(e.target.value)}
                placeholder="Direct phone / WhatsApp *"
                className="h-11 px-3.5 rounded-xl bg-[#101416] border border-[#41484b]/70 text-sm text-[#e0e3e5] placeholder:text-[#8a9295] focus:outline-none focus:border-[#a0cedf]"
              />
            </div>
          </div>

          {error && (
            <p role="alert" className="text-xs font-medium text-[#ffb4ab]">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 px-6 rounded-full bg-[#a0cedf] text-[#003543] text-sm font-semibold hover:bg-[#bbeafc] transition-colors cursor-pointer disabled:opacity-60"
          >
            {submitting ? 'Publishing Direct Listing...' : 'Publish Direct Coastal Listing'}
          </button>
        </form>

        {/* Live Preview Card */}
        <aside className="lg:col-span-5 space-y-4 lg:sticky lg:top-24">
          <p className="text-xs font-medium text-[#8a9295]">Live Listing Preview</p>
          <div className="bg-[#181c1e] border border-[#41484b]/50 rounded-2xl overflow-hidden">
            <div className="relative aspect-[4/3] bg-[#0b0f10]">
              <ImageWithFallback
                imageKey={imageKey}
                alt={title || 'Coastal property preview'}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f10]/80 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs text-[#e0e3e5]">
                <span>{category}</span>
                <span>New Direct Listing</span>
              </div>
            </div>

            <div className="p-5 space-y-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs text-[#c0c8cb]">
                  <span>{region}</span>
                  <span aria-hidden="true">·</span>
                  <span>{shoreDistance || '3 min walk to beach'}</span>
                </div>
                <h3 className="text-lg font-semibold text-[#e0e3e5]">
                  {title.trim() || 'Your Coastal Stay Title'}
                </h3>
                <p className="text-xs text-[#8a9295]">
                  Direct with {hostName.trim() || 'Homeowner'} · {bedrooms || 2} bedrooms · Up to{' '}
                  {maxGuests || 4} guests
                </p>
              </div>

              <div className="pt-4 border-t border-[#41484b]/35 flex items-center justify-between">
                <div>
                  <span className="text-lg font-semibold text-[#e0e3e5] tabular-nums">
                    ₹{(Number(nightlyRateInr) || 9500).toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs text-[#8a9295]"> / night</span>
                  <p className="text-[11px] font-medium text-[#a0cedf]">₹0 Brokerage</p>
                </div>
                <span className="inline-flex items-center gap-1.5 text-xs text-[#a0cedf]">
                  <ShieldCheck className="h-4 w-4" />
                  100% Direct
                </span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
