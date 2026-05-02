// ==UserScript==
// @name        Reddit - Fetch YouTube titles
// @author      Tailszefox
// @description Display the title of YouTube videos
// @match       https://*.reddit.com/r/*/comments/*
// @version     1.1
// @grant       GM_xmlhttpRequest
// @grant       GM_addStyle
// @grant       GM_registerMenuCommand
// @grant       GM_setValue
// @grant       GM_getValue
// ==/UserScript==

function parseLink(url) {
    const match = url.match(/^https?:\/\/(?:youtu\.be\/|www\.youtube\.com\/(?:watch\?v=|shorts\/))([a-zA-Z0-9_-]+)/);
    return match ? { vid: match[1] } : null;
}

function getTitle(l, vid) {
    let apiKey = GM_getValue("apiKey", null);

    if (apiKey === null || apiKey === "") {
        alert("Can't fetch YouTube titles; use userscript menu to enter API key.");
        return;
    }

    let apiUrl = 'https://www.googleapis.com/youtube/v3/videos?id=' + vid + '&part=snippet&fields=items(snippet/title)&key=' + apiKey;

    GM.xmlHttpRequest({
        url: apiUrl,
        onload: response => {
            let responseJson = JSON.parse(response.responseText);
            let videoTitle = responseJson.items[0].snippet.title;
            l.innerHTML += " <span style=\"font-size: smaller;\">("+videoTitle+")</span>";
        }
    });
}

function findYoutubeLinks() {
    let linksComments = document.querySelectorAll(".commentarea")[0].querySelectorAll("a[href*='youtube.com'],a[href*='youtu.be']");
    let linksSelfPost = document.querySelectorAll(".self .entry .usertext-body")[0]?.querySelectorAll("a[href*='youtube.com'],a[href*='youtu.be']");
    let links;

    if (linksSelfPost !== undefined) {
        links = Array.from(new Set([...linksSelfPost, ...linksComments]));
    } else {
        links = linksComments;
    }

    let i = 0;
    for (i = 0; i < links.length; i++) {
        let l = links[i];
        let url = l.href;
        let p = parseLink(url);

        if (p) {
            getTitle(l, p.vid);
        }
    }
}

function registerApiKey() {
    let currentApiKey = GM_getValue("apiKey", "");
    let apiKey = prompt("Please enter your YouTube API key", currentApiKey);

    if (apiKey) {
        GM_setValue("apiKey", apiKey);
    }
}

GM_registerMenuCommand("Set API key", registerApiKey);
window.setTimeout(findYoutubeLinks, 100);