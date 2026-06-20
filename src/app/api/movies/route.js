
async function fetchFromTMDB(endpoint, params = {}) {
  const token = process.env.TMDB_API_TOKEN;
  const apiKey = process.env.TMDB_API_KEY;

  const url = new URL(`https://api.themoviedb.org/3${endpoint}`);
  
  // Set default query parameters
  Object.entries(params).forEach(([key, val]) => {
    if (val !== undefined && val !== null) {
      url.searchParams.set(key, String(val));
    }
  });

  const headers = {
    'Content-Type': 'application/json',
  };

  // Authenticate using v4 Bearer token if present; fallback to v3 API Key
  if (token && token !== 'your_read_access_token_here' && token.trim() !== '') {
    headers['Authorization'] = `Bearer ${token.trim()}`;
  } else if (apiKey && apiKey !== 'your_api_key_here' && apiKey.trim() !== '') {
    url.searchParams.set('api_key', apiKey.trim());
  } else {
    throw new Error(
      'TMDB credentials are not configured. Please add TMDB_API_KEY or TMDB_API_TOKEN in the .env file.'
    );
  }

  const res = await fetch(url.toString(), {
    headers,
    next: { revalidate: 3600 } // Cache API responses for 1 hour
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    const message = errorBody.status_message || res.statusText;
    throw new Error(`TMDB API Error: ${res.status} - ${message}`);
  }

  return res.json();
}

export async function GET(request) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    // Check if dynamic movie details are requested by ID
    const id = searchParams.get('id');
    if (id) {
      const data = await fetchFromTMDB(`/movie/${id}`, {
        append_to_response: 'credits,videos'
      });
      return Response.json(data);
    }

    const page = parseInt(searchParams.get('page') || '1', 10);
    const query = searchParams.get('query') || '';

    // Specifications R1: Exactly 12 results per page.
    const ITEMS_PER_PAGE = 12;
    const TMDB_ITEMS_PER_PAGE = 20;

    const start = (page - 1) * ITEMS_PER_PAGE;
    const end = page * ITEMS_PER_PAGE;

    const tmdbPageStart = Math.floor(start / TMDB_ITEMS_PER_PAGE) + 1;
    const tmdbPageEnd = Math.floor((end - 1) / TMDB_ITEMS_PER_PAGE) + 1;

    let results = [];
    let totalResults = 0;

    // Use TMDB Search or Trending/Popular
    const endpoint = query.trim() ? '/search/movie' : '/movie/popular';
    const fetchParams = query.trim() ? { query: query.trim() } : {};

    // Fetch the start page
    const dataStart = await fetchFromTMDB(endpoint, {
      ...fetchParams,
      page: tmdbPageStart
    });
    
    results = results.concat(dataStart.results || []);
    totalResults = dataStart.total_results || 0;

    // Fetch the end page if the 12 items cross the TMDB page boundary
    if (
      tmdbPageStart !== tmdbPageEnd &&
      (tmdbPageEnd - 1) * TMDB_ITEMS_PER_PAGE < totalResults
    ) {
      const dataEnd = await fetchFromTMDB(endpoint, {
        ...fetchParams,
        page: tmdbPageEnd
      });
      results = results.concat(dataEnd.results || []);
    }

    // Slice to obtain the exact 12 items
    const sliceStart = start % TMDB_ITEMS_PER_PAGE;
    const paginatedResults = results.slice(sliceStart, sliceStart + ITEMS_PER_PAGE);
    const totalPages = Math.ceil(totalResults / ITEMS_PER_PAGE);

    return Response.json({
      results: paginatedResults,
      page,
      totalPages,
      totalResults
    });
  } catch (error) {
    console.error('API Error:', error);
    return Response.json(
      { error: error.message || 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}
