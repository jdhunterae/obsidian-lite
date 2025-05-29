# Obsidian-Lite — A Local-Only Markdown Notes App

This is a minimalist, Obsidian-inspired note-taking app that runs entirely in your browser. Write in Markdown, use `[[backlinks]]` to link notes together, and everything stays private on your device.

**Live demo:** [jdhunterae.github.io/obsidian-lite](https://jdhunterae.github.io/obsidian-lite)

---

## Features (MVP — In Progress)

- [x] Create and edit Markdown notes in a split editor/preview layout
- [x] Store and retrieve notes using browser `localStorage`
- [x] Abstracted `Note` model for future-proof storage and logic separation
- [x] Sidebar with toggle visibility
- [x] Navigate between multiple notes
- [x] Autosave drafts with optional restore on reload
- [x] Unsaved change detection with modal prompts
- [x] Cleanup of abandoned, empty notes
- [x] Visual indicator for unsaved changes in sidebar
- [x] Responsive, minimalist UI with Tailwind
- [x] Custom modals and toast notifications for UX

---

## Stretch Goals

- [ ] Search notes by title or content
- [ ] Support `#tags` and tag filtering
- [ ] Export all notes as a `.zip` or individual `.md` files
- [ ] Optional themes (dark/light)
- [ ] Graph view of note connections (inspired by Obsidian)
- [ ] Drag-and-drop note rearrangement
- [ ] Offline install via PWA
- [ ] Switch from `marked.js` to `markdown-it` to support extended Markdown syntax (footnotes, containers, etc.)

---

## Data & Privacy Notice

All notes are stored **only in your browser** using `localStorage`.

- No notes are ever sent to a server
- If you clear your browser data or switch devices, your notes will be lost unless exported manually
- Your notes are private, secure, and offline by design
- Backup regularly if you're writing anything important!

---

## File Structure

```
index.html         # App layout and DOM structure
style.css          # Optional CSS styles (e.g., for scroll or layout tweaks)
script.js          # Main logic: editor interaction, save/load, sidebar updates
note.js            # Note model for managing content and metadata
note_session.js    # Session manager: autosave, active note ID, unsaved state tracking
modal.js           # Custom modals, confirmations, and toast UI
README.md          # Project description and development progress
```

---

## How to Run

Just open [`index.html`](index.html) in your browser or visit the GitHub Pages site.

---

## Built By

Andrew Pomerleau  
[jdhunterae.github.io](http://jdhunterae.github.io)  
GitHub: [@jdhunterae](https://github.com/jdhunterae)
