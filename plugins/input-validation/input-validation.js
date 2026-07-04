NS.validate = (selector, type = "value", options = {}) => {
    if (!selector) return console.error("You must pass a selector.");
    type = type === "text" ? "textContent" : "value"

    const foundElement = document.querySelector(selector);
    if (options?.required && !foundElement[type]) return false;
    if (options?.regex && !options?.regex.test(foundElement[type])) return false;
    if (options?.enum && !options?.enum.includes(foundElement[type])) return false;
    if (options?.matchesWith) { // Both must match the type, case sensitive.
        const matchElement = document.querySelector(options?.matchesWith);
        if (!matchElement) {
            console.error(`Element "${options.matchesWith}" not found for matchesWith validation.`);
            return false;
        }

        if (matchElement[type] !== foundElement[type]) return false;
    }

    if (foundElement.type === "number") {
        if (!Number.isInteger(Number(foundElement[type]))) return false;
        if (options?.max !== undefined && foundElement[type] > options?.max) return false;
        if (options?.min !== undefined && foundElement[type] < options?.min) return false;
    }

    return true;
}