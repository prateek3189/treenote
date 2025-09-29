const filePickerElement = document.getElementById("avatar");
const imagePreviewElement = document.getElementById("image-preview");

function showPreview() {
  const files = filePickerElement.files;
  if (!files || files.length <= 0) {
    return;
  }

  const pickedFile = files[0];
  imagePreviewElement.src = URL.createObjectURL(pickedFile);
}

filePickerElement.addEventListener("change", showPreview);
