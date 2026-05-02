// ==UserScript==
// @name             GamesRecap - Remove YT video
// @author           Tailszefox
// @match            https://*.gamesrecap.io/*
// @version          1.0
// ==/UserScript==

function removeYouTube(event) {
    event.preventDefault(); // Prevent the default navigation behavior

    // Select the target node that will be observed for mutations
    const targetNode = document.body;

    // Create a new instance of MutationObserver
    const observer = new MutationObserver(function(mutationsList) {
        for (let mutation of mutationsList) {
            if (mutation.type === 'childList') {
                // Check if the "stream-player" element is added to the DOM
                const streamPlayerElement = document.getElementById('stream-player');
                if (streamPlayerElement) {
                    // Remove the "stream-player" element
                    streamPlayerElement.remove();
                    // Disconnect the observer after removing the element (if needed)
                    observer.disconnect();
                }
            }
        }
    });

    // Configuration for the observer (specify the types of mutations to observe)
    const observerConfig = {
        childList: true, // Observe changes to the list of child nodes
        subtree: true, // Observe changes in all descendants of the target node
    };

    // Start observing the target node for mutations
    observer.observe(targetNode, observerConfig);
}

const streamPlayerElement = document.getElementById('stream-player');

if (streamPlayerElement) {
    streamPlayerElement.remove();
} else {
    const watchButtons = document.querySelectorAll('a[href="/watch"]');

    watchButtons.forEach(button => {
        button.addEventListener('click', removeYouTube);
    });
}