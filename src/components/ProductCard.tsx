import { Laptop, ShoppingCart } from 'lucide-react';
import type { Product, Variant } from '../catalog';
import { displayName, minPrice, money, ramOptions, storageOptions } from '../catalog';

type Props = {
  product: Product;
  onOpen: (p: Product) => void;
  onAdd: (p: Product, v: Variant) => void;
};

export default function ProductCard({ product: p, onOpen, onAdd }: Props) {
  const price = minPrice(p);
  const firstPriced = p.variants.find(v => v.price > 0 && v.inStock !== false && p.inStock !== false);
  const available = p.inStock !== false && p.variants.some(v => v.inStock !== false);
  const img = p.image || p.images?.[0];
  const details: [string, string][] = [
    ['Processor', p.cpu],
    ['RAM', ramOptions(p)],
    ['Storage', storageOptions(p)],
    ['Display', p.display],
    ['Graphics', p.graphics],
    ['Keyboard', p.keyboard],
  ];
  return (
    <div className='group relative md:h-[416px]'>
      <article className='flex flex-col bg-white rounded-2xl border border-slate-200 overflow-hidden transition-shadow md:absolute md:inset-x-0 md:top-0 md:min-h-[416px] md:group-hover:z-30 md:group-hover:shadow-2xl md:group-hover:border-indigo-300 md:group-focus-within:z-30'>
        <div className='relative h-56 shrink-0 overflow-hidden bg-slate-50'>
          {img ? (
            <img src={img} alt={displayName(p)} loading='lazy' className='absolute inset-0 w-full h-full object-contain p-3' onError={e => { e.currentTarget.style.display = 'none'; }} />
          ) : (
            <div className='absolute inset-0 grid place-items-center text-slate-300'><Laptop size={64} strokeWidth={1} /></div>
          )}
          <span className='absolute top-3 left-3 bg-emerald-600 text-white text-[10px] font-extrabold rounded-full px-2.5 py-1'>10/10 MINT VERIFIED</span>
          <span className={'absolute top-3 right-3 text-[10px] font-bold rounded-full px-2 py-1 ' + (available ? 'bg-white text-emerald-700' : 'bg-rose-100 text-rose-700')}>
            {available ? 'In Stock' : 'Out of Stock'}
          </span>
        </div>
        <div className='flex flex-col flex-1 p-4'>
          <h3 className='font-extrabold text-[17px] leading-snug line-clamp-2 min-h-[2.6rem] text-slate-900'>{displayName(p)}</h3>
          <div className='mt-2'>
            <small className='text-slate-400 block'>Starting from</small>
            <b className='text-lg text-slate-950'>{price > 0 ? money(price) : 'Price on request'}</b>
          </div>
          <div className='overflow-hidden transition-[max-height] duration-300 max-h-none md:max-h-0 md:group-hover:max-h-60 md:group-focus-within:max-h-60'>
            <dl className='mt-3 pt-3 border-t border-slate-100 space-y-1.5 text-xs'>
              {details.map(([k, v]) => <div key={k} className='flex gap-2'><dt className='w-16 shrink-0 text-slate-400 font-semibold'>{k}</dt><dd className='font-semibold text-slate-700'>{v}</dd></div>)}
            </dl>
          </div>
          <div className='mt-auto pt-3 flex gap-2'>
            <button onClick={() => onOpen(p)} className='btn-primary flex-1 rounded-lg px-4 py-2.5 text-sm font-bold'>View details</button>
            {firstPriced && (
              <button onClick={() => onAdd(p, firstPriced)} aria-label={'Add ' + displayName(p) + ' to cart'} className='grid place-items-center w-11 rounded-lg border border-slate-200 text-slate-700 hover:border-cyan-400 hover:text-cyan-600'><ShoppingCart size={18} /></button>
            )}
          </div>
        </div>
      </article>
    </div>
  );
}
