# 🎬 NotDistract Remotion Promotional Video

Programmatic marketing video for **NotDistract** built using [Remotion](https://www.remotion.dev/) (React + Web standards).

---

## 📹 Rendered Video Files

Pre-rendered MP4 video assets ready to post:

* **Landscape (16:9 - 1920x1080):** `out/notdistract_promo.mp4` (~4.7 MB)
  * Best for: LinkedIn Desktop feed, YouTube, Twitter/X, and portfolio showcases.
* **Square (1:1 - 1080x1080):** `out/notdistract_promo_square.mp4` (~4.6 MB)
  * Best for: LinkedIn Mobile app feed, Instagram post, and carousel headers.

---

## ⏱️ Video Storyboard (16s @ 30fps)

1. **Scene 1 (0s - 3.6s): The Problem**
   * Visualizes the chaotic algorithm trap: recommended feeds, endless shorts, and distractions.
   * *"Ever opened YouTube for a 10-minute tutorial... and lost 2 hours to the algorithm?"*
2. **Scene 2 (3.6s - 7.5s): Brand & Philosophy**
   * Smooth entrance of the NotDistract brand icon and title.
   * Staggered animated sequence of the 5-step intentional philosophy:
     $$\text{Search} \longrightarrow \text{Watch} \longrightarrow \text{Focus} \longrightarrow \text{Finish} \longrightarrow \text{Leave}$$
3. **Scene 3 (7.5s - 12.3s): 4 Signature Pillars**
   * 🔍 **Search-First Workspace:** Zero algorithmic recommendations.
   * 🛡️ **Dedicated Focus Mode:** Clean embedded player without distraction sidebars.
   * ⏱️ **Persistent Focus Timer:** Pomodoro countdown with Web Audio chime.
   * ⚠️ **Distraction Shield:** Behavioral intervention if you attempt to leave early.
4. **Scene 4 (12.3s - 16s): Tech Highlights & Call to Action**
   * ⚡ 0 Dependencies • 🌐 Vanilla JS & Web APIs • 📦 PWA Offline Shell • 🔒 100% Local Privacy
   * Links: `adityasing9.github.io/youtube` • GitHub: `adityasing9/youtube`
   * Created by Aditya Sing.

---

## 🛠️ How to Preview & Re-render

From this directory (`promo-video`):

```bash
# Install dependencies (already installed)
npm install

# Open interactive Remotion Studio player in your browser
npm start

# Render 16:9 Landscape MP4
npm run build

# Render 1:1 Square MP4
npx remotion render src/index.ts NotDistractPromoSquare out/notdistract_promo_square.mp4
```
