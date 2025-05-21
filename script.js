const editor = document.getElementById('editor');
const preview = document.getElementById('preview');
const saveButton = document.getElementById('save');
const resetButton = document.getElementById('reset');
const sidebar = document.getElementById('sidebar');
const mainPane = document.getElementById('main-pane');
const toggleSidebarButton = document.getElementById('toggle-sidebar');
const noteList = document.getElementById('note-list');

const SAVE_KEY = 'obsidian-lite-note';
const AUTOSAVE_KEY = 'obsidian-lite-autosave';

function extractTitle(markdown, fallback = 'Untitled 1') {
  const lines = markdown.split('\n');

  for (const line of lines) {
    if (line.trim().startsWith('# ')) {
      return line.replace(/^# /, '').trim();
    }
  }

  return fallback;
}

function renderSidebar() {
  noteList.innerHTML = '';

  const saved = localStorage.getItem(SAVE_KEY);
  if (!saved) return;

  const title = extractTitle(saved);
  const li = document.createElement('li');
  li.textContent = title;
  li.className =
    'px-3 py-2 rounded cursor-pointer text-sm font-medium text-gray-800 hover:bg-gray-200 transition truncate';

  li.classList.add('bg-blue-100', 'text-blue-800', 'font-semibold');

  noteList.appendChild(li);
}

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
    renderSidebar();
  });
} else {
  editor.value = savedContent;
  preview.innerHTML = marked.parse(editor.value);
  renderSidebar();
}

// Save button writes to 'saved' key and clears autosave
saveButton.addEventListener('click', () => {
  const markdown = editor.value;
  localStorage.setItem(SAVE_KEY, markdown);
  localStorage.removeItem(AUTOSAVE_KEY);
  preview.innerHTML = marked.parse(markdown);
  showToast('Note saved successfully.');
  renderSidebar();
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
      renderSidebar();
    }
  });
});

toggleSidebarButton.addEventListener('click', () => {
  sidebar.classList.toggle('hidden');
});
