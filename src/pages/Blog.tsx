import { Laptop } from 'lucide-react';
import type { ReactNode } from 'react';
import '../blog.css';
import { AUTHOR, articles } from '../articles';
import type { Article } from '../articles';
import type { Product } from '../catalog';
import { displayName, minPrice, money, ramOptions } from '../catalog';

export const formatDate = (iso: string) =>
  new Date(iso + 'T00:00:00Z').toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });

export const readMinutes = (body: string) => Math.max(1, Math.round(body.split(/\s+/).filter(Boolean).length / 200));

const inline = (text: string): ReactNode[] =>
  text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith('**') && part.endsWith('**') ? <strong key={i}>{part.slice(2, -2)}</strong> : part
  );

const renderBody = (body: string): ReactNode[] =>
  body.split(/\n\s*\n/).map((block, i) => {
    const lines = block.split('\n').filter(l => l.trim());
    if (block.startsWith('## ')) return <h2 key={i}>{block.slice(3).trim()}</h2>;
    if (lines.length && lines.every(l => l.startsWith('- ')))
      return (
        <ul key={i}>
          {lines.map((l, j) => (
            <li key={j}>{inline(l.slice(2))}</li>
          ))}
        </ul>
      );
    if (lines.length && lines.every(l => /^\d+\. /.test(l)))
      return (
        <ol key={i}>
          {lines.map((l, j) => (
            <li key={j}>{inline(l.replace(/^\d+\. /, ''))}</li>
          ))}
        </ol>
      );
    return <p key={i}>{inline(block.trim())}</p>;
  });

const byNewestGeneration = (list: Product[]) => [...list].sort((a, b) => b.generation - a.generation);

const pickRelated = (products: Product[], cfg: Article['related']): Product[] => {
  const hasPrice = (p: Product) => p.variants.some(v => v.price > 0 && v.inStock !== false);
  const base = products.filter(p => !(p as any).hidden && p.inStock !== false && hasPrice(p));
  const minRam = cfg.minRam || 0;
  const strict = base.filter(
    p =>
      (!cfg.series || cfg.series.includes(p.series)) &&
      (!cfg.brand || p.brand === cfg.brand) &&
      (!cfg.maxPrice || minPrice(p) <= cfg.maxPrice) &&
      (!minRam || p.variants.some(v => v.ram >= minRam && v.price > 0 && v.inStock !== false))
  );
  const rest = base.filter(p => !strict.includes(p));
  const pool = [...byNewestGeneration(strict), ...byNewestGeneration(rest)];
  const picked: Product[] = [];
  const seen = new Set<string>();
  for (const p of pool) {
    if (picked.length >= 3) break;
    if (!seen.has(p.series)) {
      seen.add(p.series);
      picked.push(p);
    }
  }
  for (const p of pool) {
    if (picked.length >= 3) break;
    if (!picked.includes(p)) picked.push(p);
  }
  return picked;
};

function RelatedLaptops({
  article,
  products,
  onOpen,
  onBrowse,
}: {
  article: Article;
  products: Product[];
  onOpen: (p: Product) => void;
  onBrowse: (brand: string, series: string) => void;
}) {
  const cfg = article.related;
  const items = pickRelated(products, cfg);
  return (
    <aside className='lp-related' aria-label='Related laptops'>
      <span className='lp-kicker'>Related Laptops</span>
      <h2>{cfg.heading}</h2>
      <p>{cfg.blurb} These are laptops from the PrimeTech Pakistan store, shown here for convenience.</p>
      {items.length > 0 && (
        <ul className='lp-rel-list'>
          {items.map(p => {
            const img = p.image || p.images?.[0];
            return (
              <li key={p.id} className='lp-rel-card'>
                <div className='lp-rel-img'>
                  {img ? <img src={img} alt={displayName(p)} loading='lazy' /> : <Laptop size={44} />}
                </div>
                <b className='text-sm text-slate-900 leading-5'>{displayName(p)}</b>
                <span className='text-xs text-slate-500'>RAM options: {ramOptions(p)}</span>
                <span className='text-sm font-bold text-slate-800'>From {money(minPrice(p))}</span>
                <button type='button' className='lp-rel-btn' onClick={() => onOpen(p)}>
                  View details
                </button>
              </li>
            );
          })}
        </ul>
      )}
      <button type='button' className='lp-rel-all' onClick={() => onBrowse(cfg.browse[0], cfg.browse[1])}>
        {cfg.browse[2]} &rarr;
      </button>
    </aside>
  );
}

export function BlogList() {
  return (
    <section className='lp-wrap py-12'>
      <header className='max-w-2xl'>
        <p className='lp-kicker'>Blog &amp; Buying Guides</p>
        <h1 className='text-3xl sm:text-4xl font-black text-slate-950 mt-2 leading-tight'>
          Laptop buying guides for Pakistan
        </h1>
        <p className='text-slate-600 mt-4 leading-7'>
          Independent, practical advice from the {AUTHOR} to help you choose, check and look after a laptop, written for
          buyers in Pakistan.
        </p>
      </header>
      <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10'>
        {articles.map(a => (
          <article key={a.slug} className='bg-white border border-slate-200 rounded-2xl p-6 flex flex-col'>
            <span className='lp-kicker'>{a.category}</span>
            <h2 className='text-xl font-extrabold text-slate-950 leading-snug mt-2'>
              <a href={'#/blog/' + a.slug} className='hover:text-indigo-600'>
                {a.title}
              </a>
            </h2>
            <p className='text-slate-600 text-sm leading-6 mt-3'>{a.excerpt}</p>
            <div className='text-xs text-slate-500 mt-4'>
              <time dateTime={a.date}>{formatDate(a.date)}</time> &middot; {readMinutes(a.body)} min read
            </div>
            <a href={'#/blog/' + a.slug} className='mt-auto pt-5 text-sm font-bold text-indigo-600'>
              Read the guide &rarr;
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}

export function BlogArticle({
  article,
  products,
  onOpen,
  onBrowse,
}: {
  article: Article;
  products: Product[];
  onOpen: (p: Product) => void;
  onBrowse: (brand: string, series: string) => void;
}) {
  const others = articles.filter(a => a.slug !== article.slug).slice(0, 2);
  return (
    <div className='lp-wrap py-10'>
      <nav aria-label='Breadcrumb' className='lp-crumbs'>
        <a href='#/'>Home</a> <span>/</span> <a href='#/blog'>Blog</a>
      </nav>
      <article className='lp-article'>
        <header>
          <span className='lp-kicker'>{article.category}</span>
          <h1>{article.title}</h1>
          <div className='lp-meta'>
            <span>By {AUTHOR}</span>
            <span>
              Published <time dateTime={article.date}>{formatDate(article.date)}</time>
            </span>
            <span>{readMinutes(article.body)} min read</span>
          </div>
        </header>
        <div className='lp-prose'>{renderBody(article.body)}</div>
      </article>
      <RelatedLaptops article={article} products={products} onOpen={onOpen} onBrowse={onBrowse} />
      <section className='lp-more' aria-label='More guides'>
        <h2 className='text-xl font-black text-slate-950'>More buying guides</h2>
        <ul className='mt-4 space-y-3'>
          {others.map(a => (
            <li key={a.slug}>
              <a href={'#/blog/' + a.slug} className='font-bold text-indigo-600'>
                {a.title}
              </a>
            </li>
          ))}
          <li>
            <a href='#/blog' className='font-bold text-slate-700'>
              &larr; Back to all guides
            </a>
          </li>
        </ul>
      </section>
    </div>
  );
}
