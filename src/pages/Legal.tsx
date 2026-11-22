import { Children, cloneElement, isValidElement, useState } from 'react';
import type { FormEvent, ReactNode } from 'react';
const api: any = {
  get: async () => ({ data: null }),
  post: async () => ({ data: null }),
  put: async () => ({ data: null }),
  delete: async () => ({ data: null }),
};

import '../blog.css';
import { WHATSAPP } from '../catalog';

const UPDATED = '17 November 2026';

const bold = (node: ReactNode): ReactNode =>
  Children.map(node, child => {
    if (typeof child === 'string')
      return child
        .split(/(\*\*[^*]+\*\*)/g)
        .map((p, i) => (p.startsWith('**') && p.endsWith('**') ? <strong key={i}>{p.slice(2, -2)}</strong> : p));
    if (isValidElement(child) && typeof child.type === 'string') {
      const inner = (child.props as any).children;
      if (inner !== undefined) return cloneElement(child as any, undefined, bold(inner));
    }
    return child;
  });

function Shell({ title, kicker, updated, children }: { title: string; kicker: string; updated?: boolean; children: ReactNode }) {
  return (
    <div className='lp-wrap py-10'>
      <nav aria-label='Breadcrumb' className='lp-crumbs'>
        <a href='#/'>Home</a> <span>/</span> <span>{title}</span>
      </nav>
      <article className='lp-article'>
        <header>
          <span className='lp-kicker'>{kicker}</span>
          <h1>{title}</h1>
          {updated && <p className='text-sm text-slate-500 mt-4'>Last updated: {UPDATED}</p>}
        </header>
        <div className='lp-prose' style={{ marginTop: 36 }}>
          {bold(children)}
        </div>
      </article>
    </div>
  );
}

const formatPhone = (digits: string) =>
  digits.startsWith('92') && digits.length >= 11 ? '+92 ' + digits.slice(2, 5) + ' ' + digits.slice(5) : '+' + digits;

export function AboutPage() {
  return (
    <Shell title='About Us' kicker='About PrimeTech Pakistan'>
      <p>
        PrimeTech Pakistan, which runs its online store under the name Lappify, sells quality-checked refurbished laptops and
        Chromebooks to customers across Pakistan. We focus on business-class machines from Dell, HP and Lenovo, such as the
        Dell Latitude, HP EliteBook and ProBook, and Lenovo ThinkPad families, because they are built to last and offer
        far more value than most new laptops at the same price.
      </p>
      <h2>Our mission</h2>
      <p>
        Buying a laptop in Pakistan can feel risky. Listings are often vague, photos are borrowed, and it is hard to know
        what condition a used machine is really in. Our mission is to make that decision easier: to help buyers find
        reliable laptops, to describe every machine honestly, and to give people the knowledge they need to choose well
        even if they never buy from us.
      </p>
      <h2>What we sell</h2>
      <ul>
        <li>Refurbished Dell Latitude laptops in the 3000, 5000 and 7000 series.</li>
        <li>HP EliteBook and ProBook business laptops.</li>
        <li>Lenovo ThinkPad T-series and X-series laptops.</li>
        <li>Chromebooks for students, schools and light everyday use.</li>
      </ul>
      <p>
        Each listing shows the processor, memory and storage options, display, graphics, ports and battery information so
        that you can compare models before you order.
      </p>
      <h2>Our quality standards</h2>
      <p>We list laptops against a simple standard: a unit should be in 10/10 mint condition, verified, before it is offered for sale. In practice that means we look at the things that matter most to everyday users:</p>
      <ul>
        <li>**Condition:** the body, screen, keyboard and trackpad are checked for damage, wear and faults.</li>
        <li>**Performance:** the processor, memory and storage are confirmed to match the specification shown on the listing.</li>
        <li>**Power:** the laptop is supplied with its original charger and is checked to charge and run properly.</li>
        <li>**Honest descriptions:** specifications are written plainly, and Chromebook processors and graphics are described accurately rather than inflated.</li>
      </ul>
      <h2>How we look after our customers</h2>
      <ul>
        <li>**Packing video and photos:** before dispatch, we send a live packing video and photos on WhatsApp so you can see what is being shipped.</li>
        <li>**Nationwide delivery:** we deliver to cities and towns all over Pakistan.</li>
        <li>**7-day returns:** eligible items can be returned within 7 days of delivery, subject to inspection. Full details are on our Returns page.</li>
        <li>**Flexible payment:** we accept Easypaisa, JazzCash, bank transfer, Raast and other methods shown at checkout, and we offer 10% off when you pay in advance.</li>
      </ul>
      <h2>Our blog and buying guides</h2>
      <p>
        Our editorial team writes independent guides on topics such as choosing a student laptop, understanding
        processors, checking a used laptop and caring for your battery. You can read them on our <a href='#/blog'>blog</a>.
        To understand how we separate editorial content from our store and from advertising, please read our{' '}
        <a href='#/disclaimer'>Affiliate and Editorial Disclaimer</a>.
      </p>
      <h2>Get in touch</h2>
      <p>
        Questions about a laptop, an order or this website? Visit our <a href='#/contact'>Contact Us</a> page or message us
        on WhatsApp. We are happy to help you choose.
      </p>
    </Shell>
  );
}

