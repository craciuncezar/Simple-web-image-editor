import { history } from "./history";

/**
 * Factory function to create a canvas API wrapper.
 *
 * Encapsulates the drawing API and saves the
 * previous state of the canvas before each draw call.
 * Exposes undo and redo logic.
 */
function makeCanvas() {
  const canvasEl = document.getElementById("imageProcessed");
  const context = canvasEl.getContext("2d");

  return {
    isEmpty() {
      return history.present === null;
    },
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
    draw(drawOperation) {
      drawOperation(context);
      this.commitDraw();
    },
    drawWithoutCommit(drawOperation) {
      drawOperation(context);
    },
    commitDraw() {
      const size = this.getSize();
      const data = context.getImageData(0, 0, size.width, size.height);
      history.add(
        new ImageData(new Uint8ClampedArray(data.data), data.width, data.height)
      );
    },
    drawImage(image) {
      const { width, height } = image;
      this.resize({ width, height });
      this.draw((context) => {
        context.drawImage(image, 0, 0, width, height);
      });
    },
    drawWhileMouseDown(drawAction) {
      let started = false;
      const { onmousedown, onmousemove, onmouseup } = drawAction();
      canvasEl.onmousedown = (e) => {
        started = true;
        onmousedown(e);
      };
      canvasEl.onmousemove = (e) => {
        if (!started) return;
        onmousemove(e);
      };
      canvasEl.onmouseup = () => {
        started = false;
        onmouseup?.();
        this.commitDraw();
      };
    },
    applyPixelTransformation(pixelTransformation) {
      this.draw((context) => {
        const { width, height } = this.getSize();
        const imgData = context.getImageData(0, 0, width, height);
        pixelTransformation(imgData.data);
        context.putImageData(imgData, 0, 0);
      });
    },
    undo() {
      history.undo();
      const { width, height } = history.present;
      this.resize({ width, height });
      context.putImageData(history.present, 0, 0);
    },
    redo() {
      history.redo();
      const { width, height } = history.present;
      this.resize({ width, height });
      context.putImageData(history.present, 0, 0);
    },
    getOctetStream() {
      return canvasEl
        .toDataURL("image/png")
        .replace("image/png", "image/octet-stream");
    },
  };
}

export const canvas = makeCanvas();
