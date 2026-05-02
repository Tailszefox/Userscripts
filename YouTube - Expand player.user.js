// ==UserScript==
// @name        YouTube - Expand player
// @author      Tailszefox
// @description Adds a button to expand player to fill viewport
// @match       https://www.youtube.com/*
// @version     1.0
// @run-at      document-start
// ==/UserScript==

function detectScrollAtTop(event) {
    // If we're at the top of the document and we tried to scroll up
    if (document.documentElement.scrollTop === 0 && event.deltaY < 0) {
        document.querySelector("div#player-full-bleed-container.style-scope").scrollIntoView();
    }
}

function addExpandButton(mutation, observer) {
    // Wait for buttons to be available
    if (document.querySelector("button.ytp-fullscreen-button")) {
        observer.disconnect();

        let expandButton = document.createElement("button");
        expandButton.classList.add("ytp-button");
        expandButton.classList.add("ytp-expandviewport-button");
        expandButton.style.boxShadow = "none";
        expandButton.dataset.active = "inactive";

        const SVG_NS = "http://www.w3.org/2000/svg";
        const XLINK_NS = "http://www.w3.org/1999/xlink";

        // Create SVG
        let svg = document.createElementNS(SVG_NS, "svg");
        svg.setAttribute("xmlns", SVG_NS);
        svg.setAttribute("xmlns:xlink", XLINK_NS);
        svg.setAttribute("height", "24px");
        svg.setAttribute("width", "24px");
        svg.setAttribute("version", "1.1");
        svg.setAttribute("viewBox", "0 0 20 20");

        // <use> shadow element
        let use = document.createElementNS(SVG_NS, "use");
        use.setAttribute("class", "ytp-svg-shadow");
        use.setAttributeNS(XLINK_NS, "xlink:href", "#ytp-id-viewport");

        // <path> icon
        let path = document.createElementNS(SVG_NS, "path");
        path.setAttribute(
            "d",
            "M 6 0 l 0 1.5 l -4.5 0 l 0 4.5 l -1.5 0 l 0 -6 z m -3 1.5 l 4.5 4.5 l -1.5 1.5 l -4.5 -4.5 l 0 -1.5 z M 6 20 l 0 -1.5 l -4.5 0 l 0 -4.5 l -1.5 0 l 0 6 z m -3 -1.5 l 4.5 -4.5 l -1.5 -1.5 l -4.5 4.5 l 0 1.5 z M 14 0 l 0 1.5 l 4.5 0 l 0 4.5 l 1.5 0 l 0 -6 z m 3 1.5 l -4.5 4.5 l 1.5 1.5 l 4.5 -4.5 l 0 -1.5 z M 14 20 l 0 -1.5 l 4.5 0 l 0 -4.5 l 1.5 0 l 0 6 z m 3 -1.5 l -4.5 -4.5 l 1.5 -1.5 l 4.5 4.5 l 0 1.5 z"
        );
        path.setAttribute("fill", "#fff");
        path.setAttribute("id", "ytp-id-viewport");

        // Assemble
        svg.appendChild(use);
        svg.appendChild(path);

        // Append directly (no importNode needed anymore)
        expandButton.appendChild(svg);

        let fullscreenButton = document.querySelector("button.ytp-fullscreen-button");
        fullscreenButton.parentNode.insertBefore(expandButton, fullscreenButton);

        // Tooltip creation and handling
        let tooltipBottom = document.createElement("div");
        tooltipBottom.classList.add("ytp-bottom");
        tooltipBottom.style.display = "none";

        let tooltipWrapper = document.createElement("div");
        tooltipWrapper.classList.add("ytp-tooltip-text-wrapper");
        tooltipBottom.appendChild(tooltipWrapper);

        let tooltipText = document.createElement("span");
        tooltipText.classList.add("ytp-tooltip-bottom-text");
        tooltipWrapper.appendChild(tooltipText);

        document.querySelector("#movie_player").appendChild(tooltipBottom);

        expandButton.addEventListener("mouseover", function() {
            tooltipText.textContent = "Fill viewport";

            tooltipBottom.style.display = "block";
            tooltipBottom.classList.add("ytp-tooltip");

            tooltipBottom.style.top = `${expandButton.getBoundingClientRect().top + window.pageYOffset - 95}px`;
            tooltipBottom.style.left = `${expandButton.offsetLeft - 16}px`;
        });

        expandButton.addEventListener("mouseout", function() {
            tooltipBottom.style.display = "none";
            tooltipBottom.classList.remove("ytp-tooltip");
        });

        // Click handling
        expandButton.addEventListener("click", function(event) {
            // Player not expanded yet, do it
            if (event.target.dataset.active === "inactive") {
                // Mark the button as active
                event.target.dataset.active = "active";

                // Unfix the header from the top of the screen
                document.querySelector("#masthead-container").style.position = "static";

                // Remove the margin from the rest of the page now that the header isn't in the way
                document.querySelector("#page-manager").style.marginTop = "0px";

                // Change height and max-height of full-bleed-container
                let fullBleed = document.querySelector("div#full-bleed-container");
                fullBleed.style.height = "auto";
                fullBleed.style.maxHeight = "none";

                console.log("before container");
                let container = document.querySelector("div#player-full-bleed-container.style-scope");
                console.log("after container", container);
                let viewportPx = document.documentElement.clientHeight + "px";

                // Set the height to be that of the window viewport
                container.style.height = viewportPx;
                container.style.maxHeight = viewportPx;

                // Center the player
                container.scrollIntoView();

                // Simulate a resize to force the video to take up the whole container
                window.dispatchEvent(new Event("resize"));

                // Center on player when scrolling at the top of the page
                document.addEventListener("wheel", detectScrollAtTop);

                // Restore player when we navigate away
                document.addEventListener("yt-navigate-start", function restorePlayer() {
                    // Switch the header back to being fixed
                    document.querySelector("#masthead-container").style.position = "";

                    // And the main content to have a margin
                    document.querySelector("#page-manager").style.marginTop = "";

                    // Restore the container initial size
                    let container = document.querySelector("div#player-full-bleed-container.style-scope");
                    container.style.height = "";
                    container.style.maxHeight = "";

                    // Make the button inactive again
                    document.querySelector("button.ytp-expandviewport-button").dataset.active = "inactive";

                    // Remove the event listener for detecting scrolling at the top of the page
                    this.removeEventListener("wheel", detectScrollAtTop);

                    // Remove this event listener so we don't call it more than once
                    this.removeEventListener("yt-navigate-start", restorePlayer);
                });
            }
            // Player already expanded, center it
            else {
                document.querySelector("div#player-full-bleed-container.style-scope").scrollIntoView();
            }
        });

        // Remove "Default view" button
        document.querySelector("#movie_player button.ytp-size-button")?.remove();
    }
}

function waitForPlayer() {
    // Only execute script on video pages
    if (window.location.href.indexOf("/watch?") === -1) {
        return;
    }

    // If the button is already there, no need to go any further
    if (document.querySelector("button.ytp-expandviewport-button")) {
        return;
    }

    let observer = new MutationObserver(addExpandButton);
    observer.observe(document.querySelector("div#content"), {
        subtree: true,
        childList: true
    });
}

document.addEventListener("yt-navigate-finish", waitForPlayer);