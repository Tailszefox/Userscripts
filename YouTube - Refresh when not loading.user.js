// ==UserScript==
// @name        YouTube - Refresh when not loading
// @author      Tailszefox
// @match       https://www.youtube.com/watch?v=*
// @version     1.0
// @noframes
// ==/UserScript==

// Define the function that checks for the element
function checkForElement() {
    const element = document.querySelector("div#above-the-fold > div#title");

    if (element) {
        console.log("Element found. Script ending.");
        return; // Element found, stop the script
    }

    console.log("Element not found. Waiting 10 seconds before retrying.");

    // Wait 10 seconds, then check again
    setTimeout(() => {
        const retryElement = document.querySelector("div#above-the-fold > div#title");

        if (retryElement) {
            console.log("Element appeared after retry. Script ending.");
            return; // Element found on retry, stop the script
        } else {
            console.log("Element still not found. Refreshing the page.");
            location.reload(); // Refresh the page
        }
    }, 10000); // 10 seconds
}

// Wait for the tab or window to gain focus
function waitForFocus() {
    const onFocus = () => {
        console.log("Tab/window focused for the first time. Starting check for element.");

        // Remove the event listener to ensure this only runs once
        window.removeEventListener("focus", onFocus);

        // Start checking for the element
        checkForElement();
    };

    // Check if the tab is already focused
    if (document.hasFocus()) {
        console.log("Tab/window is already focused. Starting check for element immediately.");
        checkForElement();
    } else {
        // Add event listener for when the tab/window gains focus
        window.addEventListener("focus", onFocus);
    }
}

// Start the script
waitForFocus();