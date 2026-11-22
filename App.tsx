import { useEffect, useMemo, useState } from 'react';
const api = {
  get: async () => ({ data: null }),
  post: async () => ({ data: null }),
  put: async () => ({ data: null }),
  delete: async () => ({ data: null }),
};

const auth = {
  getUser: async () => null,
  login: async () => null,
  logout: async () => null,
  onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
};


import {
  CheckCircle2,
  ChevronDown,
  Laptop,
  LockKeyhole,
  LogOut,
  Menu,
  MessageCircle,
  Minus,
  PackageCheck,
  Percent,
  Plus,
  RotateCcw,
  Search,
  ShieldCheck,
  ShoppingCart,
  SlidersHorizontal,
  Truck,
  Trash2,
  Upload,
  User,
  X,
  ZoomIn,
} from 'lucide-react';
import type { CartLine, Product, Variant } from './catalog';
import {
  WHATSAPP,
  baseCatalog,
  cities,
  defaultStoreSettings,
  displayName,
  mergeSaved,
  minPrice,
  money,
  specRows,
  variantLabel,
} from './catalog';
import HeroSlider from './components/HeroSlider';
import ProductCard from './components/ProductCard';
import Pagination from './components/Pagination';
import { articles } from './articles';
import { BlogArticle, BlogList } from './pages/Blog';
import { AboutPage, ContactPage, DisclaimerPage, NotFoundPage, PrivacyPage, TermsPage } from './pages/Legal';
import { currentRoute, pageSeo, setSeo } from './seo';

const PAGE_SIZE = 20;
const navBtn = 'text-sm font-semibold text-white/90 hover:text-cyan-300 whitespace-nowrap';
const statuses = ['Order Confirmed', 'Packing Video Sent', 'Dispatched via Courier', 'Delivered'];
const ramLabels: [string, string][] = [
  ['All', 'All'],
  ['4/128', '4 GB RAM, 128 GB'],
  ['8/256', '8 GB RAM, 256 GB'],
  ['16/256', '16 GB RAM, 256 GB'],
  ['16/512', '16 GB RAM, 512 GB'],
  ['4/32', '4 GB RAM, 32 GB'],
];
const seriesList = ['All', 'Latitude 5000', 'Latitude 7000', 'Latitude 3000', 'EliteBook', 'ProBook', 'ThinkPad T-Series', 'ThinkPad X-Series', 'Chromebook'];
const genList = ['All', '4', '5', '6', '7', '8', '10', '11', '12', '13', '14'];
const brandList = ['All', 'Dell', 'HP', 'Lenovo', 'Acer'];

