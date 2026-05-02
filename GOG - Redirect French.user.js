// ==UserScript==
// @name             GOG - Redirect French
// @match            https://www.gog.com/fr/*
// @version          1.0
// ==/UserScript==

window.location = window.location.toString().replace("www.gog.com/fr/", "www.gog.com/en/");