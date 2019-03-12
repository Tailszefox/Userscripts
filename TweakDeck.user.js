// ==UserScript==
// @name        TweakDeck
// @author      Tailszefox
// @namespace   localhost
// @description Some tweaks for TweetDeck
// @match       https://tweetdeck.twitter.com/*
// @match       http://tweetdeck.twitter.com/*
// @match       https://www.tweetdeck.twitter.com/*
// @match       http://www.tweetdeck.twitter.com/*
// @version     1.0
// @grant       GM_addStyle
// @grant       GM_setValue
// @grant       GM_getValue
// @inject-into content
// ==/UserScript==

// Increase width of first column
GM_addStyle("section.js-column:nth-child(1) { width: 500px !important; }");

// Increase height of pictures in the first column
GM_addStyle("section.js-column:nth-child(1) .media-size-medium { height: 360px !important; }");

var initScriptInterval = window.setInterval(initScript, 1000);

function initScript()
{
  // Wait for page to load
  if( document.querySelectorAll("div#container section").length == 0 )
    return;
  
  clearInterval(initScriptInterval);
  
  var rememberedTweetId = GM_getValue("rememberedTweetId", "0");
  console.log("Remembered tweet:", rememberedTweetId);
  
  var navButtons = document.querySelectorAll("nav")[1];
  
  // Remember button - Remember tweet ID of first displayed tweet
  var rememberButton = document.querySelectorAll("nav a.js-app-settings")[0].cloneNode(true);
  
  rememberButton.classList.remove("js-app-settings");
  rememberButton.dataset["action"] = "remember";
  rememberButton.dataset["title"] = "Remember tweet";
  rememberButton.title = "Remember tweet";
  rememberButton.children[0].children[0].classList.remove("icon-settings");
  rememberButton.children[0].children[0].classList.add("icon-check");
  
  rememberButton.addEventListener('click', function(e) {
    var firstColumn = document.querySelectorAll("div.column-scroller")[0];
    var currentScroll = firstColumn.scrollTop;
    
    // Convert NodeList to Array to be able to interrupt
    var tweets = Array.from(firstColumn.querySelectorAll("article"));
    
    // Search for the first completely visible tweet
    for(var i = 0; i < tweets.length; i++)
    {
      var t = tweets[i];
      
      // Ignore "Show More" items
      if(t.offsetTop >= currentScroll && t.dataset["key"].indexOf("gap_") !== 0)
      {
        var tweetId = t.dataset["key"];
        
        console.log("Remembering tweet", t);
        console.log("Remembering tweet ID", tweetId);
        
        GM_setValue("rememberedTweetId", tweetId); 
        
        rememberButton.title = "Remembered tweet " + tweetId;
        t.style.border = "1px solid white";
        
        break;
      }
    }
  }, true);
  
  navButtons.appendChild(rememberButton);
  
  // Recall button - Scroll to saved tweet
  var recallButton = document.querySelector("nav a.js-app-settings").cloneNode(true);
  
  recallButton.classList.remove("js-app-settings");
  recallButton.classList.add("js-app-recall-tweet");
  recallButton.dataset["action"] = "recall";
  recallButton.dataset["title"] = "Scroll to saved tweet";
  recallButton.title = "Scroll to saved tweet";
  recallButton.children[0].children[0].classList.remove("icon-settings");
  recallButton.children[0].children[0].classList.add("icon-arrow-d");
  
  recallButton.addEventListener('click', function(e) {
    var rememberedTweetId = parseInt(GM_getValue("rememberedTweetId", "0"), 10);
    
    if(rememberedTweetId == 0)
      return;
    
    console.log("Scrolling to tweet ID", rememberedTweetId);
    document.querySelector(".js-app-recall-tweet i").style.color = "red";
    
    scrollToTweet(rememberedTweetId);
  }, true);
  
  navButtons.appendChild(recallButton);
}

// Scroll to desired tweet, loading more as necessary
function scrollToTweet(rememberedTweetId)
{
  var firstColumn = document.querySelectorAll("div.column-scroller")[0];
    
  var tweets = Array.from(firstColumn.querySelectorAll("article"));
    
  // Search for saved tweet
  for(var i = 0; i < tweets.length; i++)
  {
    var t = tweets[i];
    var tweetId = parseInt(t.dataset["key"], 10);
     
    // If the remembered tweet has been deleted, find first tweet before it
    if(tweetId <= rememberedTweetId)
    {
      console.log("Found tweet", t);
      t.scrollIntoView();
      t.style.border = "1px solid white";
      document.querySelector(".js-app-recall-tweet i").style.color = "unset";
      return;
    }
  }
  
  // We couldn't find the tweet, so we'll scroll to the bottom and wait for more tweets to load
  console.log("Tweet not found, scrolling...");
  firstColumn.scrollTop = firstColumn.scrollHeight;
  
  window.setTimeout(function(){
    scrollToTweet(rememberedTweetId);
  }, 300);
}