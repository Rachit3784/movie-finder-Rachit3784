import React from 'react';
import MovieCard from './MovieCard';

export default function MovieGrid({ movies, favorites, onToggleFavorite, onMovieClick }) {
  if (!movies || movies.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-6 sm:gap-6 animate-fade-in">
      {movies.map((movie) => {
        const isFav = favorites.some((fav) => fav.id === movie.id);
        return (
          <MovieCard
            key={movie.id}
            movie={movie}
            isFavorite={isFav}
            onToggleFavorite={onToggleFavorite}
            onClick={() => onMovieClick(movie)}
          />
        );
      })}
    </div>
  );
}
