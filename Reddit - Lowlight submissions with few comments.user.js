// ==UserScript==
// @name        Reddit - Lowlight submissions with few comments
// @author      Tailszefox
// @description Makes submissions with few comments less visible
// @match       https://www.reddit.com/r/*/
// @match       https://www.reddit.com/
// @match       https://www.reddit.com/hot/
// @version     1.0
// @run-at      document-idle
// @grant       GM_registerMenuCommand
// @grant       GM_setValue
// @grant       GM_getValue
// ==/UserScript==

function setSubreddits() {
    let currentSubreddits = GM_getValue("subreddits", "");
    let subreddits = prompt("Enter the subreddits and the minimum amount of comments to lowlight a submission.\nExample:\npics:30 gaming:10 funny:50\nThis will lowlight submissions in pics with less than 30 comments, in gaming with less than 10 comments, and in funny with less than 50 comments.", currentSubreddits);

    if (subreddits) {
        GM_setValue("subreddits", subreddits);
    }
}

GM_registerMenuCommand("Set subreddits", setSubreddits);

// Get the list of subreddits set by the user
let subredditsValue = GM_getValue("subreddits", "");

if (subredditsValue === "") {
    return;
}

let subreddits = {};
subredditsValue.toLowerCase().split(" ").forEach(function(s) {
    let subAndComs = s.split(":");
    subreddits[subAndComs[0]] = parseInt(subAndComs[1], 10);
});

let currentSubreddit;

// If on front page
if(window.location.href === "https://www.reddit.com/" || window.location.href === "https://www.reddit.com/hot/") {
    currentSubreddit = "frontpage";
}
else {
    currentSubreddit = window.location.href.match(/https:\/\/(www|old).reddit.com\/r\/(\w+)\/?$/)?.[2].toLowerCase();
}

if (currentSubreddit === undefined || subreddits[currentSubreddit] === undefined) {
    return;
}

// Lowlight all submissions with less than than the number of comments specified
document.querySelectorAll(".linklisting > div.thing").forEach(function(submission) {
    let aComments = submission.querySelector("a.comments");

    if (aComments !== null) {
        let commentsNb = parseInt(submission.querySelector("a.comments").textContent.split(" ")[0], 10) || 0;

        if (commentsNb < subreddits[currentSubreddit]) {
            let thumbnail = submission.querySelector("a.thumbnail");
            let entry = submission.querySelector("div.entry");

            if (thumbnail) {
                thumbnail.style.filter = "opacity(30%)";
            }

            entry.style.filter = "opacity(30%)";
        }
    }
});