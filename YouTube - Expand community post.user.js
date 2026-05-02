// ==UserScript==
// @name        YouTube - Expand community post
// @author      Tailszefox
// @description Automatically expands community post
// @match       https://www.youtube.com/*
// @version     1.0
// @run-at      document-start
// ==/UserScript==

function checkPage() {
    // Only execute script on community post pages
    let currentPath = window.location.pathname;
    if (currentPath.startsWith("/post")) {
        document.querySelector("ytd-backstage-post-renderer #more")?.click();
    }
}

document.addEventListener("yt-navigate-finish", checkPage);