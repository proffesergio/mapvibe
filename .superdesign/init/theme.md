Inter + Hind Siliguri; Tailwind 4; indigo brand; light/dark slate surfaces.
## src/app/globals.css
```
@import "tailwindcss";

@custom-variant dark (&:where(.dark, .dark *));

@theme {
  --font-sans: var(--font-hind), var(--font-inter), ui-sans-serif, system-ui,
    "Segoe UI", "Noto Sans Bengali", sans-serif;
  --font-bangla: var(--font-hind), "Noto Sans Bengali", ui-sans-serif, system-ui,
    sans-serif;

  --color-brand-50: #eef2ff;
  --color-brand-100: #e0e7ff;
  --color-brand-500: #4f46e5;
  --color-brand-600: #4338ca;
  --color-brand-700: #3730a3;

  --color-vibe-green: #16a34a;
  --color-vibe-amber: #f59e0b;
  --color-vibe-rose: #f43f5e;

  --color-poster-bg: #ffffff;
  --color-poster-ink: #111827;
}

:root {
  --background: #f8fafc;
  --foreground: #0f172a;
  color-scheme: light;
}

.dark {
  --background: #020617;
  --foreground: #f1f5f9;
  color-scheme: dark;
}

html {
  scroll-behavior: smooth;
}

body {
  background: var(--background);
  color: var(--foreground);
  font-family: var(--font-sans);
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}

/* Large touch targets for mobile-first checklist UX */
button,
a {
  -webkit-tap-highlight-color: transparent;
}

/* Poster export must never inherit dark-mode filters */
.poster-capture,
.poster-capture * {
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}

/* Subtle entrance for cards */
@keyframes vibe-rise {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.vibe-rise {
  animation: vibe-rise 0.35s ease-out both;
}

/* Animated live Bangladesh map — runs on every district (de)select.
   Paths remount via key flip in RealBdMap so .bd-district-on replays. */
.bd-district {
  transition: fill 0.35s ease, opacity 0.35s ease;
}

.bd-district-on {
  animation: bd-pop 0.45s ease-out;
}

@keyframes bd-pop {
  0% {
    opacity: 0.35;
  }
  60% {
    opacity: 1;
  }
  100% {
    opacity: 1;
  }
}

.bd-label-in {
  animation: bd-label-in 0.4s ease-out both;
}

@keyframes bd-label-in {
  from {
    opacity: 0;
    transform: translateY(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Expanding ripple on the last-picked district (live view only). */
.bd-ping {
  transform-box: fill-box;
  transform-origin: center;
  animation: bd-ping 1s ease-out infinite;
}

@keyframes bd-ping {
  0% {
    transform: scale(0.5);
    opacity: 0.9;
  }
  100% {
    transform: scale(2.4);
    opacity: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .bd-district-on,
  .bd-label-in,
  .bd-ping,
  .vibe-rise {
    animation: none;
  }
}

```