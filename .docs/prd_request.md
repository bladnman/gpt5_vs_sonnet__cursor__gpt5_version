## **PRD REQUEST - 'The Shows' App**

> **You are to create a Product Requirements Document (PRD) for a new Next.js application.**
>
> The application will have both a **front-end UI** and a **back-end API**. It should follow a **clean, opinionated file/folder structure** with clear separation between components, services, and utilities, as defined in the attached *Structure and Theme* document.
>
> **Purpose:** The app will help users discover, track, and rate *shows* — where “shows” is an alias for both TV series and movies. The application will integrate with the **TMDB API** to provide search, discovery, and metadata.
>
> **Core Capabilities:**
>
> 1. **Show Discovery**
>    - Search shows by title (powered by TMDB API).
>    - View lists of *New*, *Popular*, and *Trending* shows.
>    - Filter shows by genre, interest level, or other criteria.
> 2. **User Collections**
>    - Maintain personal lists:
>      - Shows to watch (watchlist)
>      - Shows watched (history)
>    - Assign an *interest level* to watchlist items.
>    - Rate shows the user has watched.
>    - Keep both a **personal rating** and display the **community rating** from TMDB.
>    - View top shows by personal rating and by community rating.
> 3. **Search & Filtering**
>    - Search should be a core entry point for finding and adding shows to collections.
>    - Provide combined or separate search views for TV and movies, depending on UX considerations.
> 4. **Back-End Requirements**
>    - Persist user data (watchlist, history, ratings) in a local or hosted database.
>    - Cache API results from TMDB to reduce unnecessary calls, with explicit logging for cache hits/misses.
> 5. **Testing**
>    - Include unit tests for data handling and business logic.
>    - Include UI tests for critical flows (searching, adding to watchlist, rating).
> 6. **Extensibility Considerations**
>    - Possible future features:
>      - Authentication (Google OAuth)
>      - LLM integrations for information, advice, summaries, recommendations and other features
>      - Richer analytics (e.g., recommendations, trends over time)
>
> **Constraints:**
>
> - Must be implemented as a Next.js application.
> - Avoid complex external integrations during initial build (beyond TMDB API).
> - Follow the *Structure and Theme* document for structure, naming conventions, and theming.
> - Provide light design guidance (e.g., card-grid layout for show listings with filter sidebar).
>
> **Deliverable:** A PRD detailed enough that multiple independent developers could build consistent, comparable versions of this application while allowing flexibility in tech stack choice.
