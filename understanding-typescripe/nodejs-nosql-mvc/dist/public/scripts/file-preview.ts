const filePickerElement = document.getElementById("avatar") as HTMLInputElement;
const imagePreviewElement = document.getElementById(
  "image-preview"
) as HTMLImageElement;

function showPreview() {
  const files = filePickerElement.files;
  if (!files || files.length <= 0) {
    return;
  }

  const pickedFile = files[0];
  imagePreviewElement.src = pickedFile ? URL.createObjectURL(pickedFile) : "";
}

filePickerElement.addEventListener("change", showPreview);
