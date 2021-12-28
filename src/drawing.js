import { canvas } from "./canvas";

const image = new Image();

export function drawCircle() {
  let startX = 0;
  let startY = 0;
  let position;

  const onmousedown = ({ pageX, pageY }) => {
    position = canvas.getPosition();
    startX = pageX - position.left;
    startY = pageY - position.top;
    image.src = canvas.getOctetStream();
  };

  const onmousemove = ({ pageX, pageY }) => {
    canvas.drawWithoutCommit((context) => {
      const { width, height } = canvas.getSize();
      context.drawImage(image, 0, 0, width, height);
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
    });
  };
  return { onmousedown, onmousemove };
}

export function drawRectangle() {
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
}

export function penDraw() {
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
}

export function lineDraw() {
  let x = 0;
  let y = 0;
  let position;

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
}
