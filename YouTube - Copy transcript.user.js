// ==UserScript==
// @name        YouTube - Copy transcript
// @author      Tailszefox
// @description Copy transcript to clipboard
// @match       https://www.youtube.com/*
// @version     1.0
// @run-at      document-start
// @grant       GM_setClipboard
// @grant       GM_registerMenuCommand
// ==/UserScript==

function copyTranscript() {
    let transcriptPanel = document.querySelector("ytd-engagement-panel-section-list-renderer[visibility='ENGAGEMENT_PANEL_VISIBILITY_EXPANDED']");

    if (!transcriptPanel) {
        document.querySelectorAll("button[aria-label='Show transcript']")[0].click();
        window.setTimeout(copyTranscript, 1000);
        return;
    }

    let transcript = "";
    let lines;
    let isTimeline = false;

    if (document.querySelectorAll("transcript-segment-view-model").length !== 0) {
        lines = document.querySelectorAll("transcript-segment-view-model");
        isTimeline = true;
    } else {
        lines = transcriptPanel.querySelectorAll("ytd-transcript-segment-renderer");
    }

    if (lines.length === 0) {
        if (document.querySelector("button[aria-label='Timeline']") !== null) {
            document.querySelector("button[aria-label='Timeline']").click();
        } else {
            document.querySelectorAll("button[aria-label='Show transcript']")[0].click();
        }
        window.setTimeout(copyTranscript, 3000);
        return;
    }

    lines.forEach((l) => {
        if (isTimeline) {
            let text = l.querySelector("span").innerText;
            transcript += text + "\n";
        } else {
            let text = l.querySelector("yt-formatted-string").innerText;
            transcript += text + "\n";
        }
    });

    let videoTitle = document.querySelector("ytd-watch-metadata.watch-active-metadata div#title yt-formatted-string").innerText;
    let videoChannel = document.querySelector("div#upload-info yt-formatted-string.ytd-channel-name").innerText;

    if (videoChannel.length === 0) {
        videoChannel = document.querySelector("div#upload-info a").innerText.replace("\n", "");
    }

    let pr = unsafeWindow.ytInitialPlayerResponse;
    const tracklist = pr.captions.playerCaptionsTracklistRenderer;
    const tracks = tracklist?.captionTracks;
    let defIdx;

    if (tracks.length === 1) {
        defIdx = 0;
    } else {
        defIdx = tracklist?.audioTracks?.[0]?.defaultCaptionTrackIndex ?? tracklist?.defaultCaptionTrackIndex;
    }

    const transcriptLanguage = tracks[defIdx].languageCode;
    console.log("Transcript language:", transcriptLanguage);

    let fullTranscript;

    if (transcriptLanguage.indexOf("fr") !== -1) {
        fullTranscript = `Résume cette transcription de vidéo :\n\nTitre de la vidéo : ${videoTitle}\nChaîne : ${videoChannel}\n\n`;
    } else {
        fullTranscript = `Summarize this video transcript:\n\nVideo title: ${videoTitle}\nChannel: ${videoChannel}\n\n`;
    }

    fullTranscript += transcript;

    GM_setClipboard(fullTranscript);

    document.querySelector("h2 > yt-formatted-string[title='Transcript']").innerText = "Transcript (copied)";
    document.querySelector("h2 > yt-formatted-string[title='In this video']").innerText = "In this video (copied)";
}

GM_registerMenuCommand("Copy transcript", copyTranscript, "c");