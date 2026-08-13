# A jar of notes, just for her 🤍

A small, mobile-friendly page with just the notes jar — something she can open on her phone any time she needs one, without going through the whole birthday site.

## 1. Add your mood songs
Drop MP3 files into `assets/audio/`, named to match `config.js` (`mood-happy.mp3`, `mood-sad.mp3`, `mood-missing-you.mp3`, `mood-stressed.mp3`, `mood-need-reassurance.mp3`, `mood-just-because.mp3`). Each mood's song plays automatically the moment she taps that mood.

## 2. Edit the notes
Everything text-wise lives in `config.js` — `notesJar.moods` is a list of moods, each with a `label`, an optional `song`/`songTitle`, and a `notes` array. Add, remove, or edit notes freely. If you type a note by hand, avoid using a `"` (double quote) or a backtick `` ` `` character inside it — those have special meaning in code. Apostrophes like in "don't" are fine.

## 3. Change the header
`title` and `subtitle` at the top of `config.js` control the page heading — defaults to "for you" / "a little jar of notes, whenever you need one."

## 4. Preview it locally
Open `index.html` in a browser — no build step needed. Audio may not play from a plain double-clicked file in some browsers; it'll work correctly once hosted.

## 5. Host it on GitHub Pages
1. Create a new repository (e.g. `notes-for-her`).
2. Upload all these files, keeping the folder structure intact.
3. Go to **Settings → Pages**, set **Source: Deploy from a branch**, branch `main`, folder `/ (root)`. Save.
4. Your page is live at `https://yourusername.github.io/notes-for-her/` a minute or two later.

## 6. Installing it as an app
This is set up as a PWA (Progressive Web App) — once it's live on GitHub Pages, she can install it like a real app, no App Store or Play Store needed:

**iPhone (Safari):** open the link → tap the Share icon → **Add to Home Screen**.
**Android (Chrome):** open the link → tap the **⋮** menu → **Add to Home Screen** or **Install app** (Chrome sometimes prompts this automatically).

Once installed, it opens full-screen with its own icon and no browser bar, and after the first visit it keeps working even without signal — the app shell (page, styling, jar) loads instantly from the phone itself, and each mood's song becomes available offline too after she's played it once.

If you ever change `config.js` afterward, she may need to force-close and reopen the app (or wait a bit) for the update to load, since the app caches itself for speed.

Since this is meant to be something she can bookmark and reopen any time, there's no passcode gate on this one — if you'd like to add one, let me know and I can bring over the same keypad-and-cat gate from the main site.

## Troubleshooting
If something looks blank or broken, right-click the page → **Inspect** → **Console** tab. Any red line starting with `[site error]` tells you exactly what broke — usually a typo in `config.js`, like a missing comma or a stray quote mark.

## Files
```
index.html      — page structure
style.css       — visual design (mobile-first)
script.js       — logic (jar, audio player) — no need to edit
config.js       — YOUR CONTENT — edit this one
assets/audio/   — your mood songs go here
```
