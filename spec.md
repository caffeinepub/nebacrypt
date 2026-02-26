# Specification

## Summary
**Goal:** Fix the Nebacrypt logo banner image in the Footer component so it displays fully without any cropping.

**Planned changes:**
- Update the footer logo image element and its immediate container to use sufficient width (e.g., `w-full` or a large enough fixed/max width) so the image is not cropped
- Ensure the parent container does not have `overflow-hidden` or any style that clips the image

**User-visible outcome:** The Nebacrypt logo banner in the footer renders fully and without cropping on all common screen widths.
