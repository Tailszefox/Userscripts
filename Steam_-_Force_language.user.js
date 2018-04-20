// ==UserScript==
// @name        Steam - Force language
// @author      Tailszefox
// @namespace   localhost
// @description Forces language to English on Steam
// @icon        https://i.imgur.com/3GYdiAO.png
// @include     http://store.steampowered.com/*?l=french
// @include     http://store.steampowered.com/*?l=french#*
// @include     https://store.steampowered.com/*?l=french
// @include     https://store.steampowered.com/*?l=french#*
// @include     http://steamcommunity.com/*?l=french
// @include     http://steamcommunity.com/*?l=french#*
// @include     https://steamcommunity.com/*?l=french
// @include     https://steamcommunity.com/*?l=french#*
// @version     1
// @grant       none
// ==/UserScript==

var langs = document.getElementById("language_dropdown").children[0].children;

if(langs.length == 0)
    langs = document.querySelector("#language_dropdown .popup_body").children;

for(var i = 0; i < langs.length; i++)
{
    var lang = langs[i];
    if(lang.href.indexOf("english") != -1)
    {
        window.location.href = lang.href;
        break;
    }
}
