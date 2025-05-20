# Obsidian-Lite — A Local-Only Markdown Notes App

This is a minimalist, Obsidian-inspired note-taking app that runs entirely in your browser. Write in Markdown, use `[[backlinks]]` to link notes together, and everything stays private on your device.

**Live demo:** [jdhunterae.github.io/obsidian-lite](https://jdhunterae.github.io/obsidian-lite)

---

## Features (MVP)

- [ ] Create and edit Markdown notes in a split editor/preview layout
- [ ] Store and retrieve notes using browser `localStorage`
- [ ] Sidebar to navigate between notes
- [ ] Parse `[[backlinks]]` to create internal links
- [ ] View notes that link *to* the current note (backlinks section)
- [ ] Responsive, minimalist UI

---

## Stretch Goals

- [ ] Search notes by title or content
- [ ] Support `#tags` and tag filtering
- [ ] Export all notes as a `.zip` or individual `.md` files
- [ ] Optional themes (dark/light)
- [ ] Graph view of note connections (inspired by Obsidian)
- [ ] Drag-and-drop note rearrangement
- [ ] Offline install via PWA

---

## Data & Privacy Notice

All notes are stored **only in your browser** using `localStorage`.

- No notes are ever sent to a server.
- If you clear your browser data or switch devices, your notes will be lost unless exported manually.
- This means your notes are private, secure, and offline by design.
- Backup regularly if you're writing anything important!

---

## File Structure

```
index.html      # The app's main UI
style.css       # Styles (or Tailwind via CDN)
script.js       # App logic for editing, storage, and rendering
README.md       # Project description and progress
```

---

## How to Run

Just open [`index.html`](index.html) in your browser or visit the GitHub Pages site.

---

## Built By

Andrew Pomerleau  
[jdhunterae.github.io](http://jdhunterae.github.io)  
GitHub: [@jdhunterae](https://github.com/jdhunterae)
