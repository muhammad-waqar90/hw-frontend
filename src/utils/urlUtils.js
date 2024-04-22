export function linksToPath(path, links) {
  return links.map((item) => {
    if (!item.url) return item;

    let params = item.url.split("?")[1];
    params.replace("page=1", "");
    item.url = `${path}?${params}`;
    return item;
  });
}
