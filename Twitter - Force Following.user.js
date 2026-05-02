// ==UserScript==
// @name        Twitter - Force "Following"
// @match       https://twitter.com/home
// @match       https://twitter.com/Tailszefox
// @match       https://x.com/home
// @match       https://x.com/Tailszefox
// @grant       none
// @version     1.0
// @author      Tailszefox
// @description Fuck "For you"
// ==/UserScript==

(function() {
    function findSpans() {
        const parentDiv = document.querySelector('div[data-testid="ScrollSnap-SwipeableList"]');
        if (parentDiv) {
            const forYouSpan = Array.from(parentDiv.querySelectorAll('span')).find(span => span.textContent.trim() === 'For you');
            const followingSpan = Array.from(parentDiv.querySelectorAll('span')).find(span => span.textContent.trim() === 'Following');

            if (forYouSpan && followingSpan) {
                console.log('Spans found:', forYouSpan, followingSpan);
                const forYouSelected = forYouSpan.parentNode.children[1].style.backgroundColor !== "";
                console.log('For you selected', forYouSelected);

                if (forYouSelected === true) {
                    console.log("Switching from For You to Following");
                    followingSpan.click();
                }
                return true; // Both spans found
            } else {
                console.error('Spans not found');
                return false; // One or both spans not found
            }
        }
        return false; // Parent div not found
    }

    // Set up MutationObserver
    const observer = new MutationObserver((mutationsList, observer) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                for (const node of mutation.addedNodes) {
                    if (node.nodeType === Node.ELEMENT_NODE && node.querySelector('div[data-testid="ScrollSnap-SwipeableList"]')) {
                        // Call the function when target div is found and disconnect observer if spans are found
                        if (findSpans()) {
                            observer.disconnect();
                        }
                        return;
                    }
                }
            }
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    window.setTimeout(findSpans, 5000);
})();