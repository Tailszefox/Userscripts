// ==UserScript==
// @name        php.net - Switch to English
// @namespace   localhost
// @description Forces php.net to be displayed in English
// @include     https://secure.php.net/manual/fr/*
// @version     1
// @grant       none
// ==/UserScript==

var newLocation = window.location.href;
newLocation = newLocation.replace("/fr/", "/en/");
window.location.href = newLocation;