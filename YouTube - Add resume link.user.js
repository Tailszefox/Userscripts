// ==UserScript==
// @name        YouTube - Add resume link
// @author      Tailszefox
// @description Adds link to resume to time in URL
// @match       https://www.youtube.com/*
// @version     1.0
// @run-at      document-start
// ==/UserScript==

function addResumeLink(mutation, observer) {
    // Wait for video title
    if (document.querySelector("div#title.style-scope.ytd-watch-metadata")) {
        observer.disconnect();

        // Clear previous resume link if there is one
        let oldDivResume = document.querySelector("#divResume");

        if (oldDivResume) {
            oldDivResume.parentNode.removeChild(oldDivResume);
        }

        // No resume parameter in query
        if (window.location.search.indexOf("&t=") === -1) {
            return;
        }

        let resumeTime = window.location.search.split("&t=")[1].split("&")[0].replace("s", "");

        let divResume = document.createElement("div");
        let aResume = document.createElement("a");
        let textResume = document.createTextNode("Resume to " + resumeTime);

        divResume.id = "divResume";

        aResume.dataset.resumeSeconds = resumeTime;
        aResume.style.color = "white";
        aResume.style.cursor = "pointer";

        aResume.addEventListener("click", function() {
            let resumeTo = this.dataset.resumeSeconds;
            document.querySelector(".html5-main-video").currentTime = resumeTo;
        }, true);

        aResume.appendChild(textResume);
        divResume.appendChild(aResume);
        document.querySelector("div#title.style-scope.ytd-watch-metadata").appendChild(divResume);

        return;
    }
}

function waitForElement() {
    // Only execute script on video pages
    if (window.location.href.indexOf("/watch?") === -1) {
        return;
    }

    let observer = new MutationObserver(addResumeLink);
    observer.observe(document.querySelector("div#content"), {
        subtree: true,
        childList: true
    });
}

document.addEventListener("yt-navigate-finish", waitForElement);