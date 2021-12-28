import { canvas } from "./canvas";

const modifyResolution = document.getElementById("modifyResolution");
const uploadPictureError = document.getElementById("uploadPictureError");
const widthInput = document.getElementById("width-size");
const heightInput = document.getElementById("height-size");
const ratioCheckbox = document.getElementById("checkbox-img-ratio");
const saveButton = document.getElementById("saveResolution");
const image = new Image();

$("#resolutionModal").on("show.bs.modal", () => {
  if (canvas.isEmpty()) {
    // No picture show error message in modal
    modifyResolution.classList.add("invisible");
    uploadPictureError.classList.remove("invisible");
    return;
  }

  // Show edit resolution
  uploadPictureError.classList.add("invisible");
  modifyResolution.classList.remove("invisible");

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
  saveButton.addEventListener("click", () => {
    image.src = canvas.getOctetStream();
    image.width = widthInput.value;
    image.height = heightInput.value;

    image.onload = () => {
      canvas.drawImage(image);
    };
    $("#resolutionModal").modal("hide");
  });
});
