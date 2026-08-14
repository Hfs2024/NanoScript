/**
 * Copies some text
 * @param {string} text - Provided text to copy 
 * @param {Function} onSuccess - Action triggered when text is successfully copied
 * @param {Function} onFailure - Action triggered on failure
 * @returns {boolean} Returns true if successfully copied, and false if it fails
 */

NS.copy = async ({
    text,
    onSuccess,
    onFailure
}) => {
    if (!text) {
        console.error("Please provide text to copy!");
        return false;
    };

    await navigator.clipboard.writeText(text)
        .then(() => {
            if (typeof onSuccess === "function") onSuccess(text);
        })
        .catch(e => {
            if (typeof onFailure === "function") onFailure(e);
        });

    return true;
};