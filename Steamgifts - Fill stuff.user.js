// ==UserScript==
// @name             Steamgifts - Fill stuff
// @author           Tailszefox
// @match            https://www.steamgifts.com/giveaways/new
// @version          1.0
// ==/UserScript==

function clickButtons() {
    document.querySelector("div[data-checkbox-value='key'] i").click();
    document.querySelector("div[data-checkbox-value='everyone'] i").click();
    document.querySelector("input[name='region_restricted']").nextElementSibling.children[0].click();
    document.querySelector("textarea[name='description']").value = "Good luck!";
}

window.setTimeout(clickButtons, 1000);