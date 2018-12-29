// ==UserScript==
// @name Backloggery - Focus on name field
// @author      Tailszefox
// @namespace tailszefox.net
// @description Focus on field name when adding new game
// @match https://backloggery.com/newgame.php
// @grant none
// @version 1
// ==/UserScript==

document.querySelector("input[name='name']").focus();
