// ==UserScript==
// @name        YouTube - Hide relevant on sub page
// @author      Tailszefox
// @match       https://www.youtube.com/*
// @version     1.0
// @run-at      document-start
// ==/UserScript==

function waitForTabFocus() {
    // If already focused, continue immediately
    if (document.hasFocus()) return Promise.resolve();

    return new Promise(resolve => {
        const onFocus = () => {
            window.removeEventListener("focus", onFocus);
            resolve();
        };

        window.addEventListener("focus", onFocus);
    });
}

function hideRelevant() {
    document.querySelectorAll("#dismissible #title-text").forEach(async (titleTextElement) => {
        let titleText = titleTextElement.textContent.trim();

        if (titleText === "Most relevant") {
            console.log("Found relevant", titleTextElement);
            titleTextElement.closest("div#dismissible").style.opacity = "10%";
            titleTextElement.closest("div#dismissible").style.width = "50%";
        }
    });
}

async function waitForRelevant(mutation, observer) {
    document.querySelectorAll("#dismissible #title-text").forEach(async (titleTextElement) => {
        let titleText = titleTextElement.textContent.trim();

        if (titleText === "Most relevant") {
            observer.disconnect();
            console.log("Found relevant", titleTextElement);
            hideRelevant();
            await waitForTabFocus();
            hideRelevant();
            await new Promise(r => setTimeout(r, 5000));
            hideRelevant();
        }
    });
}

function waitForElement() {
    // Only execute script on subscription page
    if (window.location.href.indexOf("/feed/subscriptions") === -1) {
        return;
    }

    let observer = new MutationObserver(waitForRelevant);
    observer.observe(document.querySelector("div#content"), {
        subtree: true,
        childList: true
    });
}

document.addEventListener("yt-navigate-finish", waitForElement);