document.addEventListener("DOMContentLoaded", function () {
    const informedBtn = document.getElementById("informedBtn");
    const entertainedBtn = document.getElementById("entertainedBtn");
    const banner = document.getElementById("ffBanner");

    if (!informedBtn || !entertainedBtn || !banner) return;

    function setMode(mode) {
        document.body.classList.remove("ff-informed", "ff-entertained");
        informedBtn.classList.remove("active");
        entertainedBtn.classList.remove("active");

        if (mode === "informed") {
            document.body.classList.add("ff-informed");
            informedBtn.classList.add("active");
            banner.innerText = "Mode: Informed";
        } else if (mode === "entertained") {
            document.body.classList.add("ff-entertained");
            entertainedBtn.classList.add("active");
            banner.innerText = "Mode: Entertained";
        } else {
            banner.innerText = "Mode: Default";
            mode = "default";
        }

        window.currentFeedMode = mode;
        console.log("[feedframe_mode.js] mode set to:", mode);
    }

    // Initialize without selecting either explicit mode.
    setMode("default");

    informedBtn.addEventListener("click", function () {
        setMode("informed");
    });

    entertainedBtn.addEventListener("click", function () {
        setMode("entertained");
    });

    let blinkTimeout = null;
    let blinkLoopTimeout = null;
    const minBlinkInterval = 25000;
    const maxBlinkInterval = 35000;

    function randomBlinkInterval() {
        return Math.floor(Math.random() * (maxBlinkInterval - minBlinkInterval + 1)) + minBlinkInterval;
    }

    function triggerBlink() {
        // 先移除，确保动画可以重新开始
        document.body.classList.remove("ff-blinking");

        // 强制浏览器重算样式，帮助 animation 重新触发
        void document.body.offsetWidth;

        // 再加回来
        document.body.classList.add("ff-blinking");

        console.log("blink started:", document.body.className);

        // 避免上一次 timeout 残留
        if (blinkTimeout) {
            clearTimeout(blinkTimeout);
        }

        blinkTimeout = setTimeout(function () {
            document.body.classList.remove("ff-blinking");
            console.log("blink ended:", document.body.className);
        }, 850);
    }

    // 暴露到 console，方便你手动测试
    window.triggerBlink = triggerBlink;

    function scheduleNextBlink() {
        if (blinkLoopTimeout) {
            clearTimeout(blinkLoopTimeout);
        }

        blinkLoopTimeout = setTimeout(function () {
            triggerBlink();
            scheduleNextBlink();
        }, randomBlinkInterval());
    }

    // Randomize each blink cue between 25 and 35 seconds.
    scheduleNextBlink();
});
