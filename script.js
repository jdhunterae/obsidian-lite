const editor = document.getElementById('editor');
const preview = document.getElementById('preview');
const saveButton = document.getElementById('save');
const resetButton = document.getElementById('reset');
const sidebar = document.getElementById('sidebar');
const mainPane = document.getElementById('main-pane');
const toggleSidebarButton = document.getElementById('toggle-sidebar');
const noteList = document.getElementById('note-list');

let activeNote = null;

function renderSidebar() {
  noteList.innerHTML = '';
  const notes = Note.list();

  for (const note of notes) {
    const li = document.createElement('li');
    li.textContent = note.title;
    li.className =
      'px-3 py-2 rounded cursor-pointer text-sm font-medium text-gray-800 hover:bg-gray-200 transition truncate';

    if (note.id === activeNote?.id) {
      li.classList.add('bg-blue-100', 'text-blue-800', 'font-semibold');
    }

    li.addEventListener('click', () => {
      loadNote(note);
    });

    noteList.appendChild(li);
  }
}

function loadNote(note) {
  activeNote = note;
  editor.value = note.content;
  preview.innerHTML = marked.parse(note.content);
  NoteSession.setActiveNoteId(note.id);
  renderSidebar();
}

function loadAutosave() {
  const autosave = NoteSession.getAutosave();
  if (!autosave || !autosave.noteId) return false;

  const saved = Note.load(autosave.noteId);
  if (!saved) {
    // orphaned autosave
    activeNote = new Note(autosave.noteId, autosave.content);
    return true;
  }

  if (autosave.content !== saved.content) {
    return confirmModal('Unsaved draft found. Restore it?').then((restore) => {
      if (restore) {
        activeNote = new Note(saved.id, autosave.content);
      } else {
        activeNote = saved;
        NoteSession.clearAutosave();
      }

      loadNote(activeNote);
      return true;
    });
  }

  activeNote = saved;
  return false;
}

// Load last active note or create a default one
(async function init() {
  const restored = await loadAutosave();

  if (!restored) {
    const savedId = NoteSession.getActiveNoteId();
    const saved = savedId ? Note.load(savedId) : null;
    activeNote = saved || Note.createNew();
    loadNote(activeNote);
  }
})();

// Save button logic
saveButton.addEventListener('click', () => {
  if (!activeNote) return;
  activeNote.content = editor.value;
  activeNote.save();
  NoteSession.clearAutosave();
  showToast('Note saved successfully');
  renderSidebar();
});

// Auto-save on input (but not to 'saved' key)
editor.addEventListener('input', () => {
  const markdown = editor.value;
  preview.innerHTML = marked.parse(markdown);
  NoteSession.setAutosave({ noteId: activeNote?.id, content: markdown });
});

// Scroll sync: approximate line mapping
editor.addEventListener('scroll', () => {
  const ratio = editor.scrollTop / (editor.scrollHeight - editor.clientHeight);
  preview.scrollTop = ratio * (preview.scrollHeight - preview.clientHeight);
});

// Reset both autosave and saved content
resetButton?.addEventListener('click', () => {
  confirmModal('Clear this note? This cannot be undone.').then((confirmed) => {
    if (confirmed) {
      if (activeNote) {
        activeNote.delete();
      }

      NoteSession.clearAutosave();
      activeNote = Note.createNew();
      loadNote(activeNote);
    }
  });
});

// toggle hide/reveal the sidebar
toggleSidebarButton.addEventListener('click', () => {
  sidebar.classList.toggle('hidden');
});
