"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const filePickerElement = document.getElementById("avatar");
const imagePreviewElement = document.getElementById("image-preview");
function showPreview() {
    const files = filePickerElement.files;
    if (!files || files.length <= 0) {
        return;
    }
    const pickedFile = files[0];
    imagePreviewElement.src = pickedFile ? URL.createObjectURL(pickedFile) : "";
}
filePickerElement.addEventListener("change", showPreview);
//# sourceMappingURL=file-preview.js.map