const ACTIVE_NOTE_KEY = 'obsidian-lite-active';
const AUTOSAVE_KEY = 'obsidian-lite-autosave';

let unsavedChanges = false;

const NoteSession = {
  getActiveNoteId() {
    return localStorage.getItem(ACTIVE_NOTE_KEY);
  },

  setActiveNoteId(id) {
    localStorage.setItem(ACTIVE_NOTE_KEY, id);
  },

  getAutosave() {
    const data = localStorage.getItem(AUTOSAVE_KEY);
    return data ? JSON.parse(data) : null;
  },

  setAutosave({ noteId, content }) {
    localStorage.setItem(AUTOSAVE_KEY, JSON.stringify({ noteId, content }));
    unsavedChanges = true;
  },

  clearAutosave() {
    localStorage.removeItem(AUTOSAVE_KEY);
    unsavedChanges = false;
  },

  hasUnsaved() {
    return unsavedChanges;
  },

  markUnsaved() {
    unsavedChanges = true;
  },

  clearUnsaved() {
    unsavedChanges = false;
  },
};
