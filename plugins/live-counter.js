NS.liveCounter = ({
    element = "",
    max = 100,
    counter = "",
    onLimit
}) => {
    if (typeof onLimit !== "function") return console.log("onLimit arg must be a type of function.");
    if (!element || !counter || !Number.isInteger(max)) return console.log("Please provide all arguments. Make sure max is a number.");
    const foundElement = document.querySelector(element);
    const foundCounter = document.querySelector(counter);

    foundElement.addEventListener("input", function () {
        const length = foundElement.value.length;
        foundCounter.textContent = `${length}/${max}`;
    });

    foundElement.addEventListener('paste', function (e) {
        const length = foundElement.value.length;
        const pasted = (e.clipboardData || window.clipboardData).getData('text');
        const newLength = length + pasted.length;
        const remain = max - length;

        if (newLength > max) {
            e.preventDefault();
            foundElement.value += pasted.slice(0, remain);
            foundCounter.textContent = `${length}/${max}`;

            onLimit();
        }
    });

    foundElement.addEventListener('keydown', function (e) {
        const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'];
        if (allowedKeys.includes(e.key)) return;
        const length = foundElement.value.length;

        if (length >= max) {
            e.preventDefault();
            onLimit();
        }
    });
}