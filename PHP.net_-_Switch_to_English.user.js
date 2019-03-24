// ==UserScript==
// @name        PHP.net - Switch to English
// @author       Tailszefox
// @namespace   localhost
// @description Forces php.net to be displayed in English
// @icon        https://i.imgur.com/yiF0ATF.png
// @include     https://secure.php.net/manual/fr/*
// @version     1.0
// @grant       none
// ==/UserScript==

var newLocation = window.location.href;
newLocation = newLocation.replace("/fr/", "/en/");
window.location.href = newLocation;
