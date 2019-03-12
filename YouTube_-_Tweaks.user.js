// ==UserScript==
// @name        YouTube - Tweaks
// @author      Tailszefox
// @namespace   localhost
// @description Some tweaks to make YouTube better
// @icon        https://i.imgur.com/8qxoj2N.png
// @include     https://www.youtube.com/*
// @version     1
// @grant       GM_setClipboard
// @grant       GM_xmlhttpRequest
// @run-at      document-start
// ==/UserScript==

var intervals = [];
var intervalsNames = [];
var clipboard = "";

// No iframe
if (self == top)
{
    console.log("Script loaded");
  
    window.addEventListener("yt-navigate-start", function() { console.log("start") });
    window.addEventListener("yt-navigate-finish", function() { console.log("finish") });

    window.addEventListener("DOMContentLoaded", function() { console.log("DOMload") });
    window.addEventListener("load", function() { console.log("load") });

    // Clear intervals each time we switch to a different page
    window.addEventListener("yt-navigate-start", clearIntervals);

    // Call main function when current page has loaded, either directly or through SPF
    process(false);
    //window.addEventListener("DOMContentLoaded", function() { process(false); });
    window.addEventListener("yt-navigate-finish", function() { process(true); });
}

// Add new interval
function addInterval(f, time)
{
    if (intervalsNames.includes(f.name))
    {
        console.log(f.name + " already has an interval");
        return;
    }

    var intervalId = window.setInterval(f, time);
    intervals.push(intervalId);
    console.log("Adding new interval " + intervalId);
    intervalsNames.push(f.name);
    console.log("Adding new interval name " + f.name);
}

// Clear one interval using function name
function clearOneInterval(intervalName)
{
    if (! intervalsNames.includes(intervalName))
    {
        console.log(intervalName + " not found!");
        return;
    }

    var index = intervalsNames.indexOf(intervalName);
    var intervalId = intervals[index];

    window.clearInterval(intervalId);
    intervals.splice(index, 1);
    intervalsNames.splice(index, 1);

    console.log("Clearing interval name " + intervalName);
    console.log("Clearing interval " + intervalId);
    console.log("New interval array: " + intervals);
    console.log("New interval name array: " + intervalsNames);
}

// Clear all intervals previously added
function clearIntervals()
{
    intervals.forEach(function(intervalId, index) {
        window.clearInterval(intervalId);
        console.log("Clearing interval " + intervalId);
        console.log("Clearing interval name " + intervalsNames[index]);
    });

    intervals = [];
    intervalsNames = [];
}

// Main function
function process(spf)
{
    var href = window.location.href;
    console.log("Current page is " +  href);
    console.log("Called with SPF " + spf);

    // Subscriptions, channel, playlist: add copy to clipboard buttons
    if(href.indexOf("/feed/subscriptions") != -1 || href.indexOf("/user/") != -1 || href.indexOf("/channel/") != -1 || href.indexOf("/playlist?") != -1)
    {
        clipboard = "";
        addCopyToClipboardButtons();
        addInterval(addCopyToClipboardButtons, 5000);
      
        // Playlist page: change playlist link
        if(href.indexOf("/playlists") != -1)
        {
          addInterval(changePlaylistLinks, 5000);
        }
    }
    // Video
    else if(href.indexOf("/watch?") != -1)
    {     
        // Only called with SPF
        if (spf == true)
        {
            //addInterval(stopAutoplay, 100);
            addInterval(addRedditThreads, 1000);
            addInterval(addResumeLink, 1000);
            addInterval(expandDescription, 1000);
            addInterval(expandPlayerContainer, 1000);
            addInterval(expandPlayer, 5000);
            //addInterval(switchToFullHd, 5000);
        }
    }
}

// Add copy to clipboard buttons
function addCopyToClipboardButtons()
{
    var href = window.location.href;
    var selector = "";

    // Subscriptions or channel
    if(href.indexOf("/feed/subscriptions") != -1 || href.indexOf("/user/") != -1 || href.indexOf("/channel/") != -1)
    {
        selector = "#video-title";
    }
    // Playlist
    else if(href.indexOf("/playlist?") != -1)
    {
        selector = "a.ytd-playlist-video-renderer";
    }

    links = document.querySelectorAll(selector);

    for(var i = 0; i < links.length; i++)
    {
        var l = links[i];

        if(l.getAttribute("data-scanned"))
            continue;

        var button = document.createElement("a");
        button.innerHTML = "+";
        button.style.cursor = "pointer";
        button.style.color=  "white";
        button.style.float = "right";
        button.style.fontSize = "24px";
        button.style.position = "relative";
        button.style.marginRight = "10px";
        button.title = l.href;

        button.addEventListener("click", function(e) {
            e.target.style.color = "#008aff";
            e.target.oldColor = e.target.style.color;

            var url = e.target.title;
            clipboard += url + " ";
            GM_setClipboard(clipboard);
            console.log("Added " + url + " to clipboard");
            console.log("Clipboard is now " + clipboard);
        }, true);

        button.addEventListener("mouseover", function() {
            this.oldColor = this.style.color;
            this.style.color = "#74d8ff" 
        }, true);

        button.addEventListener("mouseout", function() {
            if (this.oldColor)
            {
                this.style.color = this.oldColor;
            }
            else
            {
                this.style.color = "white";
            }
        }, true);

        l.parentNode.insertBefore(button, l);
        l.setAttribute("data-scanned", "true");
    }
}

