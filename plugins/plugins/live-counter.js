NS.liveCounter = ({
    element = "",
    max = 100,
    allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Control', 'Alt'],
    counterElement = "",
    remainingElement = "",
    showCounter = false,
    showRemaining = false,
    onLimit
}) => {
    if (typeof onLimit !== "function") return console.error("onLimit arg must be a type of function.");
    if (!element || !Number.isInteger(max) || !Array.isArray(allowedKeys)) return console.error("Please provide all arguments. Make sure max is a number and allowedKeys in an array.");
    const foundElement = document.querySelector(element);
    let foundCounter = "";
    let foundRemaining = "";
    if (showCounter) foundCounter = document.querySelector(counterElement);
    if (showRemaining) foundRemaining = document.querySelector(remainingElement);

    foundElement.addEventListener("input", function () {
        const length = foundElement.value.length;
        if (showCounter && foundCounter) foundCounter.textContent = `${length}/${max}`;
        if (showRemaining && foundRemaining) foundRemaining.textContent = max - length;
    });

    foundElement.addEventListener('paste', function (e) {
        const length = foundElement.value.length;
        const pasted = (e.clipboardData || window.clipboardData).getData('text');
        const newLength = length + pasted.length;
        const remain = max - length;

        if (newLength > max) {
            e.preventDefault();
            foundElement.value += pasted.slice(0, remain);
            if (showCounter && foundCounter) foundCounter.textContent = `${length}/${max}`;
            if (showRemaining && foundRemaining) foundRemaining.textContent = max - lengt;

            onLimit();
        }
    });

    foundElement.addEventListener('keydown', function (e) {
        if (allowedKeys.includes(e.key)) return;
        const length = foundElement.value.length;

        if (length >= max) {
            e.preventDefault();
            onLimit();
        }
    });

    return {
        count: foundElement.value.length,
        remaining: max - foundElement.value.length
    }
}