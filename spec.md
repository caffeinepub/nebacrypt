# Specification

## Summary
**Goal:** Add a Music page for the Synthetic Agondonters Collective and a landing page preview section, integrated into the existing Nebacrypt site navigation.

**Planned changes:**
- Create a new `/music` route and `MusicPage.tsx` displaying a responsive grid of hardcoded track cards (title, genre/description tag, outbound link to https://suno.com/@nebacrypt), styled to match the existing Nordic-themed design
- Add a compact music preview section to `LandingPage.tsx` showing 2–3 track cards and a "See all music" link to `/music`, placed after the services section
- Register the `/music` route in `App.tsx`
- Add a "Music" navigation link to `Header.tsx` for both desktop and mobile menus with active state styling

**User-visible outcome:** Users can discover the Synthetic Agondonters Collective via a preview on the landing page and navigate to a dedicated Music page listing all tracks, each linking out to the Suno profile in a new tab.
