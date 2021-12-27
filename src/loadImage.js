const imgArea = document.querySelector(".img-area");
const canvas = document.getElementById("imageProcessed");
const context = canvas.getContext("2d");

imgArea.addEventListener("dragover", (e) => {
  e.preventDefault();
});

imgArea.addEventListener("drop", (e) => {
  e.preventDefault();

  const file = e.dataTransfer.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = (e) => {
    const image = new Image();
    image.src = e.target.result;
    image.onload = () => {
      //Hide the original image and text in drag area
      document.getElementById("default-drag-area").classList.add("invisible");
      // Display the canvas
      canvas.classList.remove("invisible");

      canvas.width = image.width;
      canvas.height = image.height;
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
    };
  };
  reader.readAsDataURL(file);
});