const emptyForm = { name: '', email: '', subject: '', message: '', website: '' };

export function ContactPage({ settings }: { settings: any }) {
  const [form, setForm] = useState(emptyForm);
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const email = String(settings?.supportEmail || '').trim();
  const wa = String(settings?.whatsappNumber || WHATSAPP).replace(/\D/g, '') || WHATSAPP;
  const phone = String(settings?.supportPhone || '').trim() || formatPhone(wa);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (state === 'sending') return;
    setState('sending');
    try {
      await api.post('/api/contact', form);
      setForm(emptyForm);
      setState('sent');
    } catch {
      setState('error');
    }
  };
  const set = (k: keyof typeof emptyForm, v: string) => setForm({ ...form, [k]: v });

  return (
    <Shell title='Contact Us' kicker='We would love to hear from you'>
      <p>
        Whether you need help choosing a laptop, want to ask about an order, or have a question about this website, send us
        a message and we will get back to you as soon as we can. For the quickest reply, message us on WhatsApp.
      </p>
      <h2>Our details</h2>
      <ul>
        <li>**Business name:** PrimeTech Pakistan (Lappify)</li>
        <li>**Phone / WhatsApp:** {phone}</li>
        {email && <li>**Email:** <a href={'mailto:' + email}>{email}</a></li>}
        <li>**Location:** Pakistan. We deliver to customers nationwide, including Lahore, Karachi, Islamabad, Rawalpindi, Faisalabad, Multan and Peshawar.</li>
      </ul>
      <p>
        <a href={'https://wa.me/' + wa + '?text=Hello%20PrimeTech%20Pakistan%2C%20I%20need%20help%20choosing%20a%20laptop.'} target='_blank' rel='noreferrer'>
          Chat with us on WhatsApp
        </a>
      </p>
      <h2>Send us a message</h2>
      {state === 'sent' ? (
        <div className='bg-emerald-50 border border-emerald-200 rounded-xl p-5 text-emerald-800' style={{ fontSize: 16, lineHeight: 1.6 }} role='status'>
          Thank you. Your message has been sent and our team will reply soon.
        </div>
      ) : (
        <form onSubmit={submit} className='space-y-4' style={{ fontSize: 15 }} noValidate={false}>
          <label className='block font-semibold'>
            Name
            <input required maxLength={120} className='field mt-1' value={form.name} onChange={e => set('name', e.target.value)} autoComplete='name' />
          </label>
          <label className='block font-semibold'>
            Email
            <input required type='email' maxLength={200} className='field mt-1' value={form.email} onChange={e => set('email', e.target.value)} autoComplete='email' />
          </label>
          <label className='block font-semibold'>
            Subject
            <input required maxLength={200} className='field mt-1' value={form.subject} onChange={e => set('subject', e.target.value)} />
          </label>
          <label className='block font-semibold'>
            Message
            <textarea required rows={6} maxLength={5000} className='field mt-1' value={form.message} onChange={e => set('message', e.target.value)} />
          </label>
          <div style={{ position: 'absolute', left: -9999 }} aria-hidden='true'>
            <label>
              Website
              <input tabIndex={-1} autoComplete='off' value={form.website} onChange={e => set('website', e.target.value)} />
            </label>
          </div>
          {state === 'error' && (
            <p className='text-rose-700 font-semibold' role='alert'>
              Your message could not be sent. Please try again or message us on WhatsApp.
            </p>
          )}
          <button type='submit' disabled={state === 'sending'} className='btn-primary px-6 py-3 rounded-xl font-bold'>
            {state === 'sending' ? 'Sending...' : 'Send message'}
          </button>
        </form>
      )}
    </Shell>
  );
}

