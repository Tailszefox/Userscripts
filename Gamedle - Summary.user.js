// ==UserScript==
// @name        Gamedle - Summary
// @match       https://www.gamedle.wtf/guessunlimited
// @match       https://www.gamedle.wtf/guessunlimited?*
// @match       https://www.gamedle.wtf/guess
// @match       https://www.gamedle.wtf/guess?*
// @match       https://www.gamedle.wtf/guess/*
// @grant       none
// @version     1.0
// @author      Tailszefox
// @description Better summary for specs game on Gamedle
// ==/UserScript==

function showYears() {
    // Don't bother if the year has been guessed
    if (document.getElementById("guessAnswersResumeeYear").classList.contains("writen_green_square")) {
        return;
    }

    let rows = document.querySelectorAll('.groupGuessesAnswersRow');
    let minYear = null;
    let maxYear = null;

    rows.forEach(row => {
        if (row.id === "guessAnswersResumee" || row.children.length === 0) {
            return;
        }

        if (row.children[4].children.length === 0) {
            return;
        }

        let yearDiv = row.children[4].firstChild;
        let yearValue = parseInt(yearDiv.textContent, 10);

        if (isNaN(yearValue)) {
            return;
        }

        let answerIsOlder = (yearDiv.className.indexOf("up") === -1);

        console.log(yearDiv, yearValue, answerIsOlder);

        if (answerIsOlder) {
            // If the answer is older than this year, then this year could be the new maximum
            if (maxYear === null || yearValue < maxYear) {
                maxYear = yearValue;
            }
        } else {
            // If the answer is newer than this year, then this year could be the new minimum
            if (minYear === null || yearValue > minYear) {
                minYear = yearValue;
            }
        }
    });

    let stringYear = "";

    if (minYear !== null) {
        minYear = parseInt(minYear, 10) + 1;
    }
    if (maxYear !== null) {
        maxYear = parseInt(maxYear, 10) - 1;
    }

    if (minYear !== null && maxYear !== null) {
        if (minYear === maxYear) {
            stringYear = `${maxYear}`;
        } else {
            stringYear = `${minYear}-${maxYear}`;
        }
    } else if (minYear !== null) {
        stringYear = `${minYear}-?`;
    } else if (maxYear !== null) {
        stringYear = `?-${maxYear}`;
    } else {
        stringYear = "???";
    }

    document.getElementById("guessAnswersResumeeYear").textContent = stringYear;
}

function getCluesArray(cluesDiv, useChildren) {
    let cluesArray;

    if (useChildren) {
        let cluesElementArray = Array.from(cluesDiv.querySelectorAll("[title]"));

        cluesArray = cluesElementArray.map(clue => {
            let clueClone = clue.cloneNode(true);

            let textSpan = document.createElement('span');
            textSpan.appendChild(document.createTextNode(clue.title));
            textSpan.style.fontSize = "10px";

            let div = document.createElement('div');
            div.appendChild(clueClone);
            div.appendChild(textSpan);
            div.title = clueClone.title;

            clueClone.title = "";
            return div;
        });
    } else {
        let cluesStringArray = cluesDiv.textContent.replaceAll("\n", "").split(",");
        cluesArray = cluesStringArray.map(clue => {
            let span = document.createElement('span');
            span.textContent = clue.trim();
            span.title = clue.trim();
            return span;
        });
    }

    return cluesArray;
}

