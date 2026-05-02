// ==UserScript==
// @name        YouTube - Add speed buttons
// @author      Tailszefox
// @description Adds a button to directly change the video speed
// @match       https://www.youtube.com/*
// @version     1.0
// @run-at      document-start
// ==/UserScript==

let BUTTON_COLOR_DISABLED = "#aaaaaa";

function disableButtons() {
    let textElements = document.getElementsByClassName("ytp-speed-text");
    for (let e of textElements) {
        e.setAttribute("fill", BUTTON_COLOR_DISABLED);
    }
}

function addButton(speed) {
    let speedString = speed.toString().replace(".", "dot");
    let buttonClass = `ytp-speed${speedString}-button`;
    let buttonId = `ytp-id-speed${speedString}`;

    let newSpeedButton = document.createElement("button");
    newSpeedButton.classList.add("ytp-button");
    newSpeedButton.classList.add(buttonClass);
    newSpeedButton.style.boxShadow = "none";
    newSpeedButton.dataset.active = "inactive";

    // SVG namespace constants
    const SVG_NS = "http://www.w3.org/2000/svg";
    const XLINK_NS = "http://www.w3.org/1999/xlink";

    // Create SVG element
    let svg = document.createElementNS(SVG_NS, "svg");
    svg.setAttribute("xmlns", SVG_NS);
    svg.setAttribute("xmlns:xlink", XLINK_NS);
    svg.setAttribute("height", "24");
    svg.setAttribute("width", "24");
    svg.setAttribute("version", "1.1");
    svg.setAttribute("viewBox", "0 0 24 24");

    // Create <use> element
    let use = document.createElementNS(SVG_NS, "use");
    use.setAttribute("class", "ytp-svg-shadow");
    use.setAttributeNS(XLINK_NS, "xlink:href", `#${buttonId}`);

    // Create <text> element
    let text = document.createElementNS(SVG_NS, "text");
    text.setAttribute("id", buttonId);
    text.setAttribute("class", "ytp-speed-text");
    text.setAttribute("fill", BUTTON_COLOR_DISABLED);
    text.setAttribute("stroke-width", "0px");
    text.setAttribute("font-family", "Arial");
    text.setAttribute("font-size", "18px");
    text.setAttribute("x", "50%");
    text.setAttribute("y", "55%");
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("dominant-baseline", "middle");
    text.textContent = speed;

    // Assemble SVG
    svg.appendChild(use);
    svg.appendChild(text);

    // Create container and append
    let newSpeedButtonContainer = document.createElement("div");
    newSpeedButtonContainer.setAttribute("fill-opacity", "1");

    newSpeedButton.appendChild(newSpeedButtonContainer);
    newSpeedButtonContainer.appendChild(svg);

    let buttonInsertBefore = document.querySelector("button.ytp-settings-button");
    buttonInsertBefore.parentNode.insertBefore(newSpeedButton, buttonInsertBefore);

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

    newSpeedButton.addEventListener("mouseover", function() {
        tooltipText.textContent = `Set speed to x${speed}`;

        tooltipBottom.style.display = "block";
        tooltipBottom.classList.add("ytp-tooltip");

        tooltipBottom.style.top = `${newSpeedButton.getBoundingClientRect().top + window.pageYOffset - 95}px`;
        tooltipBottom.style.left = `${newSpeedButton.offsetLeft - 16}px`;
    });

    newSpeedButton.addEventListener("mouseout", function() {
        tooltipBottom.style.display = "none";
        tooltipBottom.classList.remove("ytp-tooltip");
    });

    // Click handling
    newSpeedButton.addEventListener("click", function(event) {
        // Disable all buttons
        disableButtons();

        // If clicking on the current speed, revert back to x1 speed
        if (document.querySelector(".html5-main-video").playbackRate === speed) {
            document.querySelector(".html5-main-video").playbackRate = 1;
            window.wrappedJSObject.document.getElementById("movie_player").setPlaybackRate(1);
        }
        // Else, switch to the specified speed and enable the button
        else {
            event.target.querySelector("text").setAttribute("fill", "white");
            document.querySelector(".html5-main-video").playbackRate = speed;

            // Inform YouTube of the speed change if it's a supported one
            if (speed <= 4) {
                window.wrappedJSObject.document.getElementById("movie_player").setPlaybackRate(speed);
            }
        }
    });
}

function addSpeedButtons(mutation, observer) {
    // Wait for buttons to be available
    if (document.querySelector("button.ytp-fullscreen-button")) {
        observer.disconnect();
        addButton(1.5);
        addButton(2);
        addButton(2.5);
        addButton(3);
        addButton(4);
        addButton(5);
        addButton(6);
    }
}

function waitForPlayer() {
    // Only execute script on video pages
    if (window.location.href.indexOf("/watch?") === -1) {
        return;
    }

    // If the buttons are already there, no need to add them
    if (document.querySelector("button.ytp-speed1dot5-button")) {
        // However, we need to go back to x1 speed as YouTube remembers it when switching videos
        document.querySelector(".html5-main-video").playbackRate = 1;
        // And make all buttons appear disable
        disableButtons();
        // We can stop here
        return;
    }

    let observer = new MutationObserver(addSpeedButtons);
    observer.observe(document.querySelector("div#content"), {
        subtree: true,
        childList: true
    });
}

document.addEventListener("yt-navigate-finish", waitForPlayer);