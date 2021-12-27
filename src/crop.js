import { getOffset } from "./utils";

const cropButton = document.getElementById("cropButton");

cropButton.addEventListener("click", () => {
  const canvas = document.getElementById("imageProcessed");
  const context = canvas.getContext("2d");
  const position = getOffset(canvas);

  let started = false;
  const image = new Image();

  // Start coord from the source image relative to image
  let x = 0;
  let y = 0;
  // Position of the mouse used to get the width and height later
  let sx = 0;
  let sy = 0;
  // Width and height of the crop
  let width = 500;
  let height = 700;

  canvas.onmousedown = (event) => {
    started = true;
    sx = event.pageX;
    sy = event.pageY;
    x = sx - position.left;
    y = sy - position.top;
    image.src = canvas.toDataURL("image/png");
  };

  canvas.onmousemove = (event) => {
    if (!started) return;

    // Draw rectangle
    const x1 = Math.min(event.pageX - position.left, x);
    const y1 = Math.min(event.pageY - position.top, y);
    width = Math.abs(event.pageX - position.left - x1);
    height = Math.abs(event.pageY - position.top - y1);

    canvas.width = image.width;
    canvas.height = image.height;
    context.drawImage(image, 0, 0, canvas.width, canvas.height);

    if (!width || !height) return;

    context.strokeRect(x1 - 1, y1 - 1, width + 2, height + 2);
  };

  canvas.onmouseup = (event) => {
    started = false;
    width = event.pageX - sx;
    height = event.pageY - sy;

    image.src = canvas.toDataURL("image/png");
    image.onload = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      canvas.width = width;
      canvas.height = height;
      context.drawImage(image, x, y, width, height, 0, 0, width, height);
    };
  };
});