function showClues(targetDivId, childIndex, useChildren) {
    /*
    // Don't bother if the clue has been guessed
    if (document.getElementById(targetDivId).classList.contains("writen_green_square")) {
        return;
    }
    */

    // Clone element in the collection if another with the same title isn't already in there
    const addToCollection = (collection, element) => {
        if (!collection.some(el => el.title === element.title)) {
            collection.push(element.cloneNode(true));
        }
    };

    let rows = document.querySelectorAll('#groupGuessesAnswersDiv .groupGuessesAnswersRow');
    let possibles = [];
    let impossibles = [];
    let must = [];
    let answer = [];

    rows.forEach(row => {
        if (row.children.length === 0) {
            return;
        }

        let cluesDiv = row.children[childIndex];
        let cluesArray = getCluesArray(cluesDiv, useChildren);

        if (cluesDiv.classList.contains("writen_yellow_square")) {
            cluesArray.forEach(clue => {
                console.log("Possible", clue);
                addToCollection(possibles, clue);
            });
        } else if (cluesDiv.classList.contains("writen_red_square")) {
            cluesArray.forEach(clue => {
                console.log("Impossible", clue);
                addToCollection(impossibles, clue);
            });
        } else if (cluesDiv.classList.contains("writen_green_square")) {
            cluesArray.forEach(clue => {
                console.log("Answer", clue);
                addToCollection(answer, clue);
            });
        }
    });

    // Filter out elements from 'possibles' that are also in 'impossibles'
    possibles = possibles.filter(possibleItem =>
        !impossibles.some(impossibleItem =>
            impossibleItem.title === possibleItem.title
        )
    );

    // Do another pass to find clues that must be true
    rows.forEach(row => {
        if (row.children.length === 0) {
            return;
        }

        let cluesDiv = row.children[childIndex];

        if (cluesDiv.classList.contains("writen_yellow_square")) {
            let cluesArray = getCluesArray(cluesDiv, useChildren);

            // Remove all clues that are impossible
            let cluesLeftInRow = cluesArray.filter(possibleItem =>
                !impossibles.some(impossibleItem =>
                    impossibleItem.title === possibleItem.title
                )
            );

            // If there's only one left, it must be in the solution
            if (cluesLeftInRow.length === 1) {
                addToCollection(must, cluesLeftInRow[0]);
            }
        }
    });

    // Filter out elements from 'possibles' that are also in 'must'
    possibles = possibles.filter(possibleItem =>
        !must.some(item =>
            item.title === possibleItem.title
        )
    );

    // If we have the answer, add everything in "possibles" and "must" that isn't the answer to "impossibles"
    if (answer.length > 0) {
        possibles.forEach(element => {
            const isInAnswer = answer.some(ansEl => ansEl.title === element.title);
            if (!isInAnswer) {
                addToCollection(impossibles, element);
            }
        });

        possibles = [];

        must.forEach(element => {
            const isInAnswer = answer.some(ansEl => ansEl.title === element.title);
            if (!isInAnswer) {
                addToCollection(impossibles, element);
            }
        });

        must = [];
    }

    console.log("Final possible", possibles);
    console.log("Final impossible", impossibles);
    console.log("Final must", must);

    let targetDiv = document.getElementById(targetDivId);
    targetDiv.innerHTML = '';

    function createFullWidthSpan(text) {
        let span = document.createElement('span');
        span.textContent = text;
        span.style.display = 'block';
        span.style.width = '100%';
        span.style.fontSize = "15px";
        return span;
    }

    if (answer.length > 0) {
        let answerSpan = createFullWidthSpan('Answer');
        targetDiv.appendChild(answerSpan);

        if (useChildren) {
            answer.forEach(element => {
                element.setAttribute("attr-answer", "true");
                targetDiv.appendChild(element);
            });
        } else {
            answer.forEach(element => {
                element.setAttribute("attr-answer", "true");
                element.style.width = '100%';
                element.style.fontSize = "10px";
                targetDiv.appendChild(element);
            });
        }
    }

    if (must.length > 0) {
        let mustSpan = createFullWidthSpan('Must be');
        mustSpan.style.color = "rgb(80, 255, 0)";
        targetDiv.appendChild(mustSpan);

        if (useChildren) {
            must.forEach(element => {
                element.setAttribute("attr-must", "true");
                targetDiv.appendChild(element);
            });
        } else {
            must.forEach(element => {
                element.setAttribute("attr-must", "true");
                element.style.width = '100%';
                element.style.fontSize = "10px";
                targetDiv.appendChild(element);
            });
        }
    }

    if (possibles.length > 0) {
        let possibleSpan = createFullWidthSpan('Possible');
        targetDiv.appendChild(possibleSpan);

        if (useChildren) {
            possibles.forEach(element => {
                targetDiv.appendChild(element);
            });
        } else {
            possibles.forEach(element => {
                element.style.width = '100%';
                element.style.fontSize = "10px";
                targetDiv.appendChild(element);
            });
        }
    }

    if (impossibles.length > 0) {
        let impossibleSpan = createFullWidthSpan('Impossible');
        impossibleSpan.style.color = "rgb(255, 0, 0)";
        targetDiv.appendChild(impossibleSpan);

        if (useChildren) {
            impossibles.forEach(element => {
                targetDiv.appendChild(element);
            });
        } else {
            impossibles.forEach(element => {
                element.style.width = '100%';
                element.style.fontSize = "10px";
                targetDiv.appendChild(element);
            });
        }
    }
}

function getLinkPart(equivalents, resumeeId, linkType, noEquivalentUseName) {
    let resumee = document.getElementById(resumeeId);
    let linkPart = "";
    let useForLink = [];

    if (resumee.classList.contains("writen_yellow_square")) {
        useForLink = resumee.querySelectorAll("[attr-must]");
    } else if (resumee.classList.contains("writen_green_square")) {
        useForLink = resumee.querySelectorAll("[attr-answer]");
    }

    useForLink.forEach((item) => {
        let name = item.title;

        let equivalent;

        if (equivalents[name]) {
            equivalent = equivalents[name];
            linkPart += `${linkType}:${equivalent}/`;
        } else if (noEquivalentUseName) {
            equivalent = name.toLowerCase().replaceAll(" ", "-").replaceAll("(", "").replaceAll(")", "");
            linkPart += `${linkType}:${equivalent}/`;
        }

        console.log(name, linkPart);
    });

    return linkPart;
}

function createMobygamesLink() {
    let link = document.createElement('a');
    link.id = "mobygames";
    link.textContent = 'Search Mobygames';

    let div = document.createElement('div');
    div.appendChild(link);
    div.style.paddingBottom = "10px";

    document.getElementById('groupGuessesWritten').insertAdjacentElement('afterbegin', div);
}

function updateMobygamesLink() {
    let link = document.getElementById("mobygames");
    let linkPart = '';

    // Platforms
    let platformsEquiv = {
        "PlayStation": "playstation",
        "PlayStation 2": "ps2",
        "PlayStation 3": "ps3",
        "PlayStation 4": "playstation-4",
        "PlayStation Vita": "ps-vita",
        "Xbox 360": "xbox360",
        "Xbox Series X|S": "xbox-series",
        "Nintendo GameCube": "gamecube",
        "Nintendo Switch": "switch",
        "Nintendo Switch 2": "switch-2",
        "Nintendo 3DS": "3ds",
        "PC (Microsoft Windows)": "windows",
        "PC DOS": "dos",
        "Mac": "macintosh",
    };

    linkPart += getLinkPart(platformsEquiv, 'guessAnswersResumeePlatforms', 'platform', true);

    // Genres
    let genresEquiv = {
        "Simulator": "simulation",
        "Racing": "racing-driving",
        "Sport": "sports",
        "Point-and-click": "point_and_select",
        "Turn-based strategy (TBS)": "turn-based",
        "Adventure": "ignore-adventure",
        "Hack and slash/Beat 'em up": "ignore-slash",
        "Roguelike/Roguelite": "roguelike",
    };

    linkPart += getLinkPart(genresEquiv, 'guessAnswersResumeeGenres', 'genre', true);

    // Engines
    let enginesEquiv = {
        "Unity": "8230"
    };

    linkPart += getLinkPart(enginesEquiv, 'guessAnswersResumeeGameEngine', 'group', false);

    // Release year
    let releaseYear = document.getElementById("guessAnswersResumeeYear").textContent;

    if (releaseYear.indexOf("-") >= 0) {
        releaseYear = releaseYear.split("-");
        let from = releaseYear[0];
        let until = releaseYear[1];

        if (from !== "?") {
            linkPart += `from:${from}/`;
        }

        if (until !== "?") {
            linkPart += `until:${until}/`;
        }
    } else {
        linkPart += `from:${releaseYear}/until:${releaseYear}/`;
    }

    link.href = `https://www.mobygames.com/game/sort:moby_score/${linkPart}`;
}

function enableSummary() {
    document.getElementById("switchSummary").click();

    let element = document.getElementById('guessAnswersResumee');
    let style = window.getComputedStyle(element);

    if (style.display === 'none') {
        document.getElementById("switchSummary").click();
    }

}

function newLine() {
    window.setTimeout(() => {
        showYears();

        // Platforms
        showClues("guessAnswersResumeePlatforms", 1, true);
        // Genres
        showClues("guessAnswersResumeeGenres", 2, true);
        // Themes
        showClues("guessAnswersResumeeThemes", 3, true);
        // Game modes
        showClues("guessAnswersResumeeGameMode", 5, true);
        // Game engine
        showClues("guessAnswersResumeeGameEngine", 6, false);
        // Developer / Publisher
        showClues("guessAnswersResumeePubDev", 7, false);
        // Perspective
        showClues("guessAnswersResumeePerspective", 8, false);

        updateMobygamesLink();
    }, 1500);
}

window.setTimeout(function() {
    enableSummary();
    createMobygamesLink();
    newLine();

    const parentDiv = document.getElementById('groupGuessesAnswersDiv');
    const callback = function(mutationsList, observer) {
        for (let mutation of mutationsList) {
            console.log(mutation);
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                newLine();
            }
        }
    };

    const config = {
        childList: true
    };

    // Set up an observer for each child div of the parentDiv
    Array.from(parentDiv.children).forEach(childDiv => {
        console.log("Observing", childDiv);
        const observer = new MutationObserver(callback);
        observer.observe(childDiv, config);
    });

    /*
    let guessButton = document.querySelector("button[name='GUESS']");
    guessButton.addEventListener("click", (e) => {
        newLine();
    });

    let searchBox = document.getElementById("searchBox");
    searchBox.addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            newLine();
        }
    });
    */
}, 1000);