import { ArrowLeft, ArrowRight } from 'lucide-react';

type Props = { page: number; pages: number; onChange: (n: number) => void };

export default function Pagination({ page, pages, onChange }: Props) {
  if (pages <= 1) return null;
  const windowSize = Math.min(pages, 7);
  const start = Math.max(1, Math.min(page - 3, pages - windowSize + 1));
  const nums = Array.from({ length: windowSize }, (_, i) => start + i);
  return (
    <nav className='flex items-center justify-center gap-2 sm:gap-4 mt-10' aria-label='Pagination'>
      {page > 1 && (
        <button onClick={() => onChange(page - 1)} aria-label='Previous page' className='text-cyan-600 p-2'>
          <ArrowLeft size={26} />
        </button>
      )}
      {nums.map(n => (
        <button
          key={n}
          onClick={() => onChange(n)}
          aria-current={n === page ? 'page' : undefined}
          className={
            'w-11 h-11 rounded-full font-extrabold text-lg ' +
            (n === page ? 'btn-primary' : 'text-slate-400 hover:text-slate-700')
          }
        >
          {n}
        </button>
      ))}
      {page < pages && (
        <button onClick={() => onChange(page + 1)} aria-label='Next page' className='text-cyan-600 p-2'>
          <ArrowRight size={26} />
        </button>
      )}
    </nav>
  );
}
