// ==UserScript==
// @name        YouTube - Reddit threads
// @author      Tailszefox
// @description Adds Reddit threads to YouTube videos
// @match       https://www.youtube.com/*
// @version     1.0
// @grant       GM_xmlhttpRequest
// @run-at      document-start
// ==/UserScript==

let merchObserver = null;

function addRedditThread(thread) {
    let ul = document.querySelector("#redditThreads").firstChild;

    let li = document.createElement("li");
    li.style.paddingLeft = "10px";

    let link = thread.permalink;
    let subreddit = thread.subreddit;
    let comments = thread.num_comments;
    let title = thread.title;
    let createdAt = new Date(thread.created * 1000).toLocaleDateString("fr");

    let threadLink = document.createElement("a");
    threadLink.href = "https://www.reddit.com" + link;
    threadLink.appendChild(document.createTextNode(title));

    let subredditLink = document.createElement("a");
    subredditLink.href = "https://www.reddit.com/r/" + subreddit;
    subredditLink.appendChild(document.createTextNode("/r/" + subreddit));

    li.appendChild(subredditLink);
    li.appendChild(document.createTextNode(" \u25cf "));
    li.appendChild(document.createTextNode(comments + " comments"));
    li.appendChild(document.createTextNode(" \u25cf "));
    li.appendChild(threadLink);
    li.appendChild(document.createTextNode(" \u25cf "));
    li.appendChild(document.createTextNode(createdAt));

    li.dataset.comments = comments;

    ul.appendChild(li);
}

function compareListItems(a, b) {
    let commentsA = a.dataset.comments;
    let commentsB = b.dataset.comments;
    return commentsB - commentsA;
}

function sortList(ul) {
    // First check if there's at least one thread with more than ten comments
    let hasMoreThanTen = false;

    Array.from(ul.getElementsByTagName("LI")).forEach(function(thread) {
        if (thread.dataset.comments >= 10)
        {
            hasMoreThanTen = true;
        }
    });

    // Next, colorize each thread according to number of comments
    Array.from(ul.getElementsByTagName("LI")).forEach(function(thread) {
        let comments = parseInt(thread.dataset.comments, 10);

        if (comments === 0) {
            thread.style.color = "rgb(64, 64, 64)";
            thread.getElementsByTagName("a")[0].style.color = "rgb(64, 64, 64)";
            thread.getElementsByTagName("a")[1].style.color = "rgb(64, 64, 64)";
        } else if (comments < 10 && hasMoreThanTen) {
            thread.style.color = "rgb(128, 128, 128)";
            thread.getElementsByTagName("a")[0].style.color = "rgb(128, 128, 128)";
            thread.getElementsByTagName("a")[1].style.color = "rgb(128, 128, 128)";
        } else {
            thread.getElementsByTagName("a")[0].style.color = "rgb(39, 147, 230)";
            thread.getElementsByTagName("a")[1].style.color = "rgb(39, 147, 230)";
        }
    });

    // Finally, sort all threads
    Array.from(ul.getElementsByTagName("LI")).sort(compareListItems).forEach(li => ul.appendChild(li));
}

function fetchUrl(url) {
    GM_xmlhttpRequest({
        method: "GET",
        url: url,
        onload: function(response) {
            let results = JSON.parse(response.responseText);

            // Error
            if (results === {} || results.kind !== 'Listing' || results.data.children.length === 0)
            {
                return;
            }

            let searchResults = results.data.children;

            for (let i = 0; i < searchResults.length; i++) {
                let result = searchResults[i];

                // No data
                if (!result.data)
                {
                    continue;
                }

                addRedditThread(result.data);
            }

            if (searchResults.length > 0) {
                document.querySelector("#redditThreadsNotFound").textContent = "";

                sortList(document.querySelector("#redditThreads").firstChild);
            }
        }
    });
}

function adjustPaddingIfMerch(mutation) {
    if (mutation.length === 0)
    {
        return;
    }

    let merchShelf = document.querySelector("#merch-shelf");

    if (merchShelf.childNodes.length === 0)
    {
        document.querySelector("#redditThreads").style.paddingTop = "0px";
    }
    else
    {
        document.querySelector("#redditThreads").style.paddingTop = "15px";
    }

    merchObserver.disconnect();
    merchObserver = null;
}

function grabRedditThreads(mutation, observer) {
    // Wait for description
    if (document.querySelector("#description")) {
        observer.disconnect();

        // Clear previous thread list if there is one
        let oldThreadList = document.querySelector("#redditThreads");

        if (oldThreadList)
        {
            oldThreadList.parentNode.removeChild(oldThreadList);
        }

        let redditThreadsDiv = document.createElement("div");
        redditThreadsDiv.id = "redditThreads";

        redditThreadsDiv.style.fontSize = "1.4rem";
        redditThreadsDiv.style.fontWeight = "400";
        redditThreadsDiv.style.lineHeight = "2.1rem";
        redditThreadsDiv.style.color = "white";
        redditThreadsDiv.style.marginLeft = "15px";

        let redditThreadsUl = document.createElement("ul");
        redditThreadsUl.style.listStyleType = '"\u25b6"';
        redditThreadsDiv.appendChild(redditThreadsUl);

        let noThreadsFound = document.createElement("span");
        noThreadsFound.id = "redditThreadsNotFound";
        noThreadsFound.style.color = "rgb(64, 64, 64)";
        noThreadsFound.appendChild(document.createTextNode("No Reddit threads found"));
        redditThreadsDiv.appendChild(noThreadsFound);

        let nodeInsert = document.querySelector("#comments");
        nodeInsert.parentNode.insertBefore(redditThreadsDiv, nodeInsert);

        // Adjust padding if merch shelf is present
        let merchShelf = document.querySelector("#merch-shelf");

        if (merchShelf) {
            if (merchShelf.childNodes.length > 0)
            {
                redditThreadsDiv.style.paddingTop = "15px";
            }

            // Observe merch node, as it gets updated after the page has loaded
            merchObserver = new MutationObserver(adjustPaddingIfMerch);
            merchObserver.observe(merchShelf, {
                subtree: true,
                childList: true
            });
        }

        let pageUrl = new URL(window.location.href);
        let videoId = pageUrl.searchParams.get("v");

        let redditUrls = ['youtube.com', 'youtu.be'].map(domain => `https://old.reddit.com/search.json?limit=100&sort=top&q=url:${videoId}+site:${domain}`);
        redditUrls.forEach(fetchUrl);
    }
}

function waitForElement() {
    // Only execute script on video pages
    if (window.location.href.indexOf("/watch?") === -1)
    {
        return;
    }

    let observer = new MutationObserver(grabRedditThreads);
    observer.observe(document.querySelector("div#content"), {
        subtree: true,
        childList: true
    });
}

// Remember to remove the merch observer when we're navigating away
function removeMerchObserver() {
    if (merchObserver) {
        merchObserver.disconnect();
        merchObserver = null;
    }
}

document.addEventListener("yt-navigate-finish", waitForElement);
document.addEventListener("yt-navigate-start", removeMerchObserver);