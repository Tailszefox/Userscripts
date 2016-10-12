// ==UserScript==
// @name        Twitter - Add link to FollowFly from profile
// @namespace   localhost
// @description Get best tweets from profile using FollowFly
// @include     /^https://twitter\.com/[a-zA-Z0-9_]+/?$/
// @version     1
// @grant       none
// ==/UserScript==

var l = document.createElement("a");
l.appendChild(document.createTextNode("View on FollowFly"));

var username = window.location.pathname;
username = username.replace(/\/$/, '');
l.href = "http://followfly.co/t" + username;

document.querySelector(".ProfileHeaderCard-screenname").appendChild(l);