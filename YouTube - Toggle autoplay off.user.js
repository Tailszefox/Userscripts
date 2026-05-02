// ==UserScript==
// @name        YouTube - Toggle autoplay off
// @author      Tailszefox
// @description Clicks the autoplay toggle if it's on
// @match       https://www.youtube.com/*
// @version     1.0
// @run-at      document-start
// ==/UserScript==

function disableAutoplay() {
    // Click button to disable autoplay if it's enabled
    if (document.querySelector("div.ytp-autonav-toggle-button").attributes["aria-checked"].value === "true") {
        document.querySelector("div.ytp-autonav-toggle-button").click();

        // Check in one second if autoplay has been disabled properly
        window.setTimeout(disableAutoplay, 1000);
    }
}

function checkAutoplay(mutation, observer) {
    // Wait for button to be available
    if (document.querySelector("div.ytp-autonav-toggle-button")) {
        observer.disconnect();
        disableAutoplay();
    }
}

function waitForPlayer() {
    // Only execute script on video pages
    if (window.location.href.indexOf("/watch?") === -1) {
        return;
    }

    let observer = new MutationObserver(checkAutoplay);
    observer.observe(document.querySelector("div#content"), {
        subtree: true,
        childList: true
    });
}

document.addEventListener("yt-navigate-finish", waitForPlayer);