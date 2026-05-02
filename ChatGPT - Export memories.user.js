// ==UserScript==
// @name        ChatGPT - Export memories
// @match       https://chatgpt.com/*
// @version     1.0
// @grant       GM_setClipboard
// @grant       GM_registerMenuCommand
// ==/UserScript==

function copyMemories() {
    let memories = document.querySelectorAll("table tbody div.whitespace-pre-wrap");

    let memoryText = "";

    memories.forEach((memory) => {
        memoryText += memory.textContent + "\n---\n";
    });

    console.log(memoryText);

    GM_setClipboard(memoryText);
}

GM_registerMenuCommand("Copy memories", copyMemories, "c");