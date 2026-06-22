/**
 * ============================================================
 *  HASH BROWNS — PROJECT REGISTRY
 * ============================================================
 *  This is the ONLY file you need to touch to add a project
 *  to the showcase. Add a new object to the `projects` array
 *  below and the homepage will automatically render a live
 *  preview card for it (screenshot fetched from the URL via
 *  a free preview/thumbnail service), plus your description,
 *  tags, and links.
 *
 *  FIELDS:
 *  --------------------------------------------------------
 *  id          : unique slug, no spaces (e.g. "ghostpacket")
 *  title       : project name shown on the card
 *  description : your blurb — shows on hover / expanded card
 *  url         : the live URL of the project (used to build
 *                the auto preview screenshot + the "Visit" link)
 *  repo        : (optional) GitHub repo URL, shown as a second
 *                button if provided
 *  tags        : array of short strings, e.g. ["CTF", "Python"]
 *  year        : string, e.g. "2025"
 *  status      : "live" | "build" | "archived"  (colors the chip)
 *  cover       : (optional) override image URL. If omitted, a
 *                live screenshot preview of `url` is generated
 *                automatically — you don't have to do anything.
 *  accent      : (optional) hex color for this card's glow,
 *                defaults to the team gold if omitted.
 * ============================================================
 */

export const projects = [
  {
    id: "aegis",
    title: "AEGIS",
    description:
      "A full-stack emergency department operations platform with ACUITY — an adaptive clinical urgency and intelligence triage layer — embedded as decision support. Built for our hackathon with real RBAC, JWT auth, and audit logging, not a demo shell.",
    url: "https://github.com/HashBrownsNj/AEGIS",
    repo: "https://github.com/HashBrownsNj/AEGIS",
    tags: ["React", "TypeScript", "Node.js", "MongoDB", "Hackathon"],
    year: "2025",
    status: "build",
    accent: "#ffb627",
  },
  {
    id: "tempo",
    title: "Tempo",
    description:
      "Our private internal workspace — tasks, chat, calendar, notes, focus sessions, WebRTC video calls, and live team presence in one hub. Built so Hash Browns runs on our own software instead of a dozen scattered tools.",
    url: "https://dashboard.hashbrownsnj.dev",
    repo: "https://github.com/HashBrownsNj/Tempo",
    tags: ["Next.js", "TypeScript", "MongoDB", "Internal Tool"],
    year: "2025",
    status: "live",
    accent: "#ffb627",
  },

  // ── ADD YOUR NEXT PROJECT BELOW THIS LINE ──────────────────
  // {
  //   id: "your-project-slug",
  //   title: "Your Project Name",
  //   description: "One or two sharp sentences. No fluff.",
  //   url: "https://your-live-url.com",
  //   repo: "https://github.com/HashBrownsNj/your-repo",
  //   tags: ["Tag1", "Tag2"],
  //   year: "2026",
  //   status: "live",
  // },
];
