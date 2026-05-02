// ==UserScript==
// @name             ChatGPT - Refresh for temporary chat
// @author           Tailszefox
// @match            https://chatgpt.com/
// @match            https://chatgpt.com/?temporary-chat=true*
// @match            https://chatgpt.com/?model=*&temporary-chat=true
// @version          1.0
// @run-at           document-end
// ==/UserScript==

function clickOnTemporary() {
    if (document.querySelectorAll("div#prompt-textarea")[0].innerText.trim().length !== 0) {
        return;
    }

    window.setTimeout(() => {
        location.reload();
    }, 250);
}

let button = document.querySelectorAll("div#conversation-header-actions button[aria-label='Turn on temporary chat']")[0];

if (button) {
    button.addEventListener("click", clickOnTemporary);
}