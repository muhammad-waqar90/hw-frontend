import { MAX_FILE_SIZE, MIN_FILE_SIZE } from "@/dataObject/AF/fileSizeData.js";

export function validateFileSize(
  file,
  maxSizeInMB = MAX_FILE_SIZE.default,
  minSizeInMB = MIN_FILE_SIZE.default
) {
  if (!file?.size) {
    return false;
  }
  const fileSizeInMB = file.size / 1024 / 1024; // Convert size to MB
  return fileSizeInMB >= minSizeInMB && fileSizeInMB <= maxSizeInMB;
}

export function validateFileAspectRatio(value) {
  const img = new Image();
  img.src = URL.createObjectURL(value);
  return new Promise((resolve) => {
    img.onload = () => {
      const isValidDimensions = img.width === img.height;
      resolve({ isValidDimensions });
    };
  });
}