export function PrivacyPage() {
  return (
    <Shell title='Privacy Policy' kicker='Your privacy' updated>
      <p>
        This Privacy Policy explains how PrimeTech Pakistan (Lappify), referred to as "we", "us" or "our", collects, uses and
        protects information when you visit our website, browse our laptops, read our blog, place an order or contact us. By
        using the website you agree to the practices described here.
      </p>
      <h2>1. Information we collect</h2>
      <p>**Information you give us.** When you place an order we collect your name, phone or WhatsApp number, city, delivery address, order notes and chosen payment method. When you use our contact form we collect your name, email address, subject and message. If you submit a return request we collect your order ID, phone number and the reason for the return.</p>
      <p>**Information collected automatically.** When you visit the site, certain technical information is collected through cookies and similar technologies, such as your IP address, browser type, device type, operating system, pages viewed, time spent and the website that referred you.</p>
      <p>**Information stored in your browser.** To make the store work, we save your shopping cart and a copy of the product catalogue in your browser's local storage. This stays on your device.</p>
      <h2>2. How we use information</h2>
      <ul>
        <li>To process, deliver and support your orders, including contacting you on WhatsApp for packing verification.</li>
        <li>To handle returns, refunds and customer service requests, and to reply to your messages.</li>
        <li>To understand how visitors use the site so that we can improve our laptops, guides and pages.</li>
        <li>To show advertising that helps keep our guides free to read.</li>
        <li>To protect the site and our customers against fraud, abuse and technical problems.</li>
      </ul>
      <h2>3. Google Analytics</h2>
      <p>
        We use Google Analytics (measurement ID G-8QSGGQJGZN), a web analytics service provided by Google, to learn how
        visitors find and use our website. Google Analytics uses cookies and similar technologies to collect information
        such as pages visited, approximate location, device and browser details and how you arrived at the site. This data is
        used to produce reports and is not used by us to identify you personally. You can prevent your data from being used by
        Google Analytics by installing the{' '}
        <a href='https://tools.google.com/dlpage/gaoptout' target='_blank' rel='noreferrer'>Google Analytics Opt-out Browser Add-on</a>. Learn how Google uses data at{' '}
        <a href='https://policies.google.com/technologies/partner-sites' target='_blank' rel='noreferrer'>How Google uses information from sites or apps that use our services</a>.
      </p>
      <h2>4. Cookies and similar technologies</h2>
      <p>
        Cookies are small text files stored on your device. We and our partners use cookies and similar technologies for the
        following purposes:
      </p>
      <ul>
        <li>**Essential:** to keep the website working, remember your cart and keep you signed in where relevant.</li>
        <li>**Analytics:** to measure traffic and understand how the site is used, through Google Analytics.</li>
        <li>**Advertising:** to show ads and measure their performance, through Google and its advertising partners.</li>
      </ul>
      <p>
        You can control or delete cookies through your browser settings. Blocking some cookies may affect how parts of the
        website work.
      </p>
      <h2>5. Third-party advertising: Google AdSense and DoubleClick DART cookie</h2>
      <p>
        We may display advertisements served by Google AdSense, and third-party vendors, including Google, may use cookies to
        serve ads based on your prior visits to this website and other websites on the internet. Google's use of advertising
        cookies enables it and its partners to serve ads to you based on your visit to our site and/or other sites on the
        internet.
      </p>
      <p>
        Google uses the DoubleClick DART cookie, which allows it to serve ads to visitors based on their visits to our site
        and other sites. The DART cookie does not collect personally identifiable information such as your name, email
        address or phone number. Google's advertising and analytics partners may also use web beacons, pixels and mobile
        identifiers.
      </p>
      <p>**How to opt out of personalized advertising:**</p>
      <ul>
        <li>
          Visit <a href='https://adssettings.google.com' target='_blank' rel='noreferrer'>Google Ads Settings</a> to turn off personalized advertising or to manage the categories used to show you ads.
        </li>
        <li>
          Visit <a href='https://www.aboutads.info' target='_blank' rel='noreferrer'>www.aboutads.info</a> to opt out of personalized advertising from participating third-party vendors.
        </li>
        <li>
          Visit <a href='https://www.youronlinechoices.com' target='_blank' rel='noreferrer'>www.youronlinechoices.com</a> if you are in Europe.
        </li>
        <li>
          Read the <a href='https://policies.google.com/technologies/ads' target='_blank' rel='noreferrer'>Google advertising policies page</a> to learn more about how Google uses advertising data.
        </li>
      </ul>
      <p>
        Opting out does not stop ads from appearing; it means the ads you see will be less relevant to your interests. Where
        required by law, such as for visitors in the European Economic Area, the United Kingdom and Switzerland, we will ask for
        your consent before using cookies for personalized advertising.
      </p>
      <h2>6. Who we share information with</h2>
      <p>We do not sell your personal information. We share it only where needed to run the store and the website:</p>
      <ul>
        <li>Couriers and delivery partners, so that your order reaches you.</li>
        <li>Payment and banking providers or wallets that you choose to pay with.</li>
        <li>Hosting and technology providers who store the website's data securely on our behalf.</li>
        <li>Google, for analytics and advertising as described above.</li>
        <li>Authorities, where we are legally required to do so.</li>
      </ul>
      <h2>7. Links to other websites</h2>
      <p>
        Our pages may link to other websites. We are not responsible for the privacy practices or content of those sites, and
        we encourage you to read their policies.
      </p>
      <h2>8. Data retention and security</h2>
      <p>
        We keep order and support records for as long as needed to fulfil orders, handle returns, meet legal obligations and
        resolve disputes, and then delete or anonymise them. We use reasonable technical and organisational measures to protect
        information, but no online service can be guaranteed to be completely secure.
      </p>
      <h2>9. Your choices and rights</h2>
      <p>
        You may ask us to access, correct or delete the personal information we hold about you, subject to legal and
        record-keeping requirements. You can also withdraw consent for cookies through your browser or consent settings, and
        opt out of personalized advertising as described above. To make a request, please contact us using the details below.
      </p>
      <h2>10. Children's privacy</h2>
      <p>
        Our website is not directed at children under 13, and we do not knowingly collect personal information from them. If
        you believe a child has given us personal information, please contact us and we will delete it.
      </p>
      <h2>11. Changes to this policy</h2>
      <p>
        We may update this Privacy Policy from time to time. The "last updated" date at the top shows when it was last revised,
        and continued use of the website means you accept the updated policy.
      </p>
      <h2>12. Contact us</h2>
      <p>
        If you have questions about this Privacy Policy, please use our <a href='#/contact'>Contact Us</a> page or message us
        on WhatsApp.
      </p>
    </Shell>
  );
}

