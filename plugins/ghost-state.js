NS.getGhostState = () => {
    const currentSaves = JSON.parse(localStorage.getItem("ns-current-saves")) || [];
    currentSaves.forEach(save => {
        document.querySelector(save.selector).value = save.value;
    })
}

NS.ghostState = (selector) => {
    if (!selector) return console.error("You must provide a selector.");
    const element = document.querySelector(selector);

    element.addEventListener("input", function () {
        const currentSaves = JSON.parse(localStorage.getItem("ns-current-saves")) || [];
        const alreadyExists = currentSaves.find(save => save.selector === selector);

        if (alreadyExists) currentSaves[currentSaves.indexOf(alreadyExists)].value = element.value;
        else currentSaves.push({
            selector: selector,
            value: element.value
        });

        localStorage.setItem("ns-current-saves", JSON.stringify(currentSaves));
    });
}

NS.clearGhostState = (selector, onEnd) => {
    if (!selector) return console.error("You must provide a selector.");

    let currentSaves = JSON.parse(localStorage.getItem("ns-current-saves")) || {};
    currentSaves = currentSaves.filter(save => save.selector !== selector);
  
    localStorage.setItem("ns-current-saves", JSON.stringify(currentSaves));
    if (typeof onEnd === "function") onEnd();
}