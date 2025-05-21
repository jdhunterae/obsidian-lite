class Note {
  constructor(id, content = '') {
    this.id = id;
    this.content = content;
  }

  get title() {
    const lines = this.content.split('\n');

    for (const line of lines) {
      if (line.trim().startsWith('# ')) {
        return line.replace(/^# /, '').trim();
      }
    }

    return `Untitled ${this.id}`;
  }

  save() {
    const allNotes = Note.loadAll();
    allNotes[this.id] = { id: this.id, content: this.content };
    localStorage.setItem('obsidian-lite-notes', JSON.stringify(allNotes));
  }

  delete() {
    const allNotes = Note.loadAll();
    delete allNotes[this.id];
    localStorage.setItem('obsidian-lite-notes', JSON.stringify(allNotes));
  }

  static load(id) {
    const allNotes = Note.loadAll();
    const note = allNotes[id];
    return note ? new Note(note.id, note.content) : null;
  }

  static loadAll() {
    const data = localStorage.getItem('obsidian-lite-notes');
    return data ? JSON.parse(data) : {};
  }

  static list() {
    return Object.values(Note.loadAll()).map(
      (obj) => new Note(obj.id, obj.content)
    );
  }

  static createNew() {
    const id = `note-${Date.now()}`;
    const note = new Note(id, '');
    note.save();
    return note;
  }
}
