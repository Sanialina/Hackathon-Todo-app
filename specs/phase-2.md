# Phase 2: Aesthetics and UI/UX

## 1. Phase Goal
Transform the skeletal application into a visually stunning product using Glassmorphism principles, custom fonts, and responsive layouts.

## 2. Description
This phase introduces the "Prism" identity. We will implement Tailwind CSS utility classes to create translucent backgrounds, blurs, and floating animations.

## 3. Planned Features
*   Background gradient blobs with animation.
*   Glassmorphic card styling (transparency + backdrop blur).
*   Custom Font integration (Outfit/Sans-serif).
*   Responsive container layout.

## 4. Functional Requirements
*   **FR-2.1:** Background shall feature animated floating gradient orbs.
*   **FR-2.2:** Task cards shall utilize `backdrop-filter: blur` to simulate glass.
*   **FR-2.3:** Typography shall be updated to a modern geometric sans-serif.
*   **FR-2.4:** Layout shall adapt to Mobile (stacked) and Desktop (centered) viewports.

## 5. Non-Functional Requirements
*   UI must pass contrast accessibility checks where possible (text on glass).
*   Animations must not be CPU intensive.

## 6. Acceptance Criteria
*   The "Glass" effect is visible on task cards.
*   Background elements float/animate smoothly.
*   Font family matches the design spec.
