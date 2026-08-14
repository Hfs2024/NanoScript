/**
 * Filters items in an array. Only use with inputs/textareas.
 * @param {any[]} items - The array of items to filter
 * @param {string} selector - The input element
 * @param {boolean} run - Specify whether to programmatically run a filter
 * @param {Function} onInput - Action triggered every time a search occurs
 * @returns {boolean} Returns true if successfully configured, and false if it fails
 */

NS.findArray = ({
  items = [],
  selector = "",
  run = true,
  onSearch
}) => {
  if (!Array.isArray(items) || !selector) {
    console.error("Invalid configuration!");
    return false;
  }

  const element = document.querySelector(selector);
  if (!element) {
    console.error("Invalid selector!");
    return false;
  }

  const checkIfMatch = () => {
    const matches = [];

    for (const item of items) {
      const text = (item.textContent ? item.textContent : item.value ? item.value : item).toLowerCase().trim();
      const value = element.value || "";

      if (text.includes(value.toLowerCase().trim())) {
        item.style.display = "block";
        matches.push(text);
      } else item.style.display = "none";
    }

    if (typeof onSearch === "function") return onSearch(matches);
  };

  element.addEventListener("input", function () {
    checkIfMatch();
  });

  if (run) checkIfMatch();
  return true;
}