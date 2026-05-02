// ==UserScript==
// @name        YouTube - Redirect embed
// @author      Tailszefox
// @match       https://www.youtube.com/embed/*
// @version     1.0
// @noframes
// ==/UserScript==

window.location = window.location.toString().replace("youtube.com/embed/", "youtube.com/watch?v=");