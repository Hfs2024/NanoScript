NS.audio = ({
    src,
    loop = false,
    volume = 1,
    onEnd,
    onStart
} = {}) => {
    volume = parseFloat(volume);
    if (Number.isNaN(volume) || volume < 0 || volume > 1) return console.error("Volume must be a type of number between 0 and 1.");
    if (!src) return console.error("You must pass a source.");

    const audio = new Audio(src);
    audio.volume = volume;
    audio.loop = loop ? true : false; // Ensure it's a boolean

    const obj = {
        play: () => {
            if (typeof onStart === "function") onStart();
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
            return audio.loop = value ? true : false; // Ensure it's a boolean
        },

        setVolume: (value) => {
            return audio.volume = parseFloat(value); // Ensure it's a number
        },

        toggleMute: () => {
            return audio.muted = !audio.muted;
        },

        mute: () => {
            return audio.muted = true;
        },

        unMute: () => {
            return audio.muted = false;
        },

        getCurrentTime:() => {
            return audio.currentTime;
        },

        setCurrentTime: (value) => {
            return audio.currentTime = parseFloat(value); // Ensure it's a number
        }
    }

    audio.addEventListener("ended", function () {
        if (typeof onEnd === "function") onEnd();
    });

    return obj;
}