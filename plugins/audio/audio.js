/**
 * Creates a helper object to control audio playback.
 * @param {string} src - URL of the audio file.
 * @param {boolean} loop - Repeat audio when finished.
 * @param {number} volume - Volume between 0 and 1.
 * @param {Function} onStart - Runs when audio starts.
 * @param {Function} onEnd - Runs when audio ends.
 * @param {Function} onPause - Runs when audio is paused.
 * @returns {Object|boolean} Returns methods to control the audio if successfully configured, and false if it fails
 */

NS.audio = ({
    src,
    loop = false,
    volume = 1,
    onStart,
    onEnd,
    onPause
} = {}) => {
    volume = parseFloat(volume);
    if (Number.isNaN(volume) || volume < 0 || volume > 1 || !src) {
        console.error("Invalid configuration!");
        return false;
    }

    const audio = new Audio(src);
    audio.volume = volume;
    audio.loop = loop ? true : false; // Ensure it's a boolean

    const obj = {
        play: () => {
            if (typeof onStart === "function") onStart();
            return audio.play();
        },

        pause: () => {
            if (typeof onPause === "function") onPause();
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