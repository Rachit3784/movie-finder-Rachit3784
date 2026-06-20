# AI LOG

## Tools Used

- **Gemini**: Used for architectural planning, designing the server-side pagination slicing logic, and debugging Next.js framework issues.

---

## Best Prompts

### Prompt 1
> "Create a Next.js API route that proxies TMDB search and popular endpoints, accepting page and query params. It must mathematically convert TMDB's 20 items per page to exactly 12 items per page to satisfy the pagination requirement, fetching multiple pages from TMDB where boundaries overlap, and slice them correctly."
- **Why it worked**: This prompt clearly specified the math requirements (offset, page indexing). It allowed the AI to implement a flawless page-mapping mechanism on the server side, keeping our TMDB API keys completely hidden from client inspection while guaranteeing exactly 12 results.

### Prompt 2
> "Implement an attractive, professional movie details modal component in Tailwind CSS. It should load detailed info (runtime, genres, cast, crew, trailers) dynamically using the route handler, and feature backdrop image covers, a close button, play trailer buttons, and full support for keyboard ESC close and scroll lock."
- **Why it worked**: Instead of overloading the main grid by fetching heavy metadata upfront, this prompt effectively decoupled the movie card layout from deep metadata fetching, helping build a highly performant interface with clean loading skeletons.

---

## What I Fixed Manually

### 1. Empty Favorites Tab Rendering Error
The AI-generated code assumed that data would always be present when rendering the movie grid. When switching over to the **Favorites** tab while no movies were saved in `localStorage`, the application threw a runtime exception trying to read properties of undefined. I manually resolved this by adding a safety fallback check and structural tabs, rendering a graceful "No favorites saved yet" empty state message.

### 2. Next.js Cross-Origin (CORS) Restrictions
During local testing and API proxying, explicit cross-origin issues surfaced when communicating across standard request boundaries. The AI didn't configure headers for the framework route wrapper. I manually intervened and updated `next.config.mjs` to explicitly declare allowed headers and source origins to bypass the routing block cleanly.

### 3. Next.js 15+ Async `params` and `searchParams` Promises
The AI initially accessed the page `searchParams` synchronously, which throws critical dynamic layout errors in the latest Next.js architectures because they are now resolved as promises. I manually refactored the parameter consumption logic using modern `async/await` patterns to guarantee strict alignment with the latest framework specs.
