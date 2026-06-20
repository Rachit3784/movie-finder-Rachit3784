'use client';

import React, { useEffect, useState, useRef } from 'react';

export default function MovieDetailsModal({ movie, onClose, isFavorite, onToggleFavorite }) {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);
  const modalRef = useRef(null);

  // Fetch full details (including credits & videos)
  useEffect(() => {
    if (!movie?.id) return;

    let isMounted = true;
    setLoading(true);
    setError(null);
    setShowTrailer(false);

    fetch(`/api/movies?id=${movie.id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load movie details');
        return res.json();
      })
      .then((data) => {
        if (isMounted) {
          setDetails(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [movie?.id]);

  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    // Lock scroll on body when modal is open
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  if (!movie) return null;

  // Extract basic details from movie or API details
  const title = details?.title || movie.title;
  const overview = details?.overview || movie.overview;
  const rating = details?.vote_average ? details.vote_average.toFixed(1) : movie.vote_average?.toFixed(1) || 'N/A';
  const releaseYear = (details?.release_date || movie.release_date)?.substring(0, 4) || 'N/A';
  
  // Backdrop image URL (original or w780 size)
  const backdropUrl = (details?.backdrop_path || movie.backdrop_path)
    ? `https://image.tmdb.org/t/p/w780${details?.backdrop_path || movie.backdrop_path}`
    : null;

  const posterUrl = (details?.poster_path || movie.poster_path)
    ? `https://image.tmdb.org/t/p/w342${details?.poster_path || movie.poster_path}`
    : null;

  // Extra details from API
  const runtime = details?.runtime 
    ? `${Math.floor(details.runtime / 60)}h ${details.runtime % 60}m` 
    : null;

  const genres = details?.genres || [];
  
  // Cast and crew extraction
  const cast = details?.credits?.cast?.slice(0, 5).map(c => c.name).join(', ') || '';
  const director = details?.credits?.crew?.find(c => c.job === 'Director')?.name || '';

  // Trailer video key
  const trailerVideo = details?.videos?.results?.find(
    (v) => (v.type === 'Trailer' || v.type === 'Teaser') && v.site === 'YouTube'
  );

  const handleBackdropClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  return (
    <div 
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 overflow-y-auto animate-fade-in backdrop-blur-sm"
    >
      <div 
        ref={modalRef}
        className="relative w-full max-w-4xl rounded-xl overflow-hidden glass-modal shadow-2xl animate-slide-up my-8 max-h-[90vh] overflow-y-auto"
      >
        {/* Header backdrop area */}
        <div className="relative w-full h-[250px] sm:h-[380px] bg-zinc-950">
          {showTrailer && trailerVideo ? (
            <div className="w-full h-full">
              <iframe
                src={`https://www.youtube.com/embed/${trailerVideo.key}?autoplay=1`}
                title={`${title} Trailer`}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
              <button 
                onClick={() => setShowTrailer(false)}
                className="absolute top-4 left-4 z-10 flex items-center gap-1.5 px-3 py-1.5 bg-black/80 hover:bg-black text-xs font-semibold text-white rounded-md border border-white/10"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Show Poster
              </button>
            </div>
          ) : (
            <>
              {backdropUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img 
                  src={backdropUrl} 
                  alt={`${title} backdrop`}
                  className="w-full h-full object-cover object-top opacity-80"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-zinc-900/60">
                  <span className="text-zinc-600 text-sm">No image available</span>
                </div>
              )}
              
              {/* Bottom gradient fade for text legibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#18181b] via-[#18181b]/40 to-transparent" />
              
              {/* Floating control buttons */}
              <div className="absolute bottom-6 left-6 right-6 flex flex-wrap items-end justify-between gap-4">
                <div className="max-w-[70%]">
                  {details?.tagline && (
                    <span className="inline-block px-2.5 py-1 mb-2 bg-netflix-red/90 text-[10px] sm:text-xs font-bold uppercase tracking-wider rounded">
                      {details.tagline}
                    </span>
                  )}
                  <h2 className="text-xl sm:text-3xl font-extrabold text-white leading-tight drop-shadow-md">
                    {title}
                  </h2>
                </div>

                <div className="flex items-center gap-3">
                  {trailerVideo && (
                    <button 
                      onClick={() => setShowTrailer(true)}
                      className="flex items-center gap-2 px-5 py-2.5 bg-white text-black hover:bg-zinc-200 transition-colors font-bold text-sm sm:text-base rounded-md shadow-md active:scale-95"
                    >
                      <svg className="w-5.5 h-5.5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                      Play Trailer
                    </button>
                  )}
                  <button 
                    onClick={() => onToggleFavorite(movie)}
                    className="flex h-11 w-11 items-center justify-center rounded-full bg-zinc-800/80 text-white backdrop-blur-md transition-colors hover:bg-zinc-700 border border-white/10 active:scale-95"
                    aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                  >
                    <svg 
                      className={`w-5.5 h-5.5 transition-colors ${isFavorite ? 'fill-netflix-red text-netflix-red' : 'text-zinc-300'}`} 
                      fill={isFavorite ? 'currentColor' : 'none'} 
                      stroke="currentColor" 
                      strokeWidth="2.5" 
                      viewBox="0 0 24 24" 
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                    </svg>
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Close button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 hover:bg-black/80 text-zinc-300 hover:text-white transition-colors border border-white/10"
            aria-label="Close details"
          >
            <svg className="w-5.5 h-5.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Dynamic content information area */}
        <div className="p-6 sm:p-8 bg-[#18181b] grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Main info text */}
          <div className="md:col-span-2 space-y-6">
            <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm font-semibold text-zinc-300">
              {/* Year */}
              <span>{releaseYear}</span>
              
              {/* Runtime */}
              {runtime && (
                <>
                  <span className="h-3 w-[1px] bg-zinc-700" />
                  <span>{runtime}</span>
                </>
              )}

              {/* Rating */}
              <span className="h-3 w-[1px] bg-zinc-700" />
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4 text-amber-500 fill-amber-500" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-white">{rating}</span>
                <span className="text-zinc-500 font-normal">/ 10</span>
              </div>
            </div>

            {/* Overview / Storyline */}
            <div className="space-y-2">
              <h4 className="text-zinc-400 font-bold uppercase tracking-wider text-xs">Storyline</h4>
              <p className="text-zinc-200 text-sm sm:text-base leading-relaxed font-normal">
                {overview || 'No storyline description is currently available for this title.'}
              </p>
            </div>

            {/* Genres list */}
            {genres.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {genres.map((g) => (
                  <span 
                    key={g.id}
                    className="px-3 py-1 bg-zinc-800 text-zinc-300 text-xs font-medium rounded-full border border-zinc-700/50"
                  >
                    {g.name}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Credits and dynamic details card */}
          <div className="bg-[#1f1f23] rounded-lg p-5 border border-zinc-800/60 h-fit space-y-4">
            {loading ? (
              <div className="space-y-4 animate-pulse">
                <div className="h-4 bg-zinc-800 rounded w-2/3"></div>
                <div className="h-4 bg-zinc-800 rounded w-full"></div>
                <div className="h-4 bg-zinc-800 rounded w-1/2"></div>
              </div>
            ) : error ? (
              <div className="text-xs text-netflix-red font-medium">
                Failed to fetch cast details.
              </div>
            ) : (
              <>
                {director && (
                  <div>
                    <span className="block text-zinc-500 font-bold uppercase tracking-wider text-[10px]">Director</span>
                    <span className="text-sm font-semibold text-zinc-200">{director}</span>
                  </div>
                )}
                
                {cast && (
                  <div>
                    <span className="block text-zinc-500 font-bold uppercase tracking-wider text-[10px]">Starring</span>
                    <span className="text-sm text-zinc-300 leading-normal block">{cast}</span>
                  </div>
                )}

                {details?.status && (
                  <div className="grid grid-cols-2 gap-4 pt-2 border-t border-zinc-800">
                    <div>
                      <span className="block text-zinc-500 font-bold uppercase tracking-wider text-[9px]">Status</span>
                      <span className="text-xs text-zinc-300 font-medium">{details.status}</span>
                    </div>
                    {details?.budget > 0 && (
                      <div>
                        <span className="block text-zinc-500 font-bold uppercase tracking-wider text-[9px]">Budget</span>
                        <span className="text-xs text-zinc-300 font-medium">
                          ${(details.budget / 1000000).toFixed(1)}M
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
