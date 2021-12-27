const canvas = document.getElementById("imageProcessed");
const modifyResolution = document.getElementById("modifyResolution");
const uploadPictureError = document.getElementById("uploadPictureError");
const widthInput = document.getElementById("width-size");
const heightInput = document.getElementById("height-size");
const ratioCheckbox = document.getElementById("checkbox-img-ratio");
const saveButton = document.getElementById("saveResolution");

$("#resolutionModal").on("show.bs.modal", (e) => {
  // Check if is any picture uploaded
  if (canvas.classList.contains("invisible")) {
    // No picture show error message in modal
    modifyResolution.classList.add("invisible");
    uploadPictureError.classList.remove("invisible");
  } else {
    // Show edit resolution
    uploadPictureError.classList.add("invisible");
    modifyResolution.classList.remove("invisible");

    // Update values with current resolution
    widthInput.value = canvas.width;
    heightInput.value = canvas.height;

    // Keep image ratio if selected
    const ratio = canvas.width / canvas.height;

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
      const context = canvas.getContext("2d");
      const image = new Image();
      image.src = canvas.toDataURL("image/png");
      canvas.width = widthInput.value;
      canvas.height = heightInput.value;
      image.onload = () => {
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
      };
      $("#resolutionModal").modal("hide");
    });
  }
});
