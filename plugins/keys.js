NS.combination = ({
    keys = [],
    selector,
    control = false,
    alt = false,
    shift = false,
    action
}) => {
    if (!Array.isArray(keys) || !selector) return console.error("You didn't enter a key or a selector!");

    const foundElement = document.querySelector(selector);

    foundElement.addEventListener("keydown", function (e) {
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
}