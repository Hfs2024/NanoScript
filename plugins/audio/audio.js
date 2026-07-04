NS.audio = ({
    src,
    loop = false,
    onEnd
} = {}) => {
    if (!src) return console.error("You must pass a source.");

    const audio = new Audio(src);
    audio.loop = loop ? true : false; // Ensure it's a boolean

    const obj = {
        play: () => {
            return audio.play();
        },

        pause: () => {
            return audio.pause();
        },

        isPaused: () => {
            return audio.paused;
        },

        isLooped: () => {
            return audio.loop;
        },

        setLoop: (value) => {
            audio.loop = value ? true : false; // Ensure it's a boolean
        }
    }

    audio.addEventListener("ended", function () {
        if (typeof onEnd === "function") onEnd();
    });
    
    return obj;
}