/**
 * Gets last saved drafts from localStorage
 * @param {boolean} onClose - Specify whether to trigger the beforeunload event
 * @param {Function} onCloseAction - Runs if `onClose` is true
 * @returns {any[]} - Returns any found saves
 */

NS.getGhostState = (onClose = false, onCloseAction) => {
    const currentSaves = JSON.parse(localStorage.getItem("ns-current-saves")) || [];
    currentSaves.forEach(save => {
        if (document.querySelector(save.selector)) document.querySelector(save.selector)[save.type] = save.value;
    });

    if (onClose) {
        window.addEventListener("beforeunload", function (e) {
            e.preventDefault();
            if (typeof onCloseAction === "function") onCloseAction();
            e.returnValue = "";
        });
    }

    return currentSaves;
}

/**
 * Sets auto-save drafts to a specific element
 * @param {string} selector - The input element 
 * @param {string} type - The type of the element's content
 * @param {number} resave - When to resave every X seconds
 * @param {number} timeout - Specify timeout variable
 * @param {Function} onSave - Action triggered on every save
 * @returns {boolean} Returns true if successfully configured, and false if it fails
 */
NS.ghostState = ({
    selector = "",
    type = "",
    resave = 3000,
    timeout = null,
    onSave
} = {}) => {
    if (!selector) {
        console.error("Invalid configration!");
        return false;
    }
    const element = document.querySelector(selector);
    if (!element) {
        console.error("Invalid selector!");
        return false;
    }
    resave = Number.isInteger(resave) ? resave : 3000;
    type = type === "text" ? "textContent" : type === "html" ? "innerHTML" : "value";

    const update = () => {
        const currentSaves = JSON.parse(localStorage.getItem("ns-current-saves")) || [];
        const alreadyExists = currentSaves.find(save => save.selector === selector);
        if (alreadyExists) currentSaves[currentSaves.indexOf(alreadyExists)].value = element[type];
        else currentSaves.push({
            selector: selector,
            type: type,
            value: element[type]
        });

        localStorage.setItem("ns-current-saves", JSON.stringify(currentSaves));
        if (typeof onSave === "function") return onSave();
    }

    element.addEventListener("input", function () {
        if (timeout) clearInterval(timeout);
        timeout = setTimeout(update, resave);
    });

    return true;
}

/**
 * Clears auto-save drafts from a specific element
 * @param {string} selector - The input element 
 * @param {Function} onEnd - Action triggered once auto-save drafts is cleared
 * * @returns {boolean} Returns true if successfully cleared, and false if it fails
 */
NS.clearGhostState = (selector = "", onEnd) => {
    if (!selector) {
        console.error("Invalid configration!");
        return false;
    }
    const element = document.querySelector(selector);
    if (!element) {
        console.error("Invalid selector!");
        return false;
    }

    const currentSaves = JSON.parse(localStorage.getItem("ns-current-saves")) || [];
    const index = currentSaves.findIndex(save => save.selector === selector);
    if (index === -1) return false;

    currentSaves.splice(index, 1);

    localStorage.setItem("ns-current-saves", JSON.stringify(currentSaves));
    if (typeof onEnd === "function") onEnd();
    return true;
}