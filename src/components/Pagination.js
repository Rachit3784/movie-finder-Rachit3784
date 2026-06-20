import React from 'react';

export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-12 py-6 border-t border-zinc-800/80">
      <div className="text-sm text-text-muted">
        Page <span className="text-zinc-100 font-semibold">{page}</span> of{' '}
        <span className="text-zinc-100 font-semibold">{totalPages}</span>
      </div>
      
      <div className="flex items-center gap-3">
        {/* Previous Button */}
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-md font-medium text-sm transition-all border ${
            page <= 1
              ? 'border-zinc-850 bg-zinc-900/40 text-zinc-600 cursor-not-allowed'
              : 'border-zinc-800 bg-zinc-900 text-zinc-200 hover:bg-zinc-850 hover:text-white active:scale-95'
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
          </svg>
          Previous
        </button>

        {/* Next Button */}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-md font-medium text-sm transition-all border ${
            page >= totalPages
              ? 'border-zinc-850 bg-zinc-900/40 text-zinc-600 cursor-not-allowed'
              : 'border-zinc-800 bg-zinc-900 text-zinc-200 hover:bg-zinc-850 hover:text-white active:scale-95'
          }`}
        >
          Next
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
