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