export function TermsPage() {
  return (
    <Shell title='Terms and Conditions' kicker='Terms of use' updated>
      <p>
        These Terms and Conditions govern your use of the PrimeTech Pakistan (Lappify) website and your purchases from our
        store. By using the website or placing an order, you agree to these terms. If you do not agree, please do not use the
        site.
      </p>
      <h2>1. Using the website</h2>
      <p>
        You may browse the site, read our guides and buy from our store for lawful, personal or business purposes. You agree
        not to misuse the site, attempt to gain unauthorised access, interfere with its operation, copy it in bulk by
        automated means, or submit false information.
      </p>
      <h2>2. Products, pricing and availability</h2>
      <ul>
        <li>Our laptops are refurbished. Each listing describes the model, specification and condition as accurately as we can.</li>
        <li>Prices are shown in Pakistani rupees (PKR) and may change at any time without notice, for example due to market conditions.</li>
        <li>Stock changes quickly. A product being shown does not guarantee that it is available, and we may cancel or decline an order if an item is out of stock or a price was listed in error. If that happens, any payment you made will be refunded.</li>
        <li>Photos are for illustration. Minor cosmetic differences, and differences in the supplied charger model, may exist between units of the same model.</li>
        <li>Specifications can vary between variants. Please check the RAM and storage option you select before ordering.</li>
      </ul>
      <h2>3. Orders and payment</h2>
      <p>
        An order is confirmed when we accept it and contact you, usually on WhatsApp, for verification. We accept the payment
        methods shown at checkout. Discounts such as 10% off for advance payment apply as described on the site at the time
        of your order. Some payment options may be unavailable at certain times. You are responsible for giving accurate
        delivery details.
      </p>
      <h2>4. Delivery</h2>
      <p>
        We deliver across Pakistan through courier partners. Delivery times and charges are confirmed before dispatch and
        may be affected by location, courier delays or events beyond our control. Before dispatch, we send a packing video
        and photos on WhatsApp.
      </p>
      <h2>5. Returns and refunds</h2>
      <p>
        Eligible items may be returned within 7 days of delivery, subject to inspection. The laptop must be returned with its
        charger and accessories in the condition received. Damage, liquid exposure, tampering or missing parts after
        delivery may affect eligibility. See our Returns page for the process and our policy summary.
      </p>
      <h2>6. Intellectual property</h2>
      <p>
        The text, articles, graphics, logos, layout and other content on this website belong to PrimeTech Pakistan or are used
        with permission, and are protected by applicable intellectual property laws. You may view and share links to our
        pages for personal use. You may not copy, republish, sell or distribute our articles or other content without our
        written permission. Brand names such as Dell, HP, Lenovo and Intel are trademarks of their respective owners and are
        used only to identify the products we sell; we are not affiliated with or endorsed by them.
      </p>
      <h2>7. Information and advice on this site</h2>
      <p>
        Our guides are provided for general information. We work hard to keep them accurate, but we do not guarantee that they
        are complete or current, and they are not professional advice. Please see our{' '}
        <a href='#/disclaimer'>Affiliate and Editorial Disclaimer</a>.
      </p>
      <h2>8. Third-party links and advertising</h2>
      <p>
        The website may contain links to third-party websites and advertisements served by third parties such as Google. We do
        not control or endorse those sites or advertisers and are not responsible for their content or practices. See our{' '}
        <a href='#/privacy-policy'>Privacy Policy</a> for details.
      </p>
      <h2>9. Disclaimer of warranties and limitation of liability</h2>
      <p>
        The website is provided "as is" and "as available". To the fullest extent permitted by law, we are not liable for
        indirect or consequential losses, loss of data or profits, or interruptions to the website. Nothing in these terms
        removes any rights you have as a consumer under the laws of Pakistan.
      </p>
      <h2>10. Governing law</h2>
      <p>These terms are governed by the laws of Pakistan, and any disputes will be subject to the courts of Pakistan.</p>
      <h2>11. Changes to these terms</h2>
      <p>
        We may update these terms from time to time. The updated version applies from the date it is posted on this page, and
        continued use of the website means you accept the changes.
      </p>
      <h2>12. Contact</h2>
      <p>Questions about these terms? Please visit our <a href='#/contact'>Contact Us</a> page.</p>
    </Shell>
  );
}

