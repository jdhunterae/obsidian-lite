const editor = document.getElementById('editor');
const preview = document.getElementById('preview');
const saveButton = document.getElementById('save');
const resetButton = document.getElementById('reset');

const SAVE_KEY = 'obsidian-lite-note';
const AUTOSAVE_KEY = 'obsidian-lite-autosave';

// Load saved and autosaved content
const savedContent = localStorage.getItem(SAVE_KEY) || '';
const autoSavedContent = localStorage.getItem(AUTOSAVE_KEY);

// If there's unsaved draft, prompt the user to restore
if (autoSavedContent && autoSavedContent !== savedContent) {
  confirmModal('Unsaved draft found. Restore it?').then((restore) => {
    if (restore) {
      editor.value = autoSavedContent;
    } else {
      editor.value = savedContent;
      localStorage.removeItem(AUTOSAVE_KEY);
    }
    preview.innerHTML = marked.parse(editor.value);
  });
} else {
  editor.value = savedContent;
  preview.innerHTML = marked.parse(editor.value);
}

// Save button writes to 'saved' key and clears autosave
saveButton.addEventListener('click', () => {
  const markdown = editor.value;
  localStorage.setItem(SAVE_KEY, markdown);
  localStorage.removeItem(AUTOSAVE_KEY);
  showToast('Note saved successfully.');
});

// Auto-save on input (but not to 'saved' key)
editor.addEventListener('input', () => {
  const markdown = editor.value;
  preview.innerHTML = marked.parse(markdown);
  localStorage.setItem(AUTOSAVE_KEY, markdown);
});

// Scroll sync: approximate line mapping
editor.addEventListener('scroll', () => {
  const ratio = editor.scrollTop / (editor.scrollHeight - editor.clientHeight);
  preview.scrollTop = ratio * (preview.scrollHeight - preview.clientHeight);
});

// Reset both autosave and saved content
resetButton?.addEventListener('click', () => {
  confirmModal(
    'Clear all saved and draft content? This cannot be undone.'
  ).then((confirmed) => {
    if (confirmed) {
      localStorage.removeItem(SAVE_KEY);
      localStorage.removeItem(AUTOSAVE_KEY);
      editor.value = '';
      preview.innerHTML = '';
    }
  });
});
