// ==UserScript==
// @name        Twitter Best
// @namespace   localhost
// @description Get best tweets from profile
// @include     /^https://twitter\.com/[a-zA-Z0-9]+$/
// @version     1
// @grant       none
// ==/UserScript==

var l = document.createElement("a");
l.appendChild(document.createTextNode("View on FollowFly"));

var username = window.location.pathname;
l.href = "http://followfly.co/t" + username;

document.querySelector(".ProfileHeaderCard-screenname").appendChild(l);