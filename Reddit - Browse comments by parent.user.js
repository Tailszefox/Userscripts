// ==UserScript==
// @name        Reddit - Browse comments by parent
// @author      Tailszefox
// @description Browse comments by parent (root) comments
// @match     https://*.reddit.com/r/*/comments/*
// @version     1
// @grant       none
// ==/UserScript==

function getPosition(element) {
    return element.getBoundingClientRect().top + window.scrollY;
}

function scrollToComment(next) {
    let children = document.querySelectorAll("div[id^='siteTable_t3'] > *");

    // If there's only two children, we're in a comment thread
    if (children.length === 2) {
        children = document.querySelector("div[id^='siteTable_t1_']").children;
    }

    let current = document.documentElement.scrollTop;

    if (next) {
        for (let i = 0; i < children.length; i += 2) {
            let top = getPosition(children[i]);

            if (top > current + 10) {
                document.documentElement.scrollTop = top;
                return;
            }
        }
    } else {
        for (let i = 0; i < children.length; i += 2) {
            let top = getPosition(children[i]);

            if (top > current - 10) {
                if (i < 2) {
                    return;
                }

                let previousTop = getPosition(children[i - 2]);
                document.documentElement.scrollTop = previousTop;
                return;
            }
        }
    }
}

function addButtons() {
    let previous = document.createElement("a");
    previous.style.cursor = "pointer";
    previous.style.font = '24px/1 "Batch"';
    previous.style.color = "#888";
    previous.appendChild(document.createTextNode("\u2190"));

    let next = document.createElement("a");
    next.style.cursor = "pointer";
    next.style.font = '24px/1 "Batch"';
    next.style.color = "#888";
    next.appendChild(document.createTextNode("\u2192"));

    previous.addEventListener("click", function() {
        scrollToComment(next = false);
    });

    next.addEventListener("click", function() {
        scrollToComment(next = true);
    });

    let nreFloatLi = document.createElement("li");
    nreFloatLi.id = "tailszefoxArrows";
    nreFloatLi.appendChild(document.createElement("br"));
    nreFloatLi.appendChild(previous);
    nreFloatLi.appendChild(document.createElement("br"));
    nreFloatLi.appendChild(next);

    let nreFloat = document.querySelector(".res-floater-visibleAfterScroll ul");
    nreFloat.appendChild(nreFloatLi);
}

function waitForButtons() {
    if (document.querySelector(".res-floater-visibleAfterScroll ul li") === null) {
        setTimeout(waitForButtons, 1000);
        return;
    }

    setTimeout(addButtons, 1000);
}

setTimeout(waitForButtons, 1000);