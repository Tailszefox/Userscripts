// ==UserScript==
// @name        YouTube - Add player control buttons
// @author      Tailszefox
// @description Adds buttons to control player
// @match       https://www.youtube.com/*
// @version     1.0
// @run-at      document-start
// ==/UserScript==

function addButton(buttonName, buttonText, buttonTooltip, seekIncrement) {
    let buttonClass = `ytp-seek${buttonName}-button`;
    let buttonId = `ytp-id-seek${buttonName}`;

    let newControlButton = document.createElement("button");
    newControlButton.classList.add("ytp-button");
    newControlButton.classList.add(buttonClass);
    newControlButton.dataset.active = "inactive";

    // Parse SVG data for the button as a new document
    let buttonSvg = new DOMParser().parseFromString(`
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" height="100%" version="1.1" viewBox="0 0 36 36" width="100%">
            <use class="ytp-svg-shadow" xlink:href="#${buttonId}"></use>
            <rect class="ytp-seek-rectangle" fill="none" stroke="none" stroke-width="1px" stroke-opacity="100%" width="28px" height="20px" x="4" y="8" rx="3">
                <text id="${buttonId}" fill="white" stroke="white" font-family="Arial" font-size="16px" font-weight="normal" x="50%" dominant-baseline="middle" text-anchor="middle" y="55%">${buttonText}</text>
            </rect>
        </svg>`, "image/svg+xml");

    // Import that document and add it as a child to the button
    newControlButton.appendChild(newControlButton.ownerDocument.importNode(buttonSvg.documentElement, true));

    let buttonInsertBefore = document.querySelector("button.ytp-subtitles-button");
    buttonInsertBefore.parentNode.insertBefore(newControlButton, buttonInsertBefore);

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

    // Reduce text size if it doesn't fit in the rectangle
    if (document.querySelector(`.${buttonClass} use`).getBoundingClientRect().width >= 30) {
        document.getElementById(buttonId).setAttribute("font-size", "13px");
    }

    newControlButton.addEventListener("mouseover", function() {
        tooltipText.textContent = buttonTooltip;

        tooltipBottom.style.display = "block";
        tooltipBottom.classList.add("ytp-tooltip");

        tooltipBottom.style.top = `${newControlButton.getBoundingClientRect().top + window.pageYOffset - 95}px`;
        tooltipBottom.style.left = `${newControlButton.offsetLeft - 16}px`;
    });

    newControlButton.addEventListener("mouseout", function() {
        tooltipBottom.style.display = "none";
        tooltipBottom.classList.remove("ytp-tooltip");
    });

    // Click handling
    newControlButton.addEventListener("click", function() {
        document.querySelector(".html5-main-video").currentTime += seekIncrement;
    });
}

function addSeekButtons(mutation, observer) {
    // Wait for buttons to be available
    if (document.querySelector("button.ytp-fullscreen-button")) {
        observer.disconnect();
        addButton("previousframe", "-1", "Seek to previous frame", -0.02);
        addButton("nextframe", "+1", "Seek to next frame", 0.02);
        addButton("fivahead", "-5s", "Seek 5s behind", -5);
        addButton("fivebehind", "+5s", "Seek 5s ahead", 5);
    }
}

function waitForPlayer() {
    // Only execute script on video pages
    if (window.location.href.indexOf("/watch?") === -1) {
        return;
    }

    // If the buttons are already there, no need to add them
    if (document.querySelector("button.ytp-seeknextframe-button")) {
        return;
    }

    let observer = new MutationObserver(addSeekButtons);
    observer.observe(document.querySelector("div#content"), {
        subtree: true,
        childList: true
    });
}

document.addEventListener("yt-navigate-finish", waitForPlayer);