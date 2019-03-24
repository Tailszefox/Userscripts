// ==UserScript==
// @name        Google Play - Switch to English
// @author      Tailszefox
// @namespace   localhost
// @description Forces language to English on Google Play Store
// @icon        https://i.imgur.com/7RZiSjY.jpg
// @include     https://play.google.com/store/*
// @exclude     https://play.google.com/store/*hl=en*
// @version     1.0
// @grant       none
// @inject-into content
// ==/UserScript==

var newLocation = window.location.href;
newLocation = newLocation.replace("&hl=fr", "");
newLocation = newLocation.replace("?hl=fr", "");
newLocation += "&hl=en";

window.location.href = newLocation;
