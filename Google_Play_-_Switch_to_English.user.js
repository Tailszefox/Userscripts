// ==UserScript==
// @name        Google Play - Switch to English
// @author      Tailszefox
// @namespace   localhost
// @description Add a link to switch to English on Google Play Store
// @icon        https://i.imgur.com/7RZiSjY.jpg
// @include     https://play.google.com/store/*
// @exclude     https://play.google.com/store/*hl=en*
// @version     1.1
// @grant       none
// @inject-into content
// ==/UserScript==

var newLocation = window.location.href;
newLocation = newLocation.replace("&hl=fr", "");
newLocation = newLocation.replace("?hl=fr", "");
newLocation += "&hl=en";

var changeList = document.createElement("li");
changeList.classList.add("fle8Af");

var changeLink = document.createElement("a");
changeLink.classList.add("gm1qLe");
changeLink.href = newLocation;

changeLink.appendChild(document.createTextNode("English"));
changeList.appendChild(changeLink);
document.querySelectorAll("ul.CoKTif")[0].appendChild(changeList);
