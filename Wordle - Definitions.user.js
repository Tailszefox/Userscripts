// ==UserScript==
// @name        Wordle - Definitions
// @match       https://www.nytimes.com/games/wordle/*
// @grant       none
// @version     1.0
// @author      Tailszefox
// @description Get word definition in Wordle
// ==/UserScript==

function setupObserver(targetNode, callback) {
    const config = {
        attributes: false,
        childList: true,
        subtree: true
    };
    const observer = new MutationObserver(callback);
    observer.observe(targetNode, config);
    return observer;
}

function clickButtonWhenAvailable(observer) {
    let playButton = document.querySelector("button[data-testid='Play']");
    if (playButton) {
        playButton.click();
        observer.disconnect();
    }
}

function getDefinition(row) {
    let letters = Array.from(row.children);
    let word = "";
    letters.forEach(letter => word += letter.textContent);
    let url = "https://en.wiktionary.org/wiki/" + word;
    window.open(url, '_blank');
}

function addEventToWordRows(observer) {
    let game = document.querySelector("main#wordle-app-game");

    if (game) {
        let wordRows = Array.from(document.querySelector("main#wordle-app-game").children[1].firstChild.children);

        if (wordRows.length > 0) {
            wordRows.forEach(function(row) {
                row.style.cursor = "pointer";
                row.addEventListener("click", function() {
                    getDefinition(row);
                });
            });
            observer.disconnect();
        }
    }
}

let buttonObserver = setupObserver(document, () => clickButtonWhenAvailable(buttonObserver));
let rowObserver = setupObserver(document, () => addEventToWordRows(rowObserver));