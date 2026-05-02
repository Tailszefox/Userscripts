// ==UserScript==
// @name        Steam - Check agree when redeeming key
// @author      Tailszefox
// @description Checks the "I agree" checkbox on Steam's key redeeming page
// @match       https://store.steampowered.com/account/registerkey
// @match       https://store.steampowered.com/account/registerkey?key=*
// @version     1.0
// @run-at      document-idle
// ==/UserScript==

document.getElementById("accept_ssa").checked = "true";