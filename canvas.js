/**
 * Canvas API wrapper.
 *
 * Encapsulates the canvas element and the drawing API.
 * Exposes undo and redo logic using the history object.
 */
function makeCanvas() {
  const canvasEl = document.getElementById("imageProcessed");
  const context = canvasEl.getContext("2d");
  const history = {
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
  };

  return {
    isEmpty() {
      return history.present === null;
    },
    /**
     * Returns the position of the canvas element relative to the document
     */
    getPosition() {
      const box = canvasEl.getBoundingClientRect();
      return {
        top: box.top + window.pageYOffset - document.documentElement.clientTop,
        left:
          box.left + window.pageXOffset - document.documentElement.clientLeft,
      };
    },
    getSize() {
      return {
        width: canvasEl.width,
        height: canvasEl.height,
      };
    },
    resize(size) {
      canvasEl.width = size.width;
      canvasEl.height = size.height;
    },
    /**
     * Performs an action on the canvas element while preserving the history.
     * @param {callback} drawOperation
     */
    draw(drawOperation) {
      drawOperation(context);
      this.commitDraw();
    },
    /**
     * Draw something on the canvas without affecting the history.
     * This is useful for intermediate drawing steps.
     * @param {callback} drawOperation
     */
    drawWithoutCommit(drawOperation) {
      drawOperation(context);
    },
    /**
     * Commits a copy of the current ImageData to the history object.
     */
    commitDraw() {
      const size = this.getSize();
      const data = context.getImageData(0, 0, size.width, size.height);
      history.add(
        new ImageData(new Uint8ClampedArray(data.data), data.width, data.height)
      );
    },
    /**
     * Abstracts the process of drawing an image on the canvas.
     * @param {HTMLImageElement} image
     */
    drawImage(image) {
      const { width, height } = image;
      this.resize({ width, height });
      this.draw((context) => {
        context.drawImage(image, 0, 0, width, height);
      });
    },
    /**
     * Performs mouse events on the canvas while the mouse is down.
     * Commits changes to the history once the mouse is released.
     * @param {callback} action return mouse events to be performed on the canvas
     */
    performWhileMouseDown(action) {
      let started = false;
      const { onmousedown, onmousemove, onmouseup } = action();
      canvasEl.onmousedown = (e) => {
        started = true;
        onmousedown?.(e);
      };
      canvasEl.onmousemove = (e) => {
        if (!started) return;
        onmousemove?.(e);
      };
      canvasEl.onmouseup = (e) => {
        started = false;
        onmouseup?.(e);
        this.commitDraw();
      };
    },
    /**
     * Modifies the canvas pixels using the given transformation.
     * @param {callback} pixelTransformation receives the pixel data to mutate in place
     */
    applyPixelTransformation(pixelTransformation) {
      this.draw((context) => {
        const { width, height } = this.getSize();
        const imgData = context.getImageData(0, 0, width, height);
        pixelTransformation(imgData.data);
        context.putImageData(imgData, 0, 0);
      });
    },
    /**
     * Undo the last action on the canvas.
     */
    undo() {
      history.undo();
      const { width, height } = history.present;
      this.resize({ width, height });
      context.putImageData(history.present, 0, 0);
    },
    /**
     * Redo the last action on the canvas.
     */
    redo() {
      history.redo();
      const { width, height } = history.present;
      this.resize({ width, height });
      context.putImageData(history.present, 0, 0);
    },
    /**
     * Return a data URI containing a representation of the current canvas as a base64 encoded string.
     */
    getOctetStream() {
      return canvasEl
        .toDataURL("image/png")
        .replace("image/png", "image/octet-stream");
    },
  };
}

export const canvas = makeCanvas();
