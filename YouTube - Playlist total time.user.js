// ==UserScript==
// @name        YouTube - Playlist total time
// @author      Tailszefox
// @description Get how long watching a playlist would take
// @match       https://www.youtube.com/*
// @version     1.0
// @run-at      document-start
// ==/UserScript==

function formatDuration(duration) {
    let days = Math.floor(duration / 86400);
    let hours = Math.floor((duration % 86400) / 3600);
    let minutes = Math.floor((duration % 3600) / 60);
    let seconds = duration % 60;

    let durationString = "";

    if (days > 0) {
        durationString += days + " day" + (days > 1 ? "s" : "") + " ";
    }

    durationString += (hours < 10 ? "0" : "") + hours + ":";
    durationString += (minutes < 10 ? "0" : "") + minutes + ":";
    durationString += (seconds < 10 ? "0" : "") + seconds;

    return durationString;
}


function waitForStats() {
    window.setTimeout(addDurationLink, 5000);
}

function addDurationLink() {
    // Only execute on playlists
    if (window.location.href.indexOf("/playlist?") === -1) {
        return;
    }

    // Remove the previous duration link if it's present
    document.querySelector("#playlistGetDuration")?.remove();

    let durationLink = document.createElement("a");
    durationLink.id = "playlistGetDuration";
    durationLink.className = "metadata-stats ytd-playlist-byline-renderer";
    durationLink.style.cursor = "pointer";

    let stats = document.querySelectorAll("yt-content-metadata-view-model")[1].children[1];
    stats.insertAdjacentElement("afterend", durationLink);

    durationLink.appendChild(document.createTextNode("Duration:"));

    durationLink.addEventListener("click", function() {
        let totalLength = 0;

        let videoDurations = document.querySelectorAll("ytd-browse[role='main'] ytd-thumbnail-overlay-time-status-renderer span");

        videoDurations.forEach(function(durationElement) {
            let videoDuration = durationElement.innerText.trim();

            // Check that it has a duration (premiere)
            if (videoDuration.match(/:/g) === null) {
                return;
            }

            // Add 0 hours to the duration if it's less than an hour, to parse it properly
            if (videoDuration.match(/:/g).length === 1) {
                videoDuration = "0:" + videoDuration;
            }

            let parts = videoDuration.split(":");
            let hours = parseInt(parts[0]);
            let minutes = parseInt(parts[1]);
            let seconds = parseInt(parts[2]);
            totalLength += hours * 3600 + minutes * 60 + seconds;
        });

        let totalLengthFormatted = formatDuration(totalLength);
        durationLink.textContent = "Duration: " + totalLengthFormatted;
    });
}

document.addEventListener("yt-navigate-finish", waitForStats);