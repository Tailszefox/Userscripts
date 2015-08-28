// ==UserScript==
// @name        Steam guides - Allow middle click
// @namespace   localhost
// @include     https://steamcommunity.com/app/*/guides/
// @include     https://steamcommunity.com/app/*/guides/*
// @version     1
// @grant       none
// ==/UserScript==

var guides = document.querySelectorAll(".workshopItemCollection");

for(var guide of guides)
{
    var onClickAttr = guide.getAttribute("onclick");
    var url = onClickAttr.substring(onClickAttr.indexOf("http"), onClickAttr.length-1);

    var title = guide.querySelector(".workshopItemTitle");
    var titleText = title.firstChild;

    var newLink = document.createElement("a");
    newLink.href = url;
    newLink.appendChild(titleText);

    title.appendChild(newLink);
}