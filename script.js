const editor = document.getElementById('editor');
const preview = document.getElementById('preview');

editor.addEventListener('input', () => {
  const markdown = editor.value;
  preview.innerHTML = marked.parse(markdown);
});