function App() {
  const [products, setProducts] = useState<Product[]>(baseCatalog);
  const [catalogDraft, setCatalogDraft] = useState(JSON.stringify(baseCatalog, null, 2));
  const [storeSettings, setStoreSettings] = useState<any>(defaultStoreSettings);
  const [settingsDraft, setSettingsDraft] = useState(JSON.stringify(defaultStoreSettings, null, 2));
  const [cart, setCart] = useState<CartLine[]>([]);
  const [active, setActive] = useState<Product | null>(null);
  const [variant, setVariant] = useState<Variant | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [search, setSearch] = useState('');
  const [brand, setBrand] = useState('All');
  const [series, setSeries] = useState('All');
  const [gen, setGen] = useState('All');
  const [ram, setRam] = useState('All');
  const [touch, setTouch] = useState('All');
  const [maxPrice, setMaxPrice] = useState('1000000');
  const [sort, setSort] = useState('featured');
  const [pageNo, setPageNo] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [page, setPageState] = useState<'shop' | 'track' | 'admin' | 'returns'>('shop');
  const [route, setRoute] = useState<string>(currentRoute());
  const setPage = (p: 'shop' | 'track' | 'admin' | 'returns') => {
    setPageState(p);
    if (currentRoute()) window.location.hash = '#/';
  };
  const [checkout, setCheckout] = useState(false);
  const [payment, setPayment] = useState('');
  const [notice, setNotice] = useState('');
  const [adminPass, setAdminPass] = useState('');
  const [adminOk, setAdminOk] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [trackId, setTrackId] = useState('');
  const [trackPhone, setTrackPhone] = useState('');
  const [tracked, setTracked] = useState<any>(null);
  const [returnReason, setReturnReason] = useState('');
  const [customer, setCustomer] = useState({ name: '', phone: '', city: 'Lahore', address: '', notes: '' });
  const [menu, setMenu] = useState(false);
  const [user, setUser] = useState<{ name?: string; email?: string } | null>(null);

  useEffect(() => {
    let alive = true;
    auth
      .getUser()
      .then(u => {
        if (alive && u) setUser({ name: u.name, email: u.email });
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (user?.name) setCustomer(c => (c.name ? c : { ...c, name: user.name || '' }));
  }, [user]);

  useEffect(() => {
    let alive = true;
    try {
      const saved = localStorage.getItem('lappify-products');
      if (saved) setProducts(mergeSaved(baseCatalog, JSON.parse(saved)));
      const c = localStorage.getItem('lappify-cart');
      if (c) setCart(JSON.parse(c));
    } catch {}
    (async () => {
      try {
        const r = await api.get('/api/products');
        const list = r.data?.products;
        if (alive && Array.isArray(list) && list.length) {
          const merged = mergeSaved(baseCatalog, list);
          setProducts(merged);
          setCatalogDraft(JSON.stringify(merged, null, 2));
        }
      } catch {}
      try {
        const s = await api.get('/api/settings');
        if (alive && s.data?.settings) {
          setStoreSettings(s.data.settings);
          setSettingsDraft(JSON.stringify(s.data.settings, null, 2));
        }
      } catch {}
    })();
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('lappify-cart', JSON.stringify(cart));
    } catch {}
  }, [cart]);

  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(() => setNotice(''), 6000);
    return () => clearTimeout(t);
  }, [notice]);

  useEffect(() => {
    setPageNo(1);
  }, [brand, series, gen, ram, touch, maxPrice, search, sort]);

  useEffect(() => {
    const onHash = () => {
      const next = currentRoute();
      setRoute(next);
      if (next) window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  useEffect(() => {
    if (route === '') {
      const s = pageSeo[page === 'shop' ? 'home' : page];
      setSeo(s.title, s.description, page === 'admin');
      return;
    }
    if (route.startsWith('blog/')) {
      const a = articles.find(x => x.slug === route.slice(5));
      if (a) {
        setSeo(a.seoTitle, a.description);
        return;
      }
      setSeo(pageSeo.notfound.title, pageSeo.notfound.description, true);
      return;
    }
    const s = pageSeo[route];
    if (s) setSeo(s.title, s.description);
    else setSeo(pageSeo.notfound.title, pageSeo.notfound.description, true);
  }, [route, page]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const max = Number(maxPrice) || Infinity;
    const list = products.filter(
      p =>
        (brand === 'All' || p.brand === brand) &&
        (series === 'All' || p.series === series) &&
        (gen === 'All' || String(p.generation) === gen) &&
        (ram === 'All' || p.variants.some(v => v.ram + '/' + v.storage === ram && v.inStock !== false && p.inStock !== false)) &&
        (touch === 'All' || String(p.touchscreen) === (touch === 'Yes' ? 'true' : 'false')) &&
        p.variants.some(v => v.price <= max) &&
        (displayName(p) + ' ' + p.series + ' ' + p.cpu).toLowerCase().includes(q)
    );
    if (sort === 'high' || sort === 'low') {
      const key = (p: Product) => {
        const m = minPrice(p);
        return m > 0 ? m : null;
      };
      list.sort((a, b) => {
        const x = key(a);
        const y = key(b);
        if (x === null && y === null) return 0;
        if (x === null) return 1;
        if (y === null) return -1;
        return sort === 'low' ? x - y : y - x;
      });
    }
    return list;
  }, [products, brand, series, gen, ram, touch, maxPrice, search, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(pageNo, totalPages);
  const startIdx = (safePage - 1) * PAGE_SIZE;
  const visible = filtered.slice(startIdx, startIdx + PAGE_SIZE);

  const heroProducts = useMemo(() => {
    const hasImg = (p: Product) => Boolean(p.image || p.images?.[0]);
    const picked = ['dell-latitude-5430', 'dell-latitude-5420', 'dell-latitude-5410']
      .map(id => products.find(p => p.id === id))
      .filter((p): p is Product => Boolean(p && hasImg(p)));
    if (picked.length >= 3) return picked;
    const extra = products.filter(p => hasImg(p) && !picked.includes(p));
    const all = [...picked, ...extra].slice(0, 3);
    return all.length ? all : products.slice(0, 3);
  }, [products]);

  const paymentMethods = (storeSettings.paymentMethods || defaultStoreSettings.paymentMethods).filter(
    (m: any) => m.enabled && m.id !== 'cod' && !/cash on delivery/i.test(m.name)
  );
  const selectedPayment = payment || paymentMethods[0]?.name || '';
  const total = cart.reduce((s, l) => s + l.variant.price * l.qty, 0);
  const cartCount = cart.reduce((s, x) => s + x.qty, 0);

  const scrollToCatalog = () =>
    setTimeout(() => document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' }), 60);
  const browse = (b: string, s: string) => {
    setPage('shop');
    setBrand(b);
    setSeries(s);
    setSearch('');
    setMenu(false);
    scrollToCatalog();
  };
  const goHome = () => {
    setPage('shop');
    setBrand('All');
    setSeries('All');
    setGen('All');
    setRam('All');
    setTouch('All');
    setMaxPrice('1000000');
    setSearch('');
    setSort('featured');
    setMenu(false);
    window.scrollTo(0, 0);
  };
  const goToPage = (n: number) => {
    setPageNo(n);
    scrollToCatalog();
  };
  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage('shop');
    scrollToCatalog();
  };
  const startAuth = async () => {
    try {
      await auth.signInWithRedirect();
    } catch {
      setNotice('Sign in could not open. Please allow browser storage and try again.');
    }
  };
  const signOut = async () => {
    try {
      await auth.signOut();
    } catch {}
    setUser(null);
    setNotice('You have been signed out.');
  };

  const add = (p: Product, v: Variant) => {
    setCart(old => {
      const found = old.find(
        x => x.product.id === p.id && x.variant.ram === v.ram && x.variant.storage === v.storage
      );
      return found
        ? old.map(x => (x === found ? { ...x, qty: x.qty + 1 } : x))
        : [...old, { product: p, variant: v, qty: 1 }];
    });
    setDrawer(true);
    setNotice('Added to your cart');
  };
  const qty = (id: string, r: number, s: number, n: number) =>
    setCart(old =>
      old
        .map(x =>
          x.product.id === id && x.variant.ram === r && x.variant.storage === s
            ? { ...x, qty: Math.max(0, x.qty + n) }
            : x
        )
        .filter(x => x.qty > 0)
    );
  const openProduct = (p: Product) => {
    setActive(p);
    setVariant(p.variants.find(v => v.price > 0 && v.inStock !== false && p.inStock !== false) || p.variants.find(v => v.inStock !== false && p.inStock !== false) || p.variants[0]);
    setActiveImageIndex(0);
    setZoomed(false);
  };

  const finishOrder = (saved: any, msg: string) => {
    setCart([]);
    setCheckout(false);
    setDrawer(false);
    setPage('track');
    setTracked(saved);
    setTrackId(saved.id);
    setTrackPhone(customer.phone);
    setNotice(msg + saved.id);
  };
  const submitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer.name || !customer.phone || !customer.address) {
      setNotice('Please complete all required delivery details.');
      return;
    }
    if (!selectedPayment) {
      setNotice('No payment method is available right now. Please contact us on WhatsApp.');
      return;
    }
    const payload = {
      customer,
      items: cart.map(x => ({
        name: displayName(x.product),
        variant: x.variant.ram + 'GB / ' + x.variant.storage + 'GB',
        qty: x.qty,
        price: x.variant.price,
      })),
      total,
      payment: selectedPayment,
      status: 'Order Confirmed',
      createdAt: new Date().toISOString(),
    };
    try {
      const res = await api.post('/api/orders', payload);
      finishOrder({ ...payload, id: res.data.id }, 'Order placed. Save your Order ID: ');
    } catch {
      const saved = { ...payload, id: 'LP-' + Math.random().toString(36).slice(2, 9).toUpperCase() };
      try {
        const all = JSON.parse(localStorage.getItem('lappify-orders') || '[]');
        localStorage.setItem('lappify-orders', JSON.stringify([saved, ...all]));
      } catch {}
      finishOrder(saved, 'Order saved in this browser. Save your Order ID: ');
    }
  };
  const track = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const r = await api.get('/api/orders/' + encodeURIComponent(trackId), { phone: trackPhone });
      setTracked(r.data.order || null);
    } catch {
      const all = JSON.parse(localStorage.getItem('lappify-orders') || '[]');
      setTracked(all.find((x: any) => x.id === trackId && x.customer.phone === trackPhone) || null);
    }
  };
  const requestReturn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/api/returns', { orderId: trackId, phone: trackPhone, reason: returnReason });
      setNotice('Return request submitted. Our team will contact you on WhatsApp.');
    } catch {
      setNotice('Return request could not be sent. Please contact WhatsApp support.');
    }
  };

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/api/admin/login', { password: adminPass });
      setAdminOk(true);
      const headers = { 'x-admin-password': adminPass };
      const [ordersResult, settingsResult] = await Promise.all([
        api.get('/api/admin/orders', { headers } as any),
        api.get('/api/admin/settings', { headers } as any),
      ]);
      setOrders(ordersResult.data.orders || []);
      try {
        const m = await api.get('/api/admin/messages', { headers } as any);
        setMessages(m.data.messages || []);
      } catch {}
      setCatalogDraft(JSON.stringify(products, null, 2));
      const savedSettings = settingsResult.data.settings || storeSettings;
      setStoreSettings(savedSettings);
      setSettingsDraft(JSON.stringify(savedSettings, null, 2));
      setNotice('Admin access granted. All store controls are available.');
    } catch {
      setNotice('Admin password was not accepted or backend is not configured.');
    }
  };
  const saveProducts = async (next: Product[]) => {
    setProducts(next);
    setCatalogDraft(JSON.stringify(next, null, 2));
    try {
      localStorage.setItem('lappify-products', JSON.stringify(next));
    } catch {}
    try {
      await api.put('/api/admin/products', { products: next }, { headers: { 'x-admin-password': adminPass } } as any);
      setNotice('Catalog saved and published to all visitors.');
    } catch {
      setNotice('Saved in this browser only. Could not publish to the server.');
    }
  };
  const removeProduct = async (id: string) => {
    const target = products.find(p => p.id === id);
    if (!target || !window.confirm('Delete ' + displayName(target) + ' from the public catalogue?')) return;
    const next = products.filter(p => p.id !== id);
    const tombstone = { ...target, hidden: true };
    setProducts(next);
    setCatalogDraft(JSON.stringify(next, null, 2));
    try {
      localStorage.setItem('lappify-products', JSON.stringify([...next, tombstone]));
    } catch {}
    try {
      await api.put('/api/admin/products', { products: [...next, tombstone] }, { headers: { 'x-admin-password': adminPass } } as any);
      setNotice(displayName(target) + ' deleted from the public catalogue.');
    } catch {
      setNotice('Deletion is saved in this browser, but could not be published to the server.');
    }
  };
  const saveCatalogJson = async () => {
    try {
      const parsed = JSON.parse(catalogDraft);
      if (!Array.isArray(parsed) || parsed.some((p: any) => !p.id || !p.name || !Array.isArray(p.variants)))
        throw new Error('Invalid catalog');
      await saveProducts(parsed.map((p: any) => ({ ...p, specVersion: 2 })));
    } catch {
      setNotice('Catalog JSON is invalid. Check the product fields, variants and JSON syntax.');
    }
  };
  const saveStoreSettings = async () => {
    try {
      const parsed = JSON.parse(settingsDraft);
      if (!Array.isArray(parsed.paymentMethods) || !parsed.storeName) throw new Error('Missing required settings');
      setStoreSettings(parsed);
      await api.put('/api/admin/settings', { settings: parsed }, { headers: { 'x-admin-password': adminPass } } as any);
      setNotice('Store content and payment settings saved for all visitors.');
    } catch {
      setNotice('Settings were not saved. Check the JSON syntax, required storeName and paymentMethods list.');
    }
  };
  const updateStatus = async (id: string, status: string) => {
    setOrders(orders.map(o => (o.id === id ? { ...o, status } : o)));
    try {
      await api.put('/api/admin/orders/' + encodeURIComponent(id), { status }, { headers: { 'x-admin-password': adminPass } } as any);
    } catch {}
  };
  const uploadPhoto = async (id: string, files?: FileList | null) => {
    if (!files?.length) return;
    const product = products.find(p => p.id === id);
    if (!product) return;
    setNotice('Uploading product photos...');
    try {
      const uploaded: string[] = [];
      for (const file of Array.from(files)) {
        if (!file.type.startsWith('image/')) continue;
        const dataUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(String(reader.result));
          reader.onerror = () => reject(new Error('Could not read image'));
          reader.readAsDataURL(file);
        });
        const result = await api.post(
          '/api/admin/photo',
          { path: id + '-' + Date.now() + '-' + uploaded.length, content: dataUrl.split(',')[1], contentType: file.type },
          { headers: { 'x-admin-password': adminPass } } as any
        );
        if (result.data?.url) uploaded.push(result.data.url);
      }
      if (!uploaded.length) throw new Error('No photos were uploaded');
      const next = products.map(p => {
        if (p.id !== id) return p;
        const images = [...(p.images || (p.image ? [p.image] : [])), ...uploaded];
        return { ...p, images, image: images[0] };
      });
      await saveProducts(next);
      setNotice(uploaded.length + ' photo(s) added to ' + displayName(product) + '.');
    } catch {
      setNotice('Photo upload failed. Please try again with JPG, PNG or WebP images.');
    }
  };
  const removePhoto = async (id: string, imageUrl: string) => {
    const next = products.map(p => {
      if (p.id !== id) return p;
      const images = (p.images || []).filter(src => src !== imageUrl);
      return { ...p, images, image: images[0] || '' };
    });
    await saveProducts(next);
  };

  let contentPage: React.ReactNode = null;
  if (route === 'blog') contentPage = <BlogList />;
  else if (route.startsWith('blog/')) {
    const art = articles.find(x => x.slug === route.slice(5));
    contentPage = art ? <BlogArticle article={art} products={products} onOpen={openProduct} onBrowse={browse} /> : <NotFoundPage />;
  } else if (route === 'about') contentPage = <AboutPage />;
  else if (route === 'contact') contentPage = <ContactPage settings={storeSettings} />;
  else if (route === 'privacy-policy') contentPage = <PrivacyPage />;
  else if (route === 'terms') contentPage = <TermsPage />;
  else if (route === 'disclaimer') contentPage = <DisclaimerPage />;
  else if (route !== '') contentPage = <NotFoundPage />;

  const filterSelects: [string, string, (v: string) => void, [string, string][]][] = [
    ['Brand', brand, setBrand, brandList.map(b => [b, b])],
    ['Series', series, setSeries, seriesList.map(b => [b, b])],
    ['Processor generation', gen, setGen, genList.map(g => [g, g === 'All' ? 'All' : g + 'th Gen'])],
    ['RAM and storage', ram, setRam, ramLabels],
  ];

  return (
    <div className='min-h-screen text-slate-800'>
      <div className='promo-strip text-white text-xs sm:text-sm py-2 px-4 text-center font-semibold tracking-wide'>
        <Percent size={14} className='inline -mt-0.5 mr-1' />
        10% OFF on advance payment
        <span className='mx-2 opacity-70'>•</span>
        <span className='hidden sm:inline'>Nationwide delivery all over Pakistan</span>
        <span className='sm:hidden'>Delivery across Pakistan</span>
      </div>
      <header className='sticky top-0 z-40 nav-surface text-white shadow-lg'>
        <div className='max-w-7xl mx-auto px-4 py-3 flex items-center gap-3 sm:gap-5'>
          <button className='md:hidden p-2' onClick={() => setMenu(!menu)} aria-label='Menu'>
            <Menu />
          </button>
          <button onClick={goHome} className='flex items-center gap-2 shrink-0'>
            <div className='w-10 h-10 rounded-xl btn-primary grid place-items-center font-black text-xl'>P</div>
            <span className='text-left hidden sm:block'>
              <b className='block text-lg leading-5 tracking-tight'>PrimeTech</b>
              <small className='text-cyan-300 font-semibold tracking-[.18em] text-[9px]'>PAKISTAN</small>
            </span>
          </button>
          <form onSubmit={submitSearch} className='flex-1 flex max-w-2xl mx-auto'>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder='What are you looking for?'
              aria-label='Search laptops'
              className='w-full min-w-0 bg-white text-slate-800 placeholder:text-slate-400 rounded-l-full pl-5 pr-3 py-3 text-sm outline-none'
            />
            <button type='submit' aria-label='Search' className='bg-cyan-400 hover:bg-cyan-300 text-slate-900 px-5 rounded-r-full'>
              <Search size={20} />
            </button>
          </form>
          <div className='flex items-center gap-2 sm:gap-3 shrink-0'>
            {user ? (
              <div className='flex items-center gap-2'>
                <span className='w-9 h-9 rounded-full btn-primary grid place-items-center font-bold'>
                  {(user.name || user.email || 'U').charAt(0).toUpperCase()}
                </span>
                <span className='hidden lg:block text-sm font-semibold max-w-[110px] truncate'>
                  {user.name || user.email}
                </span>
                <button onClick={signOut} aria-label='Sign out' title='Sign out' className='p-2 rounded-lg hover:bg-white/10'>
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <>
                <button onClick={startAuth} className='hidden sm:flex items-center gap-1.5 text-sm font-semibold px-3 py-2 rounded-lg hover:bg-white/10'>
                  <User size={17} /> Sign in
                </button>
                <button onClick={startAuth} className='btn-primary text-sm font-bold px-4 py-2 rounded-lg'>
                  Sign up
                </button>
              </>
            )}
            <button onClick={() => setDrawer(true)} aria-label='Open cart' className='relative p-2.5 rounded-xl hover:bg-white/10'>
              <ShoppingCart size={24} />
              {cartCount > 0 && (
                <span className='absolute -top-0.5 -right-0.5 bg-amber-400 text-slate-900 text-[10px] font-extrabold rounded-full w-5 h-5 grid place-items-center'>
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
        <nav className='nav-bar hidden md:block'>
          <div className='max-w-7xl mx-auto px-4 py-2.5 flex items-center gap-7'>
            <button onClick={goHome} className={navBtn}>Home</button>
            <button onClick={() => browse('Dell', 'All')} className={navBtn}>Dell Laptops</button>
            <button onClick={() => browse('HP', 'All')} className={navBtn}>HP Laptops</button>
            <button onClick={() => browse('Lenovo', 'All')} className={navBtn}>Lenovo ThinkPads</button>
            <button onClick={() => browse('All', 'Chromebook')} className={navBtn}>Chromebooks</button>
            <button onClick={() => setPage('track')} className={navBtn}>Track order</button>
            <button onClick={() => setPage('returns')} className={navBtn}>Returns</button>
            <a href='#/blog' className={navBtn}>Blog</a>
          </div>
        </nav>
        {menu && (
          <div className='md:hidden nav-bar px-5 py-4 flex flex-col gap-3 text-sm font-semibold'>
            <button className='text-left' onClick={goHome}>Home</button>
            <button className='text-left' onClick={() => browse('Dell', 'All')}>Dell Laptops</button>
            <button className='text-left' onClick={() => browse('HP', 'All')}>HP Laptops</button>
            <button className='text-left' onClick={() => browse('Lenovo', 'All')}>Lenovo ThinkPads</button>
            <button className='text-left' onClick={() => browse('All', 'Chromebook')}>Chromebooks</button>
            <button className='text-left' onClick={() => { setPage('track'); setMenu(false); }}>Track order</button>
            <a href='#/blog' className='text-left' onClick={() => setMenu(false)}>Blog</a>
            {!user && <button className='text-left' onClick={startAuth}>Sign in</button>}
          </div>
        )}
      </header>

      <main className='max-w-7xl mx-auto px-4'>
        {contentPage}
        {!contentPage && page === 'shop' && (
          <>
            <div className='pt-6'>
              <HeroSlider products={heroProducts} onOpen={openProduct} />
            </div>
            <section className='grid sm:grid-cols-3 gap-3 my-8'>
              {[
                [ShieldCheck, '10/10 Mint Condition, verified', 'Every listed unit is presented against our inspection standard.'],
                [Truck, 'Nationwide delivery', 'Delivery available across Pakistan.'],
                [RotateCcw, '7-day easy returns', 'Clear return and refund terms apply.'],
              ].map(([Icon, title, desc]: any) => (
                <div key={title} className='bg-white border border-slate-200 rounded-2xl p-5 flex gap-3'>
                  <div className='bg-cyan-50 text-cyan-600 rounded-xl p-3 h-fit'>
                    <Icon size={22} />
                  </div>
                  <div>
                    <b>{title}</b>
                    <p className='text-sm text-slate-500 mt-1'>{desc}</p>
                  </div>
                </div>
              ))}
            </section>

            <section id='catalog' className='pb-16 scroll-mt-40'>
              <div className='flex flex-wrap justify-between items-end gap-4 mb-5'>
                <div>
                  <p className='text-cyan-600 text-xs font-bold tracking-[.2em]'>FIND YOUR NEXT MACHINE</p>
                  <h2 className='text-3xl font-black text-slate-950 mt-1'>Shop refurbished laptops</h2>
                </div>
                <div className='flex gap-4 items-center'>
                  <button
                    onClick={() => setFiltersOpen(!filtersOpen)}
                    className='lg:hidden flex items-center gap-1.5 text-sm font-semibold text-indigo-600'
                  >
                    <SlidersHorizontal size={16} /> Filters
                  </button>
                  <button
                    onClick={() => {
                      setBrand('All'); setSeries('All'); setGen('All'); setRam('All');
                      setTouch('All'); setMaxPrice('1000000'); setSearch('');
                    }}
                    className='text-sm font-semibold text-indigo-600'
                  >
                    Clear filters
                  </button>
                </div>
              </div>
              <div className='flex flex-wrap items-center justify-between gap-3 pb-4 mb-5 border-b border-slate-200'>
                <span className='text-slate-400 text-sm'>
                  {filtered.length === 0
                    ? 'No items found'
                    : 'Items ' + (startIdx + 1) + '-' + (startIdx + visible.length) + ' of ' + filtered.length}
                </span>
                <label className='flex items-center gap-3 text-sm'>
                  <span className='text-slate-400'>Sort By</span>
                  <span className='relative inline-block border-b-2 border-cyan-400'>
                    <select
                      value={sort}
                      onChange={e => setSort(e.target.value)}
                      className='appearance-none bg-transparent pr-6 py-1 font-semibold text-slate-900 outline-none cursor-pointer'
                    >
                      <option value='featured'>Featured</option>
                      <option value='high'>Price: High to Low</option>
                      <option value='low'>Price: Low to High</option>
                    </select>
                    <ChevronDown size={16} className='pointer-events-none absolute right-0 top-1.5 text-cyan-500' />
                  </span>
                </label>
              </div>

              <div className='grid lg:grid-cols-[230px_1fr] gap-6'>
                <aside className={'bg-white border border-slate-200 rounded-2xl p-5 h-fit ' + (filtersOpen ? 'block' : 'hidden lg:block')}>
                  <div className='flex items-center gap-2 font-bold mb-4'>
                    <SlidersHorizontal size={17} /> Filters
                  </div>
                  {filterSelects.map(([label, val, set, opts]) => (
                    <label key={label} className='block mb-4'>
                      <span className='text-xs font-bold text-slate-600'>{label}</span>
                      <select
                        value={val}
                        onChange={e => set(e.target.value)}
                        className='mt-1.5 w-full border border-slate-200 rounded-lg p-2.5 text-sm bg-white'
                      >
                        {opts.map(([v, l]) => (
                          <option key={v} value={v}>{l}</option>
                        ))}
                      </select>
                    </label>
                  ))}
                  <label className='block mb-4'>
                    <span className='text-xs font-bold text-slate-600'>Touchscreen</span>
                    <select
                      value={touch}
                      onChange={e => setTouch(e.target.value)}
                      className='mt-1.5 w-full border border-slate-200 rounded-lg p-2.5 text-sm bg-white'
                    >
                      <option>All</option>
                      <option>Yes</option>
                      <option>No</option>
                    </select>
                  </label>
                  <label className='block'>
                    <span className='text-xs font-bold text-slate-600'>Maximum price (PKR)</span>
                    <input
                      type='number'
                      value={maxPrice}
                      onChange={e => setMaxPrice(e.target.value)}
                      className='mt-1.5 w-full border border-slate-200 rounded-lg p-2.5 text-sm'
                    />
                  </label>
                </aside>
                <div>
                  {visible.length === 0 ? (
                    <div className='bg-white border border-slate-200 rounded-2xl p-10 text-center text-slate-500'>
                      No laptops match your search. Try clearing the filters.
                    </div>
                  ) : (
                    <div className='grid sm:grid-cols-2 xl:grid-cols-3 gap-5'>
                      {visible.map(p => (
                        <ProductCard key={p.id} product={p} onOpen={openProduct} onAdd={add} />
                      ))}
                    </div>
                  )}
                  <Pagination page={safePage} pages={totalPages} onChange={goToPage} />
                </div>
              </div>
            </section>
          </>
        )}

        {!contentPage && page === 'track' && (
          <section className='max-w-3xl mx-auto py-12'>
            <h1 className='text-3xl font-black'>Track your order</h1>
            <p className='text-slate-500 mt-2'>Enter your Order ID and the phone number used at checkout.</p>
            <form onSubmit={track} className='bg-white border rounded-2xl p-6 mt-6 grid sm:grid-cols-2 gap-4'>
              <label className='text-sm font-semibold'>
                Order ID
                <input required value={trackId} onChange={e => setTrackId(e.target.value)} className='field mt-1' placeholder='e.g. LP-123ABC' />
              </label>
              <label className='text-sm font-semibold'>
                Phone or WhatsApp
                <input required value={trackPhone} onChange={e => setTrackPhone(e.target.value)} className='field mt-1' placeholder='03XX XXXXXXX' />
              </label>
              <button className='sm:col-span-2 btn-primary p-3 rounded-xl font-bold'>Track order</button>
            </form>
            {tracked && (
              <div className='bg-white border rounded-2xl p-6 mt-5'>
                <div className='flex justify-between'>
                  <div>
                    <small className='text-slate-500'>Order {tracked.id}</small>
                    <h3 className='font-bold text-xl'>{tracked.status}</h3>
                  </div>
                  <PackageCheck className='text-cyan-600' size={28} />
                </div>
                <div className='grid grid-cols-4 gap-2 mt-6'>
                  {statuses.map((s, i) => (
                    <div key={s} className='text-center'>
                      <div className={'h-2 rounded-full ' + (statuses.indexOf(tracked.status) >= i ? 'bg-cyan-500' : 'bg-slate-200')}></div>
                      <small className='block text-[10px] sm:text-xs mt-2 text-slate-500'>{s}</small>
                    </div>
                  ))}
                </div>
                <p className='text-sm text-slate-600 mt-5'>Packing video and photos will be shared on WhatsApp before dispatch.</p>
                <button onClick={() => setPage('returns')} className='mt-4 text-indigo-600 font-bold text-sm'>
                  Request a return or refund →
                </button>
              </div>
            )}
          </section>
        )}

        {!contentPage && page === 'returns' && (
          <section className='max-w-2xl mx-auto py-12'>
            <h1 className='text-3xl font-black'>Return and refund portal</h1>
            <p className='text-slate-500 mt-2'>
              Submit a request within 7 days of delivery. Keep the laptop, charger and packaging in their received condition.
            </p>
            <form onSubmit={requestReturn} className='bg-white border rounded-2xl p-6 mt-6 space-y-4'>
              <label className='block text-sm font-semibold'>
                Order ID
                <input required value={trackId} onChange={e => setTrackId(e.target.value)} className='field mt-1' />
              </label>
              <label className='block text-sm font-semibold'>
                Phone number
                <input required value={trackPhone} onChange={e => setTrackPhone(e.target.value)} className='field mt-1' />
              </label>
              <label className='block text-sm font-semibold'>
                Reason for return
                <textarea required value={returnReason} onChange={e => setReturnReason(e.target.value)} className='field mt-1' rows={4} />
              </label>
              <button className='btn-primary px-6 py-3 rounded-xl font-bold'>Submit return request</button>
            </form>
            <div className='bg-cyan-50 rounded-2xl p-5 mt-5 text-sm text-slate-700'>
              <b>7-day policy summary</b>
              <p className='mt-1'>
                Notify us within 7 calendar days after delivery. The device must be returned with its supplied charger and
                accessories. Damage, liquid exposure, tampering or missing parts after delivery may affect eligibility.
                Refunds are processed after inspection using the agreed payment method. Contact us first for a return
                authorization. Any applicable courier charges are confirmed before return shipment.
              </p>
            </div>
          </section>
        )}

        {!contentPage && page === 'admin' && (
          <section className='py-10'>
            <div className='max-w-5xl mx-auto'>
              {!adminOk ? (
                <div className='max-w-md mx-auto bg-white border rounded-2xl p-7'>
                  <div className='bg-slate-100 w-12 h-12 rounded-xl grid place-items-center'>
                    <LockKeyhole />
                  </div>
                  <h1 className='text-2xl font-black mt-4'>Store administration</h1>
                  <p className='text-sm text-slate-500 mt-1'>Sign in with your private admin password.</p>
                  <form onSubmit={login} className='mt-5'>
                    <input type='password' required value={adminPass} onChange={e => setAdminPass(e.target.value)} placeholder='Admin password' className='field' />
                    <button className='w-full mt-3 btn-primary p-3 rounded-xl font-bold'>Unlock dashboard</button>
                  </form>
                </div>
              ) : (
                <>
                  <div className='flex flex-wrap justify-between gap-3 items-center'>
                    <div>
                      <p className='text-cyan-600 text-xs font-bold tracking-widest'>STORE CONTROL CENTER</p>
                      <h1 className='text-3xl font-black'>Admin dashboard</h1>
                    </div>
                    <button onClick={() => { setAdminOk(false); setAdminPass(''); }} className='border rounded-lg px-4 py-2 text-sm'>
                      Sign out
                    </button>
                  </div>
                  <div className='grid md:grid-cols-3 gap-4 mt-6'>
                    <div className='adminstat'><small>Catalog models</small><b>{products.length}</b></div>
                    <div className='adminstat'><small>Orders loaded</small><b>{orders.length}</b></div>
                    <div className='adminstat'><small>Currency</small><b>PKR</b></div>
                  </div>
                  <div className='bg-white border rounded-2xl p-5 mt-6'>
                    <h2 className='font-extrabold text-xl'>Product, variant price and stock manager</h2>
                    <p className='text-sm text-slate-500 mt-1'>Set prices and stock independently for each RAM/storage option. Mark only the unavailable variant as Out of Stock; other variants stay available. Changes are published to all visitors.</p>
                    <div className='overflow-x-auto mt-4'>
                      <table className='w-full text-sm'>
                        <thead>
                          <tr className='text-left border-b'>
                            <th className='py-3'>Model</th>
                            <th>Variant</th>
                            <th>Price (Rs.)</th>
                            <th>Stock</th>
                            <th>Photo</th>
                          </tr>
                        </thead>
                        <tbody>
                          {products.flatMap(p =>
                            p.variants.map((v, vi) => (
                              <tr key={p.id + '-' + vi} className='border-b'>
                                <td className='py-3 font-semibold'>
                                  <div>{displayName(p)}</div>
                                  {vi === 0 && <button type='button' onClick={() => removeProduct(p.id)} className='mt-2 inline-flex items-center gap-1 text-xs font-bold text-rose-600 hover:text-rose-800'><Trash2 size={13} /> Delete laptop</button>}
                                </td>
                                <td>{v.ram}/{v.storage}GB</td>
                                <td>
                                  <input
                                    type='number'
                                    min='0'
                                    value={v.price}
                                    onChange={e =>
                                      setProducts(
                                        products.map(x =>
                                          x.id === p.id
                                            ? { ...x, variants: x.variants.map((y, yi) => (yi === vi ? { ...y, price: Number(e.target.value) } : y)) }
                                            : x
                                        )
                                      )
                                    }
                                    className='w-28 border rounded-lg p-2'
                                  />
                                </td>
                                <td>
                                  <button
                                    onClick={() => saveProducts(products.map(x => x.id === p.id ? { ...x, variants: x.variants.map((y, yi) => yi === vi ? { ...y, inStock: y.inStock === false } : y) } : x))}
                                    className={'text-xs font-bold px-2 py-1 rounded ' + (v.inStock === false ? 'bg-rose-50 text-rose-700' : 'bg-emerald-50 text-emerald-700')}
                                  >
                                    {v.inStock === false ? 'Out of Stock' : 'In Stock'}
                                  </button>
                                </td>
                                <td>
                                  {vi === 0 && (
                                    <div className='min-w-36'>
                                      <label className='inline-flex items-center gap-1 cursor-pointer text-indigo-600 text-xs font-bold'>
                                        <Upload size={16} /> Add photos
                                        <input
                                          type='file'
                                          accept='image/*'
                                          multiple
                                          className='hidden'
                                          onChange={e => {
                                            uploadPhoto(p.id, e.target.files);
                                            e.currentTarget.value = '';
                                          }}
                                        />
                                      </label>
                                      <div className='text-[11px] text-slate-500 mt-1'>{(p.images || (p.image ? [p.image] : [])).length} photo(s)</div>
                                      <div className='flex flex-wrap gap-1 mt-2 max-w-40'>
                                        {(p.images || (p.image ? [p.image] : [])).map((src, index) => (
                                          <div key={src + index} className='relative'>
                                            <img src={src} alt={displayName(p) + ' photo ' + (index + 1)} className='w-10 h-10 object-cover rounded border' />
                                            <button
                                              type='button'
                                              title='Remove photo'
                                              onClick={() => removePhoto(p.id, src)}
                                              className='absolute -top-1 -right-1 bg-rose-600 text-white rounded-full w-4 h-4 text-[10px] leading-4'
                                            >
                                              ×
                                            </button>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                    <button onClick={() => saveProducts(products)} className='mt-4 btn-primary rounded-xl px-5 py-2.5 font-bold'>
                      Save all catalog changes
                    </button>
                  </div>
                  <div className='bg-white border rounded-2xl p-5 mt-6'>
                    <h2 className='font-extrabold text-xl'>Full laptop data editor</h2>
                    <p className='text-sm text-slate-500 mt-1'>
                      Edit every product field (processor, display, graphics, keyboard, ports), add new laptops, or remove models.
                      Keep each id unique and preserve the variants list.
                    </p>
                    <textarea value={catalogDraft} onChange={e => setCatalogDraft(e.target.value)} rows={18} spellCheck={false} className='field mt-3 font-mono text-xs' />
                    <button onClick={saveCatalogJson} className='mt-3 btn-primary rounded-xl px-5 py-2.5 font-bold'>Save complete laptop catalog</button>
                  </div>
                  <div className='bg-white border rounded-2xl p-5 mt-6'>
                    <h2 className='font-extrabold text-xl'>Website content and payment settings</h2>
                    <p className='text-sm text-slate-500 mt-1'>Edit store details, policies and every payment option. Set enabled to true or false for each method.</p>
                    <textarea value={settingsDraft} onChange={e => setSettingsDraft(e.target.value)} rows={22} spellCheck={false} className='field mt-3 font-mono text-xs' />
                    <button onClick={saveStoreSettings} className='mt-3 btn-primary rounded-xl px-5 py-2.5 font-bold'>Save website and payment settings</button>
                    <p className='text-xs text-amber-700 mt-3'>
                      Card payments are shown as a choice, but online charging is not active until you connect an approved gateway account. Never paste secret API keys into this editor.
                    </p>
                  </div>
                  <div className='bg-white border rounded-2xl p-5 mt-6'>
                    <h2 className='font-extrabold text-xl'>Contact form messages</h2>
                    {messages.length === 0 ? (
                      <p className='text-slate-500 text-sm mt-3'>No messages yet.</p>
                    ) : (
                      messages
                        .slice()
                        .sort((a: any, b: any) => String(b.createdAt).localeCompare(String(a.createdAt)))
                        .map((m: any) => (
                          <div key={m.id} className='border-b py-4 text-sm'>
                            <b>{m.subject}</b>
                            <p className='text-xs text-slate-500'>{m.name} · <a className='text-indigo-600' href={'mailto:' + m.email}>{m.email}</a> · {String(m.createdAt || '').slice(0, 10)}</p>
                            <p className='mt-2 whitespace-pre-wrap'>{m.message}</p>
                          </div>
                        ))
                    )}
                  </div>
                  <div className='bg-white border rounded-2xl p-5 mt-6'>
                    <h2 className='font-extrabold text-xl'>Incoming orders</h2>
                    {orders.length === 0 ? (
                      <p className='text-slate-500 text-sm mt-3'>No orders yet.</p>
                    ) : (
                      orders.map(o => (
                        <div key={o.id} className='border-b py-4 flex flex-wrap justify-between gap-3'>
                          <div>
                            <b>{o.id} · {o.customer?.name}</b>
                            <p className='text-xs text-slate-500'>{o.customer?.phone} · {money(o.total)} · {o.payment}</p>
                          </div>
                          <select value={o.status} onChange={e => updateStatus(o.id, e.target.value)} className='border rounded-lg p-2 text-sm'>
                            {[...statuses, 'Return Requested', 'Refunded'].map(s => (
                              <option key={s}>{s}</option>
                            ))}
                          </select>
                        </div>
                      ))
                    )}
                  </div>
                </>
              )}
            </div>
          </section>
        )}
      </main>

      <footer className='nav-surface text-white mt-10'>
        <div className='max-w-7xl mx-auto px-4 py-10 grid md:grid-cols-4 gap-8'>
          <div>
            <b className='text-xl'>PrimeTech Pakistan</b>
            <p className='text-sm text-slate-300 mt-2'>Quality-checked refurbished laptops and Chromebooks, delivered nationwide.</p>
          </div>
          <div>
            <b>Customer care</b>
            <button onClick={() => setPage('track')} className='block text-sm text-slate-300 mt-3'>Track order</button>
            <button onClick={() => setPage('returns')} className='block text-sm text-slate-300 mt-2'>Returns and refunds</button>
          </div>
          <div>
            <b>Our promise</b>
            <p className='text-sm text-slate-300 mt-3'>10/10 Mint Condition, verified</p>
            <p className='text-sm text-slate-300 mt-2'>Packing video and photos via WhatsApp before dispatch</p>
          </div>
          <div>
            <b>Delivery and payment</b>
            <p className='text-sm text-slate-300 mt-3'>Nationwide delivery all over Pakistan</p>
            <p className='text-sm text-cyan-300 font-semibold mt-2'>10% OFF on advance payment</p>
          </div>
        </div>
        <nav aria-label='Footer' className='border-t border-white/10 px-4 py-5'>
          <div className='max-w-7xl mx-auto flex flex-wrap justify-center gap-x-6 gap-y-3 text-sm text-slate-300'>
            <a href='#/blog' className='py-1 hover:text-cyan-300'>Blog &amp; Buying Guides</a>
            <a href='#/about' className='py-1 hover:text-cyan-300'>About Us</a>
            <a href='#/contact' className='py-1 hover:text-cyan-300'>Contact Us</a>
            <a href='#/privacy-policy' className='py-1 hover:text-cyan-300'>Privacy Policy</a>
            <a href='#/terms' className='py-1 hover:text-cyan-300'>Terms &amp; Conditions</a>
            <a href='#/disclaimer' className='py-1 hover:text-cyan-300'>Affiliate &amp; Editorial Disclaimer</a>
          </div>
        </nav>
        <div className='border-t border-white/10 py-4 text-center text-xs text-slate-400'>© 2026 PrimeTech Pakistan · Powered by Lappify</div>
      </footer>

      <a
        href={'https://wa.me/' + WHATSAPP + '?text=Hello%20PrimeTech%20Pakistan%2C%20I%20need%20help%20choosing%20a%20laptop.'}
        target='_blank'
        rel='noreferrer'
        aria-label='Chat on WhatsApp'
        className='fixed bottom-5 right-5 z-40 bg-emerald-500 text-white rounded-full p-4 shadow-xl'
      >
        <MessageCircle />
      </a>

      {drawer && (
        <div className='fixed inset-0 z-50'>
          <div className='absolute inset-0 bg-slate-950/50' onClick={() => setDrawer(false)}></div>
          <aside className='absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl p-5 overflow-y-auto'>
            <div className='flex justify-between items-center'>
              <h2 className='text-xl font-black'>Your shopping cart</h2>
              <button onClick={() => setDrawer(false)} aria-label='Close cart'><X /></button>
            </div>
            {cart.length === 0 ? (
              <p className='text-slate-500 mt-10 text-center'>Your cart is empty.</p>
            ) : (
              <>
                {cart.map(x => (
                  <div key={x.product.id + x.variant.ram + '-' + x.variant.storage} className='border-b py-4 flex gap-3'>
                    <div className='bg-slate-100 rounded-xl w-16 h-16 overflow-hidden grid place-items-center shrink-0'>
                      {x.product.image || x.product.images?.[0] ? (
                        <img src={x.product.image || x.product.images?.[0]} alt='' className='w-full h-full object-contain' />
                      ) : (
                        <Laptop />
                      )}
                    </div>
                    <div className='flex-1'>
                      <b>{displayName(x.product)}</b>
                      <small className='block text-slate-500'>{variantLabel(x.product, x.variant)}</small>
                      <b>{money(x.variant.price)}</b>
                      <div className='flex gap-3 items-center mt-2'>
                        <button onClick={() => qty(x.product.id, x.variant.ram, x.variant.storage, -1)} aria-label='Decrease quantity'><Minus size={15} /></button>
                        {x.qty}
                        <button onClick={() => qty(x.product.id, x.variant.ram, x.variant.storage, 1)} aria-label='Increase quantity'><Plus size={15} /></button>
                      </div>
                    </div>
                  </div>
                ))}
                <div className='flex justify-between font-black text-xl py-5'>
                  <span>Total</span>
                  <span>{money(total)}</span>
                </div>
                <div className='promo-strip text-white p-3 rounded-xl text-sm font-semibold mb-3'>
                  10% OFF on advance payment
                </div>
                <div className='bg-cyan-50 p-3 rounded-xl text-sm text-slate-700 mb-4'>
                  Live packing video and photos are sent via WhatsApp before dispatch.
                </div>
                <button onClick={() => setCheckout(true)} className='w-full btn-primary p-3 rounded-xl font-bold'>
                  Proceed to checkout
                </button>
              </>
            )}
            {checkout && cart.length > 0 && (
              <form onSubmit={submitOrder} className='mt-6 border-t pt-5 space-y-3'>
                <h3 className='font-black text-lg'>Delivery details</h3>
                <input required placeholder='Full name' value={customer.name} onChange={e => setCustomer({ ...customer, name: e.target.value })} className='field' />
                <input required placeholder='Active WhatsApp number' value={customer.phone} onChange={e => setCustomer({ ...customer, phone: e.target.value })} className='field' />
                <select value={customer.city} onChange={e => setCustomer({ ...customer, city: e.target.value })} className='field'>
                  {cities.map(c => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
                <textarea required placeholder='Full delivery address' value={customer.address} onChange={e => setCustomer({ ...customer, address: e.target.value })} className='field' />
                <textarea placeholder='Order notes (optional)' value={customer.notes} onChange={e => setCustomer({ ...customer, notes: e.target.value })} className='field' />
                <h3 className='font-black'>Payment method</h3>
                <p className='text-xs font-bold text-indigo-600'>Pay in advance and get 10% OFF</p>
                {paymentMethods.map((method: any) => (
                  <label key={method.id} className='flex items-start gap-2 text-sm border rounded-xl p-3'>
                    <input type='radio' name='pay' checked={selectedPayment === method.name} onChange={() => setPayment(method.name)} />
                    <span className='min-w-0'>
                      <b>{method.name}</b>
                      <small className='block text-slate-500'>{method.details}</small>
                    </span>
                  </label>
                ))}
                <div className='text-xs text-slate-500'>Checkout confirmation will be followed by WhatsApp contact for packing verification.</div>
                <button className='w-full btn-primary p-3 rounded-xl font-bold'>Place order · {money(total)}</button>
              </form>
            )}
          </aside>
        </div>
      )}

      {zoomed && active && (
        <div className='fixed inset-0 z-[80] bg-slate-950/95 p-4 flex items-center justify-center' onClick={() => setZoomed(false)}>
          <button type='button' onClick={() => setZoomed(false)} className='absolute top-5 right-5 text-white bg-white/15 rounded-full p-3' aria-label='Close image zoom'><X /></button>
          <img src={active.images?.[activeImageIndex] || active.image} alt={displayName(active) + ' enlarged view'} className='max-w-full max-h-full object-contain cursor-zoom-out' />
          <p className='absolute bottom-5 text-white/80 text-sm'>Click anywhere to close</p>
        </div>
      )}

      {active && (
        <div className='fixed inset-0 z-50 bg-slate-950/60 p-3 sm:p-6 overflow-y-auto'>
          <div className='bg-white max-w-4xl mx-auto rounded-3xl overflow-hidden my-5'>
            <div className='flex justify-between items-center p-5 border-b'>
              <div>
                <small className='text-emerald-600 font-bold'>10/10 MINT CONDITION, VERIFIED</small>
                <h2 className='text-2xl font-black'>{displayName(active)}</h2>
              </div>
              <button onClick={() => setActive(null)} aria-label='Close details'><X /></button>
            </div>
            <div className='grid md:grid-cols-2'>
              <div className='bg-slate-100 p-3'>
                {active.images && active.images.length > 0 ? (
                  <>
                    <button type='button' onClick={() => setZoomed(true)} className='relative w-full h-72 rounded-xl bg-white overflow-hidden' aria-label='Zoom product image'>
                      <img src={active.images[activeImageIndex] || active.image} className='absolute inset-0 w-full h-full object-contain p-2' alt={displayName(active) + ' product view'} />
                      <span className='absolute bottom-3 right-3 bg-white/95 text-slate-800 rounded-full p-2 shadow'><ZoomIn size={20} /></span>
                    </button>
                    <div className='grid grid-cols-3 gap-2 mt-3'>
                      {active.images.slice(0, 3).map((src, index) => (
                        <button type='button' key={src + index} onClick={() => setActiveImageIndex(index)} className={'relative h-24 rounded-lg bg-white border-2 overflow-hidden ' + (activeImageIndex === index ? 'border-cyan-500' : 'border-slate-200')}>
                          <img src={src} alt={displayName(active) + ' view ' + (index + 1)} className='absolute inset-0 w-full h-full object-contain' />
                        </button>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className='min-h-64 grid place-items-center'><Laptop size={120} className='text-slate-400' /></div>
                )}
              </div>
              <div className='p-6'>
                <h3 className='font-black text-3xl'>{variant && variant.price > 0 ? money(variant.price) : 'Price on request'}</h3>
                <p className='text-xs font-bold text-indigo-600 mt-1'>10% OFF on advance payment</p>
                <p className='text-xs text-slate-500 mt-3'>Select your RAM and storage</p>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2'>
                  {active.variants.map((v, i) => (
                    <button
                      key={i}
                      disabled={v.inStock === false || active.inStock === false}
                      onClick={() => setVariant(v)}
                      className={'p-3 border rounded-xl text-sm font-bold text-left ' + (v.inStock === false || active.inStock === false ? 'border-rose-200 bg-rose-50 text-rose-600 cursor-not-allowed' : variant === v ? 'border-cyan-500 bg-cyan-50 text-slate-900' : 'border-slate-200')}
                    >
                      {variantLabel(active, v)}{v.inStock === false || active.inStock === false ? ' · OUT OF STOCK' : ''}
                    </button>
                  ))}
                </div>
                {variant && variant.price > 0 ? (
                  <button
                    disabled={!active.inStock || variant.inStock === false}
                    onClick={() => {
                      add(active, variant);
                      setActive(null);
                    }}
                    className='w-full btn-primary p-3 rounded-xl font-bold mt-4'
                  >
                    {active.inStock && variant.inStock !== false ? 'Add to cart' : 'Out of stock'}
                  </button>
                ) : (
                  <a
                    href={'https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent('Hello, please share the price of ' + displayName(active))}
                    target='_blank'
                    rel='noreferrer'
                    className='block text-center w-full btn-primary p-3 rounded-xl font-bold mt-4'
                  >
                    Ask for price on WhatsApp
                  </a>
                )}
                <div className='mt-5 bg-cyan-50 p-3 rounded-xl text-sm text-slate-700'>
                  <b>Live packing video and photos</b> will be sent via WhatsApp before dispatch.
                </div>
              </div>
            </div>
            <div className='p-6 border-t'>
              <h3 className='font-black text-lg'>Specifications</h3>
              <div className='grid sm:grid-cols-2 gap-3 mt-3 text-sm'>
                {specRows(active).map(([k, v]) => (
                  <div key={k} className='bg-slate-50 p-3 rounded-xl'>
                    <small className='text-slate-500'>{k}</small>
                    <p className='font-semibold mt-1'>{v}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {notice && (
        <div className='fixed bottom-5 left-5 z-[70] bg-slate-900 text-white rounded-xl px-4 py-3 shadow-xl text-sm flex items-center gap-2 max-w-[80vw]'>
          <CheckCircle2 size={17} className='text-cyan-300 shrink-0' />
          {notice}
          <button onClick={() => setNotice('')} className='ml-2' aria-label='Dismiss'><X size={15} /></button>
        </div>
      )}
      <button
        onClick={() => setPage('admin')}
        className='fixed bottom-5 left-5 z-30 bg-white border border-slate-200 shadow rounded-full px-3 py-2 text-[10px] text-slate-400 hover:text-slate-800'
        style={{ display: notice ? 'none' : 'block' }}
      >
        Admin
      </button>
    </div>
  );
}
export default App;
