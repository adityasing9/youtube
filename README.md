# 🎯 NotDistract

> **YouTube without the distraction.**  
> *Search → Watch → Focus → Finish → Leave.*

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![PWA Ready](https://img.shields.io/badge/PWA-Ready-10b981.svg)](manifest.json)
[![Zero Dependencies](https://img.shields.io/badge/Dependencies-0-success.svg)](#tech-stack)
[![GitHub Pages](https://img.shields.io/badge/Hosted_on-GitHub_Pages-ef4444.svg)](https://adityasing9.github.io/youtube/)

---

## 🔗 Live Demo & Version Archives

* **V5 (Current Flagship):** [https://adityasing9.github.io/youtube/](https://adityasing9.github.io/youtube/)
* **V4 Archive:** [https://adityasing9.github.io/youtube/v4/](https://adityasing9.github.io/youtube/v4/)
* **V3 Archive:** [https://adityasing9.github.io/youtube/v3/](https://adityasing9.github.io/youtube/v3/)
* **V2 Archive:** [https://adityasing9.github.io/youtube/v2/](https://adityasing9.github.io/youtube/v2/)
* **V1 Archive:** [https://adityasing9.github.io/youtube/v1/](https://adityasing9.github.io/youtube/v1/)

---

## 💡 What is NotDistract?

**NotDistract** is an intentional, distraction-free YouTube experience engineered to eliminate algorithmic rabbit holes and help you accomplish what you came for.

Standard YouTube is optimized for endless engagement: algorithmic home feeds, infinite recommendations, shorts, autoplay, comments, and notification loops designed to keep you watching for hours.

NotDistract flips this model upside down:
1. **Search** only for what you came to learn or watch.
2. **Watch** inside an isolated, distraction-free player.
3. **Focus** with a built-in session timer.
4. **Finish** your scheduled block.
5. **Leave** without being nudged into another video.

---

## 🧠 Core Philosophy

$$\text{Search} \longrightarrow \text{Watch} \longrightarrow \text{Focus} \longrightarrow \text{Finish} \longrightarrow \text{Leave}$$

* **Zero Algorithmic Home Feeds:** When you open NotDistract, you see only a calm search bar.
* **Controlled, Finite Results:** Search results are strictly limited to direct matches—never an infinite scroll.
* **Dedicated Focus Mode:** Dedicated embed player without recommended sidebars, related videos, shorts, or comment sections.
* **Distraction Warning Shield:** A gentle intervention prompts you if you try to navigate away before your focus timer expires.
* **Local Session Tracking:** Your focus sessions are tracked privately on your device.

---

## 🚀 Features in V5

### 1. 🔍 Search-First Homepage
* Clean, minimal, calm interface designed to reduce cognitive load.
* Search by keywords (e.g., *"FastAPI Tutorial"*, *"DSA Graphs"*, *"Deep Work Focus Music"*) or paste any direct YouTube URL (`youtube.com/watch?v=...`, `youtu.be/...`) or raw 11-character video ID.
* Recent searches stored in your browser with one-click search and quick removal.
* Philosophy guide outlining intentional viewing steps.

### 2. 📋 Controlled Search Results
* Finite, card-based layout (maximum 12 results, no infinite scrolling).
* High-resolution video thumbnails with duration badges.
* Clear metadata: video title, channel name, views, and publication age.
* Informative loading skeletons, empty states, and friendly connection error handling.

### 3. 🛡️ Signature Focus Mode
* Distraction-free embedded player (`youtube-nocookie.com` with `rel=0` and `modestbranding=1`).
* Strips away recommendations, trending shorts, comments, and engagement hooks.
* Video metadata and channel information displayed cleanly.
* Quick focus goal / intention input to state what you plan to learn.

### 4. ⏱️ Focus Timer
* Quick presets: **15 min**, **25 min (Pomodoro)**, **45 min (Deep Work)**, or **Custom Duration**.
* Visual circular countdown display (SVG progress ring + MM:SS readout).
* Controls: **Start Focus**, **Pause**, **Resume**, and **Reset**.
* **State Persistence:** If you accidentally refresh or close the tab, your timer automatically recalculates and resumes based on your target timestamp.
* **Audio Cues:** Built-in two-tone completion chime generated entirely via the native Web Audio API (zero audio file downloads, works offline).
* Completed session dialog celebrating intentional completion without pushing another video.

### 5. ⚠️ Distraction Warning Intervention
* Lightweight shield that intercepts navigation attempts while a focus timer is running.
* Displays a clear confirmation:
  > *"You're leaving your current focus session."*  
  > *Current focus: [Video Title]*  
  > `[Stay Focused]` &nbsp; `[Continue & Leave]`
* Respects user autonomy—encourages focus without blocking.

### 6. 📊 Session History
* Stored 100% locally in browser `localStorage`.
* Tracks video title, channel, date & time, duration, and completion status (✓ Completed vs. ⏹ Partial).
* Daily analytics summary: **Sessions Completed Today** and **Total Focus Time**.
* Re-focus button to quickly re-open past educational videos in Focus Mode.
* Option to clear history at any time with confirmation.

### 7. 📱 Responsive UI & Accessibility
* Handcrafted modern dark slate theme (`#090a0f`) with crimson accents.
* Fluid responsive design across mobile phones, tablets, laptops, and wide desktop screens.
* Accessible buttons (minimum 44px touch targets), `:focus-visible` keyboard rings, and semantic HTML5 landmarks.

### 8. 📦 Progressive Web App (PWA)
* Standalone window installation support on Chrome, Edge, Safari, Brave, and Android/iOS.
* Offline application shell caching via Service Worker (`sw.js`).
* Modern SVG and PNG icons, high-contrast theme color, and install prompt support.

---

## 📈 Version Evolution (V1 → V5)

| Version | Status | Key Changes & Milestones |
| :--- | :--- | :--- |
| **V1** | Archived | **Initial Prototype.** Minimal black/red page with a basic search input and red button that redirected to `youtube.com/results?search_query=` in a new tab. |
| **V2** | Archived | **Recent Searches.** Introduced browser `localStorage` tracking for recent searches (`ytHistory`) and a clear history button; redirected search in the same window. |
| **V3** | Archived | **Splash Screen.** Added a full-screen animated YouTube logo splash overlay with bounce animation before displaying the search interface. |
| **V4** | Archived | **Glassmorphism UI.** Redesigned with modern CSS: glass cards (`backdrop-filter: blur`), floating ambient red glows, Inter font, and gradient buttons. Still redirected away to YouTube. |
| **V5** | **Current** | **Paradigm Shift — Complete Distraction-Free Experience.** Transformed from a redirect trampoline into a full intentional application: in-app search, embedded player, Focus Mode, Focus Timer with state persistence & audio chime, Distraction Warning shield, private Session History, PWA offline shell, and customizable Settings. |

---

## 🛠️ Tech Stack

Only lightweight, standard-compliant technologies actually used in the project:

* **HTML5:** Semantic landmarks (`<header>`, `<main>`, `<section>`, `<dialog>`, `role="article"`).
* **CSS3:** Native CSS custom properties, responsive CSS Grid & Flexbox, glassmorphism backdrop filters, SVG circle progress.
* **JavaScript (ES2022):** Vanilla modular architecture, native `fetch`, Web Audio API synthesizers, Web Storage API (`localStorage`).
* **Service Worker API:** Cache-first / Stale-While-Revalidate app shell caching.
* **APIs Supported:**
  * Direct YouTube URL/ID parser (works out-of-the-box everywhere).
  * Invidious public CORS search instances with automatic failover.
  * Optional user-supplied Google YouTube Data API v3 key (stored securely in user's browser).
* **0 External Runtime Dependencies:** Zero npm libraries, zero bundler bloat, instant sub-second load times.

---

## 📁 Project Structure

```text
youtube/
├── index.html       # Flagship V5 Single Page Application shell
├── styles.css       # Complete V5 responsive styles & dark slate theme
├── app.js           # Core V5 application logic, timer, search, history
├── sw.js            # PWA Service Worker for offline app shell caching
├── manifest.json    # PWA Web App Manifest
├── icon.svg         # Crisp scalable brand icon with focus reticle
├── image.png        # Legacy 512x512 PWA raster icon
├── README.md        # Project documentation and version evolution
├── v1/              # Archived V1 standalone version
│   ├── index.html
│   ├── manifest.json
│   └── image.png
├── v2/              # Archived V2 standalone version
│   ├── index.html
│   ├── manifest.json
│   └── image.png
├── v3/              # Archived V3 standalone version
│   ├── index.html
│   ├── manifest.json
│   └── image.png
├── v4/              # Archived V4 standalone version
│   ├── index.html
│   ├── manifest.json
│   └── image.png
└── v5/              # Direct link / redirect to root V5 application
    └── index.html
```

---

## 🔒 Security & Privacy

* **Zero Exposed Secrets:** No API keys, credentials, or secrets are committed or hardcoded in the codebase.
* **Client-Side Storage:** Settings, recent searches, and session history remain strictly inside your browser's `localStorage`.
* **Private YouTube Embeds:** Video playback utilizes `youtube-nocookie.com` to prevent tracking cookies.

---

## 💻 Local Development Setup

Because NotDistract is built with pure web standards, no complex toolchain is required:

```bash
# Clone the repository
git clone https://github.com/adityasing9/youtube.git
cd youtube

# Option 1: Serve with Python
python -m http.server 8000

# Option 2: Serve with Node.js
npx serve .

# Open in your browser
# http://localhost:8000
```

---

## 🗺️ Future Roadmap (V6 Possibilities)

* **V6 (Planned):**
  * Local AI video transcript summaries.
  * AI-powered key concept extraction and chapter focus milestones.
  * Interactive post-focus comprehension questions.

---

## 👨‍💻 Author

**Aditya Sing**  
Hosted with ❤️ on [GitHub Pages](https://adityasing9.github.io/youtube/).
