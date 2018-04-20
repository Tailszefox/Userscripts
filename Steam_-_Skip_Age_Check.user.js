// ==UserScript==
// @name        Steam - Skip Age Check
// @author      Tailszefox
// @namespace   localhost
// @description Skip age check on Steam
// @icon        https://i.imgur.com/EO8ijqj.png
// @match       http://store.steampowered.com/agecheck/app/*/
// @match       https://store.steampowered.com/agecheck/app/*/
// @version     1.0
// @grant       none
// ==/UserScript==

document.querySelector("select[name='ageYear']").value = "1989";
