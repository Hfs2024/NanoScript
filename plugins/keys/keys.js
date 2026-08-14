/**
 * Registers a keyboard shortcut listener for specific keys and modifier combinations on a targeted element
 * @param {string[]} keys - An array of key names that can trigger the action
 * @param {string} selector - The CSS selector used to target the element(s) listening for the event
 * @param {boolean} control - Requires the Control key to be held down if true
 * @param {boolean} alt  - Requires the Alt key to be held down if true
 * @param {boolean} shift - Requires the Shift key to be held down if true
 * @param {Function} action - The callback function executed when all keyboard conditions and selector matches are met
 * @returns {boolean} Returns true if successfully configured, and false if it fails
 */

NS.combination = ({
    keys = [],
    selector,
    control = false,
    alt = false,
    shift = false,
    action
}) => {
    if (!Array.isArray(keys) || !selector) {
        console.error("Invalid configuration!")
        return false;
    }

    const element = document.querySelector(selector);
    if (!element) {
        console.error("Invalid selector!");
        return false;
    }

    element.addEventListener("keydown", function (e) {
        let isMatchKey = false;

        for (let key of keys) {
            if (e.key !== key) continue;

            isMatchKey = true;
            break;
        }

        if (
            isMatchKey
            &&
            (e.ctrlKey === control)
            &&
            (e.altKey === alt)
            &&
            (e.shiftKey === shift)
        ) {
            e.preventDefault();
            if (typeof action === "function") action();
        }
    });

    return true;
}