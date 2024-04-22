export function getColorFromString(str) {
  let hash = 0;
  for (var i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return `hsl(${hash % 360}, 100%, 80%)`;
}

export function getTextFromHtml(html) {
  var tempDivElement = document.createElement("div");
  tempDivElement.innerHTML = html;
  return tempDivElement.textContent || tempDivElement.innerText || "";
}

export function shortenText(text, length) {
  if (text.length > length) return text.substring(0, length - 3) + "...";

  return text;
}

export function shortenCharacters(str, maxLen, separator = " ") {
  if (str.length <= maxLen) return str;
  return str.substr(0, str.lastIndexOf(separator, maxLen)) + "...";
}

export function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
