# 🗓️ Interactive Wall Calendar

A beautiful, fully responsive, and heavily interactive React component that faithfully replicates the physical experience of a wall calendar right in your browser. 

The aesthetic is built tightly over a modern geometric-hero design and integrates immersive 3D CSS transforms to bring genuine tactile interactions to web elements—highlighted by an authentic 3d-accelerated page-flipping animation when cycling between months.

## 🎥 Previews

### Desktop View
<video src="./src/videos/desktop-view.mp4" controls width="100%"></video>

### Mobile View
<video src="./src/videos/mobile-view.mp4" controls width="100%"></video>

## ✨ Core Features

* **3D Page Swapping**: Rotating the viewpoint month dynamically translates into a hardware-accelerated 3D flip over the top X-axis, mirroring how one flips a physical calendar over its binding.
* **Responsive Visual Hierarchy**: Uses a complex flex/grid structural order. Features a distinct two-column view (Notes on left, Grid on right) on Desktop, which smoothly collapses and reorders the DOM natively for Mobile viewing (Hero -> Grid -> Notes).
* **Date Range Selector**: Built-in state logic cleanly captures "From" and "To" active date highlights, gracefully styling continuous periods across the month grid.
* **Integrated Notes Platform**: Functional jotting space baked seamlessly into the UI.
* **Spiral-bound Aesthetic**: Features a custom-rendered CSS binding clip modeled accurately for varying device resolutions using dynamic flexbox spacing algorithms.

## 🛠️ Technology Stack

* **React 18**: Function components and reactive state hooks (`useState`, `useEffect`) manage the fluid month-range logic and DOM classes.
* **Vanilla CSS3**: Beautifully curated with 0 utility libraries. Styled explicitly through `WallCalendar.css` leveraging:
  * CSS Grid arrays
  * `transform-style: preserve-3d` / `perspective` matrices for naturalistic flips
  * `@media` breakpoints for spatial integrity
* **Vite**: Rapid development environment integration and production-ready bundler optimizations.

## 🚀 Getting Started

This template requires **Node.js v18+**.

### 1. Installation

Clone down the repository and pull the initial dependencies.

```bash
npm install
```

### 2. Local Development Server

Fire up the Vite development environment for instant Hot Module Relocating (HMR).

```bash
npm run dev
```

### 3. Building for Production

Output highly optimized and minified static assets to your `dist/` directory.

```bash
npm run build
```

## 📐 Component Architecture Explained

The main structural flow is strictly split:
* `<div className="cal-controls">`: Top-level command array triggering date flips outside of the rotating DOM block to prevent UX clipping.
* `<div className="spiral-container">`: Dynamically spaced structural `.spiral-loop` wireframes. Auto-hides on mobile breakpoints for non-overlapping mobile ratios.
* `<div className="calendar-card">`: Contains the Hero image block (with SVG geometric mask overlay) and the localized payload (`.cal-body`), actively responding to the 3D `.flip-start` class sequence. 

## 📝 License

This project is open-source and free to be edited or configured into standard dashboard setups or personal React application architectures!
