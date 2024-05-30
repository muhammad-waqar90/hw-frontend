export function linksToPath(path, links) {
  return links.map((item) => {
    if (!item.url) return item;

    let params = item.url.split("?")[1];
    params.replace("page=1", "");
    item.url = `${path}?${params}`;
    return item;
  });
}

export async function checkLink(string) {
  try {
    new URL(string);
    return true;
  } catch (err) {
    return false;
  }
}

export function getFileExtension(url) {
  const parts = url.split(".");
  if (parts.length > 1) {
    return parts.pop().toLowerCase();
  } else {
    return "";
  }
}
