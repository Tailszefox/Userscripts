// ==UserScript==
// @name        YouTube - Expand description
// @author      Tailszefox
// @description Automatically expands video description
// @match       https://www.youtube.com/*
// @version     1.0
// @run-at      document-start
// ==/UserScript==

function expandDescription(retry) {
    let description = document.querySelector("div#description.style-scope");
    description.click();

    if (retry) {
        window.setTimeout(function() {
            let expandedDescription = document.querySelector("div#description.style-scope ytd-text-inline-expander#description-inline-expander[is-expanded]");
            if (expandedDescription === null) {
                expandDescription(false);
            }
        }, 2000);
    }
}

function waitForExpandInViewport() {
    // Set up the options for the IntersectionObserver.
    // root: null uses the browser viewport. threshold: 0.1 means at least 10% of the target must be visible.
    let options = {
        root: null,
        rootMargin: '0px',
        threshold: 1
    };

    // Create the IntersectionObserver instance
    let expandObserver = new IntersectionObserver(function(entries, observer) {
        // Loop over the entries
        entries.forEach(entry => {
            // Check if the element is intersecting
            if (entry.isIntersecting) {
                // Run the desired function
                expandDescription(true);
                // Disconnect the observer after it runs once
                observer.disconnect();
            }
        });
    }, options);

    let expandButton = document.querySelector("tp-yt-paper-button#expand");
    expandObserver.observe(expandButton);
}

function waitForDescription(mutation, observer) {
    if (document.querySelector("div#description.style-scope tp-yt-paper-button#expand-sizer")) {
        observer.disconnect();
        waitForExpandInViewport();
    }
}

function waitForElement() {
    // Only execute script on video pages
    if (window.location.href.indexOf("/watch?") === -1) {
        return;
    }

    let observer = new MutationObserver(waitForDescription);
    observer.observe(document.querySelector("div#content"), {
        subtree: true,
        childList: true
    });
}

document.addEventListener("yt-navigate-finish", waitForElement);