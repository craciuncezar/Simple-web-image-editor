import { cropCanvas } from "./crop";
import * as drawings from "./drawing";
import { canvas } from "./entities/canvas";
import * as imageFilters from "./imageFilters";
import { loadImage } from "./loadImage";
import "./resizeModal";

document.getElementById("grayscale").addEventListener("click", () => {
  canvas.applyPixelTransformation(imageFilters.grayScale);
});

document.getElementById("threshold").addEventListener("click", () => {
  canvas.applyPixelTransformation(imageFilters.threshold);
});

document.getElementById("sephia").addEventListener("click", () => {
  canvas.applyPixelTransformation(imageFilters.sephia);
});

document.getElementById("invert").addEventListener("click", () => {
  canvas.applyPixelTransformation(imageFilters.invert);
});

document.getElementById("redoButton").addEventListener("click", () => {
  canvas.redo();
});

document.getElementById("undoButton").addEventListener("click", () => {
  canvas.undo();
});

document.getElementById("circleDraw").addEventListener("click", () => {
  canvas.performWhileMouseDown(drawings.drawCircle);
});

document.getElementById("rectangleDraw").addEventListener("click", () => {
  canvas.performWhileMouseDown(drawings.drawRectangle);
});

document.getElementById("penDraw").addEventListener("click", () => {
  canvas.performWhileMouseDown(drawings.penDraw);
});

document.getElementById("lineDraw").addEventListener("click", () => {
  canvas.performWhileMouseDown(drawings.lineDraw);
});

document.getElementById("cropButton").addEventListener("click", () => {
  canvas.performWhileMouseDown(cropCanvas);
});

document.getElementById("linkDownload").addEventListener("click", (e) => {
  if (canvas.isEmpty()) e.preventDefault();
  e.currentTarget.setAttribute("href", canvas.getOctetStream());
});

document.getElementById("dragAndDropZone").addEventListener("dragover", (e) => {
  e.preventDefault();
});

document.getElementById("dragAndDropZone").addEventListener("drop", (e) => {
  e.preventDefault();

  loadImage(e.dataTransfer.files).then((image) => {
    canvas.drawImage(image);
    document.querySelector(".drag-helper").classList.add("invisible");
  });
});
