document.getElementById("grayscale").addEventListener("click", () => {
  applyPixelTransformation((pixels) => {
    for (let i = 0; i < pixels.length; i += 4)
      pixels[i] =
        pixels[i + 1] =
        pixels[i + 2] =
          Math.round((pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3);
  });
});

document.getElementById("threshold").addEventListener("click", () => {
  applyPixelTransformation((pixels) => {
    for (let i = 0; i < pixels.length; i += 4) {
      const [r, g, b] = getRGB(pixels, i);
      const v = 0.2126 * r + 0.7152 * g + 0.0722 * b >= 180 ? 255 : 0;
      pixels[i] = pixels[i + 1] = pixels[i + 2] = v;
    }
  });
});

document.getElementById("sephia").addEventListener("click", () => {
  applyPixelTransformation((pixels) => {
    for (let i = 0; i < pixels.length; i += 4) {
      const [r, g, b] = getRGB(pixels, i);
      pixels[i] = r * 0.393 + g * 0.769 + b * 0.189;
      pixels[i + 1] = r * 0.349 + g * 0.686 + b * 0.168;
      pixels[i + 2] = r * 0.272 + g * 0.534 + b * 0.131;
    }
  });
});

document.getElementById("invert").addEventListener("click", () => {
  applyPixelTransformation((pixels) => {
    for (let i = 0; i < pixels.length; i += 4) {
      const [r, g, b] = getRGB(pixels, i);
      pixels[i] = 255 - r;
      pixels[i + 1] = 255 - g;
      pixels[i + 2] = 255 - b;
    }
  });
});

function applyPixelTransformation(pixelTransformation) {
  const context = document.getElementById("imageProcessed").getContext("2d");
  const { canvas } = context;
  const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
  pixelTransformation(imageData.data);
  context.putImageData(imageData, 0, 0);
}

function getRGB(pixel, position) {
  return [pixel[position], pixel[position + 1], pixel[position + 2]];
}
