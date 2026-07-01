NS.type = ({
    target,
    text,
    speed = 100,
    loop = false,
    loopDelay = 200,
    onEnd
} = {}) => {
    if (!target || !text || !Number.isInteger(speed) || !Number.isInteger(loopDelay)) return console.error("Please pass a target and text, and make sure speed and loopDelay are integers");

    const foundTarget = document.querySelector(target);
    foundTarget.textContent = ""; // Reset the target text

    for (let i = 0; i < text.length; i++) {
        setTimeout(() => {
            foundTarget.textContent += text[i];

            if (i === text.length - 1) {
                if (typeof onEnd !== "function") onEnd();
                if (loop) {
                    setTimeout(() => {
                        NS.type({ target, text, speed, loop, loopDelay, onEnd });
                    }, loopDelay);
                }
            }
        }, speed * i);
    }
}