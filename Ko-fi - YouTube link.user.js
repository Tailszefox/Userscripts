// ==UserScript==
// @name        Ko-fi - YouTube link
// @author      Tailszefox
// @description Adds a link to YouTube videos on Ko-fi posts
// @match       https://ko-fi.com/post/*
// @version     1.0
// @grant       none
// ==/UserScript==

function addAttachedUrl() {
    let ytElement = document.querySelector("lite-youtube");

    if (ytElement) {
        let videoId = ytElement.attributes.videoid.value;
        let fullUrl = "https://youtu.be/" + videoId;

        let ytLink = document.createElement("a");
        ytLink.href = fullUrl;
        ytLink.appendChild(document.createTextNode(fullUrl));

        ytElement.parentNode.appendChild(ytLink);
    }
}

window.setTimeout(addAttachedUrl, 1000);