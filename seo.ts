const upsertMeta = (attr: 'name' | 'property', key: string, content: string) => {
  let el = document.head.querySelector('meta[' + attr + '="' + key + '"]') as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
};

export const setSeo = (title: string, description: string, noindex = false) => {
  document.title = title;
  upsertMeta('name', 'description', description);
  upsertMeta('property', 'og:title', title);
  upsertMeta('property', 'og:description', description);
  upsertMeta('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow');
};

export const currentRoute = (): string => {
  const h = window.location.hash || '';
  if (!h.startsWith('#/')) return '';
  return h.slice(2).split('?')[0].replace(/\/+$/, '');
};

export const pageSeo: Record<string, { title: string; description: string }> = {
  home: {
    title: 'Lappify | PrimeTech Pakistan - Refurbished Laptops and Chromebooks',
    description:
      'Shop quality-checked refurbished Dell Latitude, HP EliteBook and Lenovo ThinkPad laptops and Chromebooks with nationwide delivery across Pakistan.',
  },
  track: {
    title: 'Track Your Order | PrimeTech Pakistan',
    description: 'Track your PrimeTech Pakistan laptop order using your Order ID and the phone number used at checkout.',
  },
  returns: {
    title: 'Returns and Refunds | PrimeTech Pakistan',
    description: 'Read our 7-day return policy and submit a return or refund request for your PrimeTech Pakistan order.',
  },
  admin: {
    title: 'Store Administration | PrimeTech Pakistan',
    description: 'Private administration area for PrimeTech Pakistan.',
  },
  blog: {
    title: 'Laptop Buying Guides and Blog | PrimeTech Pakistan',
    description:
      'Independent laptop buying guides for Pakistan: student laptops, Core i5 vs i7, used laptop checks, SSD and RAM advice, business laptops and battery care.',
  },
  about: {
    title: 'About Us | PrimeTech Pakistan',
    description:
      'Learn who PrimeTech Pakistan (Lappify) is, our mission to help buyers find reliable laptops in Pakistan and the quality standards we follow.',
  },
  contact: {
    title: 'Contact Us | PrimeTech Pakistan',
    description:
      'Contact PrimeTech Pakistan by form, phone or WhatsApp for help choosing a laptop, order support or business enquiries.',
  },
  'privacy-policy': {
    title: 'Privacy Policy | PrimeTech Pakistan',
    description:
      'How PrimeTech Pakistan collects and uses data, including Google Analytics, cookies and Google AdSense advertising, and how to opt out of personalized ads.',
  },
  terms: {
    title: 'Terms and Conditions | PrimeTech Pakistan',
    description:
      'Terms of use for the PrimeTech Pakistan website, including ordering, pricing and availability, returns and intellectual property.',
  },
  disclaimer: {
    title: 'Affiliate and Editorial Disclaimer | PrimeTech Pakistan',
    description:
      'Our buying guides are independent and informational. Read how we handle advertising, commercial interests and accuracy at PrimeTech Pakistan.',
  },
  notfound: {
    title: 'Page Not Found | PrimeTech Pakistan',
    description: 'The page you are looking for could not be found. Browse our laptops or read our buying guides.',
  },
};
