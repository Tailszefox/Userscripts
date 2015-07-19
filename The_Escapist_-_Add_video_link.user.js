// ==UserScript==
// @name        The Escapist - Add video link
// @namespace   localhost
// @description Adds a direct link to the video
// @include     http://www.escapistmagazine.com/videos/view/*
// @version     1
// @grant       none
// ==/UserScript==

function addLink()
{
    var link = document.createElement("a");
    link.appendChild(document.createTextNode("Direct link"));
    link.className = "video_menu_link";
    link.href = document.querySelector("video").src;

    var menu = document.querySelector("#video_player_menu");
    menu.insertBefore(link, menu.children[0]);
}

window.setTimeout(addLink, 3000);