// Display Reddit threads
function addRedditThreads()
{
    console.log("Description is " + document.querySelector("#description"));

    // Page has not finished loading
    if ( document.querySelector("#description") == null)
        return;

    // Page has loaded, clear interval for this function
    clearOneInterval("addRedditThreads");

    // Clear current div if it already exists
    if( document.querySelector("#redditThreads") != null )
    {
        console.log("Clearing already existing reddit threads");
        document.querySelector("#redditThreads").remove();
    }

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
                    console.log("Video ID is " + obj[1]);
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
  
    // Get search string for Reddit to get NSFW threads
    function getRedditSearchStringNsfw()
    {
        var videoId = getVideoId();
        if(videoId)
        {
            return "https://api.reddit.com/search.json?q=" + encodeURI("(url:\"3D"+videoId+"\" OR url:\""+videoId+"\") (site:youtube.com OR site:youtu.be) nsfw:yes")
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
    function addRedditThread(div, thread, nsfw)
    {
        console.log("Adding thread from " + thread.subreddit);

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
      
        if(nsfw)
        {
          li.appendChild(document.createTextNode(" \u25cf "));
          li.appendChild(document.createTextNode("(NSFW)"));
        }

        ul.appendChild(li);
    }

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
                        addRedditThread(div, finalResults[i], false);
                    }
                }
            }
        });
    }
  
    var searchStringNsfw = getRedditSearchStringNsfw();

    if(searchStringNsfw)
    {
        GM_xmlhttpRequest({
            method: "GET",
            url: searchStringNsfw,
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
                        addRedditThread(div, finalResults[i], true);
                    }
                }
            }
        });
    }
}

// Change playlist links to playlist itself instead of first video
function changePlaylistLinks()
{
  var playlistLinks = document.querySelectorAll("a.ytd-grid-playlist-renderer");
  
  // No playlist links found yet
  if(playlistLinks.length == 0)
  {
    console.log("Waiting for playlist links...")
    return;
  }
  
  console.log("Playlist links found:")
  console.log(playlistLinks);
  clearOneInterval("changePlaylistLinks");
  
  playlistLinks.forEach(
    function(playlistLink)
    {
      
      playlistLink.href = playlistLink.href.replace(/watch\?v=([-_a-zA-Z0-9]{11})&/gm, `playlist?`);
    }
  );
}

// TODO: use events maybe
function stopAutoplay()
{
    var video = document.querySelector(".html5-main-video");

    // No video found
    if (video == null)
    {
        console.log("Waiting for video...");
        return;
    }

    // Video not ready
    if (video.readyState == 0)
    {
        console.log("Video not ready...");
        return;
    }

    // Video ready, pause it and stop interval
    console.log("Video ready!");
    video.pause();
    clearOneInterval("stopAutoplay");
}

function addResumeLink()
{  
    var video = document.querySelector(".html5-main-video");
  
    // No video found
    if (video == null)
    {
        console.log("Waiting for video...");
        return;
    }
  
    var oldDivResume = document.querySelector("#divResume");

    if(oldDivResume)
    {
        oldDivResume.parentNode.removeChild(oldDivResume);
    }
  
    // No resume parameter in query
    if( window.location.search.indexOf("&t=") == -1 )
    {
        clearOneInterval("addResumeLink");
        return;
    }
  
    var resumeTime = window.location.search.split("&t=")[1].split("&")[0].replace("s", "");
    console.log("Resume time is", resumeTime);
  
    var divResume = document.createElement("div");
    var aResume = document.createElement("a");
    var textResume = document.createTextNode("Resume to " + resumeTime);
    
    divResume.id = "divResume";
  
    aResume.dataset.resumeSeconds = resumeTime;
    aResume.style.color = "white";
    aResume.style.cursor = "pointer";
  
    aResume.addEventListener("click", function(e) {
        var resumeTo = this.dataset.resumeSeconds;
        video.currentTime = resumeTo;
    }, true);
  
    aResume.appendChild(textResume);
    divResume.appendChild(aResume);
    document.querySelector("div#info.style-scope ytd-video-primary-info-renderer").appendChild(divResume);
  
    clearOneInterval("addResumeLink");
}

function expandDescription()
{
    var video = document.querySelector(".html5-main-video");
  
    // No video found
    if (video == null)
    {
        console.log("Waiting for video...");
        return;
    }
  
    document.querySelector("ytd-video-secondary-info-renderer.style-scope #more").click();
  
    clearOneInterval("expandDescription");
}

function expandPlayerContainer()
{
    var video = document.querySelector(".html5-main-video");
  
    // No video found
    if (video == null)
    {
        console.log("Waiting for video...");
        return;
    }
  
    var container = document.querySelector("div#player-theater-container.style-scope");
    container.style.height = "900px";
    container.style.minHeight = "unset";
    container.style.maxHeight = "unset";
  
    var videoContainer = document.querySelector("div.html5-video-container");
    videoContainer.style.height = "900px";
  
    video.style.width = "100%";
    video.style.height = "inherit";
    video.style.top = "inherit";
    video.style.left ="inherit";
  
    clearOneInterval("expandPlayerContainer");
}

function expandPlayer()
{
    var video = document.querySelector(".html5-main-video");
  
    // No video found
    if (video == null)
    {
        console.log("Waiting for video...");
        return;
    }
  
    video.style.width = "100%";
    video.style.height = "inherit";
    video.style.top = "inherit";
    video.style.left ="inherit";
  
    clearOneInterval("expandPlayer");
}

function switchToFullHd()
{
    var video = document.querySelector(".html5-main-video");
  
    // No video found
    if (video == null)
    {
        console.log("Waiting for video...");
        return;
    }
  
    var playerApi = document.getElementById("movie_player");
    console.log(playerApi.getAvailableQualityLevels());
  
    // 1080p not available
    if(playerApi.getAvailableQualityLevels().indexOf("hd1080") == -1)
    {
        clearOneInterval("switchToFullHd");
        return;
    }
  
    clearOneInterval("switchToFullHd");
}