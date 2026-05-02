// ==UserScript==
// @name        YouTube - Shorts tweaks on sub page
// @author      Tailszefox
// @description Stuff to do with shorts on sub page
// @match       https://www.youtube.com/*
// @version     1.0
// @run-at      document-start
// @grant       GM_xmlhttpRequest
// @grant       GM_registerMenuCommand
// @grant       GM_setValue
// @grant       GM_getValue
// ==/UserScript==

function registerApiKey() {
    let currentApiKey = GM_getValue("apiKey", "");
    let apiKey = prompt("Please enter your YouTube API key", currentApiKey);

    if (apiKey) {
        GM_setValue("apiKey", apiKey);
    }
}

function formatDuration(duration) {
    let match = duration.match(/PT(([0-9]+)H)?(([0-9]+)M)?(([0-9]+)S)?/);

    let hours = match[2] || "0";
    let minutes = match[4] || "0";
    let seconds = match[6] || "0";

    seconds = seconds.padStart(2, "0");

    if (hours > 0) {
        minutes = minutes.padStart(2, "0");
        return hours + ":" + minutes + ":" + seconds;
    }

    return minutes + ":" + seconds;
}

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

function insertInfoAndChangeLink(channelName, duration, videoId) {
    let videoLink = document.querySelector(`h3 a[href='/shorts/${videoId}']`);
    let videoDetails = videoLink.parentElement;

    videoDetails.style.maxHeight = 'none';
    videoDetails.style.webkitLineClamp = 'unset';

    let div = document.createElement("div");
    div.style.fontSize = "10pt";
    div.innerText = duration + " - " + channelName;
    videoDetails.insertBefore(div, videoDetails.children[0]);

    videoLink.href = videoLink.href.replace("/shorts/", "/watch?v=");
}

function changeThumbnailLink() {
    let containerLink = document.querySelector("a#media-container-link");
    containerLink.href = containerLink.href.replace("/shorts/", "/watch?v=");
}

function pruneOldCacheEntries(oldCache, newCache, maxMisses = 40) {
    for (let shortId in oldCache) {
        if (!newCache.hasOwnProperty(shortId)) {
            let entry = oldCache[shortId];
            console.log(shortId, "not on current page");
            console.log(entry);
            if (typeof entry.lastseen === "number" && entry.lastseen < maxMisses) {
                console.log("Increasing lastseen...");
                // Increment lastseen and preserve the entry
                newCache[shortId] = {
                    channel: entry.channel,
                    duration: entry.duration,
                    lastseen: entry.lastseen + 1
                };
            }
        }
    }

    console.log("New cache is", newCache);
}

async function scanForShorts(mutation, observer) {
    // Wait for shorts
    let shorts = document.querySelectorAll("ytd-rich-shelf-renderer[is-shorts] ytd-rich-item-renderer");

    if (shorts.length > 0) {
        observer.disconnect();

        await waitForTabFocus();
        await new Promise(r => setTimeout(r, 5000));

        shorts = document.querySelectorAll("ytd-rich-shelf-renderer[is-shorts] ytd-rich-item-renderer");
        console.log("Found shorts", shorts);

        let apiKey = GM_getValue("apiKey", null);

        // Load old cache
        let oldCache = JSON.parse(localStorage.getItem("shortCache") || "{}");
        // Start a new cache for the current session
        let newCache = {};

        // Counter for active API requests
        let activeRequests = 0;

        console.log("Old cache");
        console.log(oldCache);

        // Any new short below the fold?
        let newShortsBelowFold = false;

        shorts.forEach((short, index) => {
            // Change link when hovering
            let thumb = short.querySelector("ytm-shorts-lockup-view-model");
            // Use setTimeout with no delay to wait until other hover events are done
            thumb.addEventListener('mouseover', () => window.setTimeout(changeThumbnailLink));

            let shortId = short.querySelector("a").href.split("/").pop();

            // Check cache for the channel name
            if (oldCache[shortId]) {
                console.log("Cache hit for video ID:", shortId);
                console.log(oldCache[shortId]);
                insertInfoAndChangeLink(oldCache[shortId].channel, oldCache[shortId].duration, shortId);
                newCache[shortId] = oldCache[shortId]; // Copy to new cache
                newCache[shortId].lastseen = 0;

                // Hide short
                short.style.opacity = "25%";
            } else {
                console.log("Cache miss for video ID:", shortId);
                activeRequests++; // Increment the request counter
                console.log("active requests", activeRequests);

                // Shorts 0-4 are above fold, 5 and more are below
                if (index >= 5) {
                    console.log("Short is below fold");
                    newShortsBelowFold = true;
                }

                GM_xmlhttpRequest({
                    method: "GET",
                    url: `https://www.googleapis.com/youtube/v3/videos?id=${shortId}&part=snippet,contentDetails&key=${apiKey}`,

                    onload: function(response) {
                        let data = JSON.parse(response.responseText);
                        if (data.items && data.items.length > 0) {
                            data.items.forEach(item => {
                                let channelName = item.snippet.channelTitle;
                                let duration = item.contentDetails.duration;
                                let formattedDuration = formatDuration(duration);

                                // Insert short info into the DOM
                                insertInfoAndChangeLink(channelName, formattedDuration, shortId);

                                // Add to cache
                                newCache[shortId] = {
                                    "channel": channelName,
                                    "duration": formattedDuration,
                                    "lastseen": 0,
                                };
                            });
                        } else {
                            console.log('No data found for the provided video ID.');
                        }

                        activeRequests--; // Decrement the counter when request completes
                        console.log("Done for ID", shortId, "requests remaining", activeRequests);

                        if (activeRequests === 0) {
                            console.log("All requests done, prunning...");
                            pruneOldCacheEntries(oldCache, newCache);
                            // Save the new cache when all requests are done
                            localStorage.setItem("shortCache", JSON.stringify(newCache));

                            if (newShortsBelowFold) {
                                document.querySelector("ytd-rich-shelf-renderer[is-shorts] button[aria-label='Show more']").click();
                            } else {
                                document.querySelector("ytd-rich-shelf-renderer[is-shorts] button[aria-label='Show more']").style.opacity = "25%";
                            }
                        }
                    }
                });

            }
        });

        // Check if there were no requests made, save cache immediately
        if (activeRequests === 0) {
            console.log("No request needed, prunning...");
            pruneOldCacheEntries(oldCache, newCache);
            localStorage.setItem("shortCache", JSON.stringify(newCache));
            document.querySelector("ytd-rich-shelf-renderer[is-shorts] button[aria-label='Show more']").style.opacity = "25%";
        }
    }
}

function waitForElement() {
    // Only execute script on subscription page
    if (window.location.href.indexOf("/feed/subscriptions") === -1) {
        return;
    }

    let observer = new MutationObserver(scanForShorts);
    observer.observe(document.querySelector("div#content"), {
        subtree: true,
        childList: true
    });
}

document.addEventListener("yt-navigate-finish", waitForElement);

GM_registerMenuCommand("Set API key", registerApiKey);