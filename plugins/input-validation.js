NS.validate = (selector, options = {}) => {
    if (!selector) return console.error("You must pass a selector.");

    const foundElement = document.querySelector(selector);
    if (options?.required && !foundElement.value) return false;
    if (options?.enum && !options?.enum.includes(foundElement.value)) return false;
    if (foundElement.type === "number") {
        if (!Number.isInteger(Number(foundElement.value))) return false;
        if (options?.max !== undefined && foundElement.value > options?.max) return false;
        if (options?.min !== undefined && foundElement.value < options?.min) return false;
    }

    return true;
}