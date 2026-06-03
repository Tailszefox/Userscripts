// ==UserScript==
// @name        Mobygames - Highlight platforms
// @match       https://www.mobygames.com/game/*
// @grant       none
// @version     1.0
// @author      Tailszefox
// ==/UserScript==

function highlightPlatforms() {
    let wantedPlatforms = [];
    let platformColors = {};

    // Function to generate a color from a string
    function stringToColor(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        let color = '#';
        for (let i = 0; i < 3; i++) {
            let value = (hash >> (i * 8)) & 0xFF;
            color += ('00' + value.toString(16)).substr(-2);
        }
        return color;
    }

    // Function to check if the color is readable and adjust if necessary
    function ensureReadableColor(color) {
        // Convert hex color to RGB
        let r = parseInt(color.substr(1, 2), 16);
        let g = parseInt(color.substr(3, 2), 16);
        let b = parseInt(color.substr(5, 2), 16);
        // Calculate luminance
        let luminance = 0.299 * r + 0.587 * g + 0.114 * b;
        // Adjust color if it's too dark
        if (luminance < 128) {
            r = Math.min(255, r + 128);
            g = Math.min(255, g + 128);
            b = Math.min(255, b + 128);
            color = `rgb(${r}, ${g}, ${b})`;
        }
        return color;
    }

    let wantedPlatformsElements = document.querySelectorAll("div[name='platform'] span[class='vs__selected'] > span");

    wantedPlatformsElements.forEach((w) => {
        let platform = w.textContent.replace("or ", "");
        wantedPlatforms.push(platform);

        // Generate and store color for each wanted platform
        let color = stringToColor(platform);
        color = ensureReadableColor(color);
        platformColors[platform] = color;
    });

    wantedPlatforms.sort();
    //console.log(wantedPlatforms);
    //console.log(platformColors);

    let allPlatforms = document.querySelectorAll("tr small");

    allPlatforms.forEach((platformList) => {
        let foundWanted = 0;

        // Get the text content of the span and split it by commas to get the individual platforms
        let platforms = platformList.textContent.split(', ').map(p => p.trim().replace("...", ""));

        // Remove unimportant playtforms
        platforms = platforms.filter(platform => platform !== "Windows Apps");
        platforms = platforms.filter(platform => platform !== "Luna");
        platforms = platforms.filter(platform => platform !== "Xbox Cloud Gaming");
        platforms = platforms.filter(platform => platform !== "Stadia");
        platforms = platforms.filter(platform => platform !== "OnLive");
        platforms = platforms.filter(platform => platform !== "PlayStation Now");
        platforms = platforms.filter(platform => platform !== "Gloud");
        platforms = platforms.filter(platform => platform !== "Blacknut");

        // Check if the platform list exactly matches the wanted platforms
        let isExactMatch = platforms.length === wantedPlatforms.length &&
            platforms.every(platform => wantedPlatforms.includes(platform));

        if (isExactMatch) {
            platformList.style.backgroundColor = '#005e1c';
            platformList.style.color = 'white'; // Ensure text is readable on blue background
        } else {
            // Iterate over the platforms and wrap wanted platforms in <span> tags with the assigned color
            platforms = platforms.map(platform => {
                if (platformColors[platform]) {
                    foundWanted++;
                    return `<span style="color: ${platformColors[platform]}">${platform}</span>`;
                }
                return platform;
            });

            // Join the platforms back into a string and set the HTML content of the span
            platformList.innerHTML = platforms.join(', ');

            if(foundWanted === wantedPlatforms.length)
            {
                platformList.style.backgroundColor = 'blue';
            	platformList.style.color = 'white';
            }
            else if(foundWanted === (wantedPlatforms.length-1) && wantedPlatforms.length >= 3)
            {
                platformList.style.backgroundColor = '#4e0000';
            	platformList.style.color = 'white';
            }
        }
    });
}

function setPageObserver() {
    let targetNode = document.querySelector("tbody");

    if(targetNode === null)
    {
        targetNode = document.querySelector("main").children[1];
    }

    const config = {
        childList: true
    };

    const callback = function(mutationsList) {
        for (let mutation of mutationsList) {
            if (mutation.type === 'childList') {
                highlightPlatforms();
            }
        }
    };

    const observer = new MutationObserver(callback);
    observer.observe(targetNode, config);
}

// Run the function initially
highlightPlatforms();
setPageObserver();

// Set up the MutationObserver
const targetNode = document.querySelector("main > div[class='browser-grid mb']");
const config = {
    childList: true
};

const callback = function(mutationsList) {
    for (let mutation of mutationsList) {
        if (mutation.type === 'childList') {
            highlightPlatforms();
            setPageObserver();
        }
    }
};

const observer = new MutationObserver(callback);
observer.observe(targetNode, config);