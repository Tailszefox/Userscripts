// ==UserScript==
// @name             Floatplane - Show more and duration
// @author           Tailszefox
// @match            https://www.floatplane.com/post/*
// @version          1.1
// ==/UserScript==

function showMore() {
    let result = document.evaluate("//section[contains(@class, '_postDescription')]//span[text()='Show more']", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
    let span = result.singleNodeValue;

    if (span) {
        span.click();
    }

    const video = document.querySelector('video');

    if (video) {
        // In a background tab, Firefox delays loading the video's metadata,
        // so video.duration can still be NaN when this runs. Wait until the
        // metadata is available before computing the duration.
        if (!Number.isFinite(video.duration)) {
            video.addEventListener('loadedmetadata', showDuration, { once: true });
        } else {
            showDuration(video);
        }
    }
}

function showDuration(eventOrVideo) {
    const video = eventOrVideo.target || eventOrVideo;
    const title = document.querySelector('[class*="_titleText_"]');

    if (!title) {
        return;
    }

    const mins = Math.floor(video.duration / 60);
    const secs = Math.floor(video.duration % 60).toString().padStart(2, '0');

    title.insertAdjacentHTML('afterend', `<span style="margin-left: 5px; margin-top: 3px;"> (${mins}:${secs})</span>`);
}

window.setTimeout(showMore, 3000);