// ==UserScript==
// @name        YouTube - Display Reddit threads
// @namespace   localhost
// @include     https://www.youtube.com/watch?v=*
// @version     1
// @grant       GM_xmlhttpRequest
// ==/UserScript==

// Inspired by AlienTube
// https://github.com/xlexi/alientube

// Extract current video ID
function getVideoId()
{
    if (window.location.search.length > 0)
    {
        var s = window.location.search.substring(1);
        var requestObjects = s.split('&');
        for (var i = 0, len = requestObjects.length; i < len; i += 1)
        {
            var obj = requestObjects[i].split('=');
            if (obj[0] === "v")
            {
                return obj[1];
            }
        }
    }

    return null;
}

// Get search string for Reddit to get threads
function getRedditSearchString()
{
    var videoId = getVideoId();
    if(videoId)
    {
        return "https://api.reddit.com/search.json?q=" + encodeURI("(url:\"3D"+videoId+"\" OR url:\""+videoId+"\") (site:youtube.com OR site:youtu.be)")
    }

    return null;
}

// Create div that will contain the list
function createArea()
{
    var position = document.querySelector("#meta-contents").parentNode.nextElementSibling;

    var div = document.createElement("div");
    div.id = "redditThreads";
    div.style.fontSize = "1.4rem";
    div.style.fontWeight = "400";
    div.style.lineHeight = "2.1rem";
    div.style.color = "white";

    var ul = document.createElement("ul");
    div.appendChild(ul);

    position.parentNode.insertBefore(div, position);

    return div;
}

// Add a thread to the list
function addRedditThread(div, thread)
{
    var ul = div.firstChild;
    ul.style.listStyleType = '"\u25b6"';

    var li = document.createElement("li");
    li.style.paddingLeft = "10px";

    var link = thread.permalink;
    var subreddit = thread.subreddit;
    var comments = thread.num_comments;
    var title = thread.title;

    var threadLink = document.createElement("a");
    threadLink.href = "https://www.reddit.com" + link;
    threadLink.style.color = "rgb(39, 147, 230)";
    threadLink.appendChild(document.createTextNode(title));

    var subredditLink = document.createElement("a");
    subredditLink.href = "https://www.reddit.com/r/" + subreddit;
    subredditLink.style.color = "rgb(39, 147, 230)";
    subredditLink.appendChild(document.createTextNode("/r/" + subreddit));

    li.appendChild(subredditLink);
    li.appendChild(document.createTextNode(" \u25cf "));
    li.appendChild(threadLink);
    li.appendChild(document.createTextNode(" \u25cf "));
    li.appendChild(document.createTextNode(comments + " comments"));

    ul.appendChild(li);
}

// Main
function displayRedditThreads()
{
    var searchString = getRedditSearchString();

    if(searchString)
    {
        GM_xmlhttpRequest({
          method: "GET",
          url: searchString,
          onload: function(response) {
            results = JSON.parse(response.responseText);
            var finalResults = [];

            // Error
            if (results === {} || results.kind !== 'Listing' || results.data.children.length === 0)
                return;

            var searchResults = results.data.children;

            for(var i = 0; i < searchResults.length; i++)
            {
                var result = searchResults[i];

                // No data
                if(! result.data)
                    continue;

                finalResults.push(result.data);
            }

            // Sort by decreasing number of comments
            finalResults.sort(function(a, b){
                return parseInt(b.num_comments) - parseInt(a.num_comments);
            });

            if(finalResults.length > 0)
            {
                var div = createArea();

                for(var i = 0; i < finalResults.length; i ++)
                {
                    addRedditThread(div, finalResults[i]);
                }
            }
        }
    });
    }
}

function checkDescription()
{
    if ( document.querySelector("#description") == null)
        window.setTimeout(checkDescription, 1000);
    else
        displayRedditThreads();
}

// No iframe
if(self == top)
{
    checkDescription();
}
