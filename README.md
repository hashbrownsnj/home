# Hash Browns — Showcase Site

The official Three.js-powered homepage for Hash Browns: cybersecurity, CyberPatriot,
and hackathon team.

**Stack:** Vite + vanilla JS + Three.js (hero background) + raw CSS animations
(scroll reveals, ticker, glitch hover, custom cursor, progress bar).

No React, no framework bloat — just fast, real code you can read top to bottom.

---

## 1. Install

You need [Node.js](https://nodejs.org) 18+ installed. Then, in this folder:

```bash
npm install
```

## 2. Run it locally

```bash
npm run dev
```

This starts a dev server (usually at `http://localhost:5173`) and opens it in
your browser automatically. Edit any file and the page hot-reloads instantly.

## 3. Build for production

```bash
npm run build
```

This outputs a fully static site into the `dist/` folder. You can deploy that
folder to **any** static host:

- **Vercel / Netlify**: drag-and-drop the `dist` folder, or connect the repo
  and set build command `npm run build`, output dir `dist`.
- **GitHub Pages**: push `dist/` contents to a `gh-pages` branch (or use the
  `gh-pages` npm package).
- **Cloudflare Pages**: same as Vercel — connect repo, build command
  `npm run build`, output `dist`.

To preview the production build locally before deploying:

```bash
npm run preview
```

---

## 4. Adding a project (the whole point)

Open **`src/data/projects.js`**. Add an object to the `projects` array:

```js
{
  id: "phishnet",
  title: "PhishNet",
  description: "A browser extension that flags phishing attempts in real time using heuristic URL analysis and a live threat-feed lookup.",
  url: "https://phishnet.hashbrowns.dev",
  repo: "https://github.com/HashBrownsNj/phishnet",
  tags: ["Chrome Extension", "Security", "JavaScript"],
  year: "2026",
  status: "live",   // "live" | "build" | "archived"
}
```

That's it. The homepage will:

1. Automatically fetch a **live screenshot preview** of `url` (via a free,
   keyless screenshot API — no setup needed) and use it as the card cover.
2. Render your `description`, `tags`, year, and status chip.
3. Link the **Visit** button to `url` and the **Source** button to `repo`
   (if provided).

If you'd rather supply your own cover image instead of the auto-screenshot,
just add a `cover: "https://your-image-url.png"` field — it overrides the
automatic preview.

No rebuild step is required beyond the normal `npm run dev` / `npm run build` —
it's just data in a JS file.

---

## 5. Project structure

```
hashbrowns/
├── index.html              # page markup/sections
├── src/
│   ├── main.js              # wires everything together (cursor, nav, reveal, etc.)
│   ├── style.css            # the entire visual identity
│   ├── scrollReveal.js       # IntersectionObserver-based scroll animation trigger
│   ├── three/
│   │   └── heroScene.js     # Three.js particle/ember field in the hero section
│   ├── components/
│   │   ├── team.js          # renders the team grid from data/team.js
│   │   └── projects.js      # renders the project grid from data/projects.js
│   └── data/
│       ├── team.js          # ← edit bios/links here
│       └── projects.js      # ← ADD YOUR PROJECTS HERE
├── public/
│   └── favicon.svg
├── package.json
└── vite.config.js
```

## 6. Editing team info / links

Open `src/data/team.js`. Each person has `name`, `role`, `quote`, `bio`,
`github`, `linkedin`, and `initials` (used for the avatar badge). Set a link
to `null` to hide that button (already done for members without a public
profile of that type).

Company-wide links (LinkedIn company page, org GitHub) live in the same file
under `socials`, and are also hardcoded into the contact section in
`index.html` if you want to restyle that section directly.

---

## Notes on the screenshot preview service

Project cards use `api.microlink.io` to grab a live screenshot of each
project's URL — it's free, requires no API key, and works out of the box.
If a site blocks screenshotting (rare) or the request fails, the card
gracefully falls back to a styled "NO PREVIEW" placeholder instead of a
broken image. If you want guaranteed control over a card's look, just set
the `cover` field manually as described above.
