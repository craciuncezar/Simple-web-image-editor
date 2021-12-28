export function loadImage(files) {
  return new Promise((resolve, reject) => {
    const file = files[0];
    if (!file) reject();

    const image = new Image();
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      image.src = e.target.result;
      image.onload = () => {
        return resolve(image);
      };
    };
  });
}
