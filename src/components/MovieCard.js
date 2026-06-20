import React from 'react';

export default function MovieCard({ movie, isFavorite, onToggleFavorite, onClick }) {
  const { title, poster_path, release_date, vote_average } = movie;
  
  // Extract release year
  const releaseYear = release_date ? release_date.substring(0, 4) : 'N/A';
  
  // Format rating to 1 decimal place
  const rating = vote_average ? vote_average.toFixed(1) : 'N/A';

  // TMDB Poster image path (w342 size is optimal for grids)
  const posterUrl = poster_path 
    ? `https://image.tmdb.org/t/p/w342${poster_path}` 
    : null;

  const handleFavoriteClick = (e) => {
    e.stopPropagation(); // Prevent opening the details modal when clicking the favorite button
    onToggleFavorite(movie);
  };

  return (
    <div 
      onClick={onClick}
      className="group relative cursor-pointer overflow-hidden rounded-md bg-card-bg zoom-effect flex flex-col justify-between border border-border-custom h-[380px] sm:h-[420px]"
    >
      {/* Movie Poster or Placeholder */}
      <div className="relative w-full h-[78%] bg-zinc-900 flex items-center justify-center text-center overflow-hidden">
        {posterUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img 
            src={posterUrl} 
            alt={`${title} poster`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex flex-col items-center justify-center p-6 text-zinc-500">
            <svg 
              className="w-12 h-12 mb-3 text-zinc-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
            </svg>
            <span className="text-sm font-medium line-clamp-2 px-2">{title}</span>
          </div>
        )}

        {/* Top-Right Favorite Floating Button */}
        <button 
          onClick={handleFavoriteClick}
          className="absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md transition-all hover:bg-black/90 hover:scale-110 border border-white/10"
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <svg 
            className={`w-4 h-4 transition-colors ${isFavorite ? 'fill-netflix-red text-netflix-red' : 'text-zinc-300'}`} 
            fill={isFavorite ? 'currentColor' : 'none'} 
            stroke="currentColor" 
            strokeWidth="2.5" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
          </svg>
        </button>

        {/* Netflix Gradient overlay at the bottom of poster */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f10] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </div>

      {/* Info details section */}
      <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between bg-card-bg">
        <div>
          <h3 className="text-sm sm:text-base font-semibold text-zinc-100 line-clamp-1 group-hover:text-white transition-colors">
            {title}
          </h3>
          <div className="flex items-center gap-2 mt-1.5 text-xs text-text-muted font-medium">
            <span>{releaseYear}</span>
            <span className="inline-block h-3 w-[1px] bg-zinc-700" />
            <div className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5 text-amber-500 fill-amber-500" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-zinc-200">{rating}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
