const MemoryKeeper = class {
  constructor() {
    this.notes = [];
  }
  addNote(note) {
    this.notes.push(note);
  }
  getNotes() {
    return this.notes;
  }
};
const keeper = new MemoryKeeper();
keeper.addNote('Hello, world!');
console.log(keeper.getNotes());