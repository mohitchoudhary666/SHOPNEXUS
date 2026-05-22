import { Product, Coupon } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Nexus X2 Pro Smartphone',
    description: 'Next-generation smartphone featuring a vivid 120Hz AMOLED display, AI Triple-Lens Camera system, and custom-tuned octa-core processors built for gaming and multitasking.',
    price: 34999,
    category: 'Electronics',
    rating: 4.8,
    reviewCount: 142,
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&auto=format&fit=crop&q=60',
    features: [
      '6.7" Fluid AMOLED display with HDR10+ support',
      'AI-powered 108MP primary sensor + ultra-wide + macro lens',
      '5000mAh battery with ultra fast 65W Warp Charging',
      'IP68 rating for water and dust resistance'
    ],
    specs: {
      'Screen Size': '6.7 inches',
      'Processor': 'MediaTek Dimensity 9200 Octa-Core',
      'RAM / Storage': '12GB LPDDR5 / 256GB UFS 3.1',
      'Operating System': 'Android 14 with Custom UI'
    },
    stock: 25
  },
  {
    id: 'prod-2',
    name: 'AeroBook Air Slim Laptop',
    description: 'An ultra-slim, lightweight feather laptop built for coders, students, and professionals on the move. Packs exceptional battery life and a zero-noise tactile keyboard.',
    price: 54990,
    category: 'Electronics',
    rating: 4.6,
    reviewCount: 98,
    image: 'https://images.unsplash.com/photo-1496181130204-755241524eab?w=500&auto=format&fit=crop&q=60',
    features: [
      'Ultraweight aluminum build weighing only 1.2kg',
      'Up to 14 hours of continuous coding and video playback',
      'Whisper quiet fanless cooling integration',
      'Backlit ergonomic chiclet keyboard with dedicated function keys'
    ],
    specs: {
      'Processor': 'Intel Core i5 13th Gen',
      'RAM / Storage': '16GB DDR5 / 512GB PCIe NVMe SSD',
      'Display': '14.1" 16:10 FHD+ Crisp IPS',
      'Connectivity': 'WiFi-6, Bluetooth 5.2, USB-C Power Delivery'
    },
    stock: 12
  },
  {
    id: 'prod-3',
    name: 'SonicWave Noise Cancelling Headphones',
    description: 'Immersive sound space featuring Hybrid Active Noise Cancellation, soft protein leather earcups, and signature crystal-clear voice microphone pickup.',
    price: 6499,
    category: 'Electronics',
    rating: 4.7,
    reviewCount: 215,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60',
    features: [
      'Up to 40dB of advanced Active Hybrid ANC',
      '40mm large dynamic soundstage drivers',
      'Huge 50-hour playback duration on a single charge',
      'Foldable travel friendly design with storage pouch'
    ],
    specs: {
      'Drivers': '40mm Neo-dynamic',
      'Frequency Response': '20Hz - 20kHz',
      'Wireless': 'Bluetooth 5.3 with multipoint connection',
      'Weight': '220g'
    },
    stock: 45
  },
  {
    id: 'prod-4',
    name: 'Omni Chronos Smart Sports Watch',
    description: 'Keep tabs on your biological signals, fitness metrics, and notifications with this elegant AMOLED outdoor hybrid smartwatch.',
    price: 4999,
    category: 'Electronics',
    rating: 4.4,
    reviewCount: 84,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60',
    features: [
      'Heart rate, SpO2, and deep sleep phase analysis tracking',
      'Built-in multi-constellation GPS for accurate run plotting',
      'Waterproof rating up to 50 meters (5ATM)',
      'Custom watchface engine compiling real-time widgets'
    ],
    specs: {
      'Screen Size': '1.43" Always-on AMOLED',
      'Battery Life': 'Up to 10 days standard usage',
      'Sensor Suite': 'Optical heart sensor, Accelerometer, Gyro, Barometer',
      'Enclosure': 'Anodized Space-Alloy bezel'
    },
    stock: 30
  },
  {
    id: 'prod-5',
    name: 'Classic Vintage Denim Jacket',
    description: 'Handcrafted from 100% thick cotton denim, styled with classic breast patch pockets and adjustable side tabs. Built to age gracefully.',
    price: 2490,
    category: 'Clothing',
    rating: 4.5,
    reviewCount: 76,
    image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=500&auto=format&fit=crop&q=60',
    features: [
      'Sourced premium heavyweight denim twill',
      'Aged slate blue indigo pre-wash',
      'Double stitched flat-felled seams for long term wear',
      'Two buttoned button-flap utility chest pockets'
    ],
    specs: {
      'Material': '100% Ring-spun Indigo Cotton Twill',
      'Fitting': 'Relaxed classic fit',
      'Caretaking': 'Cold wash inside out recommended',
      'Size Grid': 'S, M, L, XL, XXL'
    },
    stock: 50
  },
  {
    id: 'prod-6',
    name: 'Nomad Premium Leather Backpack',
    description: 'A masterpiece of form and function. Created using vegetable-tanned leather, featuring a padded laptop slot and hidden anti-theft compartments.',
    price: 3999,
    category: 'Clothing',
    rating: 4.9,
    reviewCount: 63,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format&fit=crop&q=60',
    features: [
      'Genuine full-grain artisan leather outer skin',
      'Integrated plush fleece lined compartment fits up to 16" laptops',
      'Quick-access brass magnetic closures',
      'Ergonomic padded mesh shoulder supports'
    ],
    specs: {
      'Capacity': '22 Liters volume',
      'Dimensions': '18" H x 12.5" W x 6" D',
      'Zippers': 'Heavy-duty Japanese YKK sliders',
      'Water Protection': 'Waterproof canvas lining shield'
    },
    stock: 8
  },
  {
    id: 'prod-7',
    name: 'Mechanical Enthusiast Keyboard',
    description: 'Satisfying acoustics and buttery-smooth typing feel. Features pre-lubed linear switches, sound dampening foam layers, and double-shot PBT keycaps.',
    price: 3290,
    category: 'Electronics',
    rating: 4.8,
    reviewCount: 110,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&auto=format&fit=crop&q=60',
    features: [
      'Hot-swappable 5-pin key switch sockets',
      'Silent pre-lubed Linear red linear switches',
      'Full RGB programmable backlights via onboard memory',
      'Triple physical connection mode (Bluetooth, Wireless 2.4G, Type-C)'
    ],
    specs: {
      'Layout': '75% space efficient design',
      'Chassis': 'Polycarbonate bottom with metallic internal plate',
      'Battery': '3000mAh structural fuel cell',
      'Keycaps': 'Double-shot PBT cherry profiles'
    },
    stock: 15
  },
  {
    id: 'prod-8',
    name: 'Minimalist Walnut Desk Lamp',
    description: 'Elegant geometric lighting solution blending natural timber warmth with bright customizable ambient illumination.',
    price: 1890,
    category: 'Home & Living',
    rating: 4.3,
    reviewCount: 39,
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500&auto=format&fit=crop&q=60',
    features: [
      'Handcrafted genuine American Walnut pedestal base',
      'Stepless slider touch brightness dimmer controls',
      'Stroboscopic eye-shield natural light filter',
      'Built in 5W smart USB charging port hub'
    ],
    specs: {
      'Color Temperature': 'Adjustable 2700K Warm to 5500K Cool White',
      'Materials': 'American Walnut wood, brushed stainless steel',
      'Bulb Tech': '9W Energy Star certified modular LED board',
      'Cabling': '6ft braided heavy fabric power cord'
    },
    stock: 20
  },
  {
    id: 'prod-9',
    name: 'Barista Touch Espresso Machine',
    description: 'Bring the gourmet specialty coffee house experience home with dynamic one-touch custom brewing menus, integrated thermal grinders, and automated microfoam milk texturing.',
    price: 38990,
    category: 'Home & Living',
    rating: 4.8,
    reviewCount: 45,
    image: 'https://images.unsplash.com/photo-1517256064527-09c53b2d0ec6?w=500&auto=format&fit=crop&q=60',
    features: [
      'Built-in conical burr grinder with 30 precise grind settings',
      'Advanced ThermoJet system ready to brew in 3 seconds flat',
      'Intuitive touch screen swipe-to-select customizable menus',
      'Hands-free microfoam texturing wand for beautiful latte art'
    ],
    specs: {
      'Water Tank Capacity': '2.0 Liters',
      'Pressure System': '19 Bar Triple-Infused Pressure Italian Pump',
      'Body Material': 'Brushed Imperial Stainless Steel',
      'Power Rating': '1680 Watts performance'
    },
    stock: 12
  },
  {
    id: 'prod-10',
    name: 'Ergonomic Active Office Chair',
    description: 'Designed exclusively for engineers and content writers pulling long study rows. Provides total lumber support, premium breathable Korean mesh backings, and fully adjustable 3D armrests.',
    price: 12900,
    category: 'Home & Living',
    rating: 4.7,
    reviewCount: 82,
    image: 'https://images.unsplash.com/photo-1505797149-43b0069ec26b?w=500&auto=format&fit=crop&q=60',
    features: [
      'Adaptive weight-responsive dynamic lumbar tension tracking',
      'Ultra breathable reinforced structural Korean elastomer mesh',
      'Full 135-degree backrest reclining angle lock with adjustable headrests',
      'Silent heavy-duty nylon wheel casters rolling sleek on hardwood'
    ],
    specs: {
      'Frame Structural': 'Heavy aluminum die-cast base alloy',
      'Weight Capacity': 'Up to 150 kg durability',
      'Adjustability': 'Pneumatic Class-4 hydraulic height lift',
      'Armrest Action': '3D adjustable directional slides'
    },
    stock: 18
  },
  {
    id: 'prod-11',
    name: 'Summit Merino Wool Cardigan',
    description: 'Expertly knitted from high-altitude Australian Merino sheep wool. Remarkably soft weight, natural temperature regulations, and supreme moisture-wicking indices.',
    price: 3490,
    category: 'Clothing',
    rating: 4.6,
    reviewCount: 29,
    image: 'https://images.unsplash.com/photo-1534126511673-b6899657816a?w=500&auto=format&fit=crop&q=60',
    features: [
      '100% fine weave combed Australian Merino wool fibres',
      'Naturally antibacterial and crease-resistant characteristics',
      'Ribbed cuffs and hem detailing for active elegant profiles',
      'Premium dark tortoiseshell horn button secure closure'
    ],
    specs: {
      'Material Grade': 'Super 120s Premium Wool Grade',
      'Odor Resistance': 'Naturally resilient self-cleansed yarn',
      'Seasonality': 'Cozy all-season dynamic ventilation warmth',
      'Cleaning Index': 'Dry clean or gentle hand wash specs'
    },
    stock: 25
  },
  {
    id: 'prod-12',
    name: 'Apex Ultra Wireless Gaming Mouse',
    description: 'Lightning-fast competitive mouse with sub-millisecond wireless data transfer, sub-gram lightweight structural hull, and ultra-high DPI tracking accuracy.',
    price: 5890,
    category: 'Electronics',
    rating: 4.9,
    reviewCount: 156,
    image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500&auto=format&fit=crop&q=60',
    features: [
      'Ultraweight feather structural build at only 58 grams',
      'Advanced Optical Focus Pro 30K precision DPI gaming sensor',
      'Up to 90 hours of continuous playing fuel on full charge',
      'Dual wireless link with Hyperspeed plus standard Bluetooth'
    ],
    specs: {
      'Sensor Speed': '750 IPS maximum velocity',
      'Acceleration Max': '70G high stress limits',
      'Switch Lifecycle': '90 million mechanical clicks rating',
      'Onboard profiles': 'Save up to 5 custom key map configurations'
    },
    stock: 40
  }
];

export const COUPONS: Coupon[] = [
  { code: 'SHOPNEXUS20', discountPercentage: 20, description: 'Exclusive 20% flat-rate discount on premium products' },
  { code: 'SMARTDEAL15', discountPercentage: 15, description: 'Save 15% on tech items' },
  { code: 'WELCOME10', discountPercentage: 10, description: '10% New User Greeting coupon' },
];

export const PROJECT_DOCS = {
  synopsis: `Many standard commerce sites are basic and lack intelligent features that assist the customer in decision operations. This project, ShopNexus, solves this by presenting a full-stack e-commerce experience enhanced by an AI Shopping Assistant powered by Gemini API. Built securely using Node.js/Express as a backend server and React/Vite on the client-side, the platform also implements an Admin dashboard with complete feedback monitoring and CRUD models. This serves as an end-to-end design demonstration for Bachelor of Computer Applications (BCA) evaluation criteria.`,
  techHighlights: [
    { title: 'Frontend Stack', details: 'React 19, Vite, Tailwind CSS, Lucide icons, Motion' },
    { title: 'Backend Router', details: 'Express Node API, in-memory transactional database, body parsing' },
    { title: 'AI Automation', details: '@google/genai SDK Integration, server-side context proxying' },
    { title: 'Information Security', details: 'Environment variables masking on server side. No key leaks to public bundle' }
  ],
  schemas: [
    {
      tableName: 'Products',
      description: 'Stores item descriptive specs, category, live quantity markers, and pricing.',
      columns: [
        { name: 'id', type: 'VARCHAR(50)', desc: 'Primary Key - uniquely logs catalog resources' },
        { name: 'name', type: 'VARCHAR(255)', desc: 'Consumer visible display name' },
        { name: 'price', type: 'INTEGER', desc: 'Direct cost in localized currency INR' },
        { name: 'category', type: 'VARCHAR(100)', desc: 'Taxonomy grouping for fast filter lookups' },
        { name: 'stock', type: 'INTEGER', desc: 'Inventory counts tracking purchase bounds' }
      ]
    },
    {
      tableName: 'Orders',
      description: 'Captures critical checkout transactions, payment logs, and processing flags.',
      columns: [
        { name: 'id', type: 'VARCHAR(50)', desc: 'Primary Key - customer transaction receipt track ID' },
        { name: 'customerName', type: 'VARCHAR(255)', desc: 'Buyer registered name text' },
        { name: 'shippingAddress', type: 'TEXT', desc: 'Detailed physical parcel target routing string' },
        { name: 'totalAmount', type: 'INTEGER', desc: 'Net billing figure after coupon percentages' },
        { name: 'orderStatus', type: 'VARCHAR(50)', desc: 'Lifecycle states: Placed, Packed, Dispatched, Delivered' },
        { name: 'paymentStatus', type: 'VARCHAR(50)', desc: 'Verified status logs: Pending, Paid, Failed' }
      ]
    },
    {
      tableName: 'Reviews',
      description: 'Saves product quality testimonies matching customers to catalog ids.',
      columns: [
        { name: 'id', type: 'VARCHAR(50)', desc: 'Primary Key' },
        { name: 'productId', type: 'VARCHAR(50)', desc: 'Foreign Key referencing Products.id' },
        { name: 'userName', type: 'VARCHAR(100)', desc: 'Name of reviewer' },
        { name: 'rating', type: 'TINYINT', desc: 'Numeric scoring bounds (1 to 5 stars)' },
        { name: 'comment', type: 'TEXT', desc: 'User written review paragraph' }
      ]
    }
  ],
  dataFlow: [
    { step: 1, title: 'Client Browsing', desc: 'User browses products, appends quantities to reactive shopping cart in LocalStorage.' },
    { step: 2, title: 'AI Assistant Query', desc: 'User chats with ShopNexus AI. Client sends chat payload securely to Express api /api/assistant. Express invokes @google/genai.' },
    { step: 3, title: 'Checkout & Processing', desc: 'Buyer submits address, dynamic UPI simulator responds with QR code. Order details are stored in Server memory/LocalStorage.' },
    { step: 4, title: 'Admin Governance', desc: 'Store managers modify product specs (CRUD API checks) or dispatch orders through the state transition console.' }
  ]
};
