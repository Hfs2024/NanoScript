NS.type = async ({
    target,
    strings = ["I am a text typing effect!"],
    speed = 100,
    loop = false,
    loopDelay = 200,
    onEnd
} = {}) => {
    if (!target || !Number.isInteger(speed) || !Number.isInteger(loopDelay)) return console.error("Please pass a target, and make sure speed and loopDelay are integers");

    const foundTarget = document.querySelector(target);
    foundTarget.textContent = ""; // Reset the target text
    let globalCharCount = 0;

    for (let i = 0; i < strings.length; i++) {
        const string = strings[i];

        setTimeout(() => {
            foundTarget.textContent = "";
        }, speed * globalCharCount);

        for (let j = 0; j < string.length; j++) {
            setTimeout(() => {
                foundTarget.textContent += string[j];

                if ((j === string.length - 1) && (i === strings.length - 1)) {
                    if (loop) {
                        setTimeout(() => {
                            NS.type({ target, strings, speed, loop, loopDelay, onEnd });
                        }, loopDelay);
                    }
                }
            }, speed * globalCharCount);

            globalCharCount++;
        }
    }
}