export function DisclaimerPage() {
  return (
    <Shell title='Affiliate and Editorial Disclaimer' kicker='Editorial policy' updated>
      <p>
        We want you to know exactly how the content on this website is produced and funded, so that you can decide how much
        weight to give it.
      </p>
      <h2>Our guides are independent and informational</h2>
      <p>
        The articles and buying guides on our blog are written by the PrimeTech Editorial Team to help people understand
        laptops and make better decisions. They are based on general knowledge of how laptop hardware works and on our
        experience of the Pakistani market. They are informational only. They are not professional, financial or technical
        advice, and they should not be the only thing you rely on when making a purchase.
      </p>
      <h2>Commercial interest</h2>
      <p>
        PrimeTech Pakistan sells refurbished laptops. Some guides mention laptop families, such as Dell Latitude, HP
        EliteBook and Lenovo ThinkPad, that we also sell, and we show a "Related Laptops" box at the end of each guide linking
        to products in our store. We state this openly because it is a commercial interest. We aim to give balanced advice,
        including telling readers when a cheaper or different option is the better choice for them.
      </p>
      <h2>Affiliate links</h2>
      <p>
        At the time of writing, our guides do not rely on paid affiliate links. If we add affiliate links in the future, we will
        clearly label them and explain that we may earn a commission if you buy through them, at no extra cost to you. A
        commission will never decide what we recommend.
      </p>
      <h2>Advertising</h2>
      <p>
        This website may display advertisements served by Google AdSense and other third-party advertising partners. We do not
        choose the individual ads shown, and the presence of an ad is not an endorsement of the advertiser or its products.
        Advertisers have no influence over our editorial content. Please see our <a href='#/privacy-policy'>Privacy Policy</a>{' '}
        for how advertising cookies work and how to opt out of personalized ads.
      </p>
      <h2>Accuracy of information</h2>
      <p>
        Laptop specifications, prices, generations, software support dates and availability change often. We try to keep our
        articles accurate and up to date, but we cannot guarantee that every detail is current. Prices mentioned in guides are
        rough indications only. Always confirm the exact specification, condition, price and return terms with the seller before
        you buy, and test any used laptop yourself.
      </p>
      <h2>Opinions and reviews</h2>
      <p>
        Where we express a view about a product category or a laptop family, it is our own opinion and your experience may
        differ. Brand names are the property of their owners, and we are not sponsored or endorsed by them.
      </p>
      <h2>Corrections and feedback</h2>
      <p>
        If you spot a mistake or want to tell us about something that needs updating, please let us know through our{' '}
        <a href='#/contact'>Contact Us</a> page and we will review it promptly.
      </p>
    </Shell>
  );
}

export function NotFoundPage() {
  return (
    <Shell title='Page not found' kicker='404'>
      <p>We could not find the page you were looking for. It may have moved, or the link may be incorrect.</p>
      <ul>
        <li><a href='#/'>Go to the store home page</a></li>
        <li><a href='#/blog'>Read our laptop buying guides</a></li>
        <li><a href='#/contact'>Contact us</a></li>
      </ul>
    </Shell>
  );
}
