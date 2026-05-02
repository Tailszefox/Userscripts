// ==UserScript==
// @name        YouTube - Remember videos in Watch Later
// @author      Tailszefox
// @description Shows you details about deleted videos in Watch later
// @match       https://www.youtube.com/*
// @version     1.0
// @run-at      document-start
// ==/UserScript==

function waitForVideos() {
    window.setTimeout(saveVideos, 2500);
}

function saveVideos() {
    // Only execute on Watch Later playlist
    if (window.location.href.indexOf("/playlist?list=WL") === -1) {
        return;
    }

    let previousVideosJson = localStorage.getItem("savedVideosTailszefox");
    let previousVideos;

    if (previousVideosJson !== null) {
        previousVideos = JSON.parse(previousVideosJson);
    } else {
        previousVideos = {};
    }

    // Increase the number of times each video has not been seen
    Object.keys(previousVideos).forEach(function(videoId) {
        previousVideos[videoId].notSeenTimes = previousVideos[videoId].notSeenTimes + 1;
    });

    document.querySelectorAll("ytd-playlist-video-renderer").forEach(function(video) {
        let videoId = video.querySelector("a#thumbnail").href.split("v=")[1].split("&")[0];
        let videoTitle = video.querySelector("a#video-title:last-of-type").textContent.trim();
        let channelNameElement = video.querySelector("yt-formatted-string.ytd-channel-name").innerText;

        if (channelNameElement.length === 0) {
            if (videoId in previousVideos) {
                let previousData = previousVideos[videoId];

                alert(`Found deleted/private video ${videoId} titled "${previousData.title}" from channel "${previousData.channelName}"`);

                previousVideos[videoId] = previousData;
                // Reset not seen to 0
                previousVideos[videoId].notSeenTimes = 0;
            }
        } else {
            let videoChannelName = video.querySelector("ytd-channel-name a").textContent;
            let videoChannelLink = video.querySelector("ytd-channel-name a").href;
            // Save video info and reset not seen to 0
            previousVideos[videoId] = {
                "title": videoTitle,
                "channelName": videoChannelName,
                "channelUrl": videoChannelLink,
                "notSeenTimes": 0
            };
        }

    });

    // Delete videos not seen for a while
    let videosToDelete = [];

    Object.keys(previousVideos).forEach(function(videoId) {
        if (previousVideos[videoId].notSeenTimes > 10) {
            videosToDelete.push(videoId);
        }
    });

    videosToDelete.forEach(function(idToDelete) {
        delete previousVideos[idToDelete];
    });

    // Show number of videos saved
    if (document.querySelector("span#nbVideosSavedTailszefox") === null) {
        let nbSaved = document.createElement("span");
        nbSaved.id = "nbVideosSavedTailszefox";
        nbSaved.insertAdjacentText("afterbegin", " (" + Object.keys(previousVideos).length + " saved)");
        document.querySelector("div.metadata-stats yt-formatted-string")?.appendChild(nbSaved);
    }

    localStorage.setItem("savedVideosTailszefox", JSON.stringify(previousVideos));
}

function removeNbVideosSaved() {
    document.querySelector("span#nbVideosSavedTailszefox")?.remove();
}

document.addEventListener("yt-navigate-finish", waitForVideos);
document.addEventListener("yt-navigate-start", removeNbVideosSaved);