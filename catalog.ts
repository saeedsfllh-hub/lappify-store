export const SPEC_VERSION = 2;
export const WHATSAPP = '923255356510';

export type Variant = { ram: number; storage: number; price: number; inStock?: boolean };
export type Product = {
  id: string;
  brand: string;
  series: string;
  name: string;
  generation: number;
  cpu: string;
  display: string;
  graphics: string;
  ports: string;
  battery: string;
  keyboard: string;
  touchscreen: boolean;
  variants: Variant[];
  inStock: boolean;
  image?: string;
  images?: string[];
  category: string;
  specVersion?: number;
};
export type CartLine = { product: Product; variant: Variant; qty: number };

export const money = (n: number) => 'Rs. ' + Number(n || 0).toLocaleString('en-PK');

export const displayName = (p: Product) => {
  const name = p.name.trim();
  const model = name.toLowerCase().startsWith(p.brand.toLowerCase()) ? name : p.brand + ' ' + name;
  return model + ' ' + p.cpu;
};
export const minPrice = (p: Product) => {
  const list = p.variants.map(v => v.price).filter(x => x > 0);
  return list.length ? Math.min(...list) : 0;
};
export const storageType = (p: Product) => (p.category === 'Chromebooks' ? 'eMMC' : 'SSD');
export const variantLabel = (p: Product, v: Variant) => v.ram + ' GB RAM, ' + v.storage + ' GB ' + storageType(p);
const uniqueSorted = (nums: number[]) => Array.from(new Set(nums)).sort((a, b) => a - b);
export const ramOptions = (p: Product) => uniqueSorted(p.variants.map(v => v.ram)).join(', ') + ' GB';
export const storageOptions = (p: Product) =>
  uniqueSorted(p.variants.map(v => v.storage)).join(', ') + ' GB ' + storageType(p);
export const shortDisplay = (p: Product) => {
  const m = p.display.match(/^([\d.]+)-inch (Full HD|HD)/);
  return m ? m[1] + '" ' + m[2] : p.display;
};
export const specRows = (p: Product): [string, string][] => [
  ['Processor', p.cpu],
  ['Display', p.display],
  ['Graphics', p.graphics],
  ['Keyboard', p.keyboard],
  ['Ports', p.ports],
  ['Battery', p.battery],
  ['Condition', '10/10 Mint Condition, verified'],
  ['In the box', 'Laptop and original charger'],
];

const ordinal = (n: number) =>
  n +
  (n % 10 === 1 && n !== 11 ? 'st' : n % 10 === 2 && n !== 12 ? 'nd' : n % 10 === 3 && n !== 13 ? 'rd' : 'th');

type Row = {
  brand: string;
  series: string;
  category: string;
  name: string;
  gen: number;
  size: string;
  backlit: boolean;
  touch?: boolean;
  hd?: boolean;
};
type Item = [string, number, string?];
const group = (
  brand: string,
  series: string,
  category: string,
  size: string,
  backlit: boolean,
  items: Item[],
  extra: Partial<Row> = {}
): Row[] =>
  items.map(([name, gen, sz]) => ({ brand, series, category, name, gen, size: sz || size, backlit, ...extra }));

const touchChromebooks = [
  'Chromebook 3100 2-in-1',
  'Chromebook 3110 Touch',
  'Chromebook 300e 2nd Gen',
  'Chromebook 500e',
  'IdeaPad Flex 3 Chromebook',
  'Chromebook Spin 311',
];
const chromebooks = (brand: string, names: string[]): Row[] =>
  names.map(name => ({
    brand,
    series: 'Chromebook',
    category: 'Chromebooks',
    name,
    gen: 0,
    size: name === 'Chromebook 14 G5' ? '14' : '11.6',
    backlit: false,
    touch: touchChromebooks.includes(name),
  }));

const rows: Row[] = [
  ...group('Dell', 'Latitude 5000', 'Dell Laptops', '14', true, [
    ['Latitude 5410', 10],
    ['Latitude 5420', 11],
    ['Latitude 5430', 12],
    ['Latitude 5440', 13],
  ]),
  ...group('Dell', 'Latitude 7000', 'Dell Laptops', '14', true, [
    ['Latitude 7480', 7],
    ['Latitude 7490', 8],
    ['Latitude 7400', 8],
    ['Latitude 7410', 10],
    ['Latitude 7420', 11],
    ['Latitude 7430', 12],
    ['Latitude 7440', 13],
  ]),
  ...group('Dell', 'Latitude 3000', 'Dell Laptops', '14', false, [['Latitude 3410', 10], ['Latitude 3420', 11]], { hd: true }),
  ...group('Dell', 'Latitude 3000', 'Dell Laptops', '15.6', false, [['Latitude 3510', 10], ['Latitude 3520', 11]], { hd: true }),
  ...group('HP', 'EliteBook', 'HP Laptops', '14', true, [
    ['EliteBook 840 G3', 6],
    ['EliteBook 840 G4', 7],
    ['EliteBook 840 G5', 8],
    ['EliteBook 840 G6', 8],
    ['EliteBook 840 G7', 10],
    ['EliteBook 840 G8', 11],
    ['EliteBook 840 G9', 12],
  ]),
  ...group('HP', 'ProBook', 'HP Laptops', '14', false, [
    ['ProBook 440 G5', 8],
    ['ProBook 450 G5', 8, '15.6'],
    ['ProBook 440 G6', 8],
    ['ProBook 450 G6', 8, '15.6'],
    ['ProBook 440 G7', 10],
    ['ProBook 450 G7', 10, '15.6'],
    ['ProBook 440 G8', 11],
    ['ProBook 450 G8', 11, '15.6'],
    ['ProBook 440 G9', 12],
    ['ProBook 450 G9', 12, '15.6'],
  ]),
  ...group('Lenovo', 'ThinkPad T-Series', 'Lenovo ThinkPads', '14', true, [
    ['ThinkPad T440', 4],
    ['ThinkPad T440s', 4],
    ['ThinkPad T450', 5],
    ['ThinkPad T450s', 5],
    ['ThinkPad T460', 6],
    ['ThinkPad T460s', 6],
    ['ThinkPad T470', 7],
    ['ThinkPad T470s', 7],
    ['ThinkPad T480', 8],
    ['ThinkPad T480s', 8],
    ['ThinkPad T490', 8],
    ['ThinkPad T490s', 8],
    ['ThinkPad T14 Gen 1', 10],
    ['ThinkPad T14 Gen 2', 11],
    ['ThinkPad T14 Gen 3', 12],
    ['ThinkPad T14 Gen 4', 13],
    ['ThinkPad T14s Gen 4', 13],
    ['ThinkPad T14 Gen 7', 14],
    ['ThinkPad T14s Gen 7', 14],
  ]),
  ...group('Lenovo', 'ThinkPad X-Series', 'Lenovo ThinkPads', '12.5', true, [
    ['ThinkPad X240', 4],
    ['ThinkPad X250', 5],
    ['ThinkPad X260', 6],
    ['ThinkPad X270', 7],
    ['ThinkPad X280', 8],
    ['ThinkPad X390', 8, '13.3'],
    ['ThinkPad X1 Carbon Gen 6', 8, '14'],
    ['ThinkPad X1 Carbon Gen 7', 8, '14'],
    ['ThinkPad X1 Carbon Gen 8', 10, '14'],
    ['ThinkPad X1 Carbon Gen 9', 11, '14'],
    ['ThinkPad X1 Carbon Gen 10', 12, '14'],
  ]),
  ...chromebooks('Dell', ['Chromebook 11 3100', 'Chromebook 3100 2-in-1', 'Chromebook 3110 Standard', 'Chromebook 3110 Touch']),
  ...chromebooks('Lenovo', ['Chromebook 100e', 'Chromebook 300e 2nd Gen', 'Chromebook 500e', 'IdeaPad Flex 3 Chromebook']),
  ...chromebooks('HP', ['Chromebook 11 G6 EE', 'Chromebook 11 G8 EE', 'Chromebook 11A G8 EE', 'Chromebook 14 G5']),
  ...chromebooks('Acer', ['Chromebook 11 C732', 'Chromebook 11 C733', 'Chromebook 311', 'Chromebook Spin 311']),
];

const variantsFor = (r: Row): Variant[] =>
  r.category === 'Chromebooks'
    ? [{ ram: 4, storage: 32, price: 0 }]
    : r.gen <= 7
      ? [
          { ram: 4, storage: 128, price: 0 },
          { ram: 8, storage: 256, price: 0 },
        ]
      : [
          { ram: 8, storage: 256, price: 0 },
          { ram: 16, storage: 256, price: 0 },
          { ram: 16, storage: 512, price: 0 },
        ];

const build = (r: Row): Product => {
  const chrome = r.category === 'Chromebooks';
  const fullHd = !chrome && !r.hd && r.gen >= 8;
  const res = fullHd ? 'Full HD' : 'HD';
  const px = fullHd ? '1920 × 1080' : '1366 × 768';
  const chromeCpu = !chrome ? '' : /C732|11 G6 EE|14 G5/i.test(r.name) ? 'Intel Celeron Dual Core N3350' : /11A G8/i.test(r.name) ? 'AMD A4' : 'Intel Celeron Dual Core N4020';
  const graphics = chrome
    ? chromeCpu.includes('N3350') ? 'Intel HD Graphics 500' : chromeCpu.includes('AMD') ? 'AMD Radeon Graphics' : 'Intel UHD Graphics 600'
    : r.gen >= 11
      ? 'Intel Iris Xe Graphics'
      : r.gen >= 8
        ? 'Intel UHD Graphics 620'
        : 'Intel HD Graphics';
  return {
    id: (r.brand + '-' + r.name).toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    brand: r.brand,
    series: r.series,
    name: r.name,
    generation: chrome ? 0 : r.gen,
    cpu: chrome ? chromeCpu : 'Intel Core i5, ' + ordinal(r.gen) + ' Gen',
    display: r.size + '-inch ' + res + (r.touch ? ' touchscreen' : '') + ' (' + px + ')',
    graphics,
    ports: chrome
      ? 'USB-C, USB 3.0, headphone and mic jack'
      : r.gen >= 7
        ? 'USB-C, USB 3.0, HDMI, headphone and mic jack'
        : 'USB 3.0, HDMI, headphone and mic jack',
    battery: 'Battery health tested before dispatch',
    keyboard: r.backlit ? 'English backlit keyboard' : 'English keyboard without backlight',
    touchscreen: Boolean(r.touch),
    variants: variantsFor(r),
    inStock: true,
    category: r.category,
    specVersion: SPEC_VERSION,
  };
};

const priced: Record<string, { variants: Variant[]; images: string[] }> = {
  'dell-latitude-5410': {
    variants: [
      { ram: 8, storage: 256, price: 55000 },
      { ram: 16, storage: 256, price: 63000 },
    ],
    images: [
      'https://starcity.pk/wp-content/uploads/2023/01/Dell-Latitude-5410-1-247x247.jpg',
      'https://starcity.pk/wp-content/uploads/2023/01/Dell-Latitude-5410-2-247x247.jpg',
      'https://starcity.pk/wp-content/uploads/2023/01/Dell-Latitude-5410-3-247x247.jpg',
    ],
  },
  'dell-latitude-5420': {
    variants: [
      { ram: 8, storage: 256, price: 62000 },
      { ram: 16, storage: 256, price: 70000 },
      { ram: 8, storage: 512, price: 67000 },
      { ram: 16, storage: 512, price: 75000 },
    ],
    images: [
      'https://cdnassets.parts-people.com/images/products/thumb_Latitude-5420-refurbished-laptop.JPG',
      'https://cdnassets.parts-people.com/images/products/thumb_Latitude-5420-refurbished-laptop-2.JPG',
      'https://cdnassets.parts-people.com/images/products/thumb_Latitude-5420-refurbished-laptop-3.JPG',
    ],
  },
  'dell-latitude-5430': {
    variants: [
      { ram: 8, storage: 256, price: 68000 },
      { ram: 16, storage: 256, price: 76000 },
      { ram: 8, storage: 512, price: 73000 },
      { ram: 16, storage: 512, price: 81000 },
    ],
    images: [
      'https://cdn.cs.1worldsync.com/syndication/mediaserverredirect/cb93514b0511c16319cf8d367cc25fd6/original.png',
      'https://ecommerce-storage1.khmercatgroup.vip/ecommerce-storage/media/Dell-Latitude-5430-2.jpg',
      'https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/notebooks/latitude-notebooks/14-5430/pdp/laptop-latitude-14-5430-pdp-module-5.psd?align=0%2C0&fit=constrain%2C1&fmt=png-alpha&hei=781&op_usm=1.75%2C0.3%2C2%2C0&pscan=auto&qlt=90%2C0&resMode=sharp&wid=950',
    ],
  },
};

export const baseCatalog: Product[] = rows.map(build).map(p => {
  const o = priced[p.id];
  return o ? { ...p, variants: o.variants, images: o.images, image: o.images[0] } : p;
});

/**
 * Applies saved data (server or this browser) on top of the clean catalog.
 * Records saved before the spec cleanup keep only prices, stock status and photos;
 * records saved after it are used as they are.
 */
export const mergeSaved = (base: Product[], saved: any[]): Product[] => {
  const usable = (saved || []).filter(
    s => s && !s.hidden && s.id && s.name && Array.isArray(s.variants) && !/zbook/i.test(String(s.name) + String(s.series))
  );
  const byId = new Map<string, any>(usable.map(s => [String(s.id), s]));
  const merged = base.map(b => {
    const s = byId.get(b.id);
    if (!s) return b;
    if (s.specVersion === SPEC_VERSION) return s as Product;
    const images: string[] = Array.isArray(s.images) && s.images.length ? s.images : b.images || [];
    return {
      ...b,
      variants: s.variants.some((v: Variant) => v.price > 0) ? s.variants : b.variants,
      inStock: typeof s.inStock === 'boolean' ? s.inStock : b.inStock,
      images,
      image: images[0] || s.image || b.image,
    };
  });
  const baseIds = new Set(base.map(b => b.id));
  usable.forEach(s => {
    if (!baseIds.has(String(s.id))) merged.push(s as Product);
  });
  return merged;
};

export const cities = [
  'Lahore',
  'Karachi',
  'Islamabad',
  'Rawalpindi',
  'Faisalabad',
  'Multan',
  'Peshawar',
  'Quetta',
  'Gujranwala',
  'Sialkot',
  'Hyderabad',
  'Bahawalpur',
  'Sargodha',
  'Abbottabad',
  'Other',
];

export const defaultStoreSettings = {
  storeName: 'Lappify',
  tagline: 'Quality laptops. Trusted service.',
  announcement: '10% OFF on advance payment',
  whatsappNumber: '',
  supportPhone: '',
  supportEmail: '',
  aboutText: 'Your trusted destination for quality laptops in Pakistan.',
  shippingPolicy: 'Delivery times and charges are confirmed with the customer before dispatch.',
  returnPolicy: '7-day return policy for eligible items, subject to inspection.',
  paymentMethods: [
    { id: 'easypaisa', name: 'Easypaisa', enabled: true, details: 'Wallet transfer. Add your merchant or wallet account details here.' },
    { id: 'jazzcash', name: 'JazzCash', enabled: true, details: 'Wallet transfer. Add your merchant or wallet account details here.' },
    { id: 'bank', name: 'Bank Transfer (IBFT)', enabled: true, details: 'Add your bank name, account title and IBAN here.' },
    { id: 'raast', name: 'Raast / Raast QR', enabled: true, details: 'Add your Raast ID or QR payment instructions here.' },
    { id: 'cards', name: 'Debit / Credit Card (Visa, Mastercard, UnionPay)', enabled: true, details: 'Online card processing requires an activated Pakistani payment gateway and merchant credentials.' },
    { id: 'safepay', name: 'Safepay', enabled: false, details: 'Enable after connecting your Safepay merchant account.' },
    { id: 'payfast', name: 'PayFast', enabled: false, details: 'Enable after connecting your PayFast merchant account.' },
    { id: 'keenu', name: 'Keenu', enabled: false, details: 'Enable after connecting your Keenu merchant account.' },
    { id: 'nayapay', name: 'NayaPay', enabled: false, details: 'Wallet transfer. Add your merchant or wallet account details here.' },
    { id: 'sadapay', name: 'SadaPay', enabled: false, details: 'Bank or wallet transfer. Add your account details here.' },
    { id: 'upaisa', name: 'UPaisa', enabled: false, details: 'Wallet transfer. Add your merchant or wallet account details here.' },
  ],
};
