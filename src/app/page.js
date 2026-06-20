'use client';

import React, { useState, useEffect } from 'react';
import MovieGrid from '@/components/MovieGrid';
import Pagination from '@/components/Pagination';
import MovieDetailsModal from '@/components/MovieDetailsModal';
import Footer from '@/components/Footer';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [page, setPage] = useState(1);
  const [movies, setMovies] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [favorites, setFavorites] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [activeTab, setActiveTab] = useState('browse'); // 'browse' or 'favorites'

  // Debounce search query to prevent excessive API requests
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  // Load favorites from local storage on mount
  useEffect(() => {
    const stored = localStorage.getItem('movie-discovery-favorites');
    if (stored) {
      try {
        setFavorites(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse favorites from local storage', e);
      }
    }
  }, []);

  // Reset page number on search query change
  useEffect(() => {
    setPage(1);
  }, [debouncedQuery]);

  // Fetch movies from proxy API route
  useEffect(() => {
    if (activeTab === 'favorites') return;

    let isMounted = true;
    setLoading(true);
    setError(null);

    const queryParam = encodeURIComponent(debouncedQuery);
    fetch(`/api/movies?page=${page}&query=${queryParam}`)
      .then((res) => {
        if (!res.ok) {
          return res.json().then((err) => {
            throw new Error(err.error || 'Failed to fetch movie data');
          });
        }
        return res.json();
      })
      .then((data) => {
        if (isMounted) {
          setMovies(data.results || []);
          setTotalPages(data.totalPages || 0);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message);
          setMovies([]);
          setTotalPages(0);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [page, debouncedQuery, activeTab]);

  // Handle adding/removing from favorites
  const handleToggleFavorite = (movie) => {
    let updated;
    const isFav = favorites.some((fav) => fav.id === movie.id);
    if (isFav) {
      updated = favorites.filter((fav) => fav.id !== movie.id);
    } else {
      updated = [...favorites, movie];
    }
    setFavorites(updated);
    localStorage.setItem('movie-discovery-favorites', JSON.stringify(updated));
  };

  // Pagination for favorites client-side
  const getPaginatedFavorites = () => {
    const start = (page - 1) * 12;
    return favorites.slice(start, start + 12);
  };

  const totalFavoritesPages = Math.ceil(favorites.length / 12) || 1;

  // Render Skeleton Loader for cards
  const SkeletonGrid = () => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-6 sm:gap-6">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="animate-shimmer bg-zinc-900 rounded-md h-[380px] sm:h-[420px] flex flex-col justify-between p-4 border border-zinc-800">
          <div className="w-full h-[78%] bg-zinc-800 rounded-md mb-4" />
          <div className="h-4 bg-zinc-800 rounded w-3/4 mb-2" />
          <div className="h-3 bg-zinc-800 rounded w-1/2" />
        </div>
      ))}
    </div>
  );

  const featuredMovie = movies[0];
  const featuredBackdrop = featuredMovie?.backdrop_path
    ? `https://image.tmdb.org/t/p/original${featuredMovie.backdrop_path}`
    : null;

  return (
    <div className="min-h-screen flex flex-col bg-[#0f0f10] text-[#f5f5f7]">
      {/* Sticky Navigation Bar */}
      <header className="sticky top-0 z-40 w-full glass-header py-4 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            {/* Logo */}
            <h1 className="text-xl sm:text-2xl font-black tracking-tighter text-netflix-red uppercase select-none cursor-pointer" onClick={() => { setActiveTab('browse'); setPage(1); setSearchQuery(''); }}>
              Movie Finder
            </h1>

            {/* Navigation Tabs */}
            <nav className="flex items-center gap-4 text-sm font-semibold text-zinc-400">
              <button
                onClick={() => { setActiveTab('browse'); setPage(1); }}
                className={`py-1 transition-colors hover:text-white ${activeTab === 'browse' ? 'text-white border-b-2 border-netflix-red font-bold' : ''}`}
              >
                Browse
              </button>
              <button
                onClick={() => { setActiveTab('favorites'); setPage(1); }}
                className={`py-1 transition-colors hover:text-white flex items-center gap-1.5 ${activeTab === 'favorites' ? 'text-white border-b-2 border-netflix-red font-bold' : ''}`}
              >
                Favorites
                {favorites.length > 0 && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-netflix-red px-1.5 text-[10px] font-bold text-white">
                    {favorites.length}
                  </span>
                )}
              </button>
            </nav>
          </div>

          {/* Search bar inside header (only relevant for Browse tab) */}
          {activeTab === 'browse' && (
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Search by title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-md py-1.5 pl-9 pr-4 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-700 transition-colors"
                id="search-input"
              />
              <svg
                className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2 w-5 h-5 flex items-center justify-center rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white text-xs"
                >
                  ✕
                </button>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Main Grid View */}
      <main className="flex-1 w-full pb-16">

        {/* Netflix-style Hero Banner: Page 1, popular, no query, Browse tab */}
        {activeTab === 'browse' && page === 1 && !debouncedQuery && movies.length > 0 && !loading && !error && (
          <div className="relative w-full h-[55vh] sm:h-[65vh] md:h-[75vh] flex items-center bg-zinc-950 overflow-hidden mb-12">
            {featuredBackdrop && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={featuredBackdrop}
                alt={`${featuredMovie.title} cover`}
                className="absolute inset-0 w-full h-full object-cover opacity-60"
              />
            )}

            {/* Netflix Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#0f0f10] via-[#0f0f10]/60 to-transparent z-10" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f10] via-transparent to-transparent z-10" />

            {/* Hero content */}
            <div className="relative z-20 max-w-2xl px-6 sm:px-12 md:px-16 space-y-4">
              <span className="inline-block px-3 py-1 bg-netflix-red text-xs font-black tracking-widest uppercase rounded">
                Featured Title
              </span>
              <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-white leading-none drop-shadow-md">
                {featuredMovie.title}
              </h2>

              <div className="flex items-center gap-3 text-xs sm:text-sm text-zinc-300 font-semibold">
                <span>{featuredMovie.release_date?.substring(0, 4)}</span>
                <span className="h-3.5 w-[1px] bg-zinc-750" />
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4 text-amber-500 fill-amber-500" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-white">{featuredMovie.vote_average?.toFixed(1)}</span>
                </div>
              </div>

              <p className="text-zinc-300 text-sm sm:text-base leading-relaxed line-clamp-3 max-w-lg drop-shadow-sm font-normal">
                {featuredMovie.overview}
              </p>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => setSelectedMovie(featuredMovie)}
                  className="flex items-center gap-2 px-6 py-3 bg-white hover:bg-zinc-200 text-black font-bold rounded-md shadow-lg transition-transform active:scale-95 text-sm sm:text-base"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  Watch Info
                </button>
                <button
                  onClick={() => handleToggleFavorite(featuredMovie)}
                  className={`flex items-center gap-2 px-5 py-3 font-semibold rounded-md border backdrop-blur-md transition-all active:scale-95 text-sm sm:text-base ${favorites.some(f => f.id === featuredMovie.id)
                      ? 'border-netflix-red bg-netflix-red/20 text-white hover:bg-netflix-red/30'
                      : 'border-zinc-700 bg-zinc-900/60 text-zinc-200 hover:bg-zinc-800'
                    }`}
                >
                  <svg className="w-5 h-5" fill={favorites.some(f => f.id === featuredMovie.id) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                  {favorites.some(f => f.id === featuredMovie.id) ? 'Favorited' : 'My List'}
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-8 mt-6">
          {/* Section Header */}
          <div className="mb-6 flex flex-col gap-2">
            <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-wide">
              {activeTab === 'browse'
                ? (debouncedQuery ? `Search Results for "${debouncedQuery}"` : 'Trending Popular Movies')
                : 'My Favorites List'
              }
            </h3>
            {activeTab === 'favorites' && favorites.length > 0 && (
              <p className="text-xs text-text-muted">
                Showing {Math.min(favorites.length, (page - 1) * 12 + 1)}–{Math.min(favorites.length, page * 12)} of {favorites.length} saved titles.
              </p>
            )}
          </div>

          {/* Error State */}
          {error && (
            <div className="w-full p-6 my-4 bg-zinc-900/60 border border-zinc-800 rounded-lg text-center animate-fade-in">
              <svg className="w-12 h-12 text-netflix-red mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h4 className="text-base font-bold text-white mb-1.5">Connection Error</h4>
              <p className="text-sm text-text-muted max-w-md mx-auto leading-relaxed">
                {error.includes('credentials') ? (
                  <>
                    API credentials are not configured. To enable browsing, rename the <code className="bg-zinc-850 px-1 py-0.5 rounded text-netflix-red">.env.example</code> file to <code className="bg-zinc-850 px-1 py-0.5 rounded text-netflix-red">.env</code> in the project root and add your valid <strong className="text-zinc-200">TMDB API Key</strong>.
                  </>
                ) : (
                  error
                )}
              </p>
            </div>
          )}

          {/* Loading State */}
          {loading && activeTab === 'browse' && !error && <SkeletonGrid />}

          {/* Loaded Movie Grid */}
          {!loading && !error && activeTab === 'browse' && (
            movies.length > 0 ? (
              <>
                <MovieGrid
                  movies={movies}
                  favorites={favorites}
                  onToggleFavorite={handleToggleFavorite}
                  onMovieClick={setSelectedMovie}
                />
                <Pagination
                  page={page}
                  totalPages={totalPages}
                  onPageChange={setPage}
                />
              </>
            ) : (
              <div className="w-full text-center py-16 text-zinc-500 animate-fade-in">
                <svg className="w-16 h-16 mx-auto mb-4 text-zinc-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <p className="text-sm font-semibold">No results found matching your search</p>
                <p className="text-xs text-text-muted mt-1">Double check the spelling or try searching for another movie.</p>
              </div>
            )
          )}

          {/* Client-side Favorites tab grid */}
          {activeTab === 'favorites' && (
            favorites.length > 0 ? (
              <>
                <MovieGrid
                  movies={getPaginatedFavorites()}
                  favorites={favorites}
                  onToggleFavorite={handleToggleFavorite}
                  onMovieClick={setSelectedMovie}
                />
                <Pagination
                  page={page}
                  totalPages={totalFavoritesPages}
                  onPageChange={setPage}
                />
              </>
            ) : (
              <div className="w-full text-center py-20 text-zinc-500 border border-dashed border-zinc-800/80 rounded-xl animate-fade-in">
                <svg className="w-16 h-16 mx-auto mb-4 text-zinc-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <p className="text-sm font-semibold">Your Favorites List is Empty</p>
                <p className="text-xs text-text-muted mt-1">Browse trending movies and click the heart icon on any title to save them here.</p>
                <button
                  onClick={() => {
                    setActiveTab('browse')
                  }}
                  className="mt-5 px-5 py-2 bg-netflix-red hover:bg-netflix-red-hover text-white text-xs font-bold rounded shadow-md transition-colors"
                >
                  Browse Movies
                </button>
              </div>
            )
          )}

        </div>
      </main>

      {/* R4 Footer confirmation line */}
      <Footer />

      {/* Movie Details Modal */}
      {selectedMovie && (
        <MovieDetailsModal
          movie={selectedMovie}
          isFavorite={favorites.some((f) => f.id === selectedMovie.id)}
          onToggleFavorite={handleToggleFavorite}
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </div>
  );
}
