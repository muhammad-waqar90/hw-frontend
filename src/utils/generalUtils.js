export function debounce(fn, delay) {
  var timeoutID = null;
  return function () {
    clearTimeout(timeoutID);
    var args = arguments;
    var that = this;
    timeoutID = setTimeout(function () {
      fn.apply(that, args);
    }, delay);
  };
}

export function removeDuplicatesByKey(array, key) {
  let lookup = new Set();
  return array.filter((obj) => !lookup.has(obj[key]) && lookup.add(obj[key]));
}

export function sanitizeNumberKey(e) {
  ["e", "E", "+", "-", "."].includes(e.key) && e.preventDefault();
}

export function getSpecificKeyValues(list, key) {
  return list.map((item) => item[key]);
}

export function roundNumber(num, decimals) {
  const multiplier = Math.pow(10, decimals);
  return Math.round((num + Number.EPSILON) * multiplier) / multiplier;
}

export function getDecimalAmount(amount, decimals) {
  return amount.toFixed(decimals);
}

export function autoAdjustTextareaHeightOnInput(textareaElement) {
  textareaElement.style.height = "auto";
  textareaElement.style.height = textareaElement.scrollHeight + "px";
}

export function autoAdjustTextareaHeightOnModelValue(
  textareaElement,
  textareaValue
) {
  if (textareaElement) {
    textareaElement.value = textareaValue;
    textareaElement.style.height = "auto";
    textareaElement.style.height = textareaElement.scrollHeight + "px";
  }
}

export function filterById(array, id) {
  return array.filter((item) => item.id !== id);
}
