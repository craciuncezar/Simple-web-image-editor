import { getOffset } from "./utils";

const canvas = document.getElementById("imageProcessed");
const context = canvas.getContext("2d");
const image = new Image();

document.getElementById("circleDraw").addEventListener("click", () => {
  const position = getOffset(canvas);
  let started = false;
  let startX = 0;
  let startY = 0;

  canvas.onmousedown = ({ pageX, pageY }) => {
    startX = pageX - position.left;
    startY = pageY - position.top;
    started = true;
    image.src = canvas.toDataURL("image/png");
  };

  canvas.onmousemove = ({ pageX, pageY }) => {
    if (!started) return;

    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    const x = pageX - position.left;
    const y = pageY - position.top;

    context.beginPath();
    context.moveTo(startX, startY + (y - startY) / 2);
    context.bezierCurveTo(
      startX,
      startY,
      x,
      startY,
      x,
      startY + (y - startY) / 2
    );
    context.bezierCurveTo(x, y, startX, y, startX, startY + (y - startY) / 2);
    context.closePath();
    context.stroke();
  };

  canvas.onmouseup = () => {
    started = false;
  };
});

document.getElementById("rectangleDraw").addEventListener("click", () => {
  const position = getOffset(canvas);
  let started = false;
  let x = 0;
  let y = 0;
  let width = 0;
  let height = 0;

  canvas.onmousedown = (event) => {
    started = true;
    x = event.pageX - position.left;
    y = event.pageY - position.top;
    image.src = canvas.toDataURL("image/png");
  };

  canvas.onmousemove = (event) => {
    if (!started) return;

    x = Math.min(event.pageX - position.left, x);
    y = Math.min(event.pageY - position.top, y);
    width = Math.abs(event.pageX - position.left - x);
    height = Math.abs(event.pageY - position.top - y);

    context.drawImage(image, 0, 0, canvas.width, canvas.height);

    if (!width || !height) return;

    context.strokeRect(x, y, width, height);
  };

  canvas.onmouseup = () => {
    started = false;
  };
});

document.getElementById("penDraw").addEventListener("click", () => {
  let started = false;

  canvas.onmousedown = ({ offsetX, offsetY }) => {
    started = true;
    context.beginPath();
    context.moveTo(offsetX, offsetY);
  };

  canvas.onmousemove = (event) => {
    if (!started) return;

    context.lineTo(event.offsetX, event.offsetY);
    context.stroke();
  };

  canvas.onmouseup = () => {
    started = false;
  };
});

document.getElementById("lineDraw").addEventListener("click", () => {
  const position = getOffset(canvas);
  let started = false;
  let x = 0;
  let y = 0;

  canvas.onmousedown = ({ pageX, pageY }) => {
    started = true;
    x = pageX - position.left;
    y = pageY - position.top;
    image.src = canvas.toDataURL("image/png");
  };

  canvas.onmousemove = ({ pageX, pageY }) => {
    if (!started) return;

    context.drawImage(image, 0, 0, canvas.width, canvas.height);

    context.beginPath();
    context.moveTo(x, y);
    context.lineTo(pageX - position.left, pageY - position.top);
    context.stroke();
    context.closePath();
  };

  canvas.onmouseup = () => {
    started = false;
  };
});
