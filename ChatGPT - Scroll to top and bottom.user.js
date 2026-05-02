// ==UserScript==
// @name             ChatGPT - Scroll to top and bottom
// @author           Tailszefox
// @match            https://chatgpt.com/*
// @version          1.0
// ==/UserScript==

// Function to find the closest scrollable parent
function findScrollableParent(element) {
    while (element && element !== document.body) {
        const overflowY = window.getComputedStyle(element).overflowY;
        if (overflowY === "auto" || overflowY === "scroll") {
            return element;
        }
        element = element.parentElement;
    }
    return null; // No scrollable parent found
}

function addDblClickScrollListener(boundingRect, callback) {
    document.addEventListener("dblclick", function(event) {
        const {
            minX,
            maxX,
            minY,
            maxY
        } = boundingRect;

        if (event.clientX >= minX && event.clientX <= maxX &&
            event.clientY >= minY && event.clientY <= maxY) {
            callback(event);
        }
    });
}

function scrollToLastArticle(event) {
    console.log("In rectangle, checking...");

    if (event.target.querySelector("form")?.dataset.type === "unified-composer") {
        console.log("Double-click detected inside the rectangle on the correct element!");

        const articles = document.querySelectorAll("article");
        if (articles.length === 0) {
            console.warn("No <article> elements found.");
            return;
        }
        const lastArticle = articles[articles.length - 1];
        console.log("Found last <article>:", lastArticle);

        const scrollableParent = findScrollableParent(lastArticle);
        if (!scrollableParent) {
            console.warn("No scrollable parent found for the last <article>.");
            return;
        }
        console.log("Found scrollable parent:", scrollableParent);

        const rect = lastArticle.getBoundingClientRect();
        scrollableParent.scrollTo({
            left: rect.left + scrollableParent.scrollLeft,
            top: rect.top + scrollableParent.scrollTop - 50,
            behavior: "smooth"
        });

        console.log("Scrolled to show the last <article>.");
    }
}

function scrollToTopOfScrollableParent(event) {
    console.log("In top rectangle, checking...");

    if (event.target.querySelector("form")?.dataset.type === "unified-composer") {
        console.log("Double-click detected inside the top rectangle on the correct element!");

        const articles = document.querySelectorAll("article");
        if (articles.length === 0) {
            console.warn("No <article> elements found.");
            return;
        }
        const firstArticle = articles[0];
        console.log("Found first <article>:", firstArticle);

        const scrollableParent = findScrollableParent(firstArticle);
        if (!scrollableParent) {
            console.warn("No scrollable parent found for the first <article>.");
            return;
        }
        console.log("Found scrollable parent:", scrollableParent);

        scrollableParent.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth"
        });

        console.log("Scrolled to the top of the scrollable parent.");
    }
}

function keyboardScrolToTop(event) {
    if (event.ctrlKey && event.shiftKey && event.key === "Insert") {
        console.log("Key combination okay!");

        const articles = document.querySelectorAll("article");
        if (articles.length === 0) {
            console.warn("No <article> elements found.");
            return;
        }
        const firstArticle = articles[0];
        console.log("Found first <article>:", firstArticle);

        const scrollableParent = findScrollableParent(firstArticle);
        if (!scrollableParent) {
            console.warn("No scrollable parent found for the first <article>.");
            return;
        }
        console.log("Found scrollable parent:", scrollableParent);

        scrollableParent.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth"
        });

        console.log("Scrolled to the top of the scrollable parent.");

        event.preventDefault(); // Optional: prevent default behavior if needed
    }
}

// Define the bounding rectangles
const boundingRectBottom = {
    minX: 1493,
    maxX: 1897,
    minY: 880,
    maxY: 930
};

const boundingRectTop = {
    minX: 270,
    maxX: 700,
    minY: 880,
    maxY: 930
};

// Register the event listeners
addDblClickScrollListener(boundingRectBottom, scrollToLastArticle);
addDblClickScrollListener(boundingRectTop, scrollToTopOfScrollableParent);
document.addEventListener("keydown", keyboardScrolToTop);