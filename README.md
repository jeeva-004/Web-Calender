# 🗓️ Wall Calendar — Interactive React Component

A polished, interactive wall calendar component built with React + Vite.

## Features

- **Wall Calendar Aesthetic** — Hero image section at the top with a dynamic gradient + icon per month, and decorative spiral rings, emulating a physical wall calendar
- **Day Range Selector** — Click a start date, then click an end date. Days in-between are highlighted. A badge shows the selected range and duration. Click "✕" to clear.
- **Integrated Notes Section** — Click "📝 Notes" to open the notes panel. Add general month notes or day-specific notes. Right-click any day to jump directly to that day's notes tab.
- **Holiday Markers** — Key holidays are color-coded (red) with a tooltip on hover.
- **Today Highlight** — Today's date is always highlighted in blue.
- **Dark / Light Theme** — Toggle with ☀️/🌙 button in the hero area.
- **Flip Animation** — Smooth flip animation when navigating between months.
- **Fully Responsive** — Adapts gracefully from mobile to desktop.

## Getting Started

```bash
npm install
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173).

## Usage Tips

| Action | Result |
|---|---|
| Click a day | Set range start or end |
| Right-click a day | Open note for that day |
| ☀️/🌙 button | Toggle dark/light theme |
| "Today" button | Jump back to current month |
| "📝 Notes" button | Show/hide notes panel |

## Tech Stack

- React 18
- Vite 5
- CSS-in-JS (style tag inside component)
- Google Fonts: Playfair Display + DM Sans

## Design Decisions

- Gradient hero images per month emulate seasonal photography without requiring external images
- Floating icon animation adds life to the hero
- Notes are keyed by date string (`YYYY-MM-DD`) or `"general"` for month notes
- All state is in-memory (no localStorage per task spec)
