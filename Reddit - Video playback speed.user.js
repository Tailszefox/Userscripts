// ==UserScript==
// @name        Reddit - Video playback speed
// @author      Tailszefox
// @description Change playback speed of videos hosted on Reddit
// @match       https://www.reddit.com/r/*/comments/*
// @match       https://old.reddit.com/r/*/comments/*
// @version     1.0
// @run-at      document-idle
// ==/UserScript==

function addSpeedLabel(speed) {
    let speedLabel = document.createElement("label");
    speedLabel.classList.add("change_playback_speed_button");
    speedLabel.insertAdjacentText("afterbegin", "x" + speed.toString());

    if (speed === 1) {
        speedLabel.style.color = "red";
    }

    speedLabel.addEventListener("click", function(e) {
        document.querySelectorAll("label.change_playback_speed_button").forEach(function(button) {
            button.style.color = "white";
        });

        e.target.style.color = "red";
        document.querySelector("video").playbackRate = speed;
    });

    document.querySelector("div.video-settings-container").appendChild(speedLabel);
}

// Add the buttons directly if it's a Reddit video
if (document.querySelector("div.video-settings-container")) {
    addSpeedLabel(1);
    addSpeedLabel(1.5);
    addSpeedLabel(2);
    addSpeedLabel(2.5);
    addSpeedLabel(3);
    addSpeedLabel(4);
}