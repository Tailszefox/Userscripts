// ==UserScript==
// @name        Reddit - Fix reddit galleries marked as read
// @author      Tailszefox
// @description No more reddit galleries marked as read
// @match       https://www.reddit.com/
// @match       https://www.reddit.com/hot/
// @match       https://www.reddit.com/r/*/
// @match       https://www.reddit.com/r/*/top/
// @match       https://www.reddit.com/r/*/top/?*
// @version     1.0
// @run-at      document-idle
// ==/UserScript==

document.querySelectorAll(".linklisting > div.thing p.title > a").forEach(function(submissionLink) {
    if(submissionLink.attributes.href.value === "")
    {
        let realUrl = submissionLink.attributes["data-href-url"].value;
        submissionLink.setAttribute("href", realUrl);
    }
});