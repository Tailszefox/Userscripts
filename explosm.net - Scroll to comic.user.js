// ==UserScript==
// @name        explosm.net - Scroll to comic
// @match       https://explosm.net/comics/*
// @grant       none
// @version     1.0
// @author      Tailszefox
// @description Scroll to comic
// ==/UserScript==

window.setTimeout(function() {
    document.querySelector("#comic img").scrollIntoView();
}, 2000);