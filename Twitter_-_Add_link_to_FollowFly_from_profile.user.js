// ==UserScript==
// @name        Twitter - Add link to FollowFly from profile
// @author      Tailszefox
// @namespace   localhost
// @description Get best tweets from profile using FollowFly
// @icon        https://i.imgur.com/l3AdNnA.png
// @include     /^https://twitter\.com/[a-zA-Z0-9_]+/?$/
// @version     1.0
// @grant       none
// @inject-into auto
// ==/UserScript==

var l = document.createElement("a");
l.appendChild(document.createTextNode("View on FollowFly"));

var username = window.location.pathname;
username = username.replace(/\/$/, '');
l.href = "http://followfly.co/t" + username;

document.querySelector(".ProfileHeaderCard-screenname").appendChild(l);
