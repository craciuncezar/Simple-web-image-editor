const downloadButton = document.getElementById("linkDownload");
downloadButton.addEventListener("click", () => {
  const img = document.getElementById("imageProcessed");
  if (img.classList.contains("invisible")) {
    e.preventDefault();
  } else {
    const imageUrl = img
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream");
    downloadButton.setAttribute("href", imageUrl);
  }
});
