# Specification

## Summary
**Goal:** Improve text contrast in the ICP teaser section on the landing page for better readability.

**Planned changes:**
- In `LandingPage.tsx`, apply a darker text color to the first paragraph inside the third div of the ICP teaser section (matching XPath `/html[1]/body[1]/div[1]/div[1]/main[1]/div[1]/section[1]/div[3]/div[1]/p[1]`) using a high-contrast color class (e.g., `text-gray-900`).

**User-visible outcome:** The targeted paragraph in the ICP teaser section is visibly darker and clearly legible against its background, meeting WCAG AA contrast requirements.
