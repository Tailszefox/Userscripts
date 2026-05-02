// ==UserScript==
// @name        Steam - Activity: Change game links
// @author      Tailszefox
// @description Change game links from community to store
// @match       https://steamcommunity.com/id/tailszefox/home
// @version     1.0
// @grant       none
// ==/UserScript==

window.setInterval(function() {
    let gameLinks = document.querySelectorAll(".blotter_daily_rollup a[href*='steamcommunity.com/app/']");

    gameLinks.forEach((link) => {
        link.href = link.href.replace("steamcommunity.com/", "store.steampowered.com/");
    });
}, 5000);