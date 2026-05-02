// ==UserScript==
// @name             Floatplane - Show more
// @author           Tailszefox
// @match            https://www.floatplane.com/post/*
// @version          1.0
// ==/UserScript==

function showMore() {
    let result = document.evaluate("//section[contains(@class, '_postDescription')]//span[text()='Show more']", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
    let span = result.singleNodeValue;

    if (span) {
        span.click();
    }
}

window.setTimeout(showMore, 3000);