// ==UserScript==
// @name        YouTube - Shorts in video page
// @author      Tailszefox
// @description Redirects shorts to proper video page
// @match       https://www.youtube.com/*
// @version     1.0
// @run-at      document-start
// ==/UserScript==

function checkUrl() {
    // Only execute script on shorts page
    if (window.location.href.indexOf("/shorts/") === -1) {
        return;
    }

    let currentUrl = window.location.href;
    let newUrl = currentUrl.replace("/shorts/", "/watch?v=");
    location.assign(newUrl);
}

if (window.location.href.indexOf("/shorts/") !== -1) {
    checkUrl();
} else {
    document.addEventListener("yt-navigate-finish", checkUrl);
}