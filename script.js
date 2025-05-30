const mainPane = document.getElementById('main-pane');
const editor = document.getElementById('editor');
const preview = document.getElementById('preview');
const sidebar = document.getElementById('sidebar');
const noteList = document.getElementById('note-list');

const newNoteButton = document.getElementById('new-note');
const saveButton = document.getElementById('save');
const resetButton = document.getElementById('reset');
const toggleSidebarButton = document.getElementById('toggle-sidebar');

let activeNote = null;

function renderSidebar() {
  noteList.innerHTML = '';
  let notes = Note.list();

  // Sort alphabetically by title
  notes.sort((a, b) => a.title.localeCompare(b.title));

  // Move active note to the top
  if (activeNote) {
    notes = [activeNote, ...notes.filter((n) => n.id !== activeNote.id)];
  }

  for (const note of notes) {
    const li = document.createElement('li');
    li.className =
      'px-3 py-2 rounded cursor-pointer text-sm font-medium text-gray-800 hover:bg-gray-200 transition truncate';

    let titleText = note.title;
    if (note.id === activeNote?.id) {
      li.classList.add('bg-blue-100', 'text-blue-800', 'font-semibold');

      if (NoteSession.hasUnsaved()) {
        titleText = `* ${titleText}`;
      }
    }
    li.textContent = titleText;

    li.addEventListener('click', () => {
      if (note.id === activeNote?.id) return;

      if (NoteSession.hasUnsaved()) {
        showModal({
          message: 'You have unsaved changes. What would you like to do?',
          buttons: [
            {
              label: 'Save changes',
              variant: 'blue',
              action: () => {
                activeNote.content = editor.value;
                activeNote.save();
                NoteSession.clearAutosave();
                NoteSession.clearUnsaved();
                loadNote(note);
              },
            },
            {
              label: 'Discard changes',
              variant: 'red',
              action: () => {
                if (activeNote?.isEmpty() && Note.load(activeNote.id)) {
                  activeNote.delete();
                }

                NoteSession.clearAutosave();
                NoteSession.clearUnsaved();
                loadNote(note);
              },
            },
            {
              label: 'Cancel',
              variant: 'gray',
            },
          ],
        });
      } else {
        loadNote(note);
      }
    });

    noteList.appendChild(li);
  }
}

function loadNote(note) {
  activeNote = note;
  NoteSession.clearUnsaved();
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
    activeNote = new Note(autosave.noteId, autosave.content);
    NoteSession.markUnsaved();
    return true;
  }

  if (autosave.content !== saved.content) {
    return confirmModal('Unsaved draft found. Restore it?').then((restore) => {
      if (restore) {
        activeNote = new Note(saved.id, autosave.content);
        NoteSession.markUnsaved();
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
  NoteSession.clearUnsaved();
  showToast('Note saved successfully');
  renderSidebar();
});

// Auto-save on input (but not to 'saved' key)
editor.addEventListener('input', () => {
  const markdown = editor.value;
  preview.innerHTML = marked.parse(markdown);
  NoteSession.setAutosave({ noteId: activeNote?.id, content: markdown });
  renderSidebar();
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

newNoteButton.addEventListener('click', () => {
  const hasUnsaved = NoteSession.hasUnsaved();

  if (hasUnsaved) {
    showModal({
      message: 'There is unsaved data. What would you like to do?',
      buttons: [
        {
          label: 'Save changes',
          variant: 'blue',
          action: () => {
            if (activeNote) {
              activeNote.content = editor.value;
              activeNote.save();
              NoteSession.clearAutosave();
              NoteSession.clearUnsaved();
              const newNote = Note.createNew();
              loadNote(newNote);
            }
          },
        },
        {
          label: 'Discard changes',
          variant: 'red',
          action: () => {
            if (activeNote?.isEmpty() && Note.load(activeNote.id)) {
              activeNote.delete();
            }

            NoteSession.clearAutosave();
            NoteSession.clearUnsaved();
            const newNote = Note.createNew();
            loadNote(newNote);
          },
        },
        {
          label: 'Cancel',
          variant: 'gray',
        },
      ],
    });
  } else {
    NoteSession.clearAutosave();
    NoteSession.clearUnsaved();
    const newNote = Note.createNew();
    loadNote(newNote);
  }
});

// toggle hide/reveal the sidebar
toggleSidebarButton.addEventListener('click', () => {
  sidebar.classList.toggle('hidden');
});
