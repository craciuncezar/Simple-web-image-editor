import { canvas } from "./entities/canvas";

const image = new Image();

export function cropCanvas() {
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

    // Draw rectangle
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
}
