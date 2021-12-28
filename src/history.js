export const history = {
  past: [],
  present: null,
  future: [],

  add(newPresent) {
    if (this.present === newPresent) return;

    if (this.present) this.past.push(this.present);
    this.present = newPresent;
    this.future = [];
  },

  undo() {
    if (this.past.length === 0) return;

    const previous = this.past[this.past.length - 1];
    const newPast = this.past.slice(0, this.past.length - 1);
    const present = this.present;

    this.past = newPast;
    this.present = previous;
    this.future = [present, ...this.future];
  },

  redo() {
    if (this.future.length === 0) return;

    const next = this.future[0];
    const newFuture = this.future.slice(1);

    this.past.push(this.present);
    this.present = next;
    this.future = newFuture;
  },

  clear() {
    this.past = [];
    this.present = null;
    this.future = [];
  },
};
