// ==UserScript==
// @name        The Escapist - Add video link
// @author      Tailszefox
// @namespace   localhost
// @description Adds a direct link to the video
// @icon        https://i.imgur.com/TCs4Wnm.png
// @include     http://www.escapistmagazine.com/videos/view/*
// @version     1
// @grant       none
// ==/UserScript==

function addLink()
{
    var video = document.querySelector("video");
    video.autoplay = false;
    video.muted = true;
    video.pause();

    video.addEventListener("play", function(){
        video.pause();
    }, false);

    var link = document.createElement("a");
    link.appendChild(document.createTextNode("Direct link"));
    link.className = "video_menu_link";
    link.href = video.src;

    var menu = document.querySelector("#video_player_menu");
    menu.insertBefore(link, menu.children[0]);
}

window.setTimeout(addLink, 5000);
