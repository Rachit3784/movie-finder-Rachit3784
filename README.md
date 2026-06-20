# Movie Finder (Netflix Inspired)

An elegant, fully-responsive, and cinematic Movie Discovery application built with **Next.js (App Router)** and **Tailwind CSS v4**, powered by the **TMDB (The Movie Database) API**. 

Designed with Netflix aesthetics: pitch-black canvases, high-contrast layouts, glassmorphic headers, keyframe shimmers, and scale-up zoom cards.

---

## Key Features

1. **Cinematic Hero Banner**: Showcases the top trending movie with detailed backdrop, rating, and quick trailer play options (on page 1 of Browse).
2. **Dynamic Search**: Instant filtering and typing updates with a built-in 500ms debounce buffer to prevent API request spam.
3. **Netflix Hover Cards**: Zoom transitions, details, and floating heart icons to quickly bookmark titles.
4. **Proxy Route Handler (`/api/movies`)**: Keeps your TMDB API keys completely hidden from client inspection.
5. **Exact Pagination (12 items/page)**: Slices TMDB's native 20-item pages mathematically on the server side to return *exactly* 12 items per page with Prev/Next controls (no infinite scroll).
6. **Favorites List**: Custom tab displaying saved titles using `localStorage` persistence, fully compatible with client-side 12-item pagination.
7. **Interactive Details Modal**: Dynamically fetches movie status, runtime, casting directors, top actors, budgets, and plays the YouTube trailer in an iframe.
8. **Responsive Design**: Designed for all viewports (from 2 columns on mobile to 6 columns on extra-large monitors).

---

## Getting Started

### Prerequisites

- Node.js (v18.x or later recommended)
- A TMDB account to generate an API key or Read Access Token.

### Setup and Running Locally

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/movie-finder-rachit.git
   cd movie-finder-rachit
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the project root (you can copy the structure from `.env.example`):
   ```bash
   cp .env.example .env
   ```
   Add your TMDB keys inside `.env`:
   ```env
   # TMDB API Configuration
   # Get your API Key from https://www.themoviedb.org/settings/api

   # Option 1: Using TMDB v3 API Key
   TMDB_API_KEY=your_api_key_here

   # Option 2: Using TMDB v4 Read Access Token (Recommended)
   TMDB_API_TOKEN=your_read_access_token_here
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

5. **Build for Production**:
   ```bash
   npm run build
   ```

---

## Directory Structure

```txt
src/
├── app/
│   ├── api/
│   │   └── movies/
│   │       └── route.js      # Proxy handler & custom pagination slice math
│   ├── globals.css           # Custom Netflix theme styling
│   ├── layout.js             # SEO structure
│   └── page.js               # Client orchestration flow
└── components/
    ├── Footer.js             # Confirmation marker (Built for Jeevan — Rachit Gupta)
    ├── MovieCard.js          # Individual card layout & interactions
    ├── MovieDetailsModal.js  # Rich detail modal overlay & trailer player
    ├── MovieGrid.js          # Multi-column grid wrapper
    └── Pagination.js         # Navigation controller
```

---

## Spec Alignment Checklist

- [x] **R1 - Pagination**: 12 results per page, manual Prev/Next navigation, no infinite scroll.
- [x] **R2 - Repository name**: Lowercase `movie-finder-[yourfirstname]` (e.g. `movie-finder-rachit`).
- [x] **R3 - AI log file**: `AI_LOG.md` present in root folder with designated sections.
- [x] **R4 - Footer marker**: Matches exactly `Built for Jeevan — Rachit Gupta`.
- [x] **State Handling**: Beautiful skeletal shimmers for cards, detailed modal loading, clear empty search alerts, and API error screens.
