/**
 * Canvas API wrapper.
 *
 * Encapsulates the canvas element and the drawing API.
 * Exposes undo and redo logic using the history object.
 */
const canvas = (function makeCanvas() {
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
      canvasEl.onmouseup = () => {
        started = false;
        onmouseup?.();
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
})();

// Prevent controls if canvas is empty
document.getElementById("controls").addEventListener("click", (e) => {
  if (canvas.isEmpty()) e.stopPropagation();
});

// Image filters
document.getElementById("grayscale").addEventListener("click", () => {
  canvas.applyPixelTransformation((pixels) => {
    for (let i = 0; i < pixels.length; i += 4)
      pixels[i] =
        pixels[i + 1] =
        pixels[i + 2] =
          Math.round((pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3);
  });
});

document.getElementById("threshold").addEventListener("click", () => {
  canvas.applyPixelTransformation((pixels) => {
    for (let i = 0; i < pixels.length; i += 4) {
      const [r, g, b] = getRGB(pixels, i);
      const v = 0.2126 * r + 0.7152 * g + 0.0722 * b >= 180 ? 255 : 0;
      pixels[i] = pixels[i + 1] = pixels[i + 2] = v;
    }
  });
});

document.getElementById("sephia").addEventListener("click", () => {
  canvas.applyPixelTransformation((pixels) => {
    for (let i = 0; i < pixels.length; i += 4) {
      const [r, g, b] = getRGB(pixels, i);
      pixels[i] = r * 0.393 + g * 0.769 + b * 0.189;
      pixels[i + 1] = r * 0.349 + g * 0.686 + b * 0.168;
      pixels[i + 2] = r * 0.272 + g * 0.534 + b * 0.131;
    }
  });
});

document.getElementById("invert").addEventListener("click", () => {
  canvas.applyPixelTransformation((pixels) => {
    for (let i = 0; i < pixels.length; i += 4) {
      const [r, g, b] = getRGB(pixels, i);
      pixels[i] = 255 - r;
      pixels[i + 1] = 255 - g;
      pixels[i + 2] = 255 - b;
    }
  });
});

function getRGB(pixel, position) {
  return [pixel[position], pixel[position + 1], pixel[position + 2]];
}

document
  .getElementById("redoButton")
  .addEventListener("click", () => canvas.redo());
document
  .getElementById("undoButton")
  .addEventListener("click", () => canvas.undo());

// Drawings
document.getElementById("circleDraw").addEventListener("click", () => {
  const image = new Image();
  canvas.performWhileMouseDown(() => {
    let x0, y0, position;

    const onmousedown = ({ pageX, pageY }) => {
      position = canvas.getPosition();
      x0 = pageX - position.left;
      y0 = pageY - position.top;
      image.src = canvas.getOctetStream();
    };

    const onmousemove = ({ pageX, pageY }) => {
      canvas.drawWithoutCommit((context) => {
        const { width, height } = canvas.getSize();
        context.drawImage(image, 0, 0, width, height);
        const x = pageX - position.left;
        const y = pageY - position.top;

        context.beginPath();
        context.moveTo(x0, y0 + (y - y0) / 2);
        context.bezierCurveTo(x0, y0, x, y0, x, y0 + (y - y0) / 2);
        context.bezierCurveTo(x, y, x0, y, x0, y0 + (y - y0) / 2);
        context.closePath();
        context.stroke();
      });
    };
    return { onmousedown, onmousemove };
  });
});

document.getElementById("rectangleDraw").addEventListener("click", () => {
  canvas.performWhileMouseDown(() => {
    const image = new Image();
    let x = 0;
    let y = 0;
    let width = 0;
    let height = 0;
    let position;

    const onmousedown = (event) => {
      position = canvas.getPosition();
      x = event.pageX - position.left;
      y = event.pageY - position.top;
      image.src = canvas.getOctetStream();
    };

    const onmousemove = (event) => {
      x = Math.min(event.pageX - position.left, x);
      y = Math.min(event.pageY - position.top, y);
      width = Math.abs(event.pageX - position.left - x);
      height = Math.abs(event.pageY - position.top - y);

      canvas.drawWithoutCommit((context) => {
        const canvasSize = canvas.getSize();
        context.drawImage(image, 0, 0, canvasSize.width, canvasSize.height);
        if (!width || !height) return;
        context.strokeRect(x, y, width, height);
      });
    };
    return { onmousedown, onmousemove };
  });
});

document.getElementById("penDraw").addEventListener("click", () => {
  canvas.performWhileMouseDown(() => {
    const onmousedown = ({ offsetX, offsetY }) => {
      canvas.drawWithoutCommit((context) => {
        context.beginPath();
        context.moveTo(offsetX, offsetY);
      });
    };

    const onmousemove = (event) => {
      canvas.drawWithoutCommit((context) => {
        context.lineTo(event.offsetX, event.offsetY);
        context.stroke();
      });
    };
    return { onmousedown, onmousemove };
  });
});

document.getElementById("lineDraw").addEventListener("click", () => {
  canvas.performWhileMouseDown(() => {
    const image = new Image();
    let x, y, position;

    const onmousedown = ({ pageX, pageY }) => {
      position = canvas.getPosition();
      x = pageX - position.left;
      y = pageY - position.top;
      image.src = canvas.getOctetStream();
    };

    const onmousemove = ({ pageX, pageY }) => {
      canvas.drawWithoutCommit((context) => {
        const canvasSize = canvas.getSize();
        context.drawImage(image, 0, 0, canvasSize.width, canvasSize.height);
        context.beginPath();
        context.moveTo(x, y);
        context.lineTo(pageX - position.left, pageY - position.top);
        context.stroke();
        context.closePath();
      });
    };

    return { onmousedown, onmousemove };
  });
});

// Crop
document.getElementById("cropButton").addEventListener("click", () => {
  canvas.performWhileMouseDown(() => {
    const image = new Image();
    let position;

    // Start coord from the source image relative to image
    let x = 0;
    let y = 0;
    // Position of the mouse used to get the width and height later
    let sx = 0;
    let sy = 0;

    let width = 0;
    let height = 0;

    const onmousedown = ({ pageX, pageY }) => {
      position = canvas.getPosition();
      sx = pageX;
      sy = pageY;
      x = pageX - position.left;
      y = pageY - position.top;
    };

    const onmousemove = (event) => {
      const x1 = Math.min(event.pageX - position.left, x);
      const y1 = Math.min(event.pageY - position.top, y);
      width = Math.abs(event.pageX - position.left - x1);
      height = Math.abs(event.pageY - position.top - y1);
      if (!width || !height) return;

      canvas.drawWithoutCommit((context) => {
        context.strokeRect(x1 - 1, y1 - 1, width + 2, height + 2);
      });
    };

    const onmouseup = (event) => {
      width = event.pageX - sx;
      height = event.pageY - sy;
      if (!width || !height) return;

      image.src = canvas.getOctetStream();
      image.onload = () => {
        canvas.drawWithoutCommit((context) => {
          const canvasSize = canvas.getSize();
          context.clearRect(0, 0, canvasSize.width, canvasSize.height);
          canvas.resize({ width, height });
          context.drawImage(image, x, y, width, height, 0, 0, width, height);
        });
      };
    };
    return { onmousedown, onmousemove, onmouseup };
  });
});

// Resize modal TODO: Remove jQuery and bootstrap with a native implementation
$("#resolutionModal").on("show.bs.modal", (e) => {
  const image = new Image();
  const widthInput = document.getElementById("width-size");
  const heightInput = document.getElementById("height-size");
  const ratioCheckbox = document.getElementById("checkbox-img-ratio");

  // Update values with current resolution
  const canvasSize = canvas.getSize();
  widthInput.value = canvasSize.width;
  heightInput.value = canvasSize.height;

  // Keep image ratio if selected
  const ratio = canvasSize.width / canvasSize.height;
  widthInput.addEventListener("keyup", () => {
    if (!ratioCheckbox.checked) return;
    heightInput.value = widthInput.value / ratio;
  });
  heightInput.addEventListener("keyup", () => {
    if (!ratioCheckbox.checked) return;
    widthInput.value = heightInput.value * ratio;
  });

  // Redraw image with new resolution values
  document.getElementById("saveResolution").addEventListener("click", () => {
    image.src = canvas.getOctetStream();
    image.width = widthInput.value;
    image.height = heightInput.value;
    image.onload = () => canvas.drawImage(image);
    $("#resolutionModal").modal("hide");
  });
});

// Download
document.getElementById("linkDownload").addEventListener("click", (e) => {
  if (canvas.isEmpty()) e.preventDefault();
  e.currentTarget.setAttribute("href", canvas.getOctetStream());
});

// Load image drag and drop
document.getElementById("dragAndDropZone").addEventListener("dragover", (e) => {
  e.preventDefault();
});

document.getElementById("dragAndDropZone").addEventListener("drop", (e) => {
  e.preventDefault();
  const file = e.dataTransfer.files[0];
  if (!file) return;

  const image = new Image();
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = (e) => {
    image.src = e.target.result;
    image.onload = () => {
      canvas.drawImage(image);
      document.querySelector(".drag-helper").classList.add("invisible");
    };
  };
});
