export function handleImageError(e) {
  e.target.src = "/img/image-error.png";
}

export function getDefaultImage() {
  return "/img/hijaz-logo.png";
}

export async function checkLink(string) {
  try {
    new URL(string);
    return true;
  } catch (err) {
    return false;
  }
}
