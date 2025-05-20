const editor = document.getElementById('editor');
const preview = document.getElementById('preview');

// Live preview
editor.addEventListener('input', () => {
  const markdown = editor.value;
  preview.innerHTML = marked.parse(markdown);
});

// Scroll sync: approximate line mapping
editor.addEventListener('scroll', () => {
  const ratio = editor.scrollTop / (editor.scrollHeight - editor.clientHeight);
  preview.scrollTop = ratio * (preview.scrollHeight - preview.clientHeight);
});

