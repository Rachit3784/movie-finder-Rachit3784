import React from 'react';

export default function Footer() {
  return (
    <footer className="w-full py-8 mt-auto border-t border-zinc-900 bg-zinc-950/60 text-center text-xs text-text-muted">
      <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p>© {new Date().getFullYear()} Movie Finder. All rights reserved.</p>
        <p className="font-semibold tracking-wide text-zinc-400">
          Built for Jeevan — Rachit Gupta
        </p>
      </div>
    </footer>
  );
}
