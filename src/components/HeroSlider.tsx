import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Laptop } from 'lucide-react';
import type { Product } from '../catalog';
import { displayName } from '../catalog';

type Props = { products: Product[]; onOpen: (p: Product) => void };

const slides = [
  {
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1800&q=90',
    kicker: 'PREMIUM COMPUTING',
    title: 'Designed for your next big idea',
    subtitle: 'A clean, modern workspace with dependable performance.'
  },
  {
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1800&q=90',
    kicker: 'WORK WITHOUT LIMITS',
    title: 'Power meets thoughtful design',
    subtitle: 'Find a machine that fits your work, study and everyday life.'
  },
  {
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1800&q=90',
    kicker: 'BUILT FOR PRODUCTIVITY',
    title: 'Make room for better ideas',
    subtitle: 'Explore carefully selected laptops for focused work.'
  },
  {
    image: 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&w=1800&q=90',
    kicker: 'MINIMAL. MODERN. CAPABLE.',
    title: 'A smarter everyday setup',
    subtitle: 'Thoughtful technology for your home, office and classroom.'
  },
  {
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1800&q=90',
    kicker: 'YOUR NEXT WORKSPACE',
    title: 'Ready when inspiration strikes',
    subtitle: 'Discover practical performance with a premium feel.'
  }
];

const SLIDE_MS = 3000;

export default function HeroSlider({ products, onOpen }: Props) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const timer = window.setTimeout(() => setIndex(i => (i + 1) % slides.length), SLIDE_MS);
    return () => window.clearTimeout(timer);
  }, [index]);

  const go = (n: number) => setIndex((n + slides.length) % slides.length);
  const featured = products[0];

  return (
    <section className='relative overflow-hidden rounded-3xl hero-surface shadow-2xl' aria-label='Premium laptop gallery'>
      <div className='flex transition-transform duration-700 ease-in-out' style={{ transform: 'translateX(-' + index * 100 + '%)' }}>
        {slides.map((slide, i) => (
          <div key={slide.image} className='min-w-full grid md:grid-cols-2 items-center gap-6 px-6 sm:px-14 py-8 md:py-10'>
            <div className='relative z-10'>
              <span className='inline-flex items-center rounded-full bg-white/10 border border-white/20 text-cyan-300 px-3 py-1.5 text-xs font-bold tracking-[.18em]'>
                {slide.kicker}
              </span>
              <h2 className='mt-4 text-3xl sm:text-5xl font-black tracking-tight leading-tight'>{slide.title}</h2>
              <p className='mt-3 text-slate-300 text-base sm:text-lg max-w-md'>{slide.subtitle}</p>
              {featured && (
                <button onClick={() => onOpen(featured)} className='btn-primary mt-7 rounded-xl px-7 py-3 font-bold'>
                  Explore {displayName(featured)}
                </button>
              )}
            </div>
            <div className='relative'>
              <div className='absolute inset-6 rounded-full bg-cyan-400/30 blur-3xl'></div>
              <div className='relative bg-white/95 rounded-3xl h-64 sm:h-80 md:h-[340px] p-3 shadow-2xl'>
                <img src={slide.image} alt='Premium laptop in a modern workspace' className='w-full h-full object-cover rounded-2xl' loading={i === 0 ? 'eager' : 'lazy'} />
              </div>
            </div>
          </div>
        ))}
      </div>
      <button onClick={() => go(index - 1)} aria-label='Previous slide' className='hidden sm:grid absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 place-items-center rounded-full bg-white/15 hover:bg-white/30 text-white'><ChevronLeft /></button>
      <button onClick={() => go(index + 1)} aria-label='Next slide' className='hidden sm:grid absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 place-items-center rounded-full bg-white/15 hover:bg-white/30 text-white'><ChevronRight /></button>
      <div className='absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2'>
        {slides.map((slide, i) => <button key={slide.image} onClick={() => setIndex(i)} aria-label={'Go to slide ' + (i + 1)} className={'h-2.5 rounded-full transition-all ' + (i === index ? 'w-8 bg-cyan-300' : 'w-2.5 bg-white/40')} />)}
      </div>
    </section>
  );
}
