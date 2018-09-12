// ==UserScript==
// @name        Patreon YouTube
// @author      Tailszefox
// @namespace   localhost
// @description Adds a link to YouTube videos on Patreon posts
// @include     https://www.patreon.com/posts/*
// @version     1.0
// @grant       none
// ==/UserScript==

if( window.patreon.bootstrap.post.data.attributes.embed )
{
  // Embed available
  var youtubeUrl = window.patreon.bootstrap.post.data.attributes.embed.url;
  
  var divLink = document.createElement("div");
  divLink.style.margin = "5px";
  
  var aLink = document.createElement("a");
  aLink.href = youtubeUrl;
  
  var txtNode = document.createTextNode(youtubeUrl);
  aLink.appendChild(txtNode);
  divLink.appendChild(aLink);
  
  var titleNode = document.querySelector("figure[title='video thumbnail']").nextSibling;
  titleNode.parentNode.insertBefore(divLink, titleNode);
}