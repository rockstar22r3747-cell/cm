import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT || 3000);
const IS_PROD = process.env.NODE_ENV === 'production';

interface ServerStay {
  id: string;
  title: string;
  region: string;
  locationDetail: string;
  category: string;
  imageKey: string;
  nightlyRateInr: number;
  cleaningFeeInr: number;
  maxGuests: number;
  bedrooms: number;
  shoreDistance: string;
  rating: number;
  reviewCount: number;
  instantDirect: boolean;
  amenities: string[];
  highlights: string[];
  houseRules: string[];
  description: string;
  host: {
    name: string;
    sinceYear: number;
    responseTime: string;
    phone: string;
    languages: string[];
    bio: string;
  };
}

interface ServerBooking {
  id: string;
  reference: string;
  stayId: string;
  stayTitle: string;
  region: string;
  imageKey: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  guests: number;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  arrivalNote: string;
  selectedAddons: string[];
  subtotalInr: number;
  cleaningFeeInr: number;
  addonsTotalInr: number;
  brokerageInr: number;
  totalInr: number;
  estimatedOtaSavingsInr: number;
  status: 'Confirmed' | 'Cancelled';
  createdAt: string;
  hostName: string;
  hostPhone: string;
}

interface ServerInquiry {
  id: string;
  stayId: string;
  stayTitle: string;
  hostName: string;
  senderName: string;
  senderContact: string;
  message: string;
  hostReply: string;
  createdAt: string;
}

const staysStore: ServerStay[] = [
  {
    id: 'stay-vagator-horizon',
    title: 'Samudra Edge Cliff Villa',
    region: 'North Goa',
    locationDetail: 'Chapora Headland, North Goa',
    category: 'Cliffside Villas',
    imageKey: 'hero_cliff',
    nightlyRateInr: 16500,
    cleaningFeeInr: 1200,
    maxGuests: 6,
    bedrooms: 3,
    shoreDistance: '3 min trail to cove',
    rating: 4.96,
    reviewCount: 64,
    instantDirect: true,
    amenities: [
      'Infinity plunge pool',
      '200 Mbps fiber Wi-Fi',
      'Private sunset deck',
      'Full coastal kitchen',
      'Power backup',
      'Free parking',
    ],
    highlights: [
      'Unobstructed 180-degree Arabian Sea dusk views',
      'Direct check-in with host caretaker on arrival',
      'Zero platform commission added to nightly tariff',
    ],
    houseRules: [
      'Check-in after 2:00 PM · Check-out by 11:00 AM',
      'Quiet coastal hours after 10:30 PM',
      'No commercial events without prior host consent',
    ],
    description:
      'Cantilevered over dark laterite cliffs above Chapora Bay, Samudra Edge pairs warm teak louvers with a salt-water infinity pool. Book directly with owner Vikram & Rhea with transparent pricing and personal local recommendations.',
    host: {
      name: 'Vikram & Rhea Naik',
      sinceYear: 2019,
      responseTime: 'Usually replies in 15 mins',
      phone: '+91 98230 44128',
      languages: ['English', 'Konkani', 'Hindi'],
      bio: 'Architects based in Assagao who built Samudra Edge with local laterite masons and host travelers directly without agency markups.',
    },
  },
  {
    id: 'stay-morjim-driftwood',
    title: 'Morjim Driftwood Pavilion',
    region: 'North Goa',
    locationDetail: 'Turtle Beach Lane, Morjim',
    category: 'Beachfront',
    imageKey: 'morjim_villa',
    nightlyRateInr: 11200,
    cleaningFeeInr: 800,
    maxGuests: 4,
    bedrooms: 2,
    shoreDistance: 'Steps onto sand',
    rating: 4.92,
    reviewCount: 48,
    instantDirect: true,
    amenities: [
      'Direct beach access',
      'Outdoor rain shower',
      '150 Mbps Wi-Fi',
      'Sea-facing teak deck',
      'Air conditioning',
      'Dedicated workspace',
    ],
    highlights: [
      'Private wooden deck opening straight onto Morjim sands',
      'Freshly brewed filter coffee & coastal breakfast available',
      'Direct WhatsApp coordination with host family',
    ],
    houseRules: [
      'Check-in after 1:00 PM · Check-out by 11:00 AM',
      'Rinse beach sand at the outdoor shower before entering',
      'Pets welcome on prior note to host',
    ],
    description:
      'Set tucked behind coastal palms on the quiet northern stretch of Morjim, this handcrafted teakwood pavilion lets you step from your morning deck onto soft shoreline sand.',
    host: {
      name: 'Savio Fernandes',
      sinceYear: 2018,
      responseTime: 'Usually replies in 20 mins',
      phone: '+91 98221 77309',
      languages: ['English', 'Konkani', 'Portuguese'],
      bio: 'Third-generation Morjim resident dedicated to low-impact coastal hospitality and direct guest connections.',
    },
  },
  {
    id: 'stay-gokarna-laterite',
    title: 'Kudle Ridge Laterite Cottage',
    region: 'Gokarna',
    locationDetail: 'Om-Kudle Cliff Path, Gokarna',
    category: 'Cliffside Villas',
    imageKey: 'gokarna_cliff',
    nightlyRateInr: 7400,
    cleaningFeeInr: 500,
    maxGuests: 3,
    bedrooms: 1,
    shoreDistance: '4 min cliff walk',
    rating: 4.94,
    reviewCount: 53,
    instantDirect: true,
    amenities: [
      'Sea-facing daybed veranda',
      '100 Mbps fiber Wi-Fi',
      'Solar hot water',
      'Organic cotton linens',
      'Filtered drinking water',
      'Yoga mats included',
    ],
    highlights: [
      'Hand-dressed red laterite walls stay naturally cool',
      'Overlooks fishing boats returning to Kudle cove',
      'Zero brokerage saves ~₹1,400 per night vs OTAs',
    ],
    houseRules: [
      'Check-in after 12:30 PM · Check-out by 10:30 AM',
      'Plastic-free property — refillable glass bottles provided',
      'Quiet cliffside sanctuary after 10:00 PM',
    ],
    description:
      'Perched quietly above the coastal footpath linking Kudle and Om Beach, this laterite stone cottage features wide folding timber shutters and a deep daybed veranda facing the open horizon.',
    host: {
      name: 'Ananya Hegde',
      sinceYear: 2020,
      responseTime: 'Usually replies in 25 mins',
      phone: '+91 94482 61904',
      languages: ['English', 'Kannada', 'Hindi'],
      bio: 'Former marine conservation researcher hosting three low-density stone cottages along the Gokarna headland.',
    },
  },
  {
    id: 'stay-alibaug-courtyard',
    title: 'Mandwa Slate Courtyard House',
    region: 'Alibaug',
    locationDetail: 'Sasawane Orchard Road, Alibaug',
    category: 'Cliffside Villas',
    imageKey: 'alibaug_courtyard',
    nightlyRateInr: 14800,
    cleaningFeeInr: 1000,
    maxGuests: 6,
    bedrooms: 3,
    shoreDistance: '6 min drive to Kihim',
    rating: 4.89,
    reviewCount: 39,
    instantDirect: true,
    amenities: [
      'Private slate plunge pool',
      'Timber dining pavilion',
      '200 Mbps fiber Wi-Fi',
      'Full-time caretaker',
      'Chef-ready kitchen',
      'EV charging point',
    ],
    highlights: [
      '18 minutes from Mandwa Ro-Ro & speedboat jetty',
      'Shaded frangipani courtyard with heated plunge pool',
      'Direct family-to-family booking with no service fee',
    ],
    houseRules: [
      'Check-in after 2:00 PM · Check-out by 11:00 AM',
      'Poolside glassware must be acrylic only',
      'Ferry pickup available via optional add-on',
    ],
    description:
      'Designed around a serene dark-slate courtyard pool and open-air timber pavilion, Mandwa Slate Courtyard House offers effortless weekend escapes without platform commission markups.',
    host: {
      name: 'Kabir & Meera Deshmukh',
      sinceYear: 2021,
      responseTime: 'Usually replies in 10 mins',
      phone: '+91 98204 33812',
      languages: ['English', 'Marathi', 'Hindi'],
      bio: 'Mumbai-Alibaug hosts who share their coastal orchard home directly with thoughtful travelers and small groups.',
    },
  },
  {
    id: 'stay-varkala-cliff-studio',
    title: 'Varkala Red Cliff Timber Studio',
    region: 'Varkala',
    locationDetail: 'North Cliff Edge, Varkala',
    category: 'Workation Studios',
    imageKey: 'varkala_studio',
    nightlyRateInr: 6800,
    cleaningFeeInr: 400,
    maxGuests: 2,
    bedrooms: 1,
    shoreDistance: '2 min steps to beach',
    rating: 4.95,
    reviewCount: 71,
    instantDirect: true,
    amenities: [
      '300 Mbps dual-ISP fiber',
      'Ergonomic teak work desk',
      'Cantilevered ocean balcony',
      'UPS battery backup',
      'Espresso & pour-over bar',
      'Air conditioning',
    ],
    highlights: [
      'Built specifically for coastal remote work & deep focus',
      'Unbroken ocean swell views from the glass corner desk',
      'Weekly direct stay discounts with zero commission',
    ],
    houseRules: [
      'Check-in after 1:00 PM · Check-out by 11:00 AM',
      'Ideal for solo travelers or couples',
      'Surfboard storage rack available on ground deck',
    ],
    description:
      'Suspended above Varkala’s dramatic red mineral cliffs, this glass-and-teak studio combines dual-fiber internet reliability with raw Arabian Sea views right from your morning desk.',
    host: {
      name: 'Arjun Menon',
      sinceYear: 2020,
      responseTime: 'Usually replies in 15 mins',
      phone: '+91 98470 55219',
      languages: ['English', 'Malayalam', 'Hindi'],
      bio: 'Remote software engineer and surfer hosting quiet cliffside workation studios in Varkala.',
    },
  },
  {
    id: 'stay-south-goa-manor',
    title: 'Casa Colva Heritage Manor',
    region: 'South Goa',
    locationDetail: 'Benaulim Palm Grove, South Goa',
    category: 'Heritage',
    imageKey: 'south_goa_heritage',
    nightlyRateInr: 13400,
    cleaningFeeInr: 950,
    maxGuests: 6,
    bedrooms: 3,
    shoreDistance: '5 min walk to Benaulim',
    rating: 4.93,
    reviewCount: 57,
    instantDirect: false,
    amenities: [
      'Restored balcao veranda',
      'Private lap pool',
      '150 Mbps fiber Wi-Fi',
      'Hand-painted azulejo tiles',
      'Coconut grove garden',
      'Daily housekeeping',
    ],
    highlights: [
      '1920s Indo-Portuguese manor restored with lime plaster',
      'Evening brass-lit arches overlooking private lap pool',
      'Book directly with the custodial family',
    ],
    houseRules: [
      'Check-in after 2:00 PM · Check-out by 11:00 AM',
      'Respect historic lime-plaster walls and antique woodwork',
      'Home-style Goan fish curry dinner on prior request',
    ],
    description:
      'Surrounded by tall coconut palms five minutes from quiet Benaulim sands, Casa Colva preserves century-old arched verandas and cool mosaic floors alongside a tranquil private lap pool.',
    host: {
      name: 'Elena D’Souza',
      sinceYear: 2017,
      responseTime: 'Usually replies in 30 mins',
      phone: '+91 98234 90811',
      languages: ['English', 'Konkani', 'Hindi'],
      bio: 'Heritage conservationist stewarding her ancestral Benaulim home for slow-traveling guests.',
    },
  },
];

const bookingsStore: ServerBooking[] = [
  {
    id: 'bk-seed-1',
    reference: 'CM-4829',
    stayId: 'stay-gokarna-laterite',
    stayTitle: 'Kudle Ridge Laterite Cottage',
    region: 'Gokarna',
    imageKey: 'gokarna_cliff',
    checkIn: '2026-12-18',
    checkOut: '2026-12-21',
    nights: 3,
    guests: 2,
    guestName: 'Rohan Kulkarni',
    guestEmail: 'rohan.k@example.com',
    guestPhone: '+91 98192 50311',
    arrivalNote: 'Arriving via evening train at Gokarna Road around 6:30 PM.',
    selectedAddons: ['coastal-breakfast'],
    subtotalInr: 22200,
    cleaningFeeInr: 500,
    addonsTotalInr: 1950,
    brokerageInr: 0,
    totalInr: 24650,
    estimatedOtaSavingsInr: 4437,
    status: 'Confirmed',
    createdAt: '2026-11-10T09:15:00.000Z',
    hostName: 'Ananya Hegde',
    hostPhone: '+91 94482 61904',
  },
];

const inquiriesStore: ServerInquiry[] = [
  {
    id: 'inq-seed-1',
    stayId: 'stay-gokarna-laterite',
    stayTitle: 'Kudle Ridge Laterite Cottage',
    hostName: 'Ananya Hegde',
    senderName: 'Rohan Kulkarni',
    senderContact: '+91 98192 50311',
    message: 'Is the cliff path lit after sunset, and can we store two backpacks early?',
    hostReply:
      'Yes, our caretaker Ramesh meets guests at the Kudle ridge gate with torches and keeps bags ready from 10 AM.',
    createdAt: '2026-11-10T09:20:00.000Z',
  },
];

async function startServer() {
  const app = express();
  app.use(express.json());

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true, service: 'coastmitra', timestamp: new Date().toISOString() });
  });

  app.get('/api/stays', (req, res) => {
    const region = typeof req.query.region === 'string' ? req.query.region : '';
    const category = typeof req.query.category === 'string' ? req.query.category : '';
    const q = typeof req.query.q === 'string' ? req.query.q.trim().toLowerCase() : '';

    const filtered = staysStore.filter((stay) => {
      if (region && region !== 'All Coastline' && stay.region !== region) return false;
      if (category && category !== 'All Stays' && stay.category !== category) return false;
      if (
        q &&
        !`${stay.title} ${stay.region} ${stay.locationDetail} ${stay.description}`
          .toLowerCase()
          .includes(q)
      ) {
        return false;
      }
      return true;
    });

    res.json({ stays: filtered });
  });

  app.post('/api/stays', (req, res) => {
    const body = req.body as Partial<ServerStay>;
    if (
      !body.title ||
      !body.region ||
      !body.locationDetail ||
      !body.category ||
      !body.nightlyRateInr ||
      !body.host?.name ||
      !body.host?.phone
    ) {
      res.status(400).json({ error: 'Please complete all required property and host fields.' });
      return;
    }

    const validImageKeys = [
      'hero_cliff',
      'morjim_villa',
      'gokarna_cliff',
      'alibaug_courtyard',
      'varkala_studio',
      'south_goa_heritage',
    ];
    const imageKey =
      body.imageKey && validImageKeys.includes(body.imageKey)
        ? body.imageKey
        : 'morjim_villa';

    const newStay: ServerStay = {
      id: `stay-${Date.now()}`,
      title: String(body.title).trim(),
      region: String(body.region),
      locationDetail: String(body.locationDetail).trim(),
      category: String(body.category),
      imageKey,
      nightlyRateInr: Number(body.nightlyRateInr),
      cleaningFeeInr: Number(body.cleaningFeeInr || 600),
      maxGuests: Number(body.maxGuests || 4),
      bedrooms: Number(body.bedrooms || 2),
      shoreDistance: String(body.shoreDistance || '3 min walk to beach').trim(),
      rating: 5.0,
      reviewCount: 1,
      instantDirect: Boolean(body.instantDirect ?? true),
      amenities: Array.isArray(body.amenities) && body.amenities.length > 0
        ? body.amenities
        : ['Fiber Wi-Fi', 'Sea breeze veranda', 'Direct host check-in'],
      highlights: [
        'Verified zero-brokerage direct host listing',
        'Transparent nightly tariff with no OTA commission',
        'Direct host phone & arrival coordination',
      ],
      houseRules: [
        'Check-in after 2:00 PM · Check-out by 11:00 AM',
        'Respect quiet coastal hours after 10:30 PM',
      ],
      description:
        String(body.description || '').trim() ||
        'Listed directly by the coastal homeowner on CoastMitra with zero brokerage fees.',
      host: {
        name: String(body.host.name).trim(),
        sinceYear: new Date().getFullYear(),
        responseTime: 'Usually replies in 15 mins',
        phone: String(body.host.phone).trim(),
        languages: ['English', 'Hindi'],
        bio: 'Verified CoastMitra direct property owner.',
      },
    };

    staysStore.unshift(newStay);
    res.status(201).json({ stay: newStay });
  });

  app.get('/api/bookings', (_req, res) => {
    res.json({ bookings: bookingsStore });
  });

  app.post('/api/bookings', (req, res) => {
    const body = req.body as Partial<ServerBooking>;
    if (!body.stayId || !body.checkIn || !body.checkOut || !body.guestName || !body.guestPhone) {
      res.status(400).json({ error: 'Missing required booking details.' });
      return;
    }

    const stay = staysStore.find((s) => s.id === body.stayId);
    if (!stay) {
      res.status(404).json({ error: 'Selected coastal stay was not found.' });
      return;
    }

    const start = new Date(body.checkIn);
    const end = new Date(body.checkOut);
    const diffDays = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    const nights = Math.max(1, Number.isFinite(diffDays) ? diffDays : 1);

    const subtotalInr = stay.nightlyRateInr * nights;
    const addonsTotalInr = Number(body.addonsTotalInr || 0);
    const totalInr = subtotalInr + stay.cleaningFeeInr + addonsTotalInr;
    const estimatedOtaSavingsInr = Math.round(totalInr * 0.18);

    const booking: ServerBooking = {
      id: `bk-${Date.now()}`,
      reference: `CM-${Math.floor(1000 + Math.random() * 9000)}`,
      stayId: stay.id,
      stayTitle: stay.title,
      region: stay.region,
      imageKey: stay.imageKey,
      checkIn: body.checkIn,
      checkOut: body.checkOut,
      nights,
      guests: Number(body.guests || 2),
      guestName: String(body.guestName).trim(),
      guestEmail: String(body.guestEmail || '').trim(),
      guestPhone: String(body.guestPhone).trim(),
      arrivalNote: String(body.arrivalNote || '').trim(),
      selectedAddons: Array.isArray(body.selectedAddons) ? body.selectedAddons : [],
      subtotalInr,
      cleaningFeeInr: stay.cleaningFeeInr,
      addonsTotalInr,
      brokerageInr: 0,
      totalInr,
      estimatedOtaSavingsInr,
      status: 'Confirmed',
      createdAt: new Date().toISOString(),
      hostName: stay.host.name,
      hostPhone: stay.host.phone,
    };

    bookingsStore.unshift(booking);
    res.status(201).json({ booking });
  });

  app.patch('/api/bookings/:id', (req, res) => {
    const idx = bookingsStore.findIndex((b) => b.id === req.params.id);
    if (idx === -1) {
      res.status(404).json({ error: 'Booking not found.' });
      return;
    }
    const body = req.body as Partial<ServerBooking>;
    const current = bookingsStore[idx];
    const updated: ServerBooking = {
      ...current,
      status: body.status === 'Cancelled' ? 'Cancelled' : current.status,
      guests: body.guests ? Number(body.guests) : current.guests,
      arrivalNote: typeof body.arrivalNote === 'string' ? body.arrivalNote : current.arrivalNote,
    };
    bookingsStore[idx] = updated;
    res.json({ booking: updated });
  });

  app.get('/api/inquiries', (_req, res) => {
    res.json({ inquiries: inquiriesStore });
  });

  app.post('/api/inquiries', (req, res) => {
    const body = req.body as Partial<ServerInquiry>;
    if (!body.stayId || !body.senderName || !body.message) {
      res.status(400).json({ error: 'Please include your name and message for the host.' });
      return;
    }
    const stay = staysStore.find((s) => s.id === body.stayId);
    if (!stay) {
      res.status(404).json({ error: 'Stay not found.' });
      return;
    }

    const inquiry: ServerInquiry = {
      id: `inq-${Date.now()}`,
      stayId: stay.id,
      stayTitle: stay.title,
      hostName: stay.host.name,
      senderName: String(body.senderName).trim(),
      senderContact: String(body.senderContact || 'Direct app thread').trim(),
      message: String(body.message).trim(),
      hostReply: `Thank you ${String(body.senderName).trim()}. ${stay.host.name} received your direct note and will coordinate check-in details shortly on ${stay.host.phone}.`,
      createdAt: new Date().toISOString(),
    };

    inquiriesStore.unshift(inquiry);
    res.status(201).json({ inquiry });
  });

  if (!IS_PROD) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CoastMitra server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